export const TAGS = [
	"spell",
	"condition",
	"action",
	"creature",
	"rule",
	"item",
	"ability",
	"skill",
	"combat",
	"lore",
	"class",
	"race",
] as const;

export type Tag = (typeof TAGS)[number];
