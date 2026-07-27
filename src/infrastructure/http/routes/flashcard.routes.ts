import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { FlashcardController } from "../controllers/FlashcardController";
import type { StudyController } from "../controllers/StudyController";
import { ReviewCardSchema, UpdateFlashcardSchema } from "../schemas";

export function flashcardRoutes(flashcard: FlashcardController, study: StudyController) {
	const app = new Hono();

	app.get("/:id", (c) => flashcard.getById(c));
	app.patch("/:id", zValidator("json", UpdateFlashcardSchema), (c) => flashcard.update(c));
	app.delete("/:id", (c) => flashcard.delete(c));
	app.post("/:id/review", zValidator("json", ReviewCardSchema), (c) => study.reviewCard(c));

	return app;
}
