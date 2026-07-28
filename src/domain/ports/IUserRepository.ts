import type { CreateUserInput, User } from "../entities/User";
import type { UUID } from "../uuid";

export interface IUserRepository {
	create(input: CreateUserInput): Promise<User>;
	findById(id: UUID): Promise<User | null>;
	findByUsername(username: string): Promise<User | null>;
}
