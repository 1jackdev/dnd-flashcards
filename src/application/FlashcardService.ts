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

	async addCard(input: CreateFlashcardInput): Promise<Flashcard> {
		const deck = await this.deckRepo.findById(input.deckId);
		if (!deck) throw new Error(`Deck not found: ${input.deckId}`);
		return this.flashcardRepo.create(input);
	}

	async getCard(id: UUID): Promise<Flashcard> {
		const card = await this.flashcardRepo.findById(id);
		if (!card) throw new Error(`Flashcard not found: ${id}`);
		return card;
	}

	listCards(deckId: UUID): Promise<Flashcard[]> {
		return this.flashcardRepo.findByDeckId(deckId);
	}

	listByTags(tags: Tag[]): Promise<Flashcard[]> {
		return this.flashcardRepo.findByTags(tags);
	}

	async updateCard(
		id: UUID,
		input: Partial<{ front: string; back: string; tags: Tag[] }>,
	): Promise<Flashcard> {
		await this.getCard(id);
		return this.flashcardRepo.update(id, input);
	}

	async deleteCard(id: UUID): Promise<void> {
		await this.getCard(id);
		await this.flashcardRepo.delete(id);
	}
}
