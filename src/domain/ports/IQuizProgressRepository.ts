import type { QuizProgress, RecordQuizAttemptInput } from "../entities/QuizProgress";
import type { UUID } from "../uuid";

export interface IQuizProgressRepository {
	findByQuestionAndUser(quizQuestionId: UUID, userId: UUID): Promise<QuizProgress | null>;
	findByDeckAndUser(deckId: UUID, userId: UUID): Promise<QuizProgress[]>;
	findByQuestionIdsAndUser(quizQuestionIds: UUID[], userId: UUID): Promise<QuizProgress[]>;
	recordAttempt(input: RecordQuizAttemptInput): Promise<QuizProgress>;
}
