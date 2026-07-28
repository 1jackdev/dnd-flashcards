import type { UUID } from "./uuid";

export const ANONYMOUS_USER_ID = "00000000-0000-0000-0000-000000000000" as UUID;

// dev placeholder — must be replaced with a real secret via JWT_SECRET before production use
export const JWT_SECRET = process.env.JWT_SECRET ?? "dev-placeholder-jwt-secret-do-not-use-in-prod";
