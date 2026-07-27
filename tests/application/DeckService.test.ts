import { describe, expect, mock, test } from "bun:test";
import { DeckService } from "../../src/application/DeckService";
import { deckFactory, makeMockDeckRepo } from "../factories/domain";

describe("DeckService", () => {
	describe("createDeck", () => {
		test("calls repo.create and returns result", () => {
			const deck = deckFactory.build();
			const repo = makeMockDeckRepo({ create: mock(() => deck) });
			const service = new DeckService(repo);

			const input = { name: deck.name, description: deck.description };
			const result = service.createDeck(input);

			expect(repo.create).toHaveBeenCalledWith(input);
			expect(result).toEqual(deck);
		});
	});

	describe("getDeck", () => {
		test("returns deck when found", () => {
			const deck = deckFactory.build();
			const repo = makeMockDeckRepo({ findById: mock(() => deck) });
			const service = new DeckService(repo);

			expect(service.getDeck(deck.id)).toEqual(deck);
		});

		test("throws when not found", () => {
			const deck = deckFactory.build();
			const repo = makeMockDeckRepo({ findById: mock(() => null) });
			const service = new DeckService(repo);

			expect(() => service.getDeck(deck.id)).toThrow(`Deck not found: ${deck.id}`);
		});
	});

	describe("listDecks", () => {
		test("returns all decks from repo", () => {
			const decks = deckFactory.buildList(3);
			const repo = makeMockDeckRepo({ findAll: mock(() => decks) });
			const service = new DeckService(repo);

			expect(service.listDecks()).toEqual(decks);
		});
	});

	describe("updateDeck", () => {
		test("throws when deck not found", () => {
			const deck = deckFactory.build();
			const repo = makeMockDeckRepo({ findById: mock(() => null) });
			const service = new DeckService(repo);

			expect(() => service.updateDeck(deck.id, { name: "New name" })).toThrow();
		});

		test("calls repo.update and returns result", () => {
			const deck = deckFactory.build();
			const updated = deckFactory.build({ name: "New name" });
			const repo = makeMockDeckRepo({
				findById: mock(() => deck),
				update: mock(() => updated),
			});
			const service = new DeckService(repo);

			const result = service.updateDeck(deck.id, { name: "New name" });

			expect(repo.update).toHaveBeenCalledWith(deck.id, { name: "New name" });
			expect(result).toEqual(updated);
		});
	});

	describe("deleteDeck", () => {
		test("throws when deck not found", () => {
			const deck = deckFactory.build();
			const repo = makeMockDeckRepo({ findById: mock(() => null) });
			const service = new DeckService(repo);

			expect(() => service.deleteDeck(deck.id)).toThrow();
		});

		test("calls repo.delete when found", () => {
			const deck = deckFactory.build();
			const repo = makeMockDeckRepo({ findById: mock(() => deck) });
			const service = new DeckService(repo);

			service.deleteDeck(deck.id);

			expect(repo.delete).toHaveBeenCalledWith(deck.id);
		});
	});
});
