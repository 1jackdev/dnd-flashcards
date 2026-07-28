// The database is now a remote Turso instance, not a local file, so there's nothing
// here to delete. Resetting a remote database isn't something we want to automate
// (accidental drops against the real Turso db would be a lot more costly than a stale
// local flashcards.db ever was). To reset manually:
//   turso db shell dnd-flashcards
// and drop/recreate tables by hand, or `bun run db:push` to re-sync schema.
console.log(
	"db:reset is a no-op now that the database lives in Turso. " +
		"Use `turso db shell dnd-flashcards` for manual resets.",
);
