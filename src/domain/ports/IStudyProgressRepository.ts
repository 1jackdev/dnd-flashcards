import type { StudyProgress, UpsertStudyProgressInput } from "../entities/StudyProgress";

export interface IStudyProgressRepository {
	findByFlashcardAndUser(flashcardId: string, userId: string): Promise<StudyProgress | null>;
	findByDeckAndUser(deckId: string, userId: string): Promise<StudyProgress[]>;
	upsert(input: UpsertStudyProgressInput): Promise<StudyProgress>;
}
