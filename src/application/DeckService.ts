import type { CreateDeckInput, Deck } from "../domain/entities/Deck";
import type { IDeckRepository } from "../domain/ports/IDeckRepository";
import type { UUID } from "../domain/uuid";

export class DeckService {
	constructor(private readonly deckRepo: IDeckRepository) {}

	createDeck(input: CreateDeckInput): Promise<Deck> {
		return this.deckRepo.create(input);
	}

	async getDeck(id: UUID): Promise<Deck> {
		const deck = await this.deckRepo.findById(id);
		if (!deck) throw new Error(`Deck not found: ${id}`);
		return deck;
	}

	listDecks(): Promise<Deck[]> {
		return this.deckRepo.findAll();
	}

	async updateDeck(id: UUID, input: Partial<CreateDeckInput>): Promise<Deck> {
		await this.getDeck(id);
		return this.deckRepo.update(id, input);
	}

	async deleteDeck(id: UUID): Promise<void> {
		await this.getDeck(id);
		await this.deckRepo.delete(id);
	}
}
