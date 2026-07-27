import { eq } from "drizzle-orm";
import type { CreateFlashcardInput, Flashcard } from "../../domain/entities/Flashcard";
import type { IFlashcardRepository } from "../../domain/ports/IFlashcardRepository";
import { newUUID, type UUID } from "../../domain/uuid";
import type { DB } from "./client";
import { flashcards } from "./schema";

export class DrizzleFlashcardRepository implements IFlashcardRepository {
	constructor(private readonly db: DB) {}

	create(input: CreateFlashcardInput): Flashcard {
		const now = new Date();
		const id = newUUID();
		this.db
			.insert(flashcards)
			.values({
				id,
				deckId: input.deckId,
				front: input.front,
				back: input.back,
				tags: input.tags,
				createdAt: now,
				updatedAt: now,
			})
			.run();
		return { id, ...input, createdAt: now, updatedAt: now };
	}

	findById(id: UUID): Flashcard | null {
		const row = this.db.select().from(flashcards).where(eq(flashcards.id, id)).get();
		if (!row) return null;
		return row as Flashcard;
	}

	findByDeckId(deckId: UUID): Flashcard[] {
		return this.db
			.select()
			.from(flashcards)
			.where(eq(flashcards.deckId, deckId))
			.all() as Flashcard[];
	}

	update(
		id: UUID,
		input: Partial<Pick<CreateFlashcardInput, "front" | "back" | "tags">>,
	): Flashcard {
		const updatedAt = new Date();
		this.db
			.update(flashcards)
			.set({ ...input, updatedAt })
			.where(eq(flashcards.id, id))
			.run();
		const updated = this.findById(id);
		if (!updated) throw new Error(`Flashcard not found after update: ${id}`);
		return updated;
	}

	delete(id: UUID): void {
		this.db.delete(flashcards).where(eq(flashcards.id, id)).run();
	}
}
