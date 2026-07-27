import type { Flashcard } from "../domain/entities/Flashcard";
import type { StudyProgress } from "../domain/entities/StudyProgress";
import type { IFlashcardRepository } from "../domain/ports/IFlashcardRepository";
import type { IStudyProgressRepository } from "../domain/ports/IStudyProgressRepository";
import type { Rating } from "../domain/rating";
import { calculateSM2 } from "../domain/sm2";
import type { UUID } from "../domain/uuid";

export interface CardWithProgress {
	flashcard: Flashcard;
	progress: StudyProgress | null;
}

export interface DeckProgressSummary {
	total: number;
	dueNow: number;
	mastered: number;
	cards: CardWithProgress[];
}

const DEFAULT_EASE_FACTOR = 2.5;
const MASTERED_INTERVAL_THRESHOLD = 21;

export class StudyService {
	constructor(
		private readonly flashcardRepo: IFlashcardRepository,
		private readonly studyProgressRepo: IStudyProgressRepository,
	) {}

	getDueCards(deckId: UUID, userId: UUID): CardWithProgress[] {
		const cards = this.flashcardRepo.findByDeckId(deckId);
		const progressList = this.studyProgressRepo.findByDeckAndUser(deckId, userId);
		const progressMap = new Map(progressList.map((p) => [p.flashcardId, p]));
		const now = new Date();

		return cards
			.map((flashcard) => ({ flashcard, progress: progressMap.get(flashcard.id) ?? null }))
			.filter(({ progress }) => !progress || progress.nextReviewAt <= now);
	}

	reviewCard(flashcardId: UUID, userId: UUID, rating: Rating): StudyProgress {
		const existing = this.studyProgressRepo.findByFlashcardAndUser(flashcardId, userId);

		const sm2Input = existing ?? {
			easeFactor: DEFAULT_EASE_FACTOR,
			interval: 0,
			repetitions: 0,
		};

		return this.studyProgressRepo.upsert({
			flashcardId,
			userId,
			...calculateSM2(sm2Input, rating),
			lastReviewedAt: new Date(),
		});
	}

	getDeckProgress(deckId: UUID, userId: UUID): DeckProgressSummary {
		const cards = this.flashcardRepo.findByDeckId(deckId);
		const progressList = this.studyProgressRepo.findByDeckAndUser(deckId, userId);
		const progressMap = new Map(progressList.map((p) => [p.flashcardId, p]));
		const now = new Date();

		let dueNow = 0;
		let mastered = 0;

		const cardWithProgress: CardWithProgress[] = cards.map((flashcard) => {
			const progress = progressMap.get(flashcard.id) ?? null;
			if (!progress || progress.nextReviewAt <= now) dueNow++;
			if (progress && progress.interval >= MASTERED_INTERVAL_THRESHOLD) mastered++;
			return { flashcard, progress };
		});

		return { total: cards.length, dueNow, mastered, cards: cardWithProgress };
	}
}
