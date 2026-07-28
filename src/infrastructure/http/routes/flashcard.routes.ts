import { Hono } from "hono";
import { parseUUID } from "../../../domain/uuid";
import type { FlashcardController } from "../controllers/FlashcardController";
import type { QuizController } from "../controllers/QuizController";
import type { StudyController } from "../controllers/StudyController";
import { type AuthVariables, authMiddleware } from "../middleware/auth";
import { CreateQuizQuestionSchema, ReviewCardSchema, UpdateFlashcardSchema } from "../schemas";

export function flashcardRoutes(
	flashcard: FlashcardController,
	study: StudyController,
	quiz: QuizController,
) {
	const app = new Hono<{ Variables: AuthVariables }>();
	app.use("*", authMiddleware);

	app.get("/:id", async (c) => {
		return c.json(await flashcard.getById(parseUUID(c.req.param("id"))));
	});

	app.patch("/:id", async (c) => {
		const body = UpdateFlashcardSchema.parse(await c.req.json());
		return c.json(await flashcard.update(parseUUID(c.req.param("id")), body));
	});

	app.delete("/:id", async (c) => {
		await flashcard.delete(parseUUID(c.req.param("id")));
		return c.body(null, 204);
	});

	app.post("/:id/review", async (c) => {
		const body = ReviewCardSchema.parse(await c.req.json());
		return c.json(
			await study.reviewCard(parseUUID(c.req.param("id")), c.get("userId"), body.rating),
		);
	});

	app.post("/:id/quiz", async (c) => {
		const body = CreateQuizQuestionSchema.parse(await c.req.json());
		return c.json(await quiz.create(parseUUID(c.req.param("id")), body), 201);
	});

	app.get("/:id/quiz", async (c) => {
		return c.json(await quiz.listByFlashcard(parseUUID(c.req.param("id"))));
	});

	return app;
}
