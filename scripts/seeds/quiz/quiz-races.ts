const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Races & Racial Traits";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What six categories appear in every race's trait block?": [
		{
			type: "true_false",
			question: "Every race's trait block includes a Speed category.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which of the following is one of the six categories that appears in every race's trait block, alongside Age, Size, and Languages?",
			choices: ["Ability Score Increase", "Darkvision", "Proficiencies", "Subrace"],
			correctChoiceIndex: 0,
		},
	],
	"What size are Small creatures, and what rule applies to them in combat?": [
		{
			type: "true_false",
			question: "Small creatures have trouble wielding heavy weapons.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What height range defines Small creatures generally?",
			choices: ["2–4 feet tall", "3–4 feet tall only", "Under 2 feet tall", "4–5 feet tall"],
			correctChoiceIndex: 0,
		},
	],
	"What do Subraces inherit?": [
		{
			type: "true_false",
			question: "A subrace member has only their subrace's traits, not the parent race's traits.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"What does a member of a subrace gain, in addition to the traits specified for their subrace?",
			choices: [
				"All traits of the parent race",
				"Only the parent race's ability score increase",
				"Nothing additional from the parent race",
				"Only the parent race's languages",
			],
			correctChoiceIndex: 0,
		},
	],
	"What ability score does the Dwarf race increase?": [
		{
			type: "true_false",
			question: "The Dwarf race increases Constitution by 2.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which ability score does the base Dwarf race increase by 2?",
			choices: ["Constitution", "Strength", "Dexterity", "Intelligence"],
			correctChoiceIndex: 0,
		},
	],
	"When are Dwarves considered adults, and how long do they live?": [
		{
			type: "true_false",
			question: "Dwarves are considered young until about age 50.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "About how long do Dwarves live on average?",
			choices: ["350 years", "750 years", "150 years", "80 years"],
			correctChoiceIndex: 0,
		},
	],
	"What is a Dwarf's base walking speed, and does heavy armor affect it?": [
		{
			type: "true_false",
			question: "A Dwarf's speed is reduced when wearing heavy armor.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What is a Dwarf's base walking speed?",
			choices: ["25 feet", "30 feet", "40 feet", "20 feet"],
			correctChoiceIndex: 0,
		},
	],
	"What is Dwarven Resilience?": [
		{
			type: "true_false",
			question: "Dwarven Resilience grants resistance to poison damage.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Dwarven Resilience grants advantage on saving throws against which effect?",
			choices: ["Poison", "Being charmed", "Being frightened", "Magical sleep effects"],
			correctChoiceIndex: 0,
		},
	],
	"What weapons does Dwarven Combat Training grant proficiency with?": [
		{
			type: "true_false",
			question: "Dwarven Combat Training grants proficiency with the longsword.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which weapon proficiencies does Dwarven Combat Training grant?",
			choices: [
				"Battleaxe, handaxe, light hammer, and warhammer",
				"Longsword, shortsword, shortbow, and longbow",
				"Simple weapons only",
				"Rapier and shortsword",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does Dwarven Tool Proficiency grant?": [
		{
			type: "true_false",
			question:
				"Dwarven Tool Proficiency lets you choose from smith's tools, brewer's supplies, or mason's tools.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which artisan's tool is NOT an option for Dwarven Tool Proficiency?",
			choices: ["Tinker's tools", "Smith's tools", "Brewer's supplies", "Mason's tools"],
			correctChoiceIndex: 0,
		},
	],
	"What does Stonecunning do?": [
		{
			type: "true_false",
			question:
				"Stonecunning applies to Intelligence (History) checks related to the origin of stonework.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Stonecunning lets you add double your proficiency bonus to checks about what subject?",
			choices: [
				"The origin of stonework",
				"Magic items and alchemical objects",
				"Draconic ancestry",
				"Local plants and animals",
			],
			correctChoiceIndex: 0,
		},
	],
	"What ability score does Hill Dwarf increase?": [
		{
			type: "true_false",
			question: "Hill Dwarf increases Wisdom by 1.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which ability score does Hill Dwarf increase, in addition to the base Dwarf's Constitution?",
			choices: ["Wisdom", "Intelligence", "Charisma", "Strength"],
			correctChoiceIndex: 0,
		},
	],
	"What is Dwarven Toughness (Hill Dwarf)?": [
		{
			type: "true_false",
			question:
				"Dwarven Toughness increases your hit point maximum by 1 every time you gain a level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What does Dwarven Toughness grant at 1st level, before further increases from leveling?",
			choices: [
				"+1 hit point maximum",
				"+1 to Constitution",
				"Resistance to poison damage",
				"Advantage on death saving throws",
			],
			correctChoiceIndex: 0,
		},
	],
	"What ability score does the Elf race increase?": [
		{
			type: "true_false",
			question: "The Elf race increases Dexterity by 2.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which ability score does the base Elf race increase by 2?",
			choices: ["Dexterity", "Constitution", "Charisma", "Strength"],
			correctChoiceIndex: 0,
		},
	],
	"When are Elves considered adults, and how long do they live?": [
		{
			type: "true_false",
			question: "Elves can live to be 750 years old.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At about what age do Elves claim adulthood?",
			choices: ["100", "50", "20", "40"],
			correctChoiceIndex: 0,
		},
	],
	"What is the typical alignment of Elves?": [
		{
			type: "true_false",
			question: "Elves lean strongly toward lawful alignments.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Elves are described as leaning strongly toward which alignment tendency?",
			choices: ["Chaotic", "Lawful", "Neutral evil", "Lawful good exclusively"],
			correctChoiceIndex: 0,
		},
	],
	"What is Keen Senses (Elf)?": [
		{
			type: "true_false",
			question: "Keen Senses grants proficiency in the Perception skill.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Keen Senses grants proficiency in which skill?",
			choices: ["Perception", "Intimidation", "History", "Stealth"],
			correctChoiceIndex: 0,
		},
	],
	"What is Fey Ancestry?": [
		{
			type: "true_false",
			question: "Fey Ancestry means magic can't put you to sleep.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Fey Ancestry grants advantage on saving throws against which effect?",
			choices: ["Being charmed", "Being poisoned", "Being frightened", "Being paralyzed"],
			correctChoiceIndex: 0,
		},
	],
	"What is Trance (Elf)?": [
		{
			type: "true_false",
			question: "Elves meditate for 4 hours to gain the same benefit as 8 hours of sleep.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How long do Elves meditate in Trance to gain the benefit of a full rest?",
			choices: ["4 hours", "8 hours", "2 hours", "6 hours"],
			correctChoiceIndex: 0,
		},
	],
	"What ability score does High Elf increase?": [
		{
			type: "true_false",
			question: "High Elf increases Intelligence by 1.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which ability score does High Elf increase, in addition to the base Elf's Dexterity?",
			choices: ["Intelligence", "Wisdom", "Charisma", "Constitution"],
			correctChoiceIndex: 0,
		},
	],
	"What weapons does Elf Weapon Training (High Elf) grant proficiency with?": [
		{
			type: "true_false",
			question: "Elf Weapon Training grants proficiency with the longbow.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which weapons does Elf Weapon Training grant proficiency with?",
			choices: [
				"Longsword, shortsword, shortbow, and longbow",
				"Battleaxe, handaxe, light hammer, and warhammer",
				"Simple melee weapons only",
				"Rapier, shortsword, and hand crossbow",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does the High Elf Cantrip trait grant?": [
		{
			type: "true_false",
			question: "The High Elf Cantrip trait uses Intelligence as the spellcasting ability.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "The High Elf Cantrip trait lets you choose a cantrip from which spell list?",
			choices: ["Wizard", "Sorcerer", "Cleric", "Bard"],
			correctChoiceIndex: 0,
		},
	],
	"What ability score does the Halfling race increase?": [
		{
			type: "true_false",
			question: "The Halfling race increases Dexterity by 2.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which ability score does the base Halfling race increase by 2?",
			choices: ["Dexterity", "Strength", "Charisma", "Constitution"],
			correctChoiceIndex: 0,
		},
	],
	"When do Halflings reach adulthood and how long do they live?": [
		{
			type: "true_false",
			question: "Halflings generally live into the middle of their second century.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what age do Halflings reach adulthood?",
			choices: ["20", "100", "40", "15"],
			correctChoiceIndex: 0,
		},
	],
	"What is a Halfling's size and base walking speed?": [
		{
			type: "true_false",
			question: "A Halfling's base walking speed is 25 feet.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "About how tall is a Halfling?",
			choices: ["About 3 feet", "3–4 feet", "2–4 feet", "4–5 feet"],
			correctChoiceIndex: 0,
		},
	],
	"What does the Lucky trait (Halfling) do?": [
		{
			type: "true_false",
			question:
				"The Lucky trait lets you reroll a natural 1 on an attack roll, ability check, or saving throw.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "When using the Lucky trait after rolling a 1, what must you do with the new roll?",
			choices: [
				"Use it",
				"Choose either the original or new roll",
				"Add both rolls together",
				"Reroll again if it's also low",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does Brave (Halfling) do?": [
		{
			type: "true_false",
			question: "Brave grants advantage on saving throws against being frightened.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "The Brave trait grants advantage on saving throws against which condition?",
			choices: ["Frightened", "Charmed", "Poisoned", "Paralyzed"],
			correctChoiceIndex: 0,
		},
	],
	"What does Halfling Nimbleness allow?": [
		{
			type: "true_false",
			question:
				"Halfling Nimbleness lets you move through the space of any creature that is a larger size than you.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Halfling Nimbleness allows you to move through the space of a creature that is what, relative to you?",
			choices: ["Any larger size", "Exactly one size larger", "Smaller", "The same size"],
			correctChoiceIndex: 0,
		},
	],
	"What ability score does Lightfoot Halfling increase?": [
		{
			type: "true_false",
			question: "Lightfoot Halfling increases Charisma by 1.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which ability score does Lightfoot Halfling increase, in addition to the base Halfling's Dexterity?",
			choices: ["Charisma", "Wisdom", "Intelligence", "Constitution"],
			correctChoiceIndex: 0,
		},
	],
	"What does Naturally Stealthy (Lightfoot Halfling) allow?": [
		{
			type: "true_false",
			question:
				"Naturally Stealthy requires the obscuring creature to be at least one size larger than you.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Naturally Stealthy lets you hide while obscured by a creature that is what, relative to you?",
			choices: ["At least one size larger", "Any size", "Exactly the same size", "Smaller"],
			correctChoiceIndex: 0,
		},
	],
	"What ability scores does the Human race increase?": [
		{
			type: "true_false",
			question: "The Human race increases all six ability scores by 1 each.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How does the Human race's ability score increase work?",
			choices: [
				"All six scores increase by 1 each",
				"One score increases by 2",
				"Two scores increase by 1 each",
				"Strength and Constitution increase by 1",
			],
			correctChoiceIndex: 0,
		},
	],
	"What languages do Humans start with?": [
		{
			type: "true_false",
			question: "Humans start knowing Common and one extra language of their choice.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What languages does a Human character start with?",
			choices: [
				"Common and one extra language of choice",
				"Common and Elvish",
				"Common and Infernal",
				"Common only",
			],
			correctChoiceIndex: 0,
		},
	],
	"What ability scores does the Dragonborn race increase?": [
		{
			type: "true_false",
			question: "The Dragonborn race increases Strength by 2 and Charisma by 1.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What ability score increases does the Dragonborn race grant?",
			choices: [
				"Strength +2, Charisma +1",
				"Strength +2, Constitution +1",
				"Charisma +2, Intelligence +1",
				"Constitution +2",
			],
			correctChoiceIndex: 0,
		},
	],
	"When do Dragonborn reach adulthood and how long do they live?": [
		{
			type: "true_false",
			question: "Dragonborn typically live to around 80 years.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At about what age do Dragonborn reach adulthood?",
			choices: ["15", "20", "40", "100"],
			correctChoiceIndex: 0,
		},
	],
	"What is Draconic Ancestry (Dragonborn)?": [
		{
			type: "true_false",
			question:
				"Draconic Ancestry determines your breath weapon's damage type and your damage resistance.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Choosing a Draconic Ancestry determines which of the following?",
			choices: [
				"Breath weapon shape, damage type, and damage resistance",
				"Only your character's alignment",
				"Only your speed",
				"Only your size",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does the Dragonborn Breath Weapon work?": [
		{
			type: "true_false",
			question:
				"The Dragonborn breath weapon deals 2d6 damage at low levels, with a successful save halving the damage.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How is the save DC for the Dragonborn breath weapon calculated?",
			choices: [
				"8 + Constitution modifier + proficiency bonus",
				"8 + Strength modifier + proficiency bonus",
				"10 + Constitution modifier",
				"8 + Dexterity modifier + proficiency bonus",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the breath weapon shape and saving throw for Black and Copper Dragonborn?": [
		{
			type: "true_false",
			question: "Black and Copper Dragonborn have a breath weapon that deals acid damage.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What shape is the breath weapon for Black and Copper Dragonborn?",
			choices: ["5 by 30 ft. line", "15 ft. cone", "30 ft. cone", "10 by 30 ft. line"],
			correctChoiceIndex: 0,
		},
	],
	"What are the breath weapon shape and saving throw for Blue and Bronze Dragonborn?": [
		{
			type: "true_false",
			question:
				"Blue and Bronze Dragonborn require a Constitution saving throw for their breath weapon.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What damage type does the Blue and Bronze Dragonborn breath weapon deal?",
			choices: ["Lightning", "Acid", "Fire", "Poison"],
			correctChoiceIndex: 0,
		},
	],
	"What are the breath weapon shape and saving throw for Gold and Red Dragonborn?": [
		{
			type: "true_false",
			question: "Gold and Red Dragonborn have a breath weapon shaped as a 15-foot cone.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which saving throw applies to the Gold and Red Dragonborn breath weapon?",
			choices: ["Dexterity", "Constitution", "Wisdom", "Strength"],
			correctChoiceIndex: 0,
		},
	],
	"What are the breath weapon shape and saving throw for Green Dragonborn?": [
		{
			type: "true_false",
			question: "The Green Dragonborn breath weapon requires a Constitution saving throw.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What damage type does the Green Dragonborn breath weapon deal?",
			choices: ["Poison", "Acid", "Cold", "Lightning"],
			correctChoiceIndex: 0,
		},
	],
	"What are the breath weapon shape and saving throw for Silver and White Dragonborn?": [
		{
			type: "true_false",
			question: "Silver and White Dragonborn breath weapon deals cold damage in a 15-foot cone.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which two Dragonborn ancestries share a breath weapon dealing cold damage?",
			choices: ["Silver and White", "Gold and Red", "Black and Copper", "Blue and Bronze"],
			correctChoiceIndex: 0,
		},
	],
	"What ability score does the Gnome race increase?": [
		{
			type: "true_false",
			question: "The Gnome race increases Intelligence by 2.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which ability score does the base Gnome race increase by 2?",
			choices: ["Intelligence", "Dexterity", "Charisma", "Wisdom"],
			correctChoiceIndex: 0,
		},
	],
	"When do Gnomes reach adulthood and how long do they live?": [
		{
			type: "true_false",
			question: "Gnomes can live to almost 500 years.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At about what age do Gnomes settle into adult life?",
			choices: ["40", "20", "100", "15"],
			correctChoiceIndex: 0,
		},
	],
	"What is a Gnome's size and base walking speed?": [
		{
			type: "true_false",
			question: "A Gnome's base walking speed is 25 feet.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "About how tall is a Gnome?",
			choices: ["3–4 feet", "About 3 feet only", "2–4 feet", "4–5 feet"],
			correctChoiceIndex: 0,
		},
	],
	"What is Gnome Cunning?": [
		{
			type: "true_false",
			question:
				"Gnome Cunning grants advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Gnome Cunning grants advantage on saving throws against magic for which ability scores?",
			choices: [
				"Intelligence, Wisdom, and Charisma",
				"Strength and Dexterity",
				"Constitution only",
				"All six ability scores",
			],
			correctChoiceIndex: 0,
		},
	],
	"What ability score does Rock Gnome increase?": [
		{
			type: "true_false",
			question: "Rock Gnome increases Constitution by 1.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which ability score does Rock Gnome increase, in addition to the base Gnome's Intelligence?",
			choices: ["Constitution", "Wisdom", "Charisma", "Strength"],
			correctChoiceIndex: 0,
		},
	],
	"What is Artificer's Lore (Rock Gnome)?": [
		{
			type: "true_false",
			question:
				"Artificer's Lore adds twice your proficiency bonus to History checks about magic items.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Artificer's Lore applies to History checks about which subjects?",
			choices: [
				"Magic items, alchemical objects, or technological devices",
				"The origin of stonework",
				"Draconic ancestry",
				"Local flora and fauna",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does the Tinker trait (Rock Gnome) allow?": [
		{
			type: "true_false",
			question: "The Tinker trait allows up to 3 clockwork devices active at the same time.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"How long does a clockwork device created with the Tinker trait function before it stops working?",
			choices: ["24 hours", "1 hour", "1 week", "Until destroyed"],
			correctChoiceIndex: 0,
		},
	],
	"What ability scores does Half-Elf increase?": [
		{
			type: "true_false",
			question:
				"Half-Elf increases Charisma by 2 and two other ability scores of your choice by 1 each.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How does the Half-Elf ability score increase work?",
			choices: [
				"Charisma +2, plus two other scores of choice +1 each",
				"All six scores +1 each",
				"Strength +2, Charisma +1",
				"Charisma +2 only",
			],
			correctChoiceIndex: 0,
		},
	],
	"When do Half-Elves reach adulthood and how long do they live?": [
		{
			type: "true_false",
			question: "Half-Elves often live longer than 180 years.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At about what age do Half-Elves reach adulthood?",
			choices: ["20", "100", "50", "40"],
			correctChoiceIndex: 0,
		},
	],
	"What is Skill Versatility (Half-Elf)?": [
		{
			type: "true_false",
			question: "Skill Versatility grants proficiency in two skills of your choice.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Skill Versatility grants proficiency in how many skills of your choice?",
			choices: ["Two", "One", "Three", "Four"],
			correctChoiceIndex: 0,
		},
	],
	"What languages do Half-Elves speak?": [
		{
			type: "true_false",
			question: "Half-Elves speak Common, Elvish, and one extra language of their choice.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which languages does a Half-Elf know by default, before choosing an extra?",
			choices: ["Common and Elvish", "Common and Infernal", "Common only", "Elvish only"],
			correctChoiceIndex: 0,
		},
	],
	"What ability scores does Half-Orc increase?": [
		{
			type: "true_false",
			question: "Half-Orc increases Strength by 2 and Constitution by 1.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What ability score increases does Half-Orc grant?",
			choices: [
				"Strength +2, Constitution +1",
				"Strength +2, Charisma +1",
				"Constitution +2",
				"Charisma +2, Intelligence +1",
			],
			correctChoiceIndex: 0,
		},
	],
	"When do Half-Orcs reach adulthood and how long do they live?": [
		{
			type: "true_false",
			question: "Half-Orcs rarely live longer than 75 years.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At about what age do Half-Orcs reach adulthood?",
			choices: ["14", "20", "40", "100"],
			correctChoiceIndex: 0,
		},
	],
	"What is Menacing (Half-Orc)?": [
		{
			type: "true_false",
			question: "Menacing grants proficiency in the Intimidation skill.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Menacing grants proficiency in which skill?",
			choices: ["Intimidation", "Perception", "Stealth", "History"],
			correctChoiceIndex: 0,
		},
	],
	"What is Relentless Endurance (Half-Orc)?": [
		{
			type: "true_false",
			question: "Relentless Endurance can be used once per long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Relentless Endurance triggers when a Half-Orc is reduced to what?",
			choices: [
				"0 hit points, but not killed outright",
				"Half its hit point maximum",
				"1 hit point",
				"Any negative hit points",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Savage Attacks (Half-Orc)?": [
		{
			type: "true_false",
			question: "Savage Attacks applies on a critical hit with a ranged weapon attack.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Savage Attacks lets you add an extra damage die on what kind of hit?",
			choices: [
				"A critical hit with a melee weapon attack",
				"Any hit made with advantage",
				"A critical hit with any attack, melee or ranged",
				"A sneak attack",
			],
			correctChoiceIndex: 0,
		},
	],
	"What ability scores does Tiefling increase?": [
		{
			type: "true_false",
			question: "Tiefling increases Intelligence by 1 and Charisma by 2.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What ability score increases does Tiefling grant?",
			choices: [
				"Intelligence +1, Charisma +2",
				"Charisma +2, plus two others +1 each",
				"Strength +2, Charisma +1",
				"Intelligence +2",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Hellish Resistance (Tiefling)?": [
		{
			type: "true_false",
			question: "Hellish Resistance grants resistance to fire damage.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Hellish Resistance grants resistance to which damage type?",
			choices: ["Fire", "Poison", "Cold", "Acid"],
			correctChoiceIndex: 0,
		},
	],
	"What is Infernal Legacy (Tiefling)?": [
		{
			type: "true_false",
			question: "Infernal Legacy uses Charisma as the spellcasting ability.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"At what level does Infernal Legacy grant the ability to cast hellish rebuke once per long rest?",
			choices: ["3rd level", "5th level", "1st level", "7th level"],
			correctChoiceIndex: 0,
		},
	],
	"What languages do Tieflings speak?": [
		{
			type: "true_false",
			question: "Tieflings speak Common and Infernal.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which languages does a Tiefling know?",
			choices: [
				"Common and Infernal",
				"Common and Elvish",
				"Common and one extra of choice",
				"Infernal only",
			],
			correctChoiceIndex: 0,
		},
	],
};

async function run() {
	const headers = { "Content-Type": "application/json", Authorization: `Bearer ${AUTH_TOKEN}` };

	const decksRes = await fetch(`${API}/decks`, { headers });
	if (!decksRes.ok) throw new Error(`List decks failed: ${await decksRes.text()}`);
	const decks = (await decksRes.json()) as Array<{ id: string; name: string }>;
	const deck = decks.find((d) => d.name === DECK_NAME);
	if (!deck) throw new Error(`Deck not found: ${DECK_NAME}`);

	const cardsRes = await fetch(`${API}/decks/${deck.id}/cards`, { headers });
	if (!cardsRes.ok) throw new Error(`List cards failed: ${await cardsRes.text()}`);
	const cards = (await cardsRes.json()) as Array<{ id: string; front: string }>;

	let cardsMatched = 0;
	let quizOk = 0;
	let quizTotal = 0;

	for (const card of cards) {
		const quiz = quizByFront[card.front];
		if (!quiz) {
			console.error(`  No quiz defined for card: "${card.front.slice(0, 60)}"`);
			continue;
		}
		cardsMatched++;
		quizTotal += quiz.length;
		for (const question of quiz) {
			const res = await fetch(`${API}/flashcards/${card.id}/quiz`, {
				method: "POST",
				headers,
				body: JSON.stringify(question),
			});
			if (res.ok) {
				quizOk++;
			} else {
				console.error(`  FAIL quiz "${question.question.slice(0, 50)}": ${await res.text()}`);
			}
		}
	}

	console.log(
		`Matched ${cardsMatched}/${cards.length} cards. Created ${quizOk}/${quizTotal} quiz questions.`,
	);
}

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
