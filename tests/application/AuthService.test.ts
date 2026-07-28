import { describe, expect, mock, test } from "bun:test";
import { AuthService } from "../../src/application/AuthService";
import { makeMockUserRepo, userFactory } from "../factories/domain";

describe("AuthService", () => {
	describe("register", () => {
		test("throws when username already taken", async () => {
			const existing = userFactory.build({ username: "taken" });
			const userRepo = makeMockUserRepo({ findByUsername: mock(async () => existing) });
			const service = new AuthService(userRepo);

			await expect(service.register("taken", "password123")).rejects.toThrow(
				"Username already taken: taken",
			);
			expect(userRepo.create).not.toHaveBeenCalled();
		});

		test("creates user and returns user + token without passwordHash", async () => {
			const created = userFactory.build({ username: "newuser" });
			const userRepo = makeMockUserRepo({
				findByUsername: mock(async () => null),
				create: mock(async () => created),
			});
			const service = new AuthService(userRepo);

			const result = await service.register("newuser", "password123");

			expect(userRepo.create).toHaveBeenCalledWith({
				username: "newuser",
				password: "password123",
			});
			expect(result.user).toEqual({
				id: created.id,
				username: created.username,
				createdAt: created.createdAt,
			});
			expect((result.user as { passwordHash?: string }).passwordHash).toBeUndefined();
			expect(typeof result.token).toBe("string");
			expect(result.token.split(".")).toHaveLength(3);
		});
	});

	describe("login", () => {
		test("succeeds with correct password", async () => {
			const password = "correct-password";
			const passwordHash = await Bun.password.hash(password);
			const user = userFactory.build({ username: "someuser", passwordHash });
			const userRepo = makeMockUserRepo({ findByUsername: mock(async () => user) });
			const service = new AuthService(userRepo);

			const result = await service.login("someuser", password);

			expect(result.user.username).toBe("someuser");
			expect((result.user as { passwordHash?: string }).passwordHash).toBeUndefined();
			expect(typeof result.token).toBe("string");
		});

		test("throws generic error on wrong password", async () => {
			const passwordHash = await Bun.password.hash("correct-password");
			const user = userFactory.build({ username: "someuser", passwordHash });
			const userRepo = makeMockUserRepo({ findByUsername: mock(async () => user) });
			const service = new AuthService(userRepo);

			await expect(service.login("someuser", "wrong-password")).rejects.toThrow(
				"Invalid username or password",
			);
		});

		test("throws same generic error on unknown username", async () => {
			const userRepo = makeMockUserRepo({ findByUsername: mock(async () => null) });
			const service = new AuthService(userRepo);

			await expect(service.login("nobody", "whatever")).rejects.toThrow(
				"Invalid username or password",
			);
		});
	});
});
