import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { CreateDeckInput, Deck } from "../../domain/entities/Deck";
import type { IDeckRepository } from "../../domain/ports/IDeckRepository";
import type { DB } from "./client";
import { decks } from "./schema";

export class DrizzleDeckRepository implements IDeckRepository {
	constructor(private readonly db: DB) {}

	async create(input: CreateDeckInput): Promise<Deck> {
		const now = new Date();
		const id = randomUUID();
		await this.db.insert(decks).values({ id, ...input, createdAt: now, updatedAt: now });
		return { id, ...input, createdAt: now, updatedAt: now };
	}

	async findById(id: string): Promise<Deck | null> {
		const row = await this.db.select().from(decks).where(eq(decks.id, id)).get();
		return row ?? null;
	}

	async findAll(): Promise<Deck[]> {
		return this.db.select().from(decks).all();
	}

	async update(id: string, input: Partial<CreateDeckInput>): Promise<Deck> {
		const updatedAt = new Date();
		await this.db
			.update(decks)
			.set({ ...input, updatedAt })
			.where(eq(decks.id, id));
		const row = await this.db.select().from(decks).where(eq(decks.id, id)).get();
		if (!row) throw new Error(`Deck not found after update: ${id}`);
		return row;
	}

	async delete(id: string): Promise<void> {
		await this.db.delete(decks).where(eq(decks.id, id));
	}
}
