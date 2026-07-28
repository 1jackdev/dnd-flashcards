import { describe, expect, mock, test } from "bun:test";
import { DeckService } from "../../src/application/DeckService";
import { deckFactory, makeMockDeckRepo } from "../factories/domain";

describe("DeckService", () => {
	describe("createDeck", () => {
		test("calls repo.create and returns result", async () => {
			const deck = deckFactory.build();
			const repo = makeMockDeckRepo({ create: mock(async () => deck) });
			const service = new DeckService(repo);

			const input = { name: deck.name, description: deck.description };
			const result = await service.createDeck(input);

			expect(repo.create).toHaveBeenCalledWith(input);
			expect(result).toEqual(deck);
		});
	});

	describe("getDeck", () => {
		test("returns deck when found", async () => {
			const deck = deckFactory.build();
			const repo = makeMockDeckRepo({ findById: mock(async () => deck) });
			const service = new DeckService(repo);

			expect(await service.getDeck(deck.id)).toEqual(deck);
		});

		test("throws when not found", async () => {
			const deck = deckFactory.build();
			const repo = makeMockDeckRepo({ findById: mock(async () => null) });
			const service = new DeckService(repo);

			await expect(service.getDeck(deck.id)).rejects.toThrow(`Deck not found: ${deck.id}`);
		});
	});

	describe("listDecks", () => {
		test("returns all decks from repo", async () => {
			const decks = deckFactory.buildList(3);
			const repo = makeMockDeckRepo({ findAll: mock(async () => decks) });
			const service = new DeckService(repo);

			expect(await service.listDecks()).toEqual(decks);
		});
	});

	describe("updateDeck", () => {
		test("throws when deck not found", async () => {
			const deck = deckFactory.build();
			const repo = makeMockDeckRepo({ findById: mock(async () => null) });
			const service = new DeckService(repo);

			await expect(service.updateDeck(deck.id, { name: "New name" })).rejects.toThrow();
		});

		test("calls repo.update and returns result", async () => {
			const deck = deckFactory.build();
			const updated = deckFactory.build({ name: "New name" });
			const repo = makeMockDeckRepo({
				findById: mock(async () => deck),
				update: mock(async () => updated),
			});
			const service = new DeckService(repo);

			const result = await service.updateDeck(deck.id, { name: "New name" });

			expect(repo.update).toHaveBeenCalledWith(deck.id, { name: "New name" });
			expect(result).toEqual(updated);
		});
	});

	describe("deleteDeck", () => {
		test("throws when deck not found", async () => {
			const deck = deckFactory.build();
			const repo = makeMockDeckRepo({ findById: mock(async () => null) });
			const service = new DeckService(repo);

			await expect(service.deleteDeck(deck.id)).rejects.toThrow();
		});

		test("calls repo.delete when found", async () => {
			const deck = deckFactory.build();
			const repo = makeMockDeckRepo({ findById: mock(async () => deck) });
			const service = new DeckService(repo);

			await service.deleteDeck(deck.id);

			expect(repo.delete).toHaveBeenCalledWith(deck.id);
		});
	});
});
