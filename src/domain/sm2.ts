import type { Rating } from "./rating";
import { RATING_SCORE } from "./rating";

export interface SM2Input {
	easeFactor: number;
	interval: number;
	repetitions: number;
}

export interface SM2Output {
	easeFactor: number;
	interval: number;
	repetitions: number;
	nextReviewAt: Date;
}

const MIN_EASE_FACTOR = 1.3;

export function calculateSM2(input: SM2Input, rating: Rating): SM2Output {
	const q = RATING_SCORE[rating];

	const newEaseFactor = Math.max(
		MIN_EASE_FACTOR,
		input.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)),
	);

	let newRepetitions: number;
	let newInterval: number;

	if (q < 3) {
		newRepetitions = 0;
		newInterval = 1;
	} else {
		newRepetitions = input.repetitions + 1;
		if (input.repetitions === 0) {
			newInterval = 1;
		} else if (input.repetitions === 1) {
			newInterval = 6;
		} else {
			newInterval = Math.round(input.interval * newEaseFactor);
		}
	}

	const nextReviewAt = new Date();
	nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

	return {
		easeFactor: newEaseFactor,
		interval: newInterval,
		repetitions: newRepetitions,
		nextReviewAt,
	};
}
