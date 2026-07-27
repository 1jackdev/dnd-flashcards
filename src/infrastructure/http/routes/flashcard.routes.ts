import { Hono } from "hono";
import { ANONYMOUS_USER_ID } from "../../../domain/constants";
import { parseUUID } from "../../../domain/uuid";
import type { FlashcardController } from "../controllers/FlashcardController";
import type { StudyController } from "../controllers/StudyController";
import { ReviewCardSchema, UpdateFlashcardSchema } from "../schemas";

export function flashcardRoutes(flashcard: FlashcardController, study: StudyController) {
	const app = new Hono();

	app.get("/:id", (c) => {
		return c.json(flashcard.getById(parseUUID(c.req.param("id"))));
	});

	app.patch("/:id", async (c) => {
		const body = UpdateFlashcardSchema.parse(await c.req.json());
		return c.json(flashcard.update(parseUUID(c.req.param("id")), body));
	});

	app.delete("/:id", (c) => {
		flashcard.delete(parseUUID(c.req.param("id")));
		return c.body(null, 204);
	});

	app.post("/:id/review", async (c) => {
		const body = ReviewCardSchema.parse(await c.req.json());
		return c.json(study.reviewCard(parseUUID(c.req.param("id")), ANONYMOUS_USER_ID, body.rating));
	});

	return app;
}
