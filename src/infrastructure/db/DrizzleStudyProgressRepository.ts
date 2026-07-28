import { and, eq, inArray } from "drizzle-orm";
import type { StudyProgress, UpsertStudyProgressInput } from "../../domain/entities/StudyProgress";
import type { IStudyProgressRepository } from "../../domain/ports/IStudyProgressRepository";
import { newUUID, type UUID } from "../../domain/uuid";
import type { DB } from "./client";
import { flashcards, studyProgress } from "./schema";

export class DrizzleStudyProgressRepository implements IStudyProgressRepository {
	constructor(private readonly db: DB) {}

	async findByFlashcardAndUser(flashcardId: UUID, userId: UUID): Promise<StudyProgress | null> {
		const row = await this.db
			.select()
			.from(studyProgress)
			.where(and(eq(studyProgress.flashcardId, flashcardId), eq(studyProgress.userId, userId)))
			.get();
		return row ? this.toEntity(row) : null;
	}

	async findByDeckAndUser(deckId: UUID, userId: UUID): Promise<StudyProgress[]> {
		const cardIds = (
			await this.db
				.select({ id: flashcards.id })
				.from(flashcards)
				.where(eq(flashcards.deckId, deckId))
				.all()
		).map((c) => c.id);

		if (cardIds.length === 0) return [];

		return (
			await this.db
				.select()
				.from(studyProgress)
				.where(and(inArray(studyProgress.flashcardId, cardIds), eq(studyProgress.userId, userId)))
				.all()
		).map(this.toEntity);
	}

	async findByFlashcardIdsAndUser(flashcardIds: UUID[], userId: UUID): Promise<StudyProgress[]> {
		if (flashcardIds.length === 0) return [];
		return (
			await this.db
				.select()
				.from(studyProgress)
				.where(
					and(inArray(studyProgress.flashcardId, flashcardIds), eq(studyProgress.userId, userId)),
				)
				.all()
		).map(this.toEntity);
	}

	async upsert(input: UpsertStudyProgressInput): Promise<StudyProgress> {
		const existing = await this.findByFlashcardAndUser(input.flashcardId, input.userId);

		if (existing) {
			await this.db
				.update(studyProgress)
				.set({
					easeFactor: input.easeFactor,
					interval: input.interval,
					repetitions: input.repetitions,
					nextReviewAt: input.nextReviewAt,
					lastReviewedAt: input.lastReviewedAt,
				})
				.where(eq(studyProgress.id, existing.id))
				.run();
			return { ...existing, ...input };
		}

		const id = newUUID();
		await this.db
			.insert(studyProgress)
			.values({ id, ...input })
			.run();
		return { id, ...input };
	}

	private toEntity(row: typeof studyProgress.$inferSelect): StudyProgress {
		return {
			id: row.id as UUID,
			flashcardId: row.flashcardId as UUID,
			userId: row.userId as UUID,
			easeFactor: row.easeFactor,
			interval: row.interval,
			repetitions: row.repetitions,
			nextReviewAt: row.nextReviewAt,
			lastReviewedAt: row.lastReviewedAt ?? null,
		};
	}
}
