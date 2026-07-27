import { mock } from "bun:test";
import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type { Deck } from "../../src/domain/entities/Deck";
import type { Flashcard } from "../../src/domain/entities/Flashcard";
import type { StudyProgress } from "../../src/domain/entities/StudyProgress";
import type { IDeckRepository } from "../../src/domain/ports/IDeckRepository";
import type { IFlashcardRepository } from "../../src/domain/ports/IFlashcardRepository";
import type { IStudyProgressRepository } from "../../src/domain/ports/IStudyProgressRepository";
import { TAGS } from "../../src/domain/tags";
import type { UUID } from "../../src/domain/uuid";

export const deckFactory = Factory.define<Deck>(() => ({
	id: faker.string.uuid() as UUID,
	name: faker.lorem.words(2),
	description: faker.lorem.sentence(),
	createdAt: faker.date.past(),
	updatedAt: faker.date.past(),
}));

export const flashcardFactory = Factory.define<Flashcard>(() => ({
	id: faker.string.uuid() as UUID,
	deckId: faker.string.uuid() as UUID,
	front: `${faker.lorem.sentence()}?`,
	back: faker.lorem.sentence(),
	tags: [faker.helpers.arrayElement(TAGS)],
	createdAt: faker.date.past(),
	updatedAt: faker.date.past(),
}));

export const studyProgressFactory = Factory.define<StudyProgress>(() => ({
	id: faker.string.uuid() as UUID,
	flashcardId: faker.string.uuid() as UUID,
	userId: faker.string.uuid() as UUID,
	easeFactor: 2.5,
	interval: faker.number.int({ min: 1, max: 30 }),
	repetitions: faker.number.int({ min: 0, max: 10 }),
	nextReviewAt: faker.date.future(),
	lastReviewedAt: faker.date.past(),
}));

export function makeMockDeckRepo(overrides?: Partial<IDeckRepository>): IDeckRepository {
	return {
		create: mock(() => deckFactory.build()),
		findById: mock(() => deckFactory.build()),
		findAll: mock(() => deckFactory.buildList(1)),
		update: mock(() => deckFactory.build()),
		delete: mock(() => undefined),
		...overrides,
	};
}

export function makeMockFlashcardRepo(
	overrides?: Partial<IFlashcardRepository>,
): IFlashcardRepository {
	return {
		create: mock(() => flashcardFactory.build()),
		findById: mock(() => flashcardFactory.build()),
		findByDeckId: mock(() => flashcardFactory.buildList(1)),
		update: mock(() => flashcardFactory.build()),
		delete: mock(() => undefined),
		...overrides,
	};
}

export function makeMockStudyProgressRepo(
	overrides?: Partial<IStudyProgressRepository>,
): IStudyProgressRepository {
	return {
		findByFlashcardAndUser: mock(() => null),
		findByDeckAndUser: mock(() => []),
		upsert: mock(() => studyProgressFactory.build()),
		...overrides,
	};
}
