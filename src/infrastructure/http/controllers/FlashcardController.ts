import type { FlashcardService } from "../../../application/FlashcardService";
import type { Flashcard } from "../../../domain/entities/Flashcard";
import type { UUID } from "../../../domain/uuid";
import type { CreateFlashcardInput, UpdateFlashcardInput } from "../schemas";

export class FlashcardController {
	constructor(private readonly flashcardService: FlashcardService) {}

	create(deckId: UUID, input: CreateFlashcardInput): Flashcard {
		return this.flashcardService.addCard({ deckId, ...input });
	}

	getById(id: UUID): Flashcard {
		return this.flashcardService.getCard(id);
	}

	listByDeck(deckId: UUID): Flashcard[] {
		return this.flashcardService.listCards(deckId);
	}

	update(id: UUID, input: UpdateFlashcardInput): Flashcard {
		return this.flashcardService.updateCard(id, input);
	}

	delete(id: UUID): void {
		this.flashcardService.deleteCard(id);
	}
}
