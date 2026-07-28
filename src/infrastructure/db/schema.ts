import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
	"users",
	{
		id: text("id").primaryKey(),
		username: text("username").notNull(),
		passwordHash: text("password_hash").notNull(),
		createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	},
	(t) => [uniqueIndex("users_username_idx").on(t.username)],
);

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
		tags: text("tags", { mode: "json" }).notNull().$type<string[]>(),
		createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	},
	(t) => [index("flashcards_deck_id_idx").on(t.deckId)],
);

export const quizQuestions = sqliteTable(
	"quiz_questions",
	{
		id: text("id").primaryKey(),
		flashcardId: text("flashcard_id")
			.notNull()
			.references(() => flashcards.id, { onDelete: "cascade" }),
		deckId: text("deck_id")
			.notNull()
			.references(() => decks.id, { onDelete: "cascade" }),
		type: text("type", { enum: ["multiple_choice", "true_false"] }).notNull(),
		question: text("question").notNull(),
		choices: text("choices", { mode: "json" }).$type<string[]>(),
		correctChoiceIndex: integer("correct_choice_index"),
		correctAnswer: integer("correct_answer", { mode: "boolean" }),
		createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	},
	(t) => [
		index("quiz_questions_flashcard_id_idx").on(t.flashcardId),
		index("quiz_questions_deck_id_idx").on(t.deckId),
	],
);

export const quizProgress = sqliteTable(
	"quiz_progress",
	{
		id: text("id").primaryKey(),
		quizQuestionId: text("quiz_question_id")
			.notNull()
			.references(() => quizQuestions.id, { onDelete: "cascade" }),
		userId: text("user_id").notNull(),
		attempts: integer("attempts").notNull(),
		correctCount: integer("correct_count").notNull(),
		lastAnsweredCorrectly: integer("last_answered_correctly", { mode: "boolean" }).notNull(),
		lastAnsweredAt: integer("last_answered_at", { mode: "timestamp" }).notNull(),
	},
	(t) => [
		index("quiz_progress_user_question_idx").on(t.userId, t.quizQuestionId),
		index("quiz_progress_user_idx").on(t.userId),
	],
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
	(t) => [
		index("study_progress_user_card_idx").on(t.userId, t.flashcardId),
		index("study_progress_user_idx").on(t.userId),
	],
);
