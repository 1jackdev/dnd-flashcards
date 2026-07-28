import { eq, inArray } from "drizzle-orm";
import type { CreateQuizQuestionInput, QuizQuestion } from "../../domain/entities/QuizQuestion";
import type { IQuizQuestionRepository } from "../../domain/ports/IQuizQuestionRepository";
import { newUUID, type UUID } from "../../domain/uuid";
import type { DB } from "./client";
import { quizQuestions } from "./schema";

type QuizQuestionRow = typeof quizQuestions.$inferSelect;

function toDomain(row: QuizQuestionRow): QuizQuestion {
	const base = {
		id: row.id as UUID,
		flashcardId: row.flashcardId as UUID,
		deckId: row.deckId as UUID,
		question: row.question,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
	if (row.type === "multiple_choice") {
		return {
			...base,
			type: "multiple_choice",
			choices: row.choices ?? [],
			correctChoiceIndex: row.correctChoiceIndex ?? 0,
		};
	}
	return {
		...base,
		type: "true_false",
		correctAnswer: row.correctAnswer ?? false,
	};
}

export class DrizzleQuizQuestionRepository implements IQuizQuestionRepository {
	constructor(private readonly db: DB) {}

	async create(input: CreateQuizQuestionInput): Promise<QuizQuestion> {
		const now = new Date();
		const id = newUUID();
		await this.db
			.insert(quizQuestions)
			.values({
				id,
				flashcardId: input.flashcardId,
				deckId: input.deckId,
				type: input.type,
				question: input.question,
				choices: input.type === "multiple_choice" ? input.choices : null,
				correctChoiceIndex: input.type === "multiple_choice" ? input.correctChoiceIndex : null,
				correctAnswer: input.type === "true_false" ? input.correctAnswer : null,
				createdAt: now,
				updatedAt: now,
			})
			.run();
		return { id, ...input, createdAt: now, updatedAt: now };
	}

	async findById(id: UUID): Promise<QuizQuestion | null> {
		const row = await this.db.select().from(quizQuestions).where(eq(quizQuestions.id, id)).get();
		if (!row) return null;
		return toDomain(row);
	}

	async findByFlashcardId(flashcardId: UUID): Promise<QuizQuestion[]> {
		return (
			await this.db
				.select()
				.from(quizQuestions)
				.where(eq(quizQuestions.flashcardId, flashcardId))
				.all()
		).map(toDomain);
	}

	async findByDeckId(deckId: UUID): Promise<QuizQuestion[]> {
		return (
			await this.db.select().from(quizQuestions).where(eq(quizQuestions.deckId, deckId)).all()
		).map(toDomain);
	}

	async findByFlashcardIds(flashcardIds: UUID[]): Promise<QuizQuestion[]> {
		if (flashcardIds.length === 0) return [];
		return (
			await this.db
				.select()
				.from(quizQuestions)
				.where(inArray(quizQuestions.flashcardId, flashcardIds))
				.all()
		).map(toDomain);
	}

	async delete(id: UUID): Promise<void> {
		await this.db.delete(quizQuestions).where(eq(quizQuestions.id, id)).run();
	}
}
