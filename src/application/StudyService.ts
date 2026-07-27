import type { Flashcard } from "../domain/entities/Flashcard";
import type { StudyProgress } from "../domain/entities/StudyProgress";
import type { IFlashcardRepository } from "../domain/ports/IFlashcardRepository";
import type { IStudyProgressRepository } from "../domain/ports/IStudyProgressRepository";
import type { Rating } from "../domain/rating";
import { calculateSM2 } from "../domain/sm2";

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

	async getDueCards(deckId: string, userId: string): Promise<CardWithProgress[]> {
		const cards = await this.flashcardRepo.findByDeckId(deckId);
		const progressList = await this.studyProgressRepo.findByDeckAndUser(deckId, userId);
		const progressMap = new Map(progressList.map((p) => [p.flashcardId, p]));

		const now = new Date();

		return cards
			.map((flashcard) => ({
				flashcard,
				progress: progressMap.get(flashcard.id) ?? null,
			}))
			.filter(({ progress }) => {
				if (!progress) return true;
				return progress.nextReviewAt <= now;
			});
	}

	async reviewCard(flashcardId: string, userId: string, rating: Rating): Promise<StudyProgress> {
		const existing = await this.studyProgressRepo.findByFlashcardAndUser(flashcardId, userId);

		const sm2Input = existing ?? {
			easeFactor: DEFAULT_EASE_FACTOR,
			interval: 0,
			repetitions: 0,
		};

		const sm2Output = calculateSM2(sm2Input, rating);

		return this.studyProgressRepo.upsert({
			flashcardId,
			userId,
			...sm2Output,
			lastReviewedAt: new Date(),
		});
	}

	async getDeckProgress(deckId: string, userId: string): Promise<DeckProgressSummary> {
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

		return {
			total: cards.length,
			dueNow,
			mastered,
			cards: cardWithProgress,
		};
	}
}
