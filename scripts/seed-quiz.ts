import { execSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";

if (!process.env.AUTH_TOKEN) {
	console.error("AUTH_TOKEN env var is required (a valid JWT from POST /auth/login).");
	process.exit(1);
}

const dir = join(import.meta.dir, "seeds", "quiz");
const scripts = readdirSync(dir)
	.filter((f) => f.startsWith("quiz-") && f.endsWith(".ts"))
	.sort();

for (const script of scripts) {
	console.log(`\n--- ${script} ---`);
	execSync(`bun run ${join(dir, script)}`, { stdio: "inherit" });
}
