import type { Tag } from "../tags";
import type { UUID } from "../uuid";

export interface Flashcard {
	id: UUID;
	deckId: UUID;
	front: string;
	back: string;
	tags: Tag[];
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateFlashcardInput {
	deckId: UUID;
	front: string;
	back: string;
	tags: Tag[];
}
