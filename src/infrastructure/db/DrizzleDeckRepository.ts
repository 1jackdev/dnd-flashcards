import { eq } from "drizzle-orm";
import type { CreateDeckInput, Deck } from "../../domain/entities/Deck";
import type { IDeckRepository } from "../../domain/ports/IDeckRepository";
import { newUUID, type UUID } from "../../domain/uuid";
import type { DB } from "./client";
import { decks } from "./schema";

export class DrizzleDeckRepository implements IDeckRepository {
	constructor(private readonly db: DB) {}

	async create(input: CreateDeckInput): Promise<Deck> {
		const now = new Date();
		const id = newUUID();
		await this.db
			.insert(decks)
			.values({ id, ...input, createdAt: now, updatedAt: now })
			.run();
		return { id, ...input, createdAt: now, updatedAt: now };
	}

	async findById(id: UUID): Promise<Deck | null> {
		const row = await this.db.select().from(decks).where(eq(decks.id, id)).get();
		return row ? (row as Deck) : null;
	}

	async findAll(): Promise<Deck[]> {
		return (await this.db.select().from(decks).all()) as Deck[];
	}

	async update(id: UUID, input: Partial<CreateDeckInput>): Promise<Deck> {
		const updatedAt = new Date();
		await this.db
			.update(decks)
			.set({ ...input, updatedAt })
			.where(eq(decks.id, id))
			.run();
		const row = await this.db.select().from(decks).where(eq(decks.id, id)).get();
		if (!row) throw new Error(`Deck not found after update: ${id}`);
		return row as Deck;
	}

	async delete(id: UUID): Promise<void> {
		await this.db.delete(decks).where(eq(decks.id, id)).run();
	}
}
