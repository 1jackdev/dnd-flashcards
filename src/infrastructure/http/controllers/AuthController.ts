import type { AuthResult, AuthService } from "../../../application/AuthService";

export class AuthController {
	constructor(private readonly authService: AuthService) {}

	register(username: string, password: string): Promise<AuthResult> {
		return this.authService.register(username, password);
	}

	login(username: string, password: string): Promise<AuthResult> {
		return this.authService.login(username, password);
	}
}
