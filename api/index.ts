import { createApp } from "../src/app";

// Node.js runtime, not Edge: src/domain/uuid.ts uses `node:crypto`'s
// randomUUID, which Edge's V8-isolate runtime does not support. vercel.json's
// bunVersion makes Bun the actual process executing this function, so
// extensionless relative imports resolve exactly like they do locally.
export const config = { runtime: "nodejs" };

const app = await createApp();

// Vercel's documented zero-config convention for fetch-based frameworks
// (Hono, ElysiaJS, H3, ...): a default export shaped like { fetch(request) }.
// This is the same shape Bun.serve itself expects (see src/main.ts), just
// without the `port` field, which is meaningless in a serverless context.
export default { fetch: (req: Request) => app.fetch(req) };
