import type { StudyProgress, UpsertStudyProgressInput } from "../entities/StudyProgress";
import type { UUID } from "../uuid";

export interface IStudyProgressRepository {
	findByFlashcardAndUser(flashcardId: UUID, userId: UUID): StudyProgress | null;
	findByDeckAndUser(deckId: UUID, userId: UUID): StudyProgress[];
	upsert(input: UpsertStudyProgressInput): StudyProgress;
}
