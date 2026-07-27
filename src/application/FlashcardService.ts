import type { CreateFlashcardInput, Flashcard } from "../domain/entities/Flashcard";
import type { IDeckRepository } from "../domain/ports/IDeckRepository";
import type { IFlashcardRepository } from "../domain/ports/IFlashcardRepository";
import type { Tag } from "../domain/tags";
import type { UUID } from "../domain/uuid";

export class FlashcardService {
	constructor(
		private readonly flashcardRepo: IFlashcardRepository,
		private readonly deckRepo: IDeckRepository,
	) {}

	addCard(input: CreateFlashcardInput): Flashcard {
		const deck = this.deckRepo.findById(input.deckId);
		if (!deck) throw new Error(`Deck not found: ${input.deckId}`);
		return this.flashcardRepo.create(input);
	}

	getCard(id: UUID): Flashcard {
		const card = this.flashcardRepo.findById(id);
		if (!card) throw new Error(`Flashcard not found: ${id}`);
		return card;
	}

	listCards(deckId: UUID): Flashcard[] {
		return this.flashcardRepo.findByDeckId(deckId);
	}

	updateCard(id: UUID, input: Partial<{ front: string; back: string; tags: Tag[] }>): Flashcard {
		this.getCard(id);
		return this.flashcardRepo.update(id, input);
	}

	deleteCard(id: UUID): void {
		this.getCard(id);
		this.flashcardRepo.delete(id);
	}
}
