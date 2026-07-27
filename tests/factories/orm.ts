import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type { decks, flashcards, studyProgress } from "../../src/infrastructure/db/schema";

type DeckRow = typeof decks.$inferSelect;
type FlashcardRow = typeof flashcards.$inferSelect;
type StudyProgressRow = typeof studyProgress.$inferSelect;

export const deckRowFactory = Factory.define<DeckRow>(() => ({
	id: faker.string.uuid(),
	name: faker.lorem.words(2),
	description: faker.lorem.sentence(),
	createdAt: faker.date.past(),
	updatedAt: faker.date.past(),
}));

export const flashcardRowFactory = Factory.define<FlashcardRow>(() => ({
	id: faker.string.uuid(),
	deckId: faker.string.uuid(),
	front: `${faker.lorem.sentence()}?`,
	back: faker.lorem.sentence(),
	createdAt: faker.date.past(),
	updatedAt: faker.date.past(),
}));

export const studyProgressRowFactory = Factory.define<StudyProgressRow>(() => ({
	id: faker.string.uuid(),
	flashcardId: faker.string.uuid(),
	userId: faker.string.uuid(),
	easeFactor: 2.5,
	interval: faker.number.int({ min: 1, max: 30 }),
	repetitions: faker.number.int({ min: 0, max: 10 }),
	nextReviewAt: faker.date.future(),
	lastReviewedAt: faker.date.past(),
}));
