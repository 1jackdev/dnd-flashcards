# architecture.md — Project structure reference

Hexagonal architecture: domain → application → infrastructure. The domain has no imports from application or infrastructure. Application imports domain only. Infrastructure imports both.

## Layer map

### `src/domain/`

Pure domain logic and types. No framework dependencies.

| File | Contents |
|---|---|
| `entities/Deck.ts` | `Deck` type |
| `entities/Flashcard.ts` | `Flashcard` type |
| `entities/StudyProgress.ts` | `StudyProgress` type |
| `ports/IDeckRepository.ts` | Repository interface for decks |
| `ports/IFlashcardRepository.ts` | Repository interface for flashcards |
| `ports/IStudyProgressRepository.ts` | Repository interface for study progress |
| `sm2.ts` | SM-2 spaced repetition algorithm |
| `tags.ts` | `TAGS` const and `Tag` type (closed enum) |
| `uuid.ts` | Branded `UUID` type, `newUUID()`, `parseUUID()` |
| `rating.ts` | `RATING_SCORE` const and `Rating` type |
| `constants.ts` | `ANONYMOUS_USER_ID` and other shared constants |

### `src/application/`

Service classes that orchestrate domain logic. All methods are synchronous.

| File | Responsibility |
|---|---|
| `DeckService.ts` | CRUD for decks |
| `FlashcardService.ts` | CRUD for flashcards; validates deck existence |
| `StudyService.ts` | Due card retrieval, review submission, progress aggregation using SM-2 |

Services throw plain `Error` on failure (e.g., `"Deck not found: ${id}"`). They do not catch errors from repos.

### `src/infrastructure/db/`

Drizzle ORM with `bun:sqlite`. All DB operations are synchronous.

| File | Contents |
|---|---|
| `schema.ts` | Drizzle table definitions |
| `client.ts` | `createDb(path)` factory; exports `DB` type |
| `DrizzleDeckRepository.ts` | Implements `IDeckRepository` |
| `DrizzleFlashcardRepository.ts` | Implements `IFlashcardRepository` |
| `DrizzleStudyProgressRepository.ts` | Implements `IStudyProgressRepository` |
| `seed.ts` | No-op (tags no longer require seeding) |

Write mutations use `.run()` on the Drizzle statement, not `await`.

Tags are stored as a JSON text column (`tags text (json)`) directly on the `flashcards` table — no `tags` or `flashcard_tags` tables. Tag validation is Zod-only at the HTTP boundary; the DB has no constraint on tag values.

### `src/infrastructure/http/`

Hono-based HTTP layer.

| Path | Contents |
|---|---|
| `schemas.ts` | All Zod schemas and their inferred input types |
| `controllers/DeckController.ts` | HTTP-agnostic; receives typed inputs, returns domain types |
| `controllers/FlashcardController.ts` | Same pattern |
| `controllers/StudyController.ts` | Same pattern |
| `routes/deck.routes.ts` | Mounts deck + nested card + study endpoints; owns all HTTP parsing |
| `routes/flashcard.routes.ts` | Mounts standalone flashcard endpoints |

Routes call `parseUUID()` on path params and `Schema.parse(await c.req.json())` on bodies before passing typed values to controllers.

### `src/container.ts`

`buildContainer(db: DB): Container` — manual wiring only. Instantiation order: repos → services → controllers. Returns a `Container` interface with the three controllers.

### `src/main.ts`

Entry point. Creates the DB via `createDb`, calls `buildContainer`, mounts `deckRoutes` and `flashcardRoutes` on the Hono app, registers the global error handler, and exports the server config for Bun.

The error handler maps `err.message` containing `"not found"` to 404; everything else to 500.

## Tests

### `tests/factories/domain.ts`

- `deckFactory`, `flashcardFactory`, `studyProgressFactory` — fishery factories backed by `@faker-js/faker`.
- `makeMockDeckRepo(overrides?)`, `makeMockFlashcardRepo(overrides?)`, `makeMockStudyProgressRepo(overrides?)` — return fully typed mock repos with all methods wrapped in `mock(() => defaultValue)`. Pass `overrides` to replace specific methods for the method under test.

### `tests/factories/orm.ts`

Fishery factories for raw Drizzle row types (used in repo-level tests).

## Scripts

| Script | Purpose |
|---|---|
| `scripts/check-bruno-coverage.ts` | Parses route files to collect every registered route, then checks that each has a corresponding `.yml` file in `/bruno/`. Exits non-zero if any route is uncovered. Run via `bun run scripts/check-bruno-coverage.ts`. |
| `scripts/import-srd.ts` | Reads SRD text, calls the Claude API (claude-opus-4-7 with tool use) to extract flashcard content, and POSTs the results to the local API. Requires the server to be running. |

## Pre-commit hook

Configured in `package.json` under `simple-git-hooks`:

```
pre-commit: bun run lint && bun run scripts/check-bruno-coverage.ts
```

Runs Biome (format + lint + import sort) and then verifies Bruno coverage. Both must pass for the commit to proceed.

## Bruno request collection

`/bruno/` contains one `.yml` file per API endpoint. This is the manual HTTP test collection. The pre-commit hook enforces that every route has coverage here — add a `.yml` file whenever you add a new route.

## Config files

| File | Purpose |
|---|---|
| `bunfig.toml` | Test coverage config: 80% line/function threshold, text + lcov reporters, `tests/**` excluded from coverage (glob, not regex) |
| `biome.json` | Biome lint/format rules |
| `drizzle.config.ts` | Drizzle Kit config pointing at `flashcards.db` |
| `tsconfig.json` | TypeScript config |
