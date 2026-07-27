import type { CreateFlashcardInput, Flashcard } from "../entities/Flashcard";
import type { UUID } from "../uuid";

export interface IFlashcardRepository {
	create(input: CreateFlashcardInput): Flashcard;
	findById(id: UUID): Flashcard | null;
	findByDeckId(deckId: UUID): Flashcard[];
	update(
		id: UUID,
		input: Partial<Pick<CreateFlashcardInput, "front" | "back" | "tags">>,
	): Flashcard;
	delete(id: UUID): void;
}
