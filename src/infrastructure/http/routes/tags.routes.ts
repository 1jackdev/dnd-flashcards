import { Hono } from "hono";
import { TAGS, type Tag } from "../../../domain/tags";
import type { FlashcardController } from "../controllers/FlashcardController";
import type { QuizController } from "../controllers/QuizController";
import type { StudyController } from "../controllers/StudyController";
import { type AuthVariables, authMiddleware } from "../middleware/auth";

function parseTags(raw: string | undefined): Tag[] {
	if (!raw) return [];
	return raw
		.split(",")
		.map((t) => t.trim())
		.filter((t) => t.length > 0)
		.map((t) => {
			if (!TAGS.includes(t as Tag)) throw new Error(`Invalid tag: ${t}`);
			return t as Tag;
		});
}

export function tagsRoutes(
	flashcard: FlashcardController,
	study: StudyController,
	quiz: QuizController,
) {
	const app = new Hono<{ Variables: AuthVariables }>();
	app.use("*", authMiddleware);

	app.get("/", (c) => {
		return c.json(TAGS);
	});

	app.get("/flashcards", async (c) => {
		const tags = parseTags(c.req.query("tags"));
		if (tags.length === 0) return c.json([]);
		return c.json(await flashcard.listByTags(tags));
	});

	app.get("/study", async (c) => {
		const tags = parseTags(c.req.query("tags"));
		if (tags.length === 0) return c.json({ total: 0, dueNow: 0, mastered: 0, cards: [] });
		return c.json(await study.getProgressByTags(tags, c.get("userId")));
	});

	app.get("/quiz", async (c) => {
		const tags = parseTags(c.req.query("tags"));
		if (tags.length === 0) return c.json([]);
		return c.json(await quiz.listByTags(tags));
	});

	app.get("/quiz-progress", async (c) => {
		const tags = parseTags(c.req.query("tags"));
		if (tags.length === 0) return c.json({ total: 0, questions: [] });
		return c.json(await quiz.getQuizProgressByTags(tags, c.get("userId")));
	});

	return app;
}
