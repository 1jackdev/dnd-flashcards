import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";

const dbPath = process.env.DB_PATH ?? "flashcards.db";
const walPath = `${dbPath}-wal`;
const shmPath = `${dbPath}-shm`;

for (const path of [dbPath, walPath, shmPath]) {
	if (existsSync(path)) {
		rmSync(path);
		console.log(`Deleted ${path}`);
	}
}

execSync("bun run db:push", { stdio: "inherit" });
console.log("DB reset complete.");
