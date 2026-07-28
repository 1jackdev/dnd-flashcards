import type {
	CardWithProgress,
	DeckProgressSummary,
	StudyService,
} from "../../../application/StudyService";
import type { StudyProgress } from "../../../domain/entities/StudyProgress";
import type { Rating } from "../../../domain/rating";
import type { Tag } from "../../../domain/tags";
import type { UUID } from "../../../domain/uuid";

export class StudyController {
	constructor(private readonly studyService: StudyService) {}

	getDueCards(deckId: UUID, userId: UUID): Promise<CardWithProgress[]> {
		return this.studyService.getDueCards(deckId, userId);
	}

	reviewCard(flashcardId: UUID, userId: UUID, rating: Rating): Promise<StudyProgress> {
		return this.studyService.reviewCard(flashcardId, userId, rating);
	}

	getDeckProgress(deckId: UUID, userId: UUID): Promise<DeckProgressSummary> {
		return this.studyService.getDeckProgress(deckId, userId);
	}

	getProgressByTags(tags: Tag[], userId: UUID): Promise<DeckProgressSummary> {
		return this.studyService.getProgressByTags(tags, userId);
	}
}
