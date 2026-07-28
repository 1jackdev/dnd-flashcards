import type { Flashcard } from "../domain/entities/Flashcard";
import type { StudyProgress } from "../domain/entities/StudyProgress";
import type { IFlashcardRepository } from "../domain/ports/IFlashcardRepository";
import type { IStudyProgressRepository } from "../domain/ports/IStudyProgressRepository";
import type { Rating } from "../domain/rating";
import { calculateSM2 } from "../domain/sm2";
import type { Tag } from "../domain/tags";
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

	async getDueCards(deckId: UUID, userId: UUID): Promise<CardWithProgress[]> {
		const cards = await this.flashcardRepo.findByDeckId(deckId);
		const progressList = await this.studyProgressRepo.findByDeckAndUser(deckId, userId);
		const progressMap = new Map(progressList.map((p) => [p.flashcardId, p]));
		const now = new Date();

		return cards
			.map((flashcard) => ({ flashcard, progress: progressMap.get(flashcard.id) ?? null }))
			.filter(({ progress }) => !progress || progress.nextReviewAt <= now);
	}

	async reviewCard(flashcardId: UUID, userId: UUID, rating: Rating): Promise<StudyProgress> {
		const existing = await this.studyProgressRepo.findByFlashcardAndUser(flashcardId, userId);

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

	async getDeckProgress(deckId: UUID, userId: UUID): Promise<DeckProgressSummary> {
		const cards = await this.flashcardRepo.findByDeckId(deckId);
		const progressList = await this.studyProgressRepo.findByDeckAndUser(deckId, userId);
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

	async getProgressByTags(tags: Tag[], userId: UUID): Promise<DeckProgressSummary> {
		const cards = await this.flashcardRepo.findByTags(tags);
		const cardIds = cards.map((c) => c.id);
		const progressList = await this.studyProgressRepo.findByFlashcardIdsAndUser(cardIds, userId);
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
