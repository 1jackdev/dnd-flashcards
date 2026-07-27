import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/infrastructure/db/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: process.env.DB_PATH ?? "flashcards.db",
	},
});
