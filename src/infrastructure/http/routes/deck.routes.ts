import { Hono } from "hono";
import { parseUUID } from "../../../domain/uuid";
import type { DeckController } from "../controllers/DeckController";
import type { FlashcardController } from "../controllers/FlashcardController";
import type { QuizController } from "../controllers/QuizController";
import type { StudyController } from "../controllers/StudyController";
import { type AuthVariables, authMiddleware } from "../middleware/auth";
import { CreateDeckSchema, CreateFlashcardSchema, UpdateDeckSchema } from "../schemas";

export function deckRoutes(
	deck: DeckController,
	flashcard: FlashcardController,
	study: StudyController,
	quiz: QuizController,
) {
	const app = new Hono<{ Variables: AuthVariables }>();
	app.use("*", authMiddleware);

	app.post("/", async (c) => {
		const body = CreateDeckSchema.parse(await c.req.json());
		return c.json(await deck.create(body), 201);
	});

	app.get("/", async (c) => {
		return c.json(await deck.list());
	});

	app.get("/:id", async (c) => {
		return c.json(await deck.getById(parseUUID(c.req.param("id"))));
	});

	app.patch("/:id", async (c) => {
		const body = UpdateDeckSchema.parse(await c.req.json());
		return c.json(await deck.update(parseUUID(c.req.param("id")), body));
	});

	app.delete("/:id", async (c) => {
		await deck.delete(parseUUID(c.req.param("id")));
		return c.body(null, 204);
	});

	app.post("/:deckId/cards", async (c) => {
		const body = CreateFlashcardSchema.parse(await c.req.json());
		return c.json(await flashcard.create(parseUUID(c.req.param("deckId")), body), 201);
	});

	app.get("/:deckId/cards", async (c) => {
		return c.json(await flashcard.listByDeck(parseUUID(c.req.param("deckId"))));
	});

	app.get("/:deckId/due", async (c) => {
		return c.json(await study.getDueCards(parseUUID(c.req.param("deckId")), c.get("userId")));
	});

	app.get("/:deckId/progress", async (c) => {
		return c.json(await study.getDeckProgress(parseUUID(c.req.param("deckId")), c.get("userId")));
	});

	app.get("/:deckId/quiz", async (c) => {
		return c.json(await quiz.listByDeck(parseUUID(c.req.param("deckId"))));
	});

	app.get("/:deckId/quiz-progress", async (c) => {
		return c.json(await quiz.getDeckProgress(parseUUID(c.req.param("deckId")), c.get("userId")));
	});

	return app;
}
