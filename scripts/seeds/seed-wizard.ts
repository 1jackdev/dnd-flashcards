const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Core stats
	{
		front: "What hit die does the Wizard use?",
		back: "1d6. HP at 1st level: 6 + Con modifier. Higher levels: 1d6 (or 4) + Con modifier per level after 1st.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What armor and weapons is the Wizard proficient with?",
		back: "No armor. Weapons: daggers, darts, slings, quarterstaffs, light crossbows.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What saving throws is the Wizard proficient in?",
		back: "Intelligence and Wisdom.",
		tags: ["rule", "ability", "class"],
	},
	{
		front: "What skills can a Wizard choose from at character creation?",
		back: "Choose 2 from: Arcana, History, Insight, Investigation, Medicine, Religion.",
		tags: ["rule", "skill", "class"],
	},

	// Spellcasting
	{
		front: "What is the Wizard's spellcasting ability?",
		back: "Intelligence. Spell save DC = 8 + proficiency bonus + Int modifier. Spell attack modifier = proficiency bonus + Int modifier.",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "How many cantrips does a Wizard start with?",
		back: "3 cantrips at 1st level; up to 5 by 10th level.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "How does the Wizard prepare spells?",
		back: "After a long rest, choose a number of spells from your spellbook equal to your Intelligence modifier + wizard level (minimum 1). Must be of a level for which you have spell slots. Changing the list on a long rest takes 1 minute per spell level per spell.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What is the Wizard's Spellbook?",
		back: "Starts with 6 first-level wizard spells of your choice. Gain 2 free wizard spells to add per level gained (must be of a level for which you have slots). Can copy found spells into it (2 hours + 50 gp per spell level). Can also find and copy spells on adventures.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What is Ritual Casting (Wizard)?",
		back: "Can cast a wizard spell as a ritual if it has the ritual tag and is in your spellbook — even if not currently prepared.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What can a Wizard use as a spellcasting focus?",
		back: "An arcane focus.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "How much does copying a spell into a Wizard spellbook cost?",
		back: "2 hours and 50 gp per spell level. Copying your own spellbook (backup): 1 hour and 10 gp per spell level.",
		tags: ["rule", "item", "class"],
	},

	// Arcane Recovery
	{
		front: "What is Arcane Recovery (Wizard, 1st level)?",
		back: "Once per day when you finish a short rest, recover expended spell slots with a combined level ≤ half your wizard level (rounded up). No slot can be 6th level or higher.",
		tags: ["spell", "ability", "class"],
	},

	// Arcane Tradition
	{
		front: "What is Arcane Tradition (Wizard, 2nd level)?",
		back: "Choose a school of magic (e.g. School of Evocation). Grants features at 2nd, 6th, 10th, and 14th levels.",
		tags: ["rule", "lore", "class"],
	},

	// ASI
	{
		front: "At what levels does the Wizard gain Ability Score Improvement?",
		back: "4th, 8th, 12th, 16th, and 19th levels.",
		tags: ["rule", "ability", "class"],
	},

	// Spell Mastery
	{
		front: "What is Spell Mastery (Wizard, 18th level)?",
		back: "Choose one 1st-level and one 2nd-level wizard spell in your spellbook. Cast those spells at their lowest level without expending a spell slot when prepared. Can swap chosen spells by spending 8 hours studying.",
		tags: ["spell", "ability", "class"],
	},

	// Signature Spells
	{
		front: "What is Signature Spells (Wizard, 20th level)?",
		back: "Choose two 3rd-level wizard spells in your spellbook. Always prepared (don't count against limit). Cast each once at 3rd level without expending a spell slot per short or long rest. Higher-level casting still costs a slot.",
		tags: ["spell", "ability", "class"],
	},

	// School of Evocation
	{
		front: "What is Evocation Savant (School of Evocation, 2nd level)?",
		back: "Gold and time to copy an evocation spell into your spellbook is halved (1 hour and 25 gp per spell level).",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What is Sculpt Spells (School of Evocation, 2nd level)?",
		back: "When you cast an evocation spell that affects other creatures you can see, choose a number of them equal to 1 + the spell's level. Chosen creatures automatically succeed on their saving throws and take no damage even if they would normally take half on a success.",
		tags: ["spell", "combat", "class"],
	},
	{
		front: "What is Potent Cantrip (School of Evocation, 6th level)?",
		back: "When a creature succeeds on a saving throw against your cantrip, it takes half the cantrip's damage (if any) but no additional effect.",
		tags: ["spell", "combat", "class"],
	},
	{
		front: "What is Empowered Evocation (School of Evocation, 10th level)?",
		back: "Add your Intelligence modifier to one damage roll of any wizard evocation spell you cast.",
		tags: ["spell", "combat", "class"],
	},
	{
		front: "What is Overchannel (School of Evocation, 14th level)?",
		back: "When you cast a wizard spell of 1st–5th level that deals damage, you can deal maximum damage with it. First use per long rest: no cost. Subsequent uses before a long rest: take 2d12 necrotic damage per spell level (increasing by 1d12 per additional use). This damage ignores resistance and immunity.",
		tags: ["spell", "combat", "class"],
	},
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: "Wizard",
			description: "SRD 5.1 Wizard class features and School of Evocation.",
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
