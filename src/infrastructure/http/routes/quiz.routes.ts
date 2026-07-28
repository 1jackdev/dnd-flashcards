import { Hono } from "hono";
import { parseUUID } from "../../../domain/uuid";
import type { QuizController } from "../controllers/QuizController";
import { type AuthVariables, authMiddleware } from "../middleware/auth";
import { RecordQuizAttemptSchema } from "../schemas";

export function quizRoutes(quiz: QuizController) {
	const app = new Hono<{ Variables: AuthVariables }>();
	app.use("*", authMiddleware);

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
			await quiz.recordAttempt(parseUUID(c.req.param("id")), c.get("userId"), body.correct),
		);
	});

	return app;
}
