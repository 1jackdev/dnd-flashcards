import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { buildContainer } from "./container";
import { createDb } from "./infrastructure/db/client";
import { authRoutes } from "./infrastructure/http/routes/auth.routes";
import { deckRoutes } from "./infrastructure/http/routes/deck.routes";
import { flashcardRoutes } from "./infrastructure/http/routes/flashcard.routes";
import { quizRoutes } from "./infrastructure/http/routes/quiz.routes";
import { tagsRoutes } from "./infrastructure/http/routes/tags.routes";

export async function createApp() {
	const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
	const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
	if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
		throw new Error(
			"Missing required environment variables: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must both be set.",
		);
	}

	const db = await createDb(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN);
	const container = buildContainer(db);

	const { deckController, flashcardController, studyController, quizController, authController } =
		container;

	const app = new Hono();

	// `hono/bun`'s serveStatic uses Bun.file directly. Vercel's deployed
	// functions also run under Bun (see vercel.json's bunVersion), so
	// `typeof Bun !== "undefined"` is true there too — `process.env.VERCEL` is
	// what actually distinguishes local dev from a Vercel deployment, where
	// files in public/ are served directly by Vercel's static file host instead.
	if (typeof Bun !== "undefined" && !process.env.VERCEL) {
		const { serveStatic } = await import("hono/bun");
		app.use("/public/*", serveStatic({ root: "./" }));
	}

	app.route(
		"/decks",
		deckRoutes(deckController, flashcardController, studyController, quizController),
	);
	app.route("/flashcards", flashcardRoutes(flashcardController, studyController, quizController));
	app.route("/quiz", quizRoutes(quizController));
	app.route("/tags", tagsRoutes(flashcardController, studyController, quizController));
	app.route("/auth", authRoutes(authController));

	app.onError((err, c) => {
		if (err instanceof HTTPException) {
			return c.json({ error: err.message }, err.status);
		}
		const message = err instanceof Error ? err.message : "Unknown error";
		const status = message.includes("not found") ? 404 : 500;
		return c.json({ error: message }, status);
	});

	return app;
}
