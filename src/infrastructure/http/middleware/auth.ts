import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";
import { JWT_SECRET } from "../../../domain/constants";
import { parseUUID, type UUID } from "../../../domain/uuid";

export type AuthVariables = {
	userId: UUID;
};

const BEARER_PREFIX = "Bearer ";

export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
	const header = c.req.header("Authorization");
	if (!header?.startsWith(BEARER_PREFIX)) {
		throw new HTTPException(401, { message: "Missing or malformed Authorization header" });
	}
	const token = header.slice(BEARER_PREFIX.length);

	let payload: Awaited<ReturnType<typeof verify>>;
	try {
		payload = await verify(token, JWT_SECRET, "HS256");
	} catch {
		throw new HTTPException(401, { message: "Invalid or expired token" });
	}

	if (typeof payload.sub !== "string") {
		throw new HTTPException(401, { message: "Invalid token payload" });
	}

	let userId: UUID;
	try {
		userId = parseUUID(payload.sub);
	} catch {
		throw new HTTPException(401, { message: "Invalid token payload" });
	}

	c.set("userId", userId);
	await next();
});
