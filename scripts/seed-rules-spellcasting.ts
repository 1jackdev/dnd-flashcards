const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Spell basics
	{ front: "What are spell levels, and how do they relate to character level?", back: "Spells range from level 0 (cantrips) to 9. A spell's level indicates its power. Character level and spell level don't correspond directly — e.g. a 17th-level character is typically needed to cast a 9th-level spell.", tags: ["spell", "rule"] },
	{ front: "What is the difference between known and prepared spells?", back: "Some classes (bards, sorcerers) have a fixed list of known spells always available. Others (clerics, wizards) prepare spells each day from a larger list or spellbook. In both cases, the number available is limited by level.", tags: ["spell", "rule"] },
	{ front: "What are spell slots?", back: "A limited resource consumed when casting spells. Each spell requires a slot of the spell's level or higher. All expended slots are restored on a long rest (except Warlock's Pact Magic, which restores on short or long rest).", tags: ["spell", "rule"] },
	{ front: "What happens when you cast a spell at a higher level?", back: "The spell assumes the higher level for that casting. Many spells have enhanced effects when upcast, as described in the spell's entry.", tags: ["spell", "rule"] },
	{ front: "What is a cantrip?", back: "A level 0 spell that can be cast at will, without expending a spell slot and without preparation. Practice has fixed it permanently in the caster's mind.", tags: ["spell", "rule"] },
	{ front: "What is a ritual spell?", back: "A spell with the ritual tag that can be cast without expending a spell slot by adding 10 minutes to the casting time. Can't be cast at a higher level this way. Requires a class feature granting ritual casting. Most classes require the spell to be prepared or known; wizards can cast any ritual from their spellbook without having it prepared.", tags: ["spell", "rule"] },
	{ front: "Can you cast spells while wearing armor?", back: "Only if you are proficient with that armor. If not, you are too distracted and physically hampered to cast.", tags: ["spell", "rule", "combat"] },

	// Casting a spell
	{ front: "What are the three types of spell components?", back: "Verbal (V): specific chanting — blocked by silence or being gagged. Somatic (S): precise gestures — requires at least one free hand. Material (M): specific objects — can be replaced by a component pouch or spellcasting focus, unless the component has a cost or is consumed by the spell.", tags: ["spell", "rule"] },
	{ front: "What are the spell casting time options?", back: "1 action (most spells). Bonus action (especially swift spells — if used, you can only cast a cantrip with a 1-action casting time that turn, not another full spell). Reaction (instant response; spell description specifies exact trigger). Longer (minutes or hours — must use action each turn and maintain concentration; if broken, spell fails but slot isn't expended).", tags: ["spell", "rule", "action"] },
	{ front: "What is the rule when casting a bonus action spell?", back: "If you cast a spell as a bonus action, you can't cast another spell on the same turn EXCEPT a cantrip with a casting time of 1 action.", tags: ["spell", "rule"] },
	{ front: "What are the spell duration types?", back: "Instantaneous: effect happens immediately and can't be dispelled. Fixed duration (rounds/minutes/hours/years): lasts that long. Concentration: lasts as long as you concentrate (up to the spell's max). Until dispelled.", tags: ["spell", "rule"] },

	// Concentration
	{ front: "What breaks Concentration?", back: "1. Casting another concentration spell (you can only concentrate on one at a time). 2. Taking damage: Con saving throw, DC = max(10, half damage taken) per damage source. 3. Being incapacitated or killed. 4. GM may call for DC 10 Con save for severe environmental events.", tags: ["spell", "rule"] },
	{ front: "Can you end concentration voluntarily?", back: "Yes. At any time, no action required.", tags: ["spell", "rule"] },

	// Targets and areas of effect
	{ front: "What are the five area of effect shapes?", back: "Cone (width = distance from origin at each point), Cube (origin on a face; not included in area), Cylinder (circular base + height; origin included), Line (straight path from origin; not included in area), Sphere (extends outward from origin; origin included).", tags: ["spell", "rule"] },
	{ front: "What are the rules for spell targeting and cover?", back: "Target must have a clear path to you (can't be behind total cover). If area of effect is placed where you can't see and a wall blocks the path, the origin appears on the near side of the wall. You can target yourself with spells that target a creature of your choice (unless the spell says otherwise).", tags: ["spell", "rule"] },
	{ front: "What is the spell save DC formula?", back: "8 + spellcasting ability modifier + proficiency bonus + any special modifiers.", tags: ["spell", "rule"] },
	{ front: "What is the spell attack bonus formula?", back: "Spellcasting ability modifier + proficiency bonus. Ranged spell attacks have disadvantage if you are within 5 ft of a hostile creature that can see you and isn't incapacitated.", tags: ["spell", "rule", "combat"] },

	// Schools of magic
	{ front: "What are the eight schools of magic?", back: "Abjuration (protection, barriers, banishment), Conjuration (transportation, summoning, creation from nothing), Divination (revealing information, secrets, glimpses of future), Enchantment (affecting minds, controlling behavior), Evocation (manipulating energy — fire, lightning, healing), Illusion (deceiving senses or minds), Necromancy (life and death energy, undead, resurrection), Transmutation (changing properties of creatures, objects, or environments).", tags: ["spell", "lore"] },

	// Combining magical effects
	{ front: "How do multiple spell effects stack?", back: "Effects of different spells add together while their durations overlap. Effects of the same spell cast multiple times don't combine — only the most potent effect (e.g. highest bonus) applies.", tags: ["spell", "rule"] },
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: "Spellcasting Rules", description: "SRD 5.1 spellcasting rules: spell levels, slots, components, casting times, concentration, areas of effect, and schools of magic." }),
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
