import type { StudyProgress, UpsertStudyProgressInput } from "../entities/StudyProgress";
import type { UUID } from "../uuid";

export interface IStudyProgressRepository {
	findByFlashcardAndUser(flashcardId: UUID, userId: UUID): Promise<StudyProgress | null>;
	findByDeckAndUser(deckId: UUID, userId: UUID): Promise<StudyProgress[]>;
	findByFlashcardIdsAndUser(flashcardIds: UUID[], userId: UUID): Promise<StudyProgress[]>;
	upsert(input: UpsertStudyProgressInput): Promise<StudyProgress>;
}
