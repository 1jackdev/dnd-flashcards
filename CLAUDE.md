# CLAUDE.md — Coding practices for this project

## Dependency injection

All wiring happens in `src/container.ts` via `buildContainer(db: DB)`. It instantiates repos, passes them to services, passes services to controllers, and returns a `Container` object. No decorators, no IoC container library, no reflection magic. Add new dependencies by editing `buildContainer` directly.

## Type strictness: UUIDs

All entity IDs use the branded type `UUID = string & { readonly __brand: "UUID" }` from `src/domain/uuid.ts`.

- Use `parseUUID(value)` at the HTTP boundary (route handlers reading path params or body).
- Use `newUUID()` inside repository implementations when creating new records.
- Never accept or pass raw `string` where `UUID` is expected. TypeScript will catch this at compile time.

## Sync-first execution model

Repos, services, and controllers are all synchronous. Drizzle with `bun:sqlite` is synchronous — write mutations use `.run()`, not `.execute()` or `await`. The only `async` functions in the codebase are route handlers, which must `await c.req.json()` before parsing.

Do not make service or repository methods `async`. Do not add `Promise` return types to domain or application layer code.

## Zod validation

All request body validation uses explicit `Schema.parse(await c.req.json())` at the top of each route handler. There is no validation middleware. Schemas are defined in `src/infrastructure/http/schemas.ts` and imported into route files. Do not define schemas inline in route handlers or in controller files.

If adding a new endpoint that accepts a body, add its schema to `schemas.ts` and call `.parse()` in the route handler.

## Controllers

Controllers are HTTP-agnostic. They take typed domain inputs (e.g., `CreateDeckInput`, `UUID`) and return domain types (e.g., `Deck`). They do not receive or reference Hono `Context`. All HTTP concerns — parsing params, calling `parseUUID`, reading request bodies, setting response status codes — belong in route files, not controllers.

## Linting and formatting

Run `bun run lint` to format, lint, and sort imports in one step. This runs `biome check --write .`. Do not run `biome format` or `biome lint` separately — they do not handle import sorting. CI uses `bun run ci:biome` (no write flag).

## Tests

Bun's built-in test runner (`bun test`). Test factories live in `tests/factories/`:

- `tests/factories/domain.ts`: fishery factories for domain entities (`deckFactory`, `flashcardFactory`, `studyProgressFactory`) and mock repo factories (`makeMockDeckRepo`, `makeMockFlashcardRepo`, `makeMockStudyProgressRepo`).
- `tests/factories/orm.ts`: fishery factories for raw Drizzle row types.

When testing a service method, construct a mock repo via `makeMockDeckRepo()` etc., then override the specific method under test using the `overrides` parameter with `mock(() => value)`. Do not manually implement the full interface — use the factory defaults for methods not under test.

Coverage thresholds: 80% line and function coverage, enforced by `bunfig.toml`. The `tests/**` directory is excluded from coverage.

## Tags

Tags are a closed set defined in `src/domain/tags.ts` as the `TAGS` const. The `Tag` type is derived from that const. Never accept freeform tag strings. Tag validation in schemas uses `z.enum(TAGS)`. Do not add new tags without updating `TAGS`.

## Error handling

Services throw plain `Error` with descriptive messages, e.g., `"Deck not found: ${id}"`. There is no custom error class hierarchy. The global error handler in `src/main.ts` maps errors to HTTP responses: messages containing `"not found"` become 404, everything else becomes 500. Do not add per-route try/catch blocks. Do not throw HTTP-specific errors from services or repos.

## Comments

Only add comments when the reason for a decision is non-obvious. Do not add docstrings. Do not add comments that restate what the code does.
