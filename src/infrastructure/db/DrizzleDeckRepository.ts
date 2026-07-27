import { eq } from "drizzle-orm";
import type { CreateDeckInput, Deck } from "../../domain/entities/Deck";
import type { IDeckRepository } from "../../domain/ports/IDeckRepository";
import { newUUID, type UUID } from "../../domain/uuid";
import type { DB } from "./client";
import { decks } from "./schema";

export class DrizzleDeckRepository implements IDeckRepository {
	constructor(private readonly db: DB) {}

	create(input: CreateDeckInput): Deck {
		const now = new Date();
		const id = newUUID();
		this.db
			.insert(decks)
			.values({ id, ...input, createdAt: now, updatedAt: now })
			.run();
		return { id, ...input, createdAt: now, updatedAt: now };
	}

	findById(id: UUID): Deck | null {
		const row = this.db.select().from(decks).where(eq(decks.id, id)).get();
		return row ? (row as Deck) : null;
	}

	findAll(): Deck[] {
		return this.db.select().from(decks).all() as Deck[];
	}

	update(id: UUID, input: Partial<CreateDeckInput>): Deck {
		const updatedAt = new Date();
		this.db
			.update(decks)
			.set({ ...input, updatedAt })
			.where(eq(decks.id, id))
			.run();
		const row = this.db.select().from(decks).where(eq(decks.id, id)).get();
		if (!row) throw new Error(`Deck not found after update: ${id}`);
		return row as Deck;
	}

	delete(id: UUID): void {
		this.db.delete(decks).where(eq(decks.id, id)).run();
	}
}
