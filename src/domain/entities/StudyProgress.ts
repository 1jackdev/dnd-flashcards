import type { UUID } from "../uuid";

export interface StudyProgress {
	id: UUID;
	flashcardId: UUID;
	userId: UUID;
	easeFactor: number;
	interval: number;
	repetitions: number;
	nextReviewAt: Date;
	lastReviewedAt: Date | null;
}

export interface UpsertStudyProgressInput {
	flashcardId: UUID;
	userId: UUID;
	easeFactor: number;
	interval: number;
	repetitions: number;
	nextReviewAt: Date;
	lastReviewedAt: Date;
}
