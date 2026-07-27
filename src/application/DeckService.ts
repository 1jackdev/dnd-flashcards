import type { CreateDeckInput, Deck } from "../domain/entities/Deck";
import type { IDeckRepository } from "../domain/ports/IDeckRepository";

export class DeckService {
	constructor(private readonly deckRepo: IDeckRepository) {}

	async createDeck(input: CreateDeckInput): Promise<Deck> {
		return this.deckRepo.create(input);
	}

	async getDeck(id: string): Promise<Deck> {
		const deck = await this.deckRepo.findById(id);
		if (!deck) throw new Error(`Deck not found: ${id}`);
		return deck;
	}

	async listDecks(): Promise<Deck[]> {
		return this.deckRepo.findAll();
	}

	async updateDeck(id: string, input: Partial<CreateDeckInput>): Promise<Deck> {
		await this.getDeck(id);
		return this.deckRepo.update(id, input);
	}

	async deleteDeck(id: string): Promise<void> {
		await this.getDeck(id);
		return this.deckRepo.delete(id);
	}
}
