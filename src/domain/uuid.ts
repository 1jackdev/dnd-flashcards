import { randomUUID } from "node:crypto";

export type UUID = string & { readonly __brand: "UUID" };

export function newUUID(): UUID {
	return randomUUID() as UUID;
}

export function parseUUID(value: string): UUID {
	if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
		throw new Error(`Invalid UUID: ${value}`);
	}
	return value as UUID;
}
