import type { Context } from "hono";

export function requireParam(c: Context, name: string): string {
	const value = c.req.param(name);
	if (!value) throw new Error(`Missing route param: ${name}`);
	return value;
}
