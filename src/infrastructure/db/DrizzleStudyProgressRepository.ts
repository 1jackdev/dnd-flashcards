import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import type { StudyProgress, UpsertStudyProgressInput } from "../../domain/entities/StudyProgress";
import type { IStudyProgressRepository } from "../../domain/ports/IStudyProgressRepository";
import type { DB } from "./client";
import { flashcards, studyProgress } from "./schema";

export class DrizzleStudyProgressRepository implements IStudyProgressRepository {
	constructor(private readonly db: DB) {}

	async findByFlashcardAndUser(flashcardId: string, userId: string): Promise<StudyProgress | null> {
		const row = await this.db
			.select()
			.from(studyProgress)
			.where(and(eq(studyProgress.flashcardId, flashcardId), eq(studyProgress.userId, userId)))
			.get();
		return row ? this.toEntity(row) : null;
	}

	async findByDeckAndUser(deckId: string, userId: string): Promise<StudyProgress[]> {
		const cardIds = await this.db
			.select({ id: flashcards.id })
			.from(flashcards)
			.where(eq(flashcards.deckId, deckId))
			.all();

		if (cardIds.length === 0) return [];

		const rows = await this.db
			.select()
			.from(studyProgress)
			.where(
				and(
					inArray(
						studyProgress.flashcardId,
						cardIds.map((c) => c.id),
					),
					eq(studyProgress.userId, userId),
				),
			)
			.all();

		return rows.map(this.toEntity);
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
				.where(eq(studyProgress.id, existing.id));
			return { ...existing, ...input };
		}

		const id = randomUUID();
		await this.db.insert(studyProgress).values({ id, ...input });
		return { id, ...input };
	}

	private toEntity(row: typeof studyProgress.$inferSelect): StudyProgress {
		return {
			id: row.id,
			flashcardId: row.flashcardId,
			userId: row.userId,
			easeFactor: row.easeFactor,
			interval: row.interval,
			repetitions: row.repetitions,
			nextReviewAt: row.nextReviewAt,
			lastReviewedAt: row.lastReviewedAt ?? null,
		};
	}
}
