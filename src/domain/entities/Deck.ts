export interface Deck {
	id: string;
	name: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateDeckInput {
	name: string;
	description: string;
}
