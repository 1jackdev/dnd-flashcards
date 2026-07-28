// dev placeholder — must be replaced with a real secret via JWT_SECRET before production use
export const JWT_SECRET = process.env.JWT_SECRET ?? "dev-placeholder-jwt-secret-do-not-use-in-prod";

// Gates POST /auth/register so only whoever holds this secret can create an
// account — this app has no public signup. Unset in prod means registration
// is unreachable (no fallback default), by design.
export const REGISTRATION_SECRET = process.env.REGISTRATION_SECRET;
