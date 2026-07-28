import { describe, expect, mock, test } from "bun:test";
import { QuizService } from "../../src/application/QuizService";
import {
	flashcardFactory,
	makeMockFlashcardRepo,
	makeMockQuizProgressRepo,
	makeMockQuizQuestionRepo,
	quizProgressFactory,
	quizQuestionFactory,
} from "../factories/domain";

describe("QuizService", () => {
	describe("addQuestion", () => {
		test("throws when flashcard not found", async () => {
			const card = flashcardFactory.build();
			const quizRepo = makeMockQuizQuestionRepo();
			const flashcardRepo = makeMockFlashcardRepo({ findById: mock(async () => null) });
			const service = new QuizService(quizRepo, flashcardRepo, makeMockQuizProgressRepo());

			await expect(
				service.addQuestion({
					flashcardId: card.id,
					type: "true_false",
					question: "Q?",
					correctAnswer: true,
				}),
			).rejects.toThrow(`Flashcard not found: ${card.id}`);
			expect(quizRepo.create).not.toHaveBeenCalled();
		});

		test("creates question with deckId from the flashcard", async () => {
			const card = flashcardFactory.build();
			const question = quizQuestionFactory.build({ flashcardId: card.id, deckId: card.deckId });
			const quizRepo = makeMockQuizQuestionRepo({ create: mock(async () => question) });
			const flashcardRepo = makeMockFlashcardRepo({ findById: mock(async () => card) });
			const service = new QuizService(quizRepo, flashcardRepo, makeMockQuizProgressRepo());

			const result = await service.addQuestion({
				flashcardId: card.id,
				type: "multiple_choice",
				question: question.question,
				choices: question.choices,
				correctChoiceIndex: question.correctChoiceIndex,
			});

			expect(quizRepo.create).toHaveBeenCalledWith({
				flashcardId: card.id,
				deckId: card.deckId,
				type: "multiple_choice",
				question: question.question,
				choices: question.choices,
				correctChoiceIndex: question.correctChoiceIndex,
			});
			expect(result).toEqual(question);
		});
	});

	describe("getQuestion", () => {
		test("returns question when found", async () => {
			const question = quizQuestionFactory.build();
			const service = new QuizService(
				makeMockQuizQuestionRepo({ findById: mock(async () => question) }),
				makeMockFlashcardRepo(),
				makeMockQuizProgressRepo(),
			);

			expect(await service.getQuestion(question.id)).toEqual(question);
		});

		test("throws when not found", async () => {
			const question = quizQuestionFactory.build();
			const service = new QuizService(
				makeMockQuizQuestionRepo({ findById: mock(async () => null) }),
				makeMockFlashcardRepo(),
				makeMockQuizProgressRepo(),
			);

			await expect(service.getQuestion(question.id)).rejects.toThrow(
				`Quiz question not found: ${question.id}`,
			);
		});
	});

	describe("listByFlashcard", () => {
		test("returns questions for flashcard", async () => {
			const card = flashcardFactory.build();
			const questions = quizQuestionFactory.buildList(2, { flashcardId: card.id });
			const service = new QuizService(
				makeMockQuizQuestionRepo({ findByFlashcardId: mock(async () => questions) }),
				makeMockFlashcardRepo(),
				makeMockQuizProgressRepo(),
			);

			expect(await service.listByFlashcard(card.id)).toEqual(questions);
		});
	});

	describe("listByDeck", () => {
		test("returns questions for deck", async () => {
			const questions = quizQuestionFactory.buildList(2);
			const service = new QuizService(
				makeMockQuizQuestionRepo({ findByDeckId: mock(async () => questions) }),
				makeMockFlashcardRepo(),
				makeMockQuizProgressRepo(),
			);

			expect(await service.listByDeck(questions[0].deckId)).toEqual(questions);
		});
	});

	describe("listByTags", () => {
		test("returns quiz questions for flashcards matching the tags", async () => {
			const cards = flashcardFactory.buildList(2, { tags: ["condition"] });
			const questions = quizQuestionFactory.buildList(2, { flashcardId: cards[0].id });
			const flashcardRepo = makeMockFlashcardRepo({ findByTags: mock(async () => cards) });
			const quizRepo = makeMockQuizQuestionRepo({
				findByFlashcardIds: mock(async () => questions),
			});
			const service = new QuizService(quizRepo, flashcardRepo, makeMockQuizProgressRepo());

			const result = await service.listByTags(["condition"]);

			expect(quizRepo.findByFlashcardIds).toHaveBeenCalledWith(cards.map((c) => c.id));
			expect(result).toEqual(questions);
		});
	});

	describe("deleteQuestion", () => {
		test("throws when question not found", async () => {
			const question = quizQuestionFactory.build();
			const service = new QuizService(
				makeMockQuizQuestionRepo({ findById: mock(async () => null) }),
				makeMockFlashcardRepo(),
				makeMockQuizProgressRepo(),
			);

			await expect(service.deleteQuestion(question.id)).rejects.toThrow();
		});

		test("calls repo.delete when found", async () => {
			const question = quizQuestionFactory.build();
			const quizRepo = makeMockQuizQuestionRepo({ findById: mock(async () => question) });
			const service = new QuizService(
				quizRepo,
				makeMockFlashcardRepo(),
				makeMockQuizProgressRepo(),
			);

			await service.deleteQuestion(question.id);

			expect(quizRepo.delete).toHaveBeenCalledWith(question.id);
		});
	});

	describe("recordAttempt", () => {
		test("throws when question not found", async () => {
			const question = quizQuestionFactory.build();
			const quizProgressRepo = makeMockQuizProgressRepo();
			const service = new QuizService(
				makeMockQuizQuestionRepo({ findById: mock(async () => null) }),
				makeMockFlashcardRepo(),
				quizProgressRepo,
			);

			await expect(service.recordAttempt(question.id, question.flashcardId, true)).rejects.toThrow(
				`Quiz question not found: ${question.id}`,
			);
			expect(quizProgressRepo.recordAttempt).not.toHaveBeenCalled();
		});

		test("records attempt when question exists", async () => {
			const question = quizQuestionFactory.build();
			const progress = quizProgressFactory.build({ quizQuestionId: question.id });
			const quizProgressRepo = makeMockQuizProgressRepo({
				recordAttempt: mock(async () => progress),
			});
			const service = new QuizService(
				makeMockQuizQuestionRepo({ findById: mock(async () => question) }),
				makeMockFlashcardRepo(),
				quizProgressRepo,
			);

			const result = await service.recordAttempt(question.id, progress.userId, true);

			expect(quizProgressRepo.recordAttempt).toHaveBeenCalledWith({
				quizQuestionId: question.id,
				userId: progress.userId,
				correct: true,
			});
			expect(result).toEqual(progress);
		});
	});

	describe("getDeckQuizProgress", () => {
		test("returns total and per-question progress", async () => {
			const questions = quizQuestionFactory.buildList(2);
			const progress = quizProgressFactory.build({ quizQuestionId: questions[0].id });
			const service = new QuizService(
				makeMockQuizQuestionRepo({ findByDeckId: mock(async () => questions) }),
				makeMockFlashcardRepo(),
				makeMockQuizProgressRepo({ findByDeckAndUser: mock(async () => [progress]) }),
			);

			const summary = await service.getDeckQuizProgress(questions[0].deckId, progress.userId);

			expect(summary.total).toBe(2);
			expect(summary.questions).toEqual([
				{ question: questions[0], progress },
				{ question: questions[1], progress: null },
			]);
		});
	});

	describe("getQuizProgressByTags", () => {
		test("returns total and per-question progress filtered by tag", async () => {
			const cards = flashcardFactory.buildList(1, { tags: ["condition"] });
			const questions = quizQuestionFactory.buildList(2, { flashcardId: cards[0].id });
			const progress = quizProgressFactory.build({ quizQuestionId: questions[0].id });
			const flashcardRepo = makeMockFlashcardRepo({ findByTags: mock(async () => cards) });
			const quizRepo = makeMockQuizQuestionRepo({
				findByFlashcardIds: mock(async () => questions),
			});
			const quizProgressRepo = makeMockQuizProgressRepo({
				findByQuestionIdsAndUser: mock(async () => [progress]),
			});
			const service = new QuizService(quizRepo, flashcardRepo, quizProgressRepo);

			const summary = await service.getQuizProgressByTags(["condition"], progress.userId);

			expect(summary.total).toBe(2);
			expect(summary.questions).toEqual([
				{ question: questions[0], progress },
				{ question: questions[1], progress: null },
			]);
		});
	});
});
