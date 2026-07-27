export interface StudyProgress {
	id: string;
	flashcardId: string;
	userId: string;
	easeFactor: number;
	interval: number;
	repetitions: number;
	nextReviewAt: Date;
	lastReviewedAt: Date | null;
}

export interface UpsertStudyProgressInput {
	flashcardId: string;
	userId: string;
	easeFactor: number;
	interval: number;
	repetitions: number;
	nextReviewAt: Date;
	lastReviewedAt: Date;
}
