import { describe, expect, test } from "bun:test";
import { calculateSM2 } from "../../src/domain/sm2";

const BASE = { easeFactor: 2.5, interval: 1, repetitions: 1 };

describe("calculateSM2", () => {
	describe("q >= 3 (correct responses)", () => {
		test("repetitions=0 → interval=1", () => {
			const result = calculateSM2({ ...BASE, repetitions: 0 }, "difficult");
			expect(result.interval).toBe(1);
			expect(result.repetitions).toBe(1);
		});

		test("repetitions=1 → interval=6", () => {
			const result = calculateSM2({ ...BASE, repetitions: 1 }, "correct");
			expect(result.interval).toBe(6);
			expect(result.repetitions).toBe(2);
		});

		test("repetitions=2+ → interval = prev * easeFactor", () => {
			const result = calculateSM2({ easeFactor: 2.5, interval: 6, repetitions: 2 }, "correct");
			expect(result.interval).toBe(Math.round(6 * 2.5));
			expect(result.repetitions).toBe(3);
		});

		test("perfect (5) increases easeFactor", () => {
			const result = calculateSM2(BASE, "perfect");
			expect(result.easeFactor).toBeGreaterThan(BASE.easeFactor);
		});

		test("difficult (3) decreases easeFactor", () => {
			const result = calculateSM2(BASE, "difficult");
			expect(result.easeFactor).toBeLessThan(BASE.easeFactor);
		});
	});

	describe("q < 3 (incorrect responses)", () => {
		test("blackout resets repetitions and interval", () => {
			const result = calculateSM2({ easeFactor: 2.5, interval: 21, repetitions: 5 }, "blackout");
			expect(result.repetitions).toBe(0);
			expect(result.interval).toBe(1);
		});

		test("wrong resets repetitions and interval", () => {
			const result = calculateSM2({ easeFactor: 2.5, interval: 21, repetitions: 5 }, "wrong");
			expect(result.repetitions).toBe(0);
			expect(result.interval).toBe(1);
		});

		test("familiar_wrong resets repetitions and interval", () => {
			const result = calculateSM2(
				{ easeFactor: 2.5, interval: 21, repetitions: 5 },
				"familiar_wrong",
			);
			expect(result.repetitions).toBe(0);
			expect(result.interval).toBe(1);
		});
	});

	test("easeFactor never drops below 1.3", () => {
		let state = { easeFactor: 1.4, interval: 1, repetitions: 1 };
		for (let i = 0; i < 10; i++) {
			state = calculateSM2(state, "difficult");
		}
		expect(state.easeFactor).toBeGreaterThanOrEqual(1.3);
	});

	test("nextReviewAt is set to future date", () => {
		const before = new Date();
		const result = calculateSM2(BASE, "perfect");
		expect(result.nextReviewAt.getTime()).toBeGreaterThan(before.getTime());
	});
});
