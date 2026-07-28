import { mock } from "bun:test";
import { faker } from "@faker-js/faker";
import { Factory } from "fishery";
import type { Deck } from "../../src/domain/entities/Deck";
import type { Flashcard } from "../../src/domain/entities/Flashcard";
import type { QuizProgress } from "../../src/domain/entities/QuizProgress";
import type { MultipleChoiceQuizQuestion } from "../../src/domain/entities/QuizQuestion";
import type { StudyProgress } from "../../src/domain/entities/StudyProgress";
import type { User } from "../../src/domain/entities/User";
import type { IDeckRepository } from "../../src/domain/ports/IDeckRepository";
import type { IFlashcardRepository } from "../../src/domain/ports/IFlashcardRepository";
import type { IQuizProgressRepository } from "../../src/domain/ports/IQuizProgressRepository";
import type { IQuizQuestionRepository } from "../../src/domain/ports/IQuizQuestionRepository";
import type { IStudyProgressRepository } from "../../src/domain/ports/IStudyProgressRepository";
import type { IUserRepository } from "../../src/domain/ports/IUserRepository";
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

export const quizQuestionFactory = Factory.define<MultipleChoiceQuizQuestion>(() => ({
	id: faker.string.uuid() as UUID,
	flashcardId: faker.string.uuid() as UUID,
	deckId: faker.string.uuid() as UUID,
	type: "multiple_choice",
	question: `${faker.lorem.sentence()}?`,
	choices: faker.helpers.multiple(() => faker.lorem.words(3), { count: 4 }),
	correctChoiceIndex: 0,
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

export const quizProgressFactory = Factory.define<QuizProgress>(() => ({
	id: faker.string.uuid() as UUID,
	quizQuestionId: faker.string.uuid() as UUID,
	userId: faker.string.uuid() as UUID,
	attempts: faker.number.int({ min: 1, max: 10 }),
	correctCount: faker.number.int({ min: 0, max: 10 }),
	lastAnsweredCorrectly: true,
	lastAnsweredAt: faker.date.past(),
}));

export function makeMockDeckRepo(overrides?: Partial<IDeckRepository>): IDeckRepository {
	return {
		create: mock(async () => deckFactory.build()),
		findById: mock(async () => deckFactory.build()),
		findAll: mock(async () => deckFactory.buildList(1)),
		update: mock(async () => deckFactory.build()),
		delete: mock(async () => undefined),
		...overrides,
	};
}

export function makeMockFlashcardRepo(
	overrides?: Partial<IFlashcardRepository>,
): IFlashcardRepository {
	return {
		create: mock(async () => flashcardFactory.build()),
		findById: mock(async () => flashcardFactory.build()),
		findByDeckId: mock(async () => flashcardFactory.buildList(1)),
		findByTags: mock(async () => flashcardFactory.buildList(1)),
		update: mock(async () => flashcardFactory.build()),
		delete: mock(async () => undefined),
		...overrides,
	};
}

export function makeMockQuizQuestionRepo(
	overrides?: Partial<IQuizQuestionRepository>,
): IQuizQuestionRepository {
	return {
		create: mock(async () => quizQuestionFactory.build()),
		findById: mock(async () => quizQuestionFactory.build()),
		findByFlashcardId: mock(async () => quizQuestionFactory.buildList(1)),
		findByDeckId: mock(async () => quizQuestionFactory.buildList(1)),
		findByFlashcardIds: mock(async () => quizQuestionFactory.buildList(1)),
		delete: mock(async () => undefined),
		...overrides,
	};
}

export function makeMockStudyProgressRepo(
	overrides?: Partial<IStudyProgressRepository>,
): IStudyProgressRepository {
	return {
		findByFlashcardAndUser: mock(async () => null),
		findByDeckAndUser: mock(async () => []),
		findByFlashcardIdsAndUser: mock(async () => []),
		upsert: mock(async () => studyProgressFactory.build()),
		...overrides,
	};
}

export function makeMockQuizProgressRepo(
	overrides?: Partial<IQuizProgressRepository>,
): IQuizProgressRepository {
	return {
		findByQuestionAndUser: mock(async () => null),
		findByDeckAndUser: mock(async () => []),
		findByQuestionIdsAndUser: mock(async () => []),
		recordAttempt: mock(async () => quizProgressFactory.build()),
		...overrides,
	};
}

export const userFactory = Factory.define<User>(() => ({
	id: faker.string.uuid() as UUID,
	username: faker.internet.username(),
	passwordHash: faker.string.alphanumeric(32),
	createdAt: faker.date.past(),
}));

export function makeMockUserRepo(overrides?: Partial<IUserRepository>): IUserRepository {
	return {
		create: mock(async () => userFactory.build()),
		findById: mock(async () => userFactory.build()),
		findByUsername: mock(async () => null),
		...overrides,
	};
}
