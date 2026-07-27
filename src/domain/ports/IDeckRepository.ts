import type { CreateDeckInput, Deck } from "../entities/Deck";

export interface IDeckRepository {
	create(input: CreateDeckInput): Promise<Deck>;
	findById(id: string): Promise<Deck | null>;
	findAll(): Promise<Deck[]>;
	update(id: string, input: Partial<CreateDeckInput>): Promise<Deck>;
	delete(id: string): Promise<void>;
}
