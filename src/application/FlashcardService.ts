import type { CreateFlashcardInput, Flashcard } from "../domain/entities/Flashcard";
import type { IDeckRepository } from "../domain/ports/IDeckRepository";
import type { IFlashcardRepository } from "../domain/ports/IFlashcardRepository";
import type { Tag } from "../domain/tags";

export class FlashcardService {
	constructor(
		private readonly flashcardRepo: IFlashcardRepository,
		private readonly deckRepo: IDeckRepository,
	) {}

	async addCard(input: CreateFlashcardInput): Promise<Flashcard> {
		const deck = await this.deckRepo.findById(input.deckId);
		if (!deck) throw new Error(`Deck not found: ${input.deckId}`);
		return this.flashcardRepo.create(input);
	}

	async getCard(id: string): Promise<Flashcard> {
		const card = await this.flashcardRepo.findById(id);
		if (!card) throw new Error(`Flashcard not found: ${id}`);
		return card;
	}

	async listCards(deckId: string): Promise<Flashcard[]> {
		return this.flashcardRepo.findByDeckId(deckId);
	}

	async updateCard(
		id: string,
		input: Partial<{ front: string; back: string; tags: Tag[] }>,
	): Promise<Flashcard> {
		await this.getCard(id);
		return this.flashcardRepo.update(id, input);
	}

	async deleteCard(id: string): Promise<void> {
		await this.getCard(id);
		return this.flashcardRepo.delete(id);
	}
}
