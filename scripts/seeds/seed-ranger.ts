const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Core stats
	{
		front: "What hit die does the Ranger use?",
		back: "1d10. HP at 1st level: 10 + Con modifier. Higher levels: 1d10 (or 6) + Con modifier per level after 1st.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What armor and weapons is the Ranger proficient with?",
		back: "Light armor, medium armor, shields; simple weapons and martial weapons.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What saving throws is the Ranger proficient in?",
		back: "Strength and Dexterity.",
		tags: ["rule", "ability", "class"],
	},
	{
		front: "What skills can a Ranger choose from at character creation?",
		back: "Choose 3 from: Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, Survival.",
		tags: ["rule", "skill", "class"],
	},

	// Favored Enemy
	{
		front: "What is Favored Enemy (Ranger, 1st level)?",
		back: "Choose one creature type (aberrations, beasts, celestials, constructs, dragons, elementals, fey, fiends, giants, monstrosities, oozes, plants, undead) or two humanoid races. Advantage on Wis (Survival) to track and Int checks to recall info about them. Also learn one language they speak. Gain an additional favored enemy and language at 6th and 14th level.",
		tags: ["ability", "rule", "class"],
	},

	// Natural Explorer
	{
		front: "What is Natural Explorer (Ranger, 1st level)?",
		back: "Choose a favored terrain (arctic, coast, desert, forest, grassland, mountain, or swamp). Double proficiency on Int/Wis checks using proficient skills related to that terrain. While traveling 1+ hour in favored terrain: no difficult terrain travel penalty, can't get lost by nonmagical means, stay alert while doing other travel activities, move stealthily at normal pace (alone), forage double food, and learn exact number/size/time of creatures you're tracking. Gain additional terrain types at 6th and 10th level.",
		tags: ["ability", "skill", "class"],
	},

	// Fighting Style
	{
		front: "What Fighting Styles can a Ranger choose from?",
		back: "Archery (+2 to ranged attack rolls), Defense (+1 AC while wearing armor), Dueling (+2 damage with melee weapon in one hand and no other weapons), Two-Weapon Fighting (add ability modifier to damage of second attack). Can't take same style twice.",
		tags: ["combat", "ability", "class"],
	},

	// Spellcasting
	{
		front: "What is the Ranger's spellcasting ability?",
		back: "Wisdom. Spell save DC = 8 + proficiency bonus + Wis modifier. Spell attack modifier = proficiency bonus + Wis modifier.",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "When does a Ranger gain spellcasting, and how many spells do they know?",
		back: "Starting at 2nd level. Ranger is a half-caster: knows a set number of spells (2 at 2nd level, up to 11 at 20th). Spells must be of a level for which you have slots. Can replace one known spell per level gained.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "How does the Ranger regain spell slots?",
		back: "All expended spell slots are regained on a long rest.",
		tags: ["spell", "rule", "class"],
	},

	// Ranger Archetype
	{
		front: "What is Ranger Archetype (3rd level)?",
		back: "Choose an archetype (e.g. Hunter). Grants features at 3rd, 7th, 11th, and 15th levels.",
		tags: ["rule", "lore", "class"],
	},

	// Primeval Awareness
	{
		front: "What is Primeval Awareness (Ranger, 3rd level)?",
		back: "Action: expend one ranger spell slot to sense whether aberrations, celestials, dragons, elementals, fey, fiends, or undead are present within 1 mile (or 6 miles in favored terrain). Duration: 1 minute per level of slot expended. Doesn't reveal location or number.",
		tags: ["action", "ability", "class"],
	},

	// ASI
	{
		front: "At what levels does the Ranger gain Ability Score Improvement?",
		back: "4th, 8th, 12th, 16th, and 19th levels.",
		tags: ["rule", "ability", "class"],
	},

	// Extra Attack
	{
		front: "What is Extra Attack (Ranger, 5th level)?",
		back: "Attack twice instead of once whenever you take the Attack action on your turn.",
		tags: ["combat", "ability", "class"],
	},

	// Land's Stride
	{
		front: "What is Land's Stride (Ranger, 8th level)?",
		back: "Moving through nonmagical difficult terrain costs no extra movement. Can pass through nonmagical plants without being slowed or damaged by thorns/spines. Advantage on saving throws against magically created or manipulated plants that impede movement (e.g. entangle).",
		tags: ["ability", "rule", "class"],
	},

	// Hide in Plain Sight
	{
		front: "What is Hide in Plain Sight (Ranger, 10th level)?",
		back: "Spend 1 minute creating natural camouflage (requires mud, dirt, plants, soot, etc.). While pressed against a solid surface at least as tall and wide as you: +10 bonus to Dexterity (Stealth) checks. Benefit ends if you move, take an action, or take a reaction.",
		tags: ["ability", "skill", "class"],
	},

	// Vanish
	{
		front: "What is Vanish (Ranger, 14th level)?",
		back: "Use the Hide action as a bonus action on your turn. Also, you can't be tracked by nonmagical means unless you choose to leave a trail.",
		tags: ["action", "ability", "class"],
	},

	// Feral Senses
	{
		front: "What is Feral Senses (Ranger, 18th level)?",
		back: "Attacking a creature you can't see doesn't impose disadvantage on your attack rolls against it. You also know the location of any invisible creature within 30 feet of you, provided it isn't hidden from you and you aren't blinded or deafened.",
		tags: ["ability", "combat", "class"],
	},

	// Foe Slayer
	{
		front: "What is Foe Slayer (Ranger, 20th level)?",
		back: "Once per turn, add your Wisdom modifier to the attack roll or damage roll of an attack against one of your favored enemies. Choose before or after rolling, but before effects are applied.",
		tags: ["combat", "ability", "class"],
	},

	// Hunter — Hunter's Prey
	{
		front: "What is Hunter's Prey (Hunter, 3rd level)?",
		back: "Choose one: Colossus Slayer (extra 1d8 damage once per turn when target is below max HP), Giant Killer (reaction to attack a Large+ creature within 5 ft. when it hits or misses you), or Horde Breaker (once per turn, make an additional attack against a different creature within 5 ft. of the original target and in weapon range).",
		tags: ["combat", "ability", "class"],
	},

	// Hunter — Defensive Tactics
	{
		front: "What is Defensive Tactics (Hunter, 7th level)?",
		back: "Choose one: Escape the Horde (opportunity attacks against you made with disadvantage), Multiattack Defense (+4 AC against all subsequent attacks from a creature that just hit you, until end of that creature's turn), or Steel Will (advantage on saves against being frightened).",
		tags: ["combat", "ability", "class"],
	},

	// Hunter — Multiattack
	{
		front: "What is Hunter Multiattack (Hunter, 11th level)?",
		back: "Choose one: Volley (action: make a ranged attack against any number of creatures within 10 ft. of a point you can see, separate attack roll per target, must have ammo for each), or Whirlwind Attack (action: make a melee attack against any number of creatures within 5 ft. of you, separate attack roll per target).",
		tags: ["combat", "action", "class"],
	},

	// Hunter — Superior Hunter's Defense
	{
		front: "What is Superior Hunter's Defense (Hunter, 15th level)?",
		back: "Choose one: Evasion (no damage on successful Dex save for half damage, half on failure), Stand Against the Tide (reaction: when a hostile creature misses you with melee attack, force it to repeat the attack against another creature of your choice), or Uncanny Dodge (reaction: halve the damage of an attack from an attacker you can see).",
		tags: ["combat", "action", "class"],
	},
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: "Ranger",
			description: "SRD 5.1 Ranger class features and Hunter archetype.",
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
