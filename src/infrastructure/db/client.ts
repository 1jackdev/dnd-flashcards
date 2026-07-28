import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export type DB = Awaited<ReturnType<typeof createDb>>;

export async function createDb(url: string, authToken: string) {
	const client = createClient({ url, authToken });
	// libsql doesn't enable FK enforcement by default; unlike bun:sqlite's PRAGMA
	// at construction time, this must be an awaited statement against the client.
	await client.execute("PRAGMA foreign_keys = ON;");
	return drizzle(client, { schema });
}
