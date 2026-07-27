import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
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

	app.post("/", zValidator("json", CreateDeckSchema), (c) => deck.create(c));
	app.get("/", (c) => deck.list(c));
	app.get("/:id", (c) => deck.getById(c));
	app.patch("/:id", zValidator("json", UpdateDeckSchema), (c) => deck.update(c));
	app.delete("/:id", (c) => deck.delete(c));

	app.post("/:deckId/cards", zValidator("json", CreateFlashcardSchema), (c) => flashcard.create(c));
	app.get("/:deckId/cards", (c) => flashcard.listByDeck(c));
	app.get("/:deckId/due", (c) => study.getDueCards(c));
	app.get("/:deckId/progress", (c) => study.getDeckProgress(c));

	return app;
}
