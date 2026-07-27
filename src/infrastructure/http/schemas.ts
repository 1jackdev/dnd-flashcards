import { z } from "zod";
import { RATING_SCORE } from "../../domain/rating";
import { TAGS } from "../../domain/tags";

const tagEnum = z.enum(TAGS);
const ratingEnum = z.enum(
	Object.keys(RATING_SCORE) as [keyof typeof RATING_SCORE, ...Array<keyof typeof RATING_SCORE>],
);

export const CreateDeckSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
});

export const UpdateDeckSchema = z
	.object({
		name: z.string().min(1).optional(),
		description: z.string().min(1).optional(),
	})
	.refine((d) => d.name !== undefined || d.description !== undefined, {
		message: "At least one field required",
	});

export const CreateFlashcardSchema = z.object({
	front: z.string().min(1),
	back: z.string().min(1),
	tags: z.array(tagEnum).min(1),
});

export const UpdateFlashcardSchema = z
	.object({
		front: z.string().min(1).optional(),
		back: z.string().min(1).optional(),
		tags: z.array(tagEnum).min(1).optional(),
	})
	.refine((d) => d.front !== undefined || d.back !== undefined || d.tags !== undefined, {
		message: "At least one field required",
	});

export const ReviewCardSchema = z.object({
	rating: ratingEnum,
});

export type CreateDeckInput = z.infer<typeof CreateDeckSchema>;
export type UpdateDeckInput = z.infer<typeof UpdateDeckSchema>;
export type CreateFlashcardInput = z.infer<typeof CreateFlashcardSchema>;
export type UpdateFlashcardInput = z.infer<typeof UpdateFlashcardSchema>;
export type ReviewCardInput = z.infer<typeof ReviewCardSchema>;
