import { and, eq, inArray } from "drizzle-orm";
import type { StudyProgress, UpsertStudyProgressInput } from "../../domain/entities/StudyProgress";
import type { IStudyProgressRepository } from "../../domain/ports/IStudyProgressRepository";
import { newUUID, type UUID } from "../../domain/uuid";
import type { DB } from "./client";
import { flashcards, studyProgress } from "./schema";

export class DrizzleStudyProgressRepository implements IStudyProgressRepository {
	constructor(private readonly db: DB) {}

	findByFlashcardAndUser(flashcardId: UUID, userId: UUID): StudyProgress | null {
		const row = this.db
			.select()
			.from(studyProgress)
			.where(and(eq(studyProgress.flashcardId, flashcardId), eq(studyProgress.userId, userId)))
			.get();
		return row ? this.toEntity(row) : null;
	}

	findByDeckAndUser(deckId: UUID, userId: UUID): StudyProgress[] {
		const cardIds = this.db
			.select({ id: flashcards.id })
			.from(flashcards)
			.where(eq(flashcards.deckId, deckId))
			.all()
			.map((c) => c.id);

		if (cardIds.length === 0) return [];

		return this.db
			.select()
			.from(studyProgress)
			.where(and(inArray(studyProgress.flashcardId, cardIds), eq(studyProgress.userId, userId)))
			.all()
			.map(this.toEntity);
	}

	upsert(input: UpsertStudyProgressInput): StudyProgress {
		const existing = this.findByFlashcardAndUser(input.flashcardId, input.userId);

		if (existing) {
			this.db
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
		this.db
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
