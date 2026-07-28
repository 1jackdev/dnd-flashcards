import type { UUID } from "../uuid";

export type QuizQuestionType = "multiple_choice" | "true_false";

interface QuizQuestionBase {
	id: UUID;
	flashcardId: UUID;
	deckId: UUID;
	question: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface MultipleChoiceQuizQuestion extends QuizQuestionBase {
	type: "multiple_choice";
	choices: string[];
	correctChoiceIndex: number;
}

export interface TrueFalseQuizQuestion extends QuizQuestionBase {
	type: "true_false";
	correctAnswer: boolean;
}

export type QuizQuestion = MultipleChoiceQuizQuestion | TrueFalseQuizQuestion;

export type QuizQuestionBody =
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number }
	| { type: "true_false"; question: string; correctAnswer: boolean };

export type CreateQuizQuestionInput = QuizQuestionBody & { flashcardId: UUID; deckId: UUID };
