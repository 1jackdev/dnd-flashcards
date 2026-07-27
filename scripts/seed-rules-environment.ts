const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Falling
	{ front: "What are the rules for falling damage?", back: "Take 1d6 bludgeoning damage per 10 feet fallen, maximum 20d6. Land prone unless you avoid taking damage from the fall.", tags: ["rule", "combat"] },

	// Suffocating
	{ front: "How long can a creature hold its breath, and what happens when it runs out?", back: "Hold breath for 1 + Con modifier minutes (minimum 30 seconds). When it runs out or while choking: survive for Con modifier rounds (minimum 1). At the start of the next turn after those rounds, drop to 0 HP and begin dying. Can't regain HP or be stabilized until breathing again.", tags: ["rule", "condition"] },

	// Vision and light
	{ front: "What are lightly and heavily obscured areas?", back: "Lightly obscured (dim light, patchy fog, moderate foliage): disadvantage on Wisdom (Perception) checks that rely on sight. Heavily obscured (darkness, opaque fog, dense foliage): blocks vision entirely; creatures effectively have the blinded condition when trying to see things there.", tags: ["rule", "condition"] },
	{ front: "What are the three categories of illumination?", back: "Bright light: most creatures see normally (torches, fires, even gloomy days). Dim light (shadows): lightly obscured area — boundary between bright light and darkness, twilight, dawn, or brilliant full moon. Darkness: heavily obscured — outdoors at night, unlit dungeons, or magical darkness.", tags: ["rule", "lore"] },
	{ front: "What is Darkvision?", back: "Within a specified range, see in darkness as if it were dim light (lightly obscured). Can't discern color in darkness, only shades of gray.", tags: ["rule", "ability"] },
	{ front: "What is Blindsight?", back: "Perceive surroundings without sight within a specific radius. Possessed by creatures without eyes (oozes) or with echolocation/heightened senses (bats, true dragons).", tags: ["rule", "ability"] },
	{ front: "What is Truesight?", back: "Within a specific range: see in normal and magical darkness, see invisible creatures and objects, auto-detect visual illusions and succeed on saves against them, see original form of shapechangers or magically transformed creatures, and see into the Ethereal Plane.", tags: ["rule", "ability"] },

	// Food and water
	{ front: "What are the food and water requirements and consequences?", back: "Food: 1 lb/day. Can subsist on half rations (half a pound = half a day without food). After 3 + Con modifier days without food (min 1), gain 1 exhaustion level per additional day. Normal day of eating resets the count. Water: 1 gallon/day (2 gallons in hot weather). Drinking only half: DC 15 Con save or 1 exhaustion at day's end. Less than half: automatic 1 exhaustion. If already exhausted: gain 2 levels instead.", tags: ["rule", "condition"] },

	// Objects
	{ front: "What are the rules for damaging objects?", back: "Objects are immune to poison and psychic damage. Otherwise can be damaged by physical and magical attacks. GM determines AC, HP, and any resistances/immunities. Objects always fail Strength and Dexterity saves and are immune to effects requiring other saves. At 0 HP, an object breaks.", tags: ["rule", "combat"] },

	// Short rest
	{ front: "What is a Short Rest?", back: "At least 1 hour of downtime doing nothing more strenuous than eating, drinking, reading, or tending wounds. At the end, spend one or more Hit Dice: roll each and add Con modifier to recover HP. Can decide to spend more after each roll. Max HD spent = character level.", tags: ["rule", "ability"] },

	// Long rest
	{ front: "What is a Long Rest?", back: "At least 8 hours of downtime: sleep or light activity (reading, talking, eating, standing watch no more than 2 hours). Interrupted by 1+ hours of strenuous activity? Must restart. Benefits: regain all lost HP, regain spent Hit Dice up to half your total (min 1). Max once per 24 hours. Must have at least 1 HP to benefit.", tags: ["rule", "ability"] },

	// Downtime
	{ front: "What are the downtime activities available between adventures?", back: "Crafting (5 gp market value progress/day, raw materials cost half; can collaborate), Practicing a Profession (modest lifestyle free; comfortable if in an org; wealthy if Performance-proficient performer), Recuperating (3 days + DC 15 Con save → end one HP-blocking effect or gain 24-hr advantage on saves vs. one disease/poison), Researching (GM-determined, 1 gp/day), Training (250 days at 1 gp/day → new language or tool proficiency).", tags: ["rule", "skill"] },
	{ front: "What are the crafting downtime rules?", back: "Requires tool proficiency and access to appropriate materials/facilities. Progress: 5 gp of market value per day; raw materials cost half market value. Multiple proficient crafters in the same place each contribute 5 gp/day. While crafting: maintain modest lifestyle for free or comfortable lifestyle at half cost.", tags: ["rule", "item"] },
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: "Environment & Resting", description: "SRD 5.1 environment rules: falling, suffocation, vision, food/water, objects, short/long rests, and downtime activities." }),
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
