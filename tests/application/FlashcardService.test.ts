import { describe, expect, mock, test } from "bun:test";
import { FlashcardService } from "../../src/application/FlashcardService";
import {
	deckFactory,
	flashcardFactory,
	makeMockDeckRepo,
	makeMockFlashcardRepo,
} from "../factories/domain";

describe("FlashcardService", () => {
	describe("addCard", () => {
		test("throws when deck not found", async () => {
			const deck = deckFactory.build();
			const flashcardRepo = makeMockFlashcardRepo();
			const deckRepo = makeMockDeckRepo({ findById: mock(async () => null) });
			const service = new FlashcardService(flashcardRepo, deckRepo);

			await expect(
				service.addCard({ deckId: deck.id, front: "Q", back: "A", tags: ["rule"] }),
			).rejects.toThrow(`Deck not found: ${deck.id}`);
			expect(flashcardRepo.create).not.toHaveBeenCalled();
		});

		test("creates card when deck exists", async () => {
			const deck = deckFactory.build();
			const card = flashcardFactory.build({ deckId: deck.id });
			const flashcardRepo = makeMockFlashcardRepo({ create: mock(async () => card) });
			const deckRepo = makeMockDeckRepo({ findById: mock(async () => deck) });
			const service = new FlashcardService(flashcardRepo, deckRepo);

			const result = await service.addCard({
				deckId: deck.id,
				front: card.front,
				back: card.back,
				tags: card.tags,
			});

			expect(flashcardRepo.create).toHaveBeenCalled();
			expect(result).toEqual(card);
		});
	});

	describe("getCard", () => {
		test("returns card when found", async () => {
			const card = flashcardFactory.build();
			const service = new FlashcardService(
				makeMockFlashcardRepo({ findById: mock(async () => card) }),
				makeMockDeckRepo(),
			);

			expect(await service.getCard(card.id)).toEqual(card);
		});

		test("throws when not found", async () => {
			const card = flashcardFactory.build();
			const service = new FlashcardService(
				makeMockFlashcardRepo({ findById: mock(async () => null) }),
				makeMockDeckRepo(),
			);

			await expect(service.getCard(card.id)).rejects.toThrow(`Flashcard not found: ${card.id}`);
		});
	});

	describe("listCards", () => {
		test("returns cards for deck", async () => {
			const deck = deckFactory.build();
			const cards = flashcardFactory.buildList(3, { deckId: deck.id });
			const service = new FlashcardService(
				makeMockFlashcardRepo({ findByDeckId: mock(async () => cards) }),
				makeMockDeckRepo(),
			);

			expect(await service.listCards(deck.id)).toEqual(cards);
		});
	});

	describe("listByTags", () => {
		test("returns cards matching any of the given tags", async () => {
			const cards = flashcardFactory.buildList(2, { tags: ["condition"] });
			const service = new FlashcardService(
				makeMockFlashcardRepo({ findByTags: mock(async () => cards) }),
				makeMockDeckRepo(),
			);

			expect(await service.listByTags(["condition", "rule"])).toEqual(cards);
		});
	});

	describe("updateCard", () => {
		test("throws when card not found", async () => {
			const card = flashcardFactory.build();
			const service = new FlashcardService(
				makeMockFlashcardRepo({ findById: mock(async () => null) }),
				makeMockDeckRepo(),
			);

			await expect(service.updateCard(card.id, { front: "New Q" })).rejects.toThrow();
		});

		test("calls repo.update and returns result", async () => {
			const card = flashcardFactory.build();
			const updated = flashcardFactory.build({ front: "New Q" });
			const flashcardRepo = makeMockFlashcardRepo({
				findById: mock(async () => card),
				update: mock(async () => updated),
			});
			const service = new FlashcardService(flashcardRepo, makeMockDeckRepo());

			const result = await service.updateCard(card.id, { front: "New Q" });

			expect(flashcardRepo.update).toHaveBeenCalledWith(card.id, { front: "New Q" });
			expect(result).toEqual(updated);
		});
	});

	describe("deleteCard", () => {
		test("throws when card not found", async () => {
			const card = flashcardFactory.build();
			const service = new FlashcardService(
				makeMockFlashcardRepo({ findById: mock(async () => null) }),
				makeMockDeckRepo(),
			);

			await expect(service.deleteCard(card.id)).rejects.toThrow();
		});

		test("calls repo.delete when found", async () => {
			const card = flashcardFactory.build();
			const flashcardRepo = makeMockFlashcardRepo({ findById: mock(async () => card) });
			const service = new FlashcardService(flashcardRepo, makeMockDeckRepo());

			await service.deleteCard(card.id);

			expect(flashcardRepo.delete).toHaveBeenCalledWith(card.id);
		});
	});
});
