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
		test("throws when deck not found", () => {
			const deck = deckFactory.build();
			const flashcardRepo = makeMockFlashcardRepo();
			const deckRepo = makeMockDeckRepo({ findById: mock(() => null) });
			const service = new FlashcardService(flashcardRepo, deckRepo);

			expect(() =>
				service.addCard({ deckId: deck.id, front: "Q", back: "A", tags: ["rule"] }),
			).toThrow(`Deck not found: ${deck.id}`);
			expect(flashcardRepo.create).not.toHaveBeenCalled();
		});

		test("creates card when deck exists", () => {
			const deck = deckFactory.build();
			const card = flashcardFactory.build({ deckId: deck.id });
			const flashcardRepo = makeMockFlashcardRepo({ create: mock(() => card) });
			const deckRepo = makeMockDeckRepo({ findById: mock(() => deck) });
			const service = new FlashcardService(flashcardRepo, deckRepo);

			const result = service.addCard({
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
		test("returns card when found", () => {
			const card = flashcardFactory.build();
			const service = new FlashcardService(
				makeMockFlashcardRepo({ findById: mock(() => card) }),
				makeMockDeckRepo(),
			);

			expect(service.getCard(card.id)).toEqual(card);
		});

		test("throws when not found", () => {
			const card = flashcardFactory.build();
			const service = new FlashcardService(
				makeMockFlashcardRepo({ findById: mock(() => null) }),
				makeMockDeckRepo(),
			);

			expect(() => service.getCard(card.id)).toThrow(`Flashcard not found: ${card.id}`);
		});
	});

	describe("listCards", () => {
		test("returns cards for deck", () => {
			const deck = deckFactory.build();
			const cards = flashcardFactory.buildList(3, { deckId: deck.id });
			const service = new FlashcardService(
				makeMockFlashcardRepo({ findByDeckId: mock(() => cards) }),
				makeMockDeckRepo(),
			);

			expect(service.listCards(deck.id)).toEqual(cards);
		});
	});

	describe("updateCard", () => {
		test("throws when card not found", () => {
			const card = flashcardFactory.build();
			const service = new FlashcardService(
				makeMockFlashcardRepo({ findById: mock(() => null) }),
				makeMockDeckRepo(),
			);

			expect(() => service.updateCard(card.id, { front: "New Q" })).toThrow();
		});

		test("calls repo.update and returns result", () => {
			const card = flashcardFactory.build();
			const updated = flashcardFactory.build({ front: "New Q" });
			const flashcardRepo = makeMockFlashcardRepo({
				findById: mock(() => card),
				update: mock(() => updated),
			});
			const service = new FlashcardService(flashcardRepo, makeMockDeckRepo());

			const result = service.updateCard(card.id, { front: "New Q" });

			expect(flashcardRepo.update).toHaveBeenCalledWith(card.id, { front: "New Q" });
			expect(result).toEqual(updated);
		});
	});

	describe("deleteCard", () => {
		test("throws when card not found", () => {
			const card = flashcardFactory.build();
			const service = new FlashcardService(
				makeMockFlashcardRepo({ findById: mock(() => null) }),
				makeMockDeckRepo(),
			);

			expect(() => service.deleteCard(card.id)).toThrow();
		});

		test("calls repo.delete when found", () => {
			const card = flashcardFactory.build();
			const flashcardRepo = makeMockFlashcardRepo({ findById: mock(() => card) });
			const service = new FlashcardService(flashcardRepo, makeMockDeckRepo());

			service.deleteCard(card.id);

			expect(flashcardRepo.delete).toHaveBeenCalledWith(card.id);
		});
	});
});
