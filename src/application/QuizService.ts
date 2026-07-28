import type { QuizProgress } from "../domain/entities/QuizProgress";
import type { QuizQuestion, QuizQuestionBody } from "../domain/entities/QuizQuestion";
import type { IFlashcardRepository } from "../domain/ports/IFlashcardRepository";
import type { IQuizProgressRepository } from "../domain/ports/IQuizProgressRepository";
import type { IQuizQuestionRepository } from "../domain/ports/IQuizQuestionRepository";
import type { Tag } from "../domain/tags";
import type { UUID } from "../domain/uuid";

export interface QuestionWithProgress {
	question: QuizQuestion;
	progress: QuizProgress | null;
}

export interface DeckQuizProgressSummary {
	total: number;
	questions: QuestionWithProgress[];
}

export class QuizService {
	constructor(
		private readonly quizRepo: IQuizQuestionRepository,
		private readonly flashcardRepo: IFlashcardRepository,
		private readonly quizProgressRepo: IQuizProgressRepository,
	) {}

	async addQuestion(input: QuizQuestionBody & { flashcardId: UUID }): Promise<QuizQuestion> {
		const card = await this.flashcardRepo.findById(input.flashcardId);
		if (!card) throw new Error(`Flashcard not found: ${input.flashcardId}`);
		const deckId = card.deckId;
		if (input.type === "multiple_choice") {
			return this.quizRepo.create({ ...input, type: "multiple_choice", deckId });
		}
		return this.quizRepo.create({ ...input, type: "true_false", deckId });
	}

	async getQuestion(id: UUID): Promise<QuizQuestion> {
		const question = await this.quizRepo.findById(id);
		if (!question) throw new Error(`Quiz question not found: ${id}`);
		return question;
	}

	listByFlashcard(flashcardId: UUID): Promise<QuizQuestion[]> {
		return this.quizRepo.findByFlashcardId(flashcardId);
	}

	listByDeck(deckId: UUID): Promise<QuizQuestion[]> {
		return this.quizRepo.findByDeckId(deckId);
	}

	async listByTags(tags: Tag[]): Promise<QuizQuestion[]> {
		const cards = await this.flashcardRepo.findByTags(tags);
		const cardIds = cards.map((c) => c.id);
		return this.quizRepo.findByFlashcardIds(cardIds);
	}

	async deleteQuestion(id: UUID): Promise<void> {
		await this.getQuestion(id);
		await this.quizRepo.delete(id);
	}

	async recordAttempt(quizQuestionId: UUID, userId: UUID, correct: boolean): Promise<QuizProgress> {
		await this.getQuestion(quizQuestionId);
		return this.quizProgressRepo.recordAttempt({ quizQuestionId, userId, correct });
	}

	async getDeckQuizProgress(deckId: UUID, userId: UUID): Promise<DeckQuizProgressSummary> {
		const questions = await this.quizRepo.findByDeckId(deckId);
		const progressList = await this.quizProgressRepo.findByDeckAndUser(deckId, userId);
		const progressMap = new Map(progressList.map((p) => [p.quizQuestionId, p]));

		const questionsWithProgress: QuestionWithProgress[] = questions.map((question) => ({
			question,
			progress: progressMap.get(question.id) ?? null,
		}));

		return { total: questions.length, questions: questionsWithProgress };
	}

	async getQuizProgressByTags(tags: Tag[], userId: UUID): Promise<DeckQuizProgressSummary> {
		const cards = await this.flashcardRepo.findByTags(tags);
		const cardIds = cards.map((c) => c.id);
		const questions = await this.quizRepo.findByFlashcardIds(cardIds);
		const progressList = await this.quizProgressRepo.findByQuestionIdsAndUser(
			questions.map((q) => q.id),
			userId,
		);
		const progressMap = new Map(progressList.map((p) => [p.quizQuestionId, p]));

		const questionsWithProgress: QuestionWithProgress[] = questions.map((question) => ({
			question,
			progress: progressMap.get(question.id) ?? null,
		}));

		return { total: questions.length, questions: questionsWithProgress };
	}
}
