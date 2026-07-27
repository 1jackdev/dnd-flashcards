import { randomUUID } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import type { CreateFlashcardInput, Flashcard } from "../../domain/entities/Flashcard";
import type { IFlashcardRepository } from "../../domain/ports/IFlashcardRepository";
import type { Tag } from "../../domain/tags";
import type { DB } from "./client";
import { flashcards, flashcardTags, tags } from "./schema";

export class DrizzleFlashcardRepository implements IFlashcardRepository {
	constructor(private readonly db: DB) {}

	async create(input: CreateFlashcardInput): Promise<Flashcard> {
		const now = new Date();
		const id = randomUUID();

		await this.db.insert(flashcards).values({
			id,
			deckId: input.deckId,
			front: input.front,
			back: input.back,
			createdAt: now,
			updatedAt: now,
		});

		await this.attachTags(id, input.tags);

		return { id, ...input, createdAt: now, updatedAt: now };
	}

	async findById(id: string): Promise<Flashcard | null> {
		const row = await this.db.select().from(flashcards).where(eq(flashcards.id, id)).get();
		if (!row) return null;
		const cardTags = await this.getTagsForCard(id);
		return { ...row, tags: cardTags };
	}

	async findByDeckId(deckId: string): Promise<Flashcard[]> {
		const rows = await this.db.select().from(flashcards).where(eq(flashcards.deckId, deckId)).all();
		if (rows.length === 0) return [];

		const ids = rows.map((r) => r.id);
		const tagRows = await this.db
			.select({ flashcardId: flashcardTags.flashcardId, name: tags.name })
			.from(flashcardTags)
			.innerJoin(tags, eq(flashcardTags.tagId, tags.id))
			.where(inArray(flashcardTags.flashcardId, ids))
			.all();

		const tagMap = new Map<string, Tag[]>();
		for (const { flashcardId, name } of tagRows) {
			const existing = tagMap.get(flashcardId) ?? [];
			existing.push(name as Tag);
			tagMap.set(flashcardId, existing);
		}

		return rows.map((row) => ({ ...row, tags: tagMap.get(row.id) ?? [] }));
	}

	async update(
		id: string,
		input: Partial<Pick<CreateFlashcardInput, "front" | "back" | "tags">>,
	): Promise<Flashcard> {
		const updatedAt = new Date();
		const { tags: newTags, ...rest } = input;

		if (Object.keys(rest).length > 0) {
			await this.db
				.update(flashcards)
				.set({ ...rest, updatedAt })
				.where(eq(flashcards.id, id));
		}

		if (newTags !== undefined) {
			await this.db.delete(flashcardTags).where(eq(flashcardTags.flashcardId, id));
			await this.attachTags(id, newTags);
		}

		const updated = await this.findById(id);
		if (!updated) throw new Error(`Flashcard not found after update: ${id}`);
		return updated;
	}

	async delete(id: string): Promise<void> {
		await this.db.delete(flashcards).where(eq(flashcards.id, id));
	}

	private async getTagsForCard(flashcardId: string): Promise<Tag[]> {
		const rows = await this.db
			.select({ name: tags.name })
			.from(flashcardTags)
			.innerJoin(tags, eq(flashcardTags.tagId, tags.id))
			.where(eq(flashcardTags.flashcardId, flashcardId))
			.all();
		return rows.map((r) => r.name as Tag);
	}

	private async attachTags(flashcardId: string, cardTags: Tag[]): Promise<void> {
		if (cardTags.length === 0) return;
		const tagRows = await this.db.select().from(tags).where(inArray(tags.name, cardTags)).all();

		const tagIdMap = new Map(tagRows.map((t) => [t.name, t.id]));
		await this.db.insert(flashcardTags).values(
			cardTags.map((tag) => ({
				flashcardId,
				tagId: tagIdMap.get(tag)!,
			})),
		);
	}
}
