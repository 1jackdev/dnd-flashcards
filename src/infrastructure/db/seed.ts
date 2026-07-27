import { randomUUID } from "node:crypto";
import { TAGS } from "../../domain/tags";
import { createDb } from "./client";
import { tags } from "./schema";

const db = createDb(process.env.DB_PATH ?? "flashcards.db");

await db
	.insert(tags)
	.values(TAGS.map((name) => ({ id: randomUUID(), name })))
	.onConflictDoNothing();

console.log(`Seeded ${TAGS.length} tags`);
