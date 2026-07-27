import type { Context } from "hono";
import type { DeckService } from "../../../application/DeckService";
import { requireParam } from "../params";
import type { CreateDeckInput, UpdateDeckInput } from "../schemas";

export class DeckController {
	constructor(private readonly deckService: DeckService) {}

	async create(c: Context) {
		const body = await c.req.json<CreateDeckInput>();
		const deck = await this.deckService.createDeck(body);
		return c.json(deck, 201);
	}

	async getById(c: Context) {
		const deck = await this.deckService.getDeck(requireParam(c, "id"));
		return c.json(deck);
	}

	async list(c: Context) {
		const decks = await this.deckService.listDecks();
		return c.json(decks);
	}

	async update(c: Context) {
		const body = await c.req.json<UpdateDeckInput>();
		const deck = await this.deckService.updateDeck(requireParam(c, "id"), body);
		return c.json(deck);
	}

	async delete(c: Context) {
		await this.deckService.deleteDeck(requireParam(c, "id"));
		return c.body(null, 204);
	}
}
