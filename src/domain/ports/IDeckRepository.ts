import type { CreateDeckInput, Deck } from "../entities/Deck";
import type { UUID } from "../uuid";

export interface IDeckRepository {
	create(input: CreateDeckInput): Deck;
	findById(id: UUID): Deck | null;
	findAll(): Deck[];
	update(id: UUID, input: Partial<CreateDeckInput>): Deck;
	delete(id: UUID): void;
}
