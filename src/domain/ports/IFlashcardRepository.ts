import type { CreateFlashcardInput, Flashcard } from "../entities/Flashcard";

export interface IFlashcardRepository {
	create(input: CreateFlashcardInput): Promise<Flashcard>;
	findById(id: string): Promise<Flashcard | null>;
	findByDeckId(deckId: string): Promise<Flashcard[]>;
	update(
		id: string,
		input: Partial<Pick<CreateFlashcardInput, "front" | "back" | "tags">>,
	): Promise<Flashcard>;
	delete(id: string): Promise<void>;
}
