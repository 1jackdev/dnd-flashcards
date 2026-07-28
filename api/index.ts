import { handle } from "hono/vercel";
import { createApp } from "../src/app";

// Node.js runtime, not Edge: src/domain/uuid.ts uses `node:crypto`'s
// randomUUID, which Edge's V8-isolate runtime does not support. hono/vercel's
// handle() just wraps app.fetch in a (req) => Response function, which
// Vercel's Node.js serverless runtime accepts directly as a Web-standard
// fetch handler. `bunVersion` in vercel.json makes Bun the actual process
// executing this function, so extensionless relative imports resolve exactly
// like they do locally — no separate bundling step needed.
export const config = { runtime: "nodejs" };

const app = await createApp();

export default handle(app);
