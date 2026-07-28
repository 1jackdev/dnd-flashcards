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

export const CreateQuizQuestionSchema = z.discriminatedUnion("type", [
	z
		.object({
			type: z.literal("multiple_choice"),
			question: z.string().min(1),
			choices: z.array(z.string().min(1)).min(2),
			correctChoiceIndex: z.number().int().min(0),
		})
		.refine((d) => d.correctChoiceIndex < d.choices.length, {
			message: "correctChoiceIndex must be a valid index into choices",
			path: ["correctChoiceIndex"],
		}),
	z.object({
		type: z.literal("true_false"),
		question: z.string().min(1),
		correctAnswer: z.boolean(),
	}),
]);

export const RecordQuizAttemptSchema = z.object({
	correct: z.boolean(),
});

export const RegisterSchema = z.object({
	username: z.string().min(3),
	password: z.string().min(8),
});

export const LoginSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(1),
});

export type CreateDeckInput = z.infer<typeof CreateDeckSchema>;
export type UpdateDeckInput = z.infer<typeof UpdateDeckSchema>;
export type CreateFlashcardInput = z.infer<typeof CreateFlashcardSchema>;
export type UpdateFlashcardInput = z.infer<typeof UpdateFlashcardSchema>;
export type ReviewCardInput = z.infer<typeof ReviewCardSchema>;
export type CreateQuizQuestionInput = z.infer<typeof CreateQuizQuestionSchema>;
export type RecordQuizAttemptInput = z.infer<typeof RecordQuizAttemptSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
