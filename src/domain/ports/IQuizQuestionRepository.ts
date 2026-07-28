import type { CreateQuizQuestionInput, QuizQuestion } from "../entities/QuizQuestion";
import type { UUID } from "../uuid";

export interface IQuizQuestionRepository {
	create(input: CreateQuizQuestionInput): Promise<QuizQuestion>;
	findById(id: UUID): Promise<QuizQuestion | null>;
	findByFlashcardId(flashcardId: UUID): Promise<QuizQuestion[]>;
	findByDeckId(deckId: UUID): Promise<QuizQuestion[]>;
	findByFlashcardIds(flashcardIds: UUID[]): Promise<QuizQuestion[]>;
	delete(id: UUID): Promise<void>;
}
