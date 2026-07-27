import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const decks = sqliteTable("decks", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const flashcards = sqliteTable(
	"flashcards",
	{
		id: text("id").primaryKey(),
		deckId: text("deck_id")
			.notNull()
			.references(() => decks.id, { onDelete: "cascade" }),
		front: text("front").notNull(),
		back: text("back").notNull(),
		createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	},
	(t) => ({
		deckIdIdx: index("flashcards_deck_id_idx").on(t.deckId),
	}),
);

export const tags = sqliteTable("tags", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
});

export const flashcardTags = sqliteTable(
	"flashcard_tags",
	{
		flashcardId: text("flashcard_id")
			.notNull()
			.references(() => flashcards.id, { onDelete: "cascade" }),
		tagId: text("tag_id")
			.notNull()
			.references(() => tags.id, { onDelete: "cascade" }),
	},
	(t) => ({
		flashcardIdx: index("flashcard_tags_flashcard_id_idx").on(t.flashcardId),
		tagIdx: index("flashcard_tags_tag_id_idx").on(t.tagId),
	}),
);

export const studyProgress = sqliteTable(
	"study_progress",
	{
		id: text("id").primaryKey(),
		flashcardId: text("flashcard_id")
			.notNull()
			.references(() => flashcards.id, { onDelete: "cascade" }),
		userId: text("user_id").notNull(),
		easeFactor: real("ease_factor").notNull(),
		interval: integer("interval").notNull(),
		repetitions: integer("repetitions").notNull(),
		nextReviewAt: integer("next_review_at", { mode: "timestamp" }).notNull(),
		lastReviewedAt: integer("last_reviewed_at", { mode: "timestamp" }),
	},
	(t) => ({
		userCardIdx: index("study_progress_user_card_idx").on(t.userId, t.flashcardId),
		userIdx: index("study_progress_user_idx").on(t.userId),
	}),
);
