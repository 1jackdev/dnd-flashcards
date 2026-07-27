import type { CreateDeckInput, Deck } from "../domain/entities/Deck";
import type { IDeckRepository } from "../domain/ports/IDeckRepository";
import type { UUID } from "../domain/uuid";

export class DeckService {
	constructor(private readonly deckRepo: IDeckRepository) {}

	createDeck(input: CreateDeckInput): Deck {
		return this.deckRepo.create(input);
	}

	getDeck(id: UUID): Deck {
		const deck = this.deckRepo.findById(id);
		if (!deck) throw new Error(`Deck not found: ${id}`);
		return deck;
	}

	listDecks(): Deck[] {
		return this.deckRepo.findAll();
	}

	updateDeck(id: UUID, input: Partial<CreateDeckInput>): Deck {
		this.getDeck(id);
		return this.deckRepo.update(id, input);
	}

	deleteDeck(id: UUID): void {
		this.getDeck(id);
		this.deckRepo.delete(id);
	}
}
