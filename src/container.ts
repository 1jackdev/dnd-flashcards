import { DeckService } from "./application/DeckService";
import { FlashcardService } from "./application/FlashcardService";
import { StudyService } from "./application/StudyService";
import type { DB } from "./infrastructure/db/client";
import { DrizzleDeckRepository } from "./infrastructure/db/DrizzleDeckRepository";
import { DrizzleFlashcardRepository } from "./infrastructure/db/DrizzleFlashcardRepository";
import { DrizzleStudyProgressRepository } from "./infrastructure/db/DrizzleStudyProgressRepository";
import { DeckController } from "./infrastructure/http/controllers/DeckController";
import { FlashcardController } from "./infrastructure/http/controllers/FlashcardController";
import { StudyController } from "./infrastructure/http/controllers/StudyController";

export interface Container {
	deckController: DeckController;
	flashcardController: FlashcardController;
	studyController: StudyController;
}

export function buildContainer(db: DB): Container {
	const deckRepo = new DrizzleDeckRepository(db);
	const flashcardRepo = new DrizzleFlashcardRepository(db);
	const studyProgressRepo = new DrizzleStudyProgressRepository(db);

	const deckService = new DeckService(deckRepo);
	const flashcardService = new FlashcardService(flashcardRepo, deckRepo);
	const studyService = new StudyService(flashcardRepo, studyProgressRepo);

	return {
		deckController: new DeckController(deckService),
		flashcardController: new FlashcardController(flashcardService),
		studyController: new StudyController(studyService),
	};
}
