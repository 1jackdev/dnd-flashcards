import { describe, expect, mock, test } from "bun:test";
import { StudyService } from "../../src/application/StudyService";
import {
	deckFactory,
	flashcardFactory,
	makeMockFlashcardRepo,
	makeMockStudyProgressRepo,
	studyProgressFactory,
} from "../factories/domain";

describe("StudyService", () => {
	describe("getDueCards", () => {
		test("includes new cards with no progress", async () => {
			const deck = deckFactory.build();
			const cards = flashcardFactory.buildList(2, { deckId: deck.id });
			const service = new StudyService(
				makeMockFlashcardRepo({ findByDeckId: mock(async () => cards) }),
				makeMockStudyProgressRepo({ findByDeckAndUser: mock(async () => []) }),
			);

			const due = await service.getDueCards(deck.id, deck.id);

			expect(due).toHaveLength(2);
			expect(due[0].progress).toBeNull();
		});

		test("includes cards past nextReviewAt", async () => {
			const card = flashcardFactory.build();
			const pastProgress = studyProgressFactory.build({
				flashcardId: card.id,
				nextReviewAt: new Date("2000-01-01"),
			});
			const service = new StudyService(
				makeMockFlashcardRepo({ findByDeckId: mock(async () => [card]) }),
				makeMockStudyProgressRepo({ findByDeckAndUser: mock(async () => [pastProgress]) }),
			);

			expect(await service.getDueCards(card.deckId, pastProgress.userId)).toHaveLength(1);
		});

		test("excludes cards not yet due", async () => {
			const card = flashcardFactory.build();
			const futureProgress = studyProgressFactory.build({
				flashcardId: card.id,
				nextReviewAt: new Date("2099-01-01"),
			});
			const service = new StudyService(
				makeMockFlashcardRepo({ findByDeckId: mock(async () => [card]) }),
				makeMockStudyProgressRepo({ findByDeckAndUser: mock(async () => [futureProgress]) }),
			);

			expect(await service.getDueCards(card.deckId, futureProgress.userId)).toHaveLength(0);
		});
	});

	describe("reviewCard", () => {
		test("uses default SM-2 values for new card", async () => {
			const card = flashcardFactory.build();
			const progressRepo = makeMockStudyProgressRepo({
				findByFlashcardAndUser: mock(async () => null),
			});
			const service = new StudyService(makeMockFlashcardRepo(), progressRepo);

			await service.reviewCard(card.id, card.deckId, "perfect");

			const upsertCall = (progressRepo.upsert as ReturnType<typeof mock>).mock.calls[0][0];
			expect(upsertCall.flashcardId).toBe(card.id);
			expect(upsertCall.easeFactor).toBeGreaterThan(2.5);
		});

		test("uses existing progress for repeat review", async () => {
			const card = flashcardFactory.build();
			const existing = studyProgressFactory.build({
				flashcardId: card.id,
				easeFactor: 1.8,
				interval: 6,
				repetitions: 2,
			});
			const progressRepo = makeMockStudyProgressRepo({
				findByFlashcardAndUser: mock(async () => existing),
			});
			const service = new StudyService(makeMockFlashcardRepo(), progressRepo);

			await service.reviewCard(card.id, existing.userId, "correct");

			const upsertCall = (progressRepo.upsert as ReturnType<typeof mock>).mock.calls[0][0];
			expect(upsertCall.interval).toBe(Math.round(6 * existing.easeFactor));
		});

		test("returns upserted progress", async () => {
			const progress = studyProgressFactory.build();
			const service = new StudyService(
				makeMockFlashcardRepo(),
				makeMockStudyProgressRepo({ upsert: mock(async () => progress) }),
			);

			const card = flashcardFactory.build({ id: progress.flashcardId });
			expect(await service.reviewCard(card.id, progress.userId, "perfect")).toEqual(progress);
		});
	});

	describe("getDeckProgress", () => {
		test("counts total, dueNow, mastered correctly", async () => {
			const deck = deckFactory.build();
			const cards = flashcardFactory.buildList(3, { deckId: deck.id });
			const userId = cards[0].deckId; // reuse UUID as userId for simplicity

			const progressList = [
				studyProgressFactory.build({
					flashcardId: cards[0].id,
					userId,
					nextReviewAt: new Date("2099-01-01"),
					interval: 30, // mastered
				}),
				studyProgressFactory.build({
					flashcardId: cards[1].id,
					userId,
					nextReviewAt: new Date("2000-01-01"),
					interval: 5, // due, not mastered
				}),
				// cards[2] has no progress → due
			];

			const service = new StudyService(
				makeMockFlashcardRepo({ findByDeckId: mock(async () => cards) }),
				makeMockStudyProgressRepo({ findByDeckAndUser: mock(async () => progressList) }),
			);

			const summary = await service.getDeckProgress(deck.id, userId);

			expect(summary.total).toBe(3);
			expect(summary.dueNow).toBe(2);
			expect(summary.mastered).toBe(1);
		});
	});

	describe("getProgressByTags", () => {
		test("counts total, dueNow, mastered correctly", async () => {
			const cards = flashcardFactory.buildList(3, { tags: ["condition"] });
			const userId = cards[0].deckId; // reuse UUID as userId for simplicity

			const progressList = [
				studyProgressFactory.build({
					flashcardId: cards[0].id,
					userId,
					nextReviewAt: new Date("2099-01-01"),
					interval: 30, // mastered
				}),
				studyProgressFactory.build({
					flashcardId: cards[1].id,
					userId,
					nextReviewAt: new Date("2000-01-01"),
					interval: 5, // due, not mastered
				}),
				// cards[2] has no progress → due
			];

			const service = new StudyService(
				makeMockFlashcardRepo({ findByTags: mock(async () => cards) }),
				makeMockStudyProgressRepo({
					findByFlashcardIdsAndUser: mock(async () => progressList),
				}),
			);

			const summary = await service.getProgressByTags(["condition"], userId);

			expect(summary.total).toBe(3);
			expect(summary.dueNow).toBe(2);
			expect(summary.mastered).toBe(1);
		});
	});
});
