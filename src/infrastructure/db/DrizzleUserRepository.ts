import { eq } from "drizzle-orm";
import type { CreateUserInput, User } from "../../domain/entities/User";
import type { IUserRepository } from "../../domain/ports/IUserRepository";
import { newUUID, type UUID } from "../../domain/uuid";
import type { DB } from "./client";
import { users } from "./schema";

export class DrizzleUserRepository implements IUserRepository {
	constructor(private readonly db: DB) {}

	async create(input: CreateUserInput): Promise<User> {
		const now = new Date();
		const id = newUUID();
		const passwordHash = Bun.password.hashSync(input.password);
		await this.db
			.insert(users)
			.values({
				id,
				username: input.username,
				passwordHash,
				createdAt: now,
			})
			.run();
		return { id, username: input.username, passwordHash, createdAt: now };
	}

	async findById(id: UUID): Promise<User | null> {
		const row = await this.db.select().from(users).where(eq(users.id, id)).get();
		if (!row) return null;
		return row as User;
	}

	async findByUsername(username: string): Promise<User | null> {
		const row = await this.db.select().from(users).where(eq(users.username, username)).get();
		if (!row) return null;
		return row as User;
	}
}
