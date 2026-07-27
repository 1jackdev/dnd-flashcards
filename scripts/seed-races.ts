const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// General racial trait rules
	{
		front: "What six categories appear in every race's trait block?",
		back: "Ability Score Increase, Age, Alignment, Size, Speed, and Languages.",
		tags: ["rule", "creature", "race"],
	},
	{
		front: "What size are Small creatures, and what rule applies to them in combat?",
		back: "Small creatures are 2–4 feet tall. They have trouble wielding heavy weapons.",
		tags: ["rule", "combat", "race"],
	},
	{
		front: "What do Subraces inherit?",
		back: "Members of a subrace have all traits of the parent race plus the traits specified for their subrace.",
		tags: ["rule", "creature", "race"],
	},

	// Dwarf
	{
		front: "What ability score does the Dwarf race increase?",
		back: "Constitution +2.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "When are Dwarves considered adults, and how long do they live?",
		back: "Considered young until age 50; live about 350 years on average.",
		tags: ["creature", "lore", "race"],
	},
	{
		front: "What is a Dwarf's base walking speed, and does heavy armor affect it?",
		back: "25 feet. Speed is not reduced by wearing heavy armor.",
		tags: ["creature", "rule", "race"],
	},
	{
		front: "What is Dwarven Resilience?",
		back: "Advantage on saving throws against poison, and resistance to poison damage.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "What weapons does Dwarven Combat Training grant proficiency with?",
		back: "Battleaxe, handaxe, light hammer, and warhammer.",
		tags: ["creature", "combat", "race"],
	},
	{
		front: "What does Dwarven Tool Proficiency grant?",
		back: "Proficiency with one artisan's tool of your choice: smith's tools, brewer's supplies, or mason's tools.",
		tags: ["creature", "skill", "race"],
	},
	{
		front: "What does Stonecunning do?",
		back: "For Intelligence (History) checks about stonework origins, you are treated as proficient and add double your proficiency bonus.",
		tags: ["creature", "skill", "race"],
	},

	// Hill Dwarf
	{
		front: "What ability score does Hill Dwarf increase?",
		back: "Wisdom +1.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "What is Dwarven Toughness (Hill Dwarf)?",
		back: "Hit point maximum increases by 1, and increases by 1 again every time you gain a level.",
		tags: ["creature", "ability", "race"],
	},

	// Elf
	{
		front: "What ability score does the Elf race increase?",
		back: "Dexterity +2.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "When are Elves considered adults, and how long do they live?",
		back: "Claim adulthood around age 100; can live to be 750 years old.",
		tags: ["creature", "lore", "race"],
	},
	{
		front: "What is the typical alignment of Elves?",
		back: "Lean strongly toward chaotic alignments, valuing freedom and self-expression. More often good than not.",
		tags: ["creature", "lore", "race"],
	},
	{
		front: "What is Keen Senses (Elf)?",
		back: "Proficiency in the Perception skill.",
		tags: ["creature", "skill", "race"],
	},
	{
		front: "What is Fey Ancestry?",
		back: "Advantage on saving throws against being charmed, and magic can't put you to sleep.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "What is Trance (Elf)?",
		back: "Elves don't sleep. They meditate deeply for 4 hours a day, gaining the same benefit as 8 hours of sleep.",
		tags: ["creature", "lore", "race"],
	},

	// High Elf
	{
		front: "What ability score does High Elf increase?",
		back: "Intelligence +1.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "What weapons does Elf Weapon Training (High Elf) grant proficiency with?",
		back: "Longsword, shortsword, shortbow, and longbow.",
		tags: ["creature", "combat", "race"],
	},
	{
		front: "What does the High Elf Cantrip trait grant?",
		back: "One cantrip of your choice from the wizard spell list, using Intelligence as your spellcasting ability.",
		tags: ["creature", "spell", "race"],
	},

	// Halfling
	{
		front: "What ability score does the Halfling race increase?",
		back: "Dexterity +2.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "When do Halflings reach adulthood and how long do they live?",
		back: "Adulthood at age 20; generally live into the middle of their second century (~150 years).",
		tags: ["creature", "lore", "race"],
	},
	{
		front: "What is a Halfling's size and base walking speed?",
		back: "Size: Small (about 3 feet tall, 40 lbs). Base walking speed: 25 feet.",
		tags: ["creature", "rule", "race"],
	},
	{
		front: "What does the Lucky trait (Halfling) do?",
		back: "When you roll a 1 on a d20 for an attack roll, ability check, or saving throw, you can reroll and must use the new roll.",
		tags: ["creature", "rule", "race"],
	},
	{
		front: "What does Brave (Halfling) do?",
		back: "Advantage on saving throws against being frightened.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "What does Halfling Nimbleness allow?",
		back: "You can move through the space of any creature that is of a larger size than you.",
		tags: ["creature", "combat", "race"],
	},

	// Lightfoot Halfling
	{
		front: "What ability score does Lightfoot Halfling increase?",
		back: "Charisma +1.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "What does Naturally Stealthy (Lightfoot Halfling) allow?",
		back: "You can attempt to hide even when obscured only by a creature that is at least one size larger than you.",
		tags: ["creature", "skill", "race"],
	},

	// Human
	{
		front: "What ability scores does the Human race increase?",
		back: "All six ability scores each increase by 1.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "What languages do Humans start with?",
		back: "Common and one extra language of their choice.",
		tags: ["creature", "lore", "race"],
	},

	// Dragonborn
	{
		front: "What ability scores does the Dragonborn race increase?",
		back: "Strength +2 and Charisma +1.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "When do Dragonborn reach adulthood and how long do they live?",
		back: "Reach adulthood by age 15; live to around 80.",
		tags: ["creature", "lore", "race"],
	},
	{
		front: "What is Draconic Ancestry (Dragonborn)?",
		back: "Choose one dragon type; your breath weapon's shape, damage type, and your damage resistance are all determined by that choice.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "How does the Dragonborn Breath Weapon work?",
		back: "Action to exhale. DC = 8 + Con modifier + proficiency bonus. 2d6 on fail, half on success. Scales to 3d6 (6th), 4d6 (11th), 5d6 (16th). Recharges on short or long rest.",
		tags: ["creature", "combat", "race"],
	},
	{
		front: "What are the breath weapon shape and saving throw for Black and Copper Dragonborn?",
		back: "Acid damage, 5 by 30 ft. line, Dexterity save.",
		tags: ["creature", "combat", "race"],
	},
	{
		front: "What are the breath weapon shape and saving throw for Blue and Bronze Dragonborn?",
		back: "Lightning damage, 5 by 30 ft. line, Dexterity save.",
		tags: ["creature", "combat", "race"],
	},
	{
		front: "What are the breath weapon shape and saving throw for Gold and Red Dragonborn?",
		back: "Fire damage, 15 ft. cone, Dexterity save.",
		tags: ["creature", "combat", "race"],
	},
	{
		front: "What are the breath weapon shape and saving throw for Green Dragonborn?",
		back: "Poison damage, 15 ft. cone, Constitution save.",
		tags: ["creature", "combat", "race"],
	},
	{
		front: "What are the breath weapon shape and saving throw for Silver and White Dragonborn?",
		back: "Cold damage, 15 ft. cone, Constitution save.",
		tags: ["creature", "combat", "race"],
	},

	// Gnome
	{
		front: "What ability score does the Gnome race increase?",
		back: "Intelligence +2.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "When do Gnomes reach adulthood and how long do they live?",
		back: "Settle into adult life around age 40; can live 350 to almost 500 years.",
		tags: ["creature", "lore", "race"],
	},
	{
		front: "What is a Gnome's size and base walking speed?",
		back: "Size: Small (3–4 feet tall, ~40 lbs). Base walking speed: 25 feet.",
		tags: ["creature", "rule", "race"],
	},
	{
		front: "What is Gnome Cunning?",
		back: "Advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.",
		tags: ["creature", "ability", "race"],
	},

	// Rock Gnome
	{
		front: "What ability score does Rock Gnome increase?",
		back: "Constitution +1.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "What is Artificer's Lore (Rock Gnome)?",
		back: "Intelligence (History) checks about magic items, alchemical objects, or technological devices: add twice your proficiency bonus instead of any normal proficiency bonus.",
		tags: ["creature", "skill", "race"],
	},
	{
		front: "What does the Tinker trait (Rock Gnome) allow?",
		back: "Proficiency with tinker's tools. Spend 1 hour and 10 gp to build a Tiny clockwork device (AC 5, 1 hp) that lasts 24 hours. Up to 3 active at a time.",
		tags: ["creature", "ability", "race"],
	},

	// Half-Elf
	{
		front: "What ability scores does Half-Elf increase?",
		back: "Charisma +2, plus two other ability scores of your choice each increase by 1.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "When do Half-Elves reach adulthood and how long do they live?",
		back: "Adulthood around age 20; often exceed 180 years.",
		tags: ["creature", "lore", "race"],
	},
	{
		front: "What is Skill Versatility (Half-Elf)?",
		back: "Gain proficiency in two skills of your choice.",
		tags: ["creature", "skill", "race"],
	},
	{
		front: "What languages do Half-Elves speak?",
		back: "Common, Elvish, and one extra language of their choice.",
		tags: ["creature", "lore", "race"],
	},

	// Half-Orc
	{
		front: "What ability scores does Half-Orc increase?",
		back: "Strength +2 and Constitution +1.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "When do Half-Orcs reach adulthood and how long do they live?",
		back: "Adulthood around age 14; rarely live longer than 75 years.",
		tags: ["creature", "lore", "race"],
	},
	{
		front: "What is Menacing (Half-Orc)?",
		back: "Proficiency in the Intimidation skill.",
		tags: ["creature", "skill", "race"],
	},
	{
		front: "What is Relentless Endurance (Half-Orc)?",
		back: "When reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. Once per long rest.",
		tags: ["creature", "combat", "race"],
	},
	{
		front: "What is Savage Attacks (Half-Orc)?",
		back: "On a critical hit with a melee weapon attack, roll one of the weapon's damage dice one additional time and add it to the extra damage of the critical hit.",
		tags: ["creature", "combat", "race"],
	},

	// Tiefling
	{
		front: "What ability scores does Tiefling increase?",
		back: "Intelligence +1 and Charisma +2.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "What is Hellish Resistance (Tiefling)?",
		back: "Resistance to fire damage.",
		tags: ["creature", "ability", "race"],
	},
	{
		front: "What is Infernal Legacy (Tiefling)?",
		back: "Know thaumaturgy cantrip. At 3rd level: cast hellish rebuke (2nd-level) once per long rest. At 5th level: cast darkness once per long rest. Spellcasting ability is Charisma.",
		tags: ["creature", "spell", "race"],
	},
	{
		front: "What languages do Tieflings speak?",
		back: "Common and Infernal.",
		tags: ["creature", "lore", "race"],
	},
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: "Races & Racial Traits",
			description: "SRD 5.1 racial traits for all core races.",
		}),
	});
	if (!deckRes.ok) throw new Error(`Create deck failed: ${await deckRes.text()}`);
	const { id: deckId } = (await deckRes.json()) as { id: string };
	console.log(`Deck created: ${deckId}`);

	let ok = 0;
	for (const card of cards) {
		const res = await fetch(`${API}/decks/${deckId}/cards`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(card),
		});
		if (res.ok) {
			ok++;
			process.stdout.write(`\r  ${ok}/${cards.length}`);
		} else {
			console.error(`\n  FAIL "${card.front.slice(0, 50)}": ${await res.text()}`);
		}
	}
	console.log(`\nDone. ${ok}/${cards.length} cards imported.`);
}

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
