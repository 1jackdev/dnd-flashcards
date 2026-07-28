import type { FlashcardService } from "../../../application/FlashcardService";
import type { Flashcard } from "../../../domain/entities/Flashcard";
import type { Tag } from "../../../domain/tags";
import type { UUID } from "../../../domain/uuid";
import type { CreateFlashcardInput, UpdateFlashcardInput } from "../schemas";

export class FlashcardController {
	constructor(private readonly flashcardService: FlashcardService) {}

	create(deckId: UUID, input: CreateFlashcardInput): Promise<Flashcard> {
		return this.flashcardService.addCard({ deckId, ...input });
	}

	getById(id: UUID): Promise<Flashcard> {
		return this.flashcardService.getCard(id);
	}

	listByDeck(deckId: UUID): Promise<Flashcard[]> {
		return this.flashcardService.listCards(deckId);
	}

	listByTags(tags: Tag[]): Promise<Flashcard[]> {
		return this.flashcardService.listByTags(tags);
	}

	update(id: UUID, input: UpdateFlashcardInput): Promise<Flashcard> {
		return this.flashcardService.updateCard(id, input);
	}

	delete(id: UUID): Promise<void> {
		return this.flashcardService.deleteCard(id);
	}
}
