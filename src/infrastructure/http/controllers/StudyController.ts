import type {
	CardWithProgress,
	DeckProgressSummary,
	StudyService,
} from "../../../application/StudyService";
import type { StudyProgress } from "../../../domain/entities/StudyProgress";
import type { Rating } from "../../../domain/rating";
import type { UUID } from "../../../domain/uuid";

export class StudyController {
	constructor(private readonly studyService: StudyService) {}

	getDueCards(deckId: UUID, userId: UUID): CardWithProgress[] {
		return this.studyService.getDueCards(deckId, userId);
	}

	reviewCard(flashcardId: UUID, userId: UUID, rating: Rating): StudyProgress {
		return this.studyService.reviewCard(flashcardId, userId, rating);
	}

	getDeckProgress(deckId: UUID, userId: UUID): DeckProgressSummary {
		return this.studyService.getDeckProgress(deckId, userId);
	}
}
