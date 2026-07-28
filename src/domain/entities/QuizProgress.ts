import type { UUID } from "../uuid";

export interface QuizProgress {
	id: UUID;
	quizQuestionId: UUID;
	userId: UUID;
	attempts: number;
	correctCount: number;
	lastAnsweredCorrectly: boolean;
	lastAnsweredAt: Date;
}

export interface RecordQuizAttemptInput {
	quizQuestionId: UUID;
	userId: UUID;
	correct: boolean;
}
