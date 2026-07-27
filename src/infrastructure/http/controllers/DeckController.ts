import type { DeckService } from "../../../application/DeckService";
import type { Deck } from "../../../domain/entities/Deck";
import type { UUID } from "../../../domain/uuid";
import type { CreateDeckInput, UpdateDeckInput } from "../schemas";

export class DeckController {
	constructor(private readonly deckService: DeckService) {}

	create(input: CreateDeckInput): Deck {
		return this.deckService.createDeck(input);
	}

	getById(id: UUID): Deck {
		return this.deckService.getDeck(id);
	}

	list(): Deck[] {
		return this.deckService.listDecks();
	}

	update(id: UUID, input: UpdateDeckInput): Deck {
		return this.deckService.updateDeck(id, input);
	}

	delete(id: UUID): void {
		this.deckService.deleteDeck(id);
	}
}
