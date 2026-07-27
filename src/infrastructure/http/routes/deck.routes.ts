import { Hono } from "hono";
import { ANONYMOUS_USER_ID } from "../../../domain/constants";
import { parseUUID } from "../../../domain/uuid";
import type { DeckController } from "../controllers/DeckController";
import type { FlashcardController } from "../controllers/FlashcardController";
import type { StudyController } from "../controllers/StudyController";
import { CreateDeckSchema, CreateFlashcardSchema, UpdateDeckSchema } from "../schemas";

export function deckRoutes(
	deck: DeckController,
	flashcard: FlashcardController,
	study: StudyController,
) {
	const app = new Hono();

	app.post("/", async (c) => {
		const body = CreateDeckSchema.parse(await c.req.json());
		return c.json(deck.create(body), 201);
	});

	app.get("/", (c) => {
		return c.json(deck.list());
	});

	app.get("/:id", (c) => {
		return c.json(deck.getById(parseUUID(c.req.param("id"))));
	});

	app.patch("/:id", async (c) => {
		const body = UpdateDeckSchema.parse(await c.req.json());
		return c.json(deck.update(parseUUID(c.req.param("id")), body));
	});

	app.delete("/:id", (c) => {
		deck.delete(parseUUID(c.req.param("id")));
		return c.body(null, 204);
	});

	app.post("/:deckId/cards", async (c) => {
		const body = CreateFlashcardSchema.parse(await c.req.json());
		return c.json(flashcard.create(parseUUID(c.req.param("deckId")), body), 201);
	});

	app.get("/:deckId/cards", (c) => {
		return c.json(flashcard.listByDeck(parseUUID(c.req.param("deckId"))));
	});

	app.get("/:deckId/due", (c) => {
		return c.json(study.getDueCards(parseUUID(c.req.param("deckId")), ANONYMOUS_USER_ID));
	});

	app.get("/:deckId/progress", (c) => {
		return c.json(study.getDeckProgress(parseUUID(c.req.param("deckId")), ANONYMOUS_USER_ID));
	});

	return app;
}
