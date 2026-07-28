import type { UUID } from "../uuid";

export interface User {
	id: UUID;
	username: string;
	passwordHash: string;
	createdAt: Date;
}

export interface CreateUserInput {
	username: string;
	password: string;
}

export type PublicUser = Omit<User, "passwordHash">;
