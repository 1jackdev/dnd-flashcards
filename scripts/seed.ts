import { execSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(import.meta.dir, "seeds");
const scripts = readdirSync(dir)
	.filter((f) => f.startsWith("seed-") && f.endsWith(".ts"))
	.sort();

for (const script of scripts) {
	console.log(`\n--- ${script} ---`);
	execSync(`bun run ${join(dir, script)}`, { stdio: "inherit" });
}
