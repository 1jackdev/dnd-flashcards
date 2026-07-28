import type { CreateFlashcardInput, Flashcard } from "../entities/Flashcard";
import type { Tag } from "../tags";
import type { UUID } from "../uuid";

export interface IFlashcardRepository {
	create(input: CreateFlashcardInput): Promise<Flashcard>;
	findById(id: UUID): Promise<Flashcard | null>;
	findByDeckId(deckId: UUID): Promise<Flashcard[]>;
	findByTags(tags: Tag[]): Promise<Flashcard[]>;
	update(
		id: UUID,
		input: Partial<Pick<CreateFlashcardInput, "front" | "back" | "tags">>,
	): Promise<Flashcard>;
	delete(id: UUID): Promise<void>;
}
