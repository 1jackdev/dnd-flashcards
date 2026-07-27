import type { Tag } from "../tags";

export interface Flashcard {
	id: string;
	deckId: string;
	front: string;
	back: string;
	tags: Tag[];
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateFlashcardInput {
	deckId: string;
	front: string;
	back: string;
	tags: Tag[];
}
