import type { Context } from "hono";
import type { StudyService } from "../../../application/StudyService";
import { ANONYMOUS_USER_ID } from "../../../domain/constants";
import { requireParam } from "../params";
import type { ReviewCardInput } from "../schemas";

export class StudyController {
	constructor(private readonly studyService: StudyService) {}

	async getDueCards(c: Context) {
		const cards = await this.studyService.getDueCards(requireParam(c, "deckId"), ANONYMOUS_USER_ID);
		return c.json(cards);
	}

	async reviewCard(c: Context) {
		const body = await c.req.json<ReviewCardInput>();
		const progress = await this.studyService.reviewCard(
			requireParam(c, "id"),
			ANONYMOUS_USER_ID,
			body.rating,
		);
		return c.json(progress);
	}

	async getDeckProgress(c: Context) {
		const summary = await this.studyService.getDeckProgress(
			requireParam(c, "deckId"),
			ANONYMOUS_USER_ID,
		);
		return c.json(summary);
	}
}
