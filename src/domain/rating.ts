export type Rating = "perfect" | "correct" | "difficult" | "familiar_wrong" | "wrong" | "blackout";

export const RATING_SCORE: Record<Rating, 0 | 1 | 2 | 3 | 4 | 5> = {
	perfect: 5,
	correct: 4,
	difficult: 3,
	familiar_wrong: 2,
	wrong: 1,
	blackout: 0,
};
