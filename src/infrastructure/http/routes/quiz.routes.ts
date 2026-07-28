import { Hono } from "hono";
import { ANONYMOUS_USER_ID } from "../../../domain/constants";
import { parseUUID } from "../../../domain/uuid";
import type { QuizController } from "../controllers/QuizController";
import { RecordQuizAttemptSchema } from "../schemas";

export function quizRoutes(quiz: QuizController) {
	const app = new Hono();

	app.get("/:id", async (c) => {
		return c.json(await quiz.getById(parseUUID(c.req.param("id"))));
	});

	app.delete("/:id", async (c) => {
		await quiz.delete(parseUUID(c.req.param("id")));
		return c.body(null, 204);
	});

	app.post("/:id/attempt", async (c) => {
		const body = RecordQuizAttemptSchema.parse(await c.req.json());
		return c.json(
			await quiz.recordAttempt(parseUUID(c.req.param("id")), ANONYMOUS_USER_ID, body.correct),
		);
	});

	return app;
}
