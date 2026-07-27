import { eq, inArray } from "drizzle-orm";
import type { CreateFlashcardInput, Flashcard } from "../../domain/entities/Flashcard";
import type { IFlashcardRepository } from "../../domain/ports/IFlashcardRepository";
import type { Tag } from "../../domain/tags";
import { newUUID, type UUID } from "../../domain/uuid";
import type { DB } from "./client";
import { flashcards, flashcardTags, tags } from "./schema";

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
				createdAt: now,
				updatedAt: now,
			})
			.run();
		this.attachTags(id, input.tags);
		return { id, ...input, createdAt: now, updatedAt: now };
	}

	findById(id: UUID): Flashcard | null {
		const row = this.db.select().from(flashcards).where(eq(flashcards.id, id)).get();
		if (!row) return null;
		return { ...(row as Flashcard), tags: this.getTagsForCard(id) };
	}

	findByDeckId(deckId: UUID): Flashcard[] {
		const rows = this.db.select().from(flashcards).where(eq(flashcards.deckId, deckId)).all();
		if (rows.length === 0) return [];

		const ids = rows.map((r) => r.id);
		const tagRows = this.db
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

		return rows.map((row) => ({ ...(row as Flashcard), tags: tagMap.get(row.id) ?? [] }));
	}

	update(
		id: UUID,
		input: Partial<Pick<CreateFlashcardInput, "front" | "back" | "tags">>,
	): Flashcard {
		const updatedAt = new Date();
		const { tags: newTags, ...rest } = input;

		if (Object.keys(rest).length > 0) {
			this.db
				.update(flashcards)
				.set({ ...rest, updatedAt })
				.where(eq(flashcards.id, id))
				.run();
		}

		if (newTags !== undefined) {
			this.db.delete(flashcardTags).where(eq(flashcardTags.flashcardId, id)).run();
			this.attachTags(id, newTags);
		}

		const updated = this.findById(id);
		if (!updated) throw new Error(`Flashcard not found after update: ${id}`);
		return updated;
	}

	delete(id: UUID): void {
		this.db.delete(flashcards).where(eq(flashcards.id, id)).run();
	}

	private getTagsForCard(flashcardId: UUID): Tag[] {
		return this.db
			.select({ name: tags.name })
			.from(flashcardTags)
			.innerJoin(tags, eq(flashcardTags.tagId, tags.id))
			.where(eq(flashcardTags.flashcardId, flashcardId))
			.all()
			.map((r) => r.name as Tag);
	}

	private attachTags(flashcardId: UUID, cardTags: Tag[]): void {
		if (cardTags.length === 0) return;
		const tagRows = this.db.select().from(tags).where(inArray(tags.name, cardTags)).all();
		const tagIdMap = new Map(tagRows.map((t) => [t.name, t.id]));
		this.db
			.insert(flashcardTags)
			.values(cardTags.map((tag) => ({ flashcardId, tagId: tagIdMap.get(tag)! })))
			.run();
	}
}
