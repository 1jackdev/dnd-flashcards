import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const BRUNO_DIR = join(ROOT, "bruno");
const ROUTES_DIR = join(ROOT, "src/infrastructure/http/routes");

function extractAppRoutes(file: string, prefix: string): string[] {
	const content = readFileSync(file, "utf-8");
	return [...content.matchAll(/app\.(get|post|patch|delete)\("([^"]+)"/g)].map((match) => {
		const path = match[2] === "/" ? "" : match[2];
		return `${match[1].toUpperCase()} ${prefix}${path}`;
	});
}

function extractBrunoRoutes(dir: string): string[] {
	return readdirSync(dir)
		.filter((f) => f.endsWith(".yml") && f !== "opencollection.yml")
		.flatMap((file) => {
			const content = readFileSync(join(dir, file), "utf-8");
			const method = content.match(/method:\s*(\w+)/)?.[1];
			const url = content.match(/url:\s*(.+)/)?.[1]?.trim();
			if (!method || !url) return [];
			const path = url
				.replace("http://localhost:3000", "")
				.replace(/\?.*$/, "")
				.replace(/\{\{[^}]+\}\}/g, ":param");
			return [`${method.toUpperCase()} ${path}`];
		});
}

function normalize(route: string): string {
	return route.replace(/:[^/]+/g, ":param");
}

const appRoutes = [
	...extractAppRoutes(join(ROUTES_DIR, "deck.routes.ts"), "/decks"),
	...extractAppRoutes(join(ROUTES_DIR, "flashcard.routes.ts"), "/flashcards"),
	...extractAppRoutes(join(ROUTES_DIR, "quiz.routes.ts"), "/quiz"),
	...extractAppRoutes(join(ROUTES_DIR, "auth.routes.ts"), "/auth"),
	...extractAppRoutes(join(ROUTES_DIR, "tags.routes.ts"), "/tags"),
];

const brunoRoutes = extractBrunoRoutes(BRUNO_DIR);

const missing = appRoutes.filter(
	(route) => !brunoRoutes.some((br) => normalize(br) === normalize(route)),
);

if (missing.length > 0) {
	console.error("Missing Bruno requests for:");
	for (const route of missing) console.error(`  ${route}`);
	process.exit(1);
}

console.log(`✓ All ${appRoutes.length} endpoints covered in Bruno`);
