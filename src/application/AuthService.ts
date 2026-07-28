import { sign } from "hono/jwt";
import { JWT_SECRET } from "../domain/constants";
import type { PublicUser, User } from "../domain/entities/User";
import type { IUserRepository } from "../domain/ports/IUserRepository";

const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

export interface AuthResult {
	user: PublicUser;
	token: string;
}

export class AuthService {
	constructor(private readonly userRepo: IUserRepository) {}

	async register(username: string, password: string): Promise<AuthResult> {
		if (await this.userRepo.findByUsername(username)) {
			throw new Error(`Username already taken: ${username}`);
		}
		const user = await this.userRepo.create({ username, password });
		return this.toResult(user);
	}

	async login(username: string, password: string): Promise<AuthResult> {
		const user = await this.userRepo.findByUsername(username);
		if (!user || !Bun.password.verifySync(password, user.passwordHash)) {
			throw new Error("Invalid username or password");
		}
		return this.toResult(user);
	}

	private async toResult(user: User): Promise<AuthResult> {
		const { passwordHash: _passwordHash, ...publicUser } = user;
		const token = await sign(
			{
				sub: user.id,
				username: user.username,
				exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
			},
			JWT_SECRET,
		);
		return { user: publicUser, token };
	}
}
