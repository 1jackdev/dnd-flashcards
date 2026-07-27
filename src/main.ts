import { Hono } from "hono";
import { buildContainer } from "./container";
import { createDb } from "./infrastructure/db/client";
import { deckRoutes } from "./infrastructure/http/routes/deck.routes";
import { flashcardRoutes } from "./infrastructure/http/routes/flashcard.routes";

const DB_PATH = process.env.DB_PATH ?? "flashcards.db";
const PORT = Number(process.env.PORT ?? 3000);

const db = createDb(DB_PATH);
const container = buildContainer(db);

const { deckController, flashcardController, studyController } = container;

const app = new Hono();

app.route("/decks", deckRoutes(deckController, flashcardController, studyController));
app.route("/flashcards", flashcardRoutes(flashcardController, studyController));

app.onError((err, c) => {
	const message = err instanceof Error ? err.message : "Unknown error";
	const status = message.includes("not found") ? 404 : 500;
	return c.json({ error: message }, status);
});

export default {
	port: PORT,
	fetch: app.fetch,
};

console.log(`Server running on http://localhost:${PORT}`);
