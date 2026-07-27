const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Core stats
	{
		front: "What hit die does the Sorcerer use?",
		back: "1d6. HP at 1st level: 6 + Con modifier. Higher levels: 1d6 (or 4) + Con modifier per level after 1st.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What armor and weapons is the Sorcerer proficient with?",
		back: "No armor. Weapons: daggers, darts, slings, quarterstaffs, light crossbows.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What saving throws is the Sorcerer proficient in?",
		back: "Constitution and Charisma.",
		tags: ["rule", "ability", "class"],
	},
	{
		front: "What skills can a Sorcerer choose from at character creation?",
		back: "Choose 2 from: Arcana, Deception, Insight, Intimidation, Persuasion, Religion.",
		tags: ["rule", "skill", "class"],
	},

	// Spellcasting
	{
		front: "What is the Sorcerer's spellcasting ability?",
		back: "Charisma. Spell save DC = 8 + proficiency bonus + Cha modifier. Spell attack modifier = proficiency bonus + Cha modifier.",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "How many cantrips does a Sorcerer start with?",
		back: "4 cantrips at 1st level; up to 6 by 10th level.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "How many spells does a Sorcerer know, and how are they chosen?",
		back: "2 known spells at 1st level; up to 15 at 20th level. Must be of a level for which you have slots. Each level gained, you can replace one known spell with another from the sorcerer list.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What can a Sorcerer use as a spellcasting focus?",
		back: "An arcane focus.",
		tags: ["spell", "rule", "class"],
	},

	// Sorcerous Origin
	{
		front: "What is Sorcerous Origin (Sorcerer, 1st level)?",
		back: "Choose the source of your innate magic (e.g. Draconic Bloodline). Grants features at 1st, 6th, 14th, and 18th levels.",
		tags: ["rule", "lore", "class"],
	},

	// Font of Magic
	{
		front: "What is Font of Magic (Sorcerer, 2nd level)?",
		back: "You gain sorcery points equal to your sorcerer level (2 at 2nd, up to 20 at 20th). Regained on a long rest. Used for Flexible Casting and Metamagic.",
		tags: ["ability", "rule", "class"],
	},
	{
		front: "What is Flexible Casting?",
		back: "Bonus action: convert sorcery points into a spell slot (1st=2pts, 2nd=3pts, 3rd=5pts, 4th=6pts, 5th=7pts; max 5th level; slot vanishes on long rest). OR bonus action: expend a spell slot to gain sorcery points equal to the slot's level.",
		tags: ["action", "ability", "class"],
	},

	// Metamagic
	{
		front: "What is Metamagic (Sorcerer, 3rd level)?",
		back: "Gain two Metamagic options of your choice; gain one more at 10th and 17th level. Can use only one option when casting a spell unless noted (Empowered Spell is the exception).",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "What does Careful Spell (Metamagic) do?",
		back: "When casting a spell that forces saving throws, spend 1 sorcery point to choose up to your Cha modifier creatures (min 1) — they automatically succeed on the save.",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "What does Distant Spell (Metamagic) do?",
		back: "Spend 1 sorcery point: double the range of a spell with range 5 ft. or greater. If range is touch, make it 30 ft.",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "What does Empowered Spell (Metamagic) do?",
		back: "When rolling damage for a spell, spend 1 sorcery point to reroll up to your Cha modifier damage dice (min 1); must use new rolls. Can be used alongside another Metamagic option.",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "What does Extended Spell (Metamagic) do?",
		back: "Spend 1 sorcery point: double the duration of a spell with duration 1 minute or longer (maximum 24 hours).",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "What does Heightened Spell (Metamagic) do?",
		back: "Spend 3 sorcery points: give one target of a spell that requires a saving throw disadvantage on its first save against that spell.",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "What does Quickened Spell (Metamagic) do?",
		back: "Spend 2 sorcery points: change the casting time of a 1-action spell to 1 bonus action for this casting.",
		tags: ["spell", "action", "class"],
	},
	{
		front: "What does Subtle Spell (Metamagic) do?",
		back: "Spend 1 sorcery point: cast the spell without any somatic or verbal components.",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "What does Twinned Spell (Metamagic) do?",
		back: "When casting a spell that targets only one creature and doesn't have a range of self, spend sorcery points equal to the spell's level (1 point for cantrips) to target a second creature in range with the same spell. The spell must be incapable of targeting more than one creature at its current level.",
		tags: ["spell", "ability", "class"],
	},

	// ASI
	{
		front: "At what levels does the Sorcerer gain Ability Score Improvement?",
		back: "4th, 8th, 12th, 16th, and 19th levels.",
		tags: ["rule", "ability", "class"],
	},

	// Sorcerous Restoration
	{
		front: "What is Sorcerous Restoration (Sorcerer, 20th level)?",
		back: "Regain 4 expended sorcery points whenever you finish a short rest.",
		tags: ["ability", "rule", "class"],
	},

	// Draconic Bloodline
	{
		front: "What is Dragon Ancestor (Draconic Bloodline, 1st level)?",
		back: "Choose one dragon type. Associated damage types: Black=Acid, Blue=Lightning, Brass=Fire, Bronze=Lightning, Copper=Acid, Gold=Fire, Green=Poison, Red=Fire, Silver=Cold, White=Cold. You can speak, read, and write Draconic. Double proficiency bonus on Cha checks when interacting with dragons.",
		tags: ["lore", "ability", "class"],
	},
	{
		front: "What is Draconic Resilience (Draconic Bloodline, 1st level)?",
		back: "Your HP maximum increases by 1 per sorcerer level. When not wearing armor, AC = 13 + Dexterity modifier.",
		tags: ["combat", "ability", "class"],
	},
	{
		front: "What is Elemental Affinity (Draconic Bloodline, 6th level)?",
		back: "When you cast a spell dealing your draconic ancestry damage type, add your Cha modifier to one damage roll. You can also spend 1 sorcery point to gain resistance to that damage type for 1 hour.",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "What is Dragon Wings (Draconic Bloodline, 14th level)?",
		back: "Bonus action: sprout dragon wings, gaining flying speed equal to your current speed. Dismiss as a bonus action. Can't manifest while wearing non-accommodating armor.",
		tags: ["action", "ability", "class"],
	},
	{
		front: "What is Draconic Presence (Draconic Bloodline, 18th level)?",
		back: "Action, spend 5 sorcery points: exude an aura of awe or fear (your choice) to 60 feet for 1 minute (concentration). Hostile creatures starting their turn in the aura make a Wisdom save or are charmed (awe) or frightened (fear) until the aura ends. Success immunizes them to this aura for 24 hours.",
		tags: ["action", "ability", "class"],
	},
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: "Sorcerer",
			description: "SRD 5.1 Sorcerer class features and Draconic Bloodline origin.",
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
