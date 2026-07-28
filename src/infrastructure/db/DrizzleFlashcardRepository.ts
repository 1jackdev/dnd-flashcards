import { eq } from "drizzle-orm";
import type { CreateFlashcardInput, Flashcard } from "../../domain/entities/Flashcard";
import type { IFlashcardRepository } from "../../domain/ports/IFlashcardRepository";
import type { Tag } from "../../domain/tags";
import { newUUID, type UUID } from "../../domain/uuid";
import type { DB } from "./client";
import { flashcards } from "./schema";

export class DrizzleFlashcardRepository implements IFlashcardRepository {
	constructor(private readonly db: DB) {}

	async create(input: CreateFlashcardInput): Promise<Flashcard> {
		const now = new Date();
		const id = newUUID();
		await this.db
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

	async findById(id: UUID): Promise<Flashcard | null> {
		const row = await this.db.select().from(flashcards).where(eq(flashcards.id, id)).get();
		if (!row) return null;
		return row as Flashcard;
	}

	async findByDeckId(deckId: UUID): Promise<Flashcard[]> {
		return (await this.db
			.select()
			.from(flashcards)
			.where(eq(flashcards.deckId, deckId))
			.all()) as Flashcard[];
	}

	async findByTags(tags: Tag[]): Promise<Flashcard[]> {
		const all = (await this.db.select().from(flashcards).all()) as Flashcard[];
		return all.filter((card) => card.tags.some((t) => tags.includes(t as Tag)));
	}

	async update(
		id: UUID,
		input: Partial<Pick<CreateFlashcardInput, "front" | "back" | "tags">>,
	): Promise<Flashcard> {
		const updatedAt = new Date();
		await this.db
			.update(flashcards)
			.set({ ...input, updatedAt })
			.where(eq(flashcards.id, id))
			.run();
		const updated = await this.findById(id);
		if (!updated) throw new Error(`Flashcard not found after update: ${id}`);
		return updated;
	}

	async delete(id: UUID): Promise<void> {
		await this.db.delete(flashcards).where(eq(flashcards.id, id)).run();
	}
}
