import type { CreateDeckInput, Deck } from "../entities/Deck";
import type { UUID } from "../uuid";

export interface IDeckRepository {
	create(input: CreateDeckInput): Promise<Deck>;
	findById(id: UUID): Promise<Deck | null>;
	findAll(): Promise<Deck[]>;
	update(id: UUID, input: Partial<CreateDeckInput>): Promise<Deck>;
	delete(id: UUID): Promise<void>;
}
