import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { REGISTRATION_SECRET } from "../../../domain/constants";
import type { AuthController } from "../controllers/AuthController";
import { LoginSchema, RegisterSchema } from "../schemas";

export function authRoutes(auth: AuthController) {
	const app = new Hono();

	app.post("/register", async (c) => {
		const secret = c.req.header("X-Registration-Secret");
		if (!REGISTRATION_SECRET || secret !== REGISTRATION_SECRET) {
			throw new HTTPException(403, { message: "Unauthorized" });
		}
		const body = RegisterSchema.parse(await c.req.json());
		const result = await auth.register(body.username, body.password);
		return c.json(result, 201);
	});

	app.post("/login", async (c) => {
		const body = LoginSchema.parse(await c.req.json());
		const result = await auth.login(body.username, body.password);
		return c.json(result);
	});

	return app;
}
