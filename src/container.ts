import { AuthService } from "./application/AuthService";
import { DeckService } from "./application/DeckService";
import { FlashcardService } from "./application/FlashcardService";
import { QuizService } from "./application/QuizService";
import { StudyService } from "./application/StudyService";
import type { DB } from "./infrastructure/db/client";
import { DrizzleDeckRepository } from "./infrastructure/db/DrizzleDeckRepository";
import { DrizzleFlashcardRepository } from "./infrastructure/db/DrizzleFlashcardRepository";
import { DrizzleQuizProgressRepository } from "./infrastructure/db/DrizzleQuizProgressRepository";
import { DrizzleQuizQuestionRepository } from "./infrastructure/db/DrizzleQuizQuestionRepository";
import { DrizzleStudyProgressRepository } from "./infrastructure/db/DrizzleStudyProgressRepository";
import { DrizzleUserRepository } from "./infrastructure/db/DrizzleUserRepository";
import { AuthController } from "./infrastructure/http/controllers/AuthController";
import { DeckController } from "./infrastructure/http/controllers/DeckController";
import { FlashcardController } from "./infrastructure/http/controllers/FlashcardController";
import { QuizController } from "./infrastructure/http/controllers/QuizController";
import { StudyController } from "./infrastructure/http/controllers/StudyController";

export interface Container {
	deckController: DeckController;
	flashcardController: FlashcardController;
	studyController: StudyController;
	quizController: QuizController;
	authController: AuthController;
}

export function buildContainer(db: DB): Container {
	const deckRepo = new DrizzleDeckRepository(db);
	const flashcardRepo = new DrizzleFlashcardRepository(db);
	const studyProgressRepo = new DrizzleStudyProgressRepository(db);
	const quizQuestionRepo = new DrizzleQuizQuestionRepository(db);
	const quizProgressRepo = new DrizzleQuizProgressRepository(db);
	const userRepo = new DrizzleUserRepository(db);

	const deckService = new DeckService(deckRepo);
	const flashcardService = new FlashcardService(flashcardRepo, deckRepo);
	const studyService = new StudyService(flashcardRepo, studyProgressRepo);
	const quizService = new QuizService(quizQuestionRepo, flashcardRepo, quizProgressRepo);
	const authService = new AuthService(userRepo);

	return {
		deckController: new DeckController(deckService),
		flashcardController: new FlashcardController(flashcardService),
		studyController: new StudyController(studyService),
		quizController: new QuizController(quizService),
		authController: new AuthController(authService),
	};
}
