import type { Context } from "hono";
import type { FlashcardService } from "../../../application/FlashcardService";
import { requireParam } from "../params";
import type { CreateFlashcardInput, UpdateFlashcardInput } from "../schemas";

export class FlashcardController {
	constructor(private readonly flashcardService: FlashcardService) {}

	async create(c: Context) {
		const body = await c.req.json<CreateFlashcardInput>();
		const deckId = requireParam(c, "deckId");
		const card = await this.flashcardService.addCard({ deckId, ...body });
		return c.json(card, 201);
	}

	async getById(c: Context) {
		const card = await this.flashcardService.getCard(requireParam(c, "id"));
		return c.json(card);
	}

	async listByDeck(c: Context) {
		const cards = await this.flashcardService.listCards(requireParam(c, "deckId"));
		return c.json(cards);
	}

	async update(c: Context) {
		const body = await c.req.json<UpdateFlashcardInput>();
		const card = await this.flashcardService.updateCard(requireParam(c, "id"), body);
		return c.json(card);
	}

	async delete(c: Context) {
		await this.flashcardService.deleteCard(requireParam(c, "id"));
		return c.body(null, 204);
	}
}
