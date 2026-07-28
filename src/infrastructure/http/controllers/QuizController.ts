import type { DeckQuizProgressSummary, QuizService } from "../../../application/QuizService";
import type { QuizProgress } from "../../../domain/entities/QuizProgress";
import type { QuizQuestion } from "../../../domain/entities/QuizQuestion";
import type { Tag } from "../../../domain/tags";
import type { UUID } from "../../../domain/uuid";
import type { CreateQuizQuestionInput } from "../schemas";

export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	create(flashcardId: UUID, input: CreateQuizQuestionInput): Promise<QuizQuestion> {
		return this.quizService.addQuestion({ flashcardId, ...input });
	}

	getById(id: UUID): Promise<QuizQuestion> {
		return this.quizService.getQuestion(id);
	}

	listByFlashcard(flashcardId: UUID): Promise<QuizQuestion[]> {
		return this.quizService.listByFlashcard(flashcardId);
	}

	listByDeck(deckId: UUID): Promise<QuizQuestion[]> {
		return this.quizService.listByDeck(deckId);
	}

	delete(id: UUID): Promise<void> {
		return this.quizService.deleteQuestion(id);
	}

	recordAttempt(id: UUID, userId: UUID, correct: boolean): Promise<QuizProgress> {
		return this.quizService.recordAttempt(id, userId, correct);
	}

	getDeckProgress(deckId: UUID, userId: UUID): Promise<DeckQuizProgressSummary> {
		return this.quizService.getDeckQuizProgress(deckId, userId);
	}

	listByTags(tags: Tag[]): Promise<QuizQuestion[]> {
		return this.quizService.listByTags(tags);
	}

	getQuizProgressByTags(tags: Tag[], userId: UUID): Promise<DeckQuizProgressSummary> {
		return this.quizService.getQuizProgressByTags(tags, userId);
	}
}
