import { and, eq, inArray } from "drizzle-orm";
import type { QuizProgress, RecordQuizAttemptInput } from "../../domain/entities/QuizProgress";
import type { IQuizProgressRepository } from "../../domain/ports/IQuizProgressRepository";
import { newUUID, type UUID } from "../../domain/uuid";
import type { DB } from "./client";
import { quizProgress, quizQuestions } from "./schema";

export class DrizzleQuizProgressRepository implements IQuizProgressRepository {
	constructor(private readonly db: DB) {}

	async findByQuestionAndUser(quizQuestionId: UUID, userId: UUID): Promise<QuizProgress | null> {
		const row = await this.db
			.select()
			.from(quizProgress)
			.where(and(eq(quizProgress.quizQuestionId, quizQuestionId), eq(quizProgress.userId, userId)))
			.get();
		return row ? this.toEntity(row) : null;
	}

	async findByDeckAndUser(deckId: UUID, userId: UUID): Promise<QuizProgress[]> {
		const questionIds = (
			await this.db
				.select({ id: quizQuestions.id })
				.from(quizQuestions)
				.where(eq(quizQuestions.deckId, deckId))
				.all()
		).map((q) => q.id);

		if (questionIds.length === 0) return [];

		return (
			await this.db
				.select()
				.from(quizProgress)
				.where(
					and(inArray(quizProgress.quizQuestionId, questionIds), eq(quizProgress.userId, userId)),
				)
				.all()
		).map(this.toEntity);
	}

	async findByQuestionIdsAndUser(quizQuestionIds: UUID[], userId: UUID): Promise<QuizProgress[]> {
		if (quizQuestionIds.length === 0) return [];
		return (
			await this.db
				.select()
				.from(quizProgress)
				.where(
					and(
						inArray(quizProgress.quizQuestionId, quizQuestionIds),
						eq(quizProgress.userId, userId),
					),
				)
				.all()
		).map(this.toEntity);
	}

	async recordAttempt(input: RecordQuizAttemptInput): Promise<QuizProgress> {
		const existing = await this.findByQuestionAndUser(input.quizQuestionId, input.userId);
		const now = new Date();

		if (existing) {
			const updated: QuizProgress = {
				...existing,
				attempts: existing.attempts + 1,
				correctCount: existing.correctCount + (input.correct ? 1 : 0),
				lastAnsweredCorrectly: input.correct,
				lastAnsweredAt: now,
			};
			await this.db
				.update(quizProgress)
				.set({
					attempts: updated.attempts,
					correctCount: updated.correctCount,
					lastAnsweredCorrectly: updated.lastAnsweredCorrectly,
					lastAnsweredAt: updated.lastAnsweredAt,
				})
				.where(eq(quizProgress.id, existing.id))
				.run();
			return updated;
		}

		const id = newUUID();
		const created: QuizProgress = {
			id,
			quizQuestionId: input.quizQuestionId,
			userId: input.userId,
			attempts: 1,
			correctCount: input.correct ? 1 : 0,
			lastAnsweredCorrectly: input.correct,
			lastAnsweredAt: now,
		};
		await this.db.insert(quizProgress).values(created).run();
		return created;
	}

	private toEntity(row: typeof quizProgress.$inferSelect): QuizProgress {
		return {
			id: row.id as UUID,
			quizQuestionId: row.quizQuestionId as UUID,
			userId: row.userId as UUID,
			attempts: row.attempts,
			correctCount: row.correctCount,
			lastAnsweredCorrectly: row.lastAnsweredCorrectly,
			lastAnsweredAt: row.lastAnsweredAt,
		};
	}
}
