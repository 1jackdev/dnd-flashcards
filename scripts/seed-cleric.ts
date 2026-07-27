const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Core stats
	{
		front: "What hit die does the Cleric use?",
		back: "1d8. HP at 1st level: 8 + Con modifier. Higher levels: 1d8 (or 5) + Con modifier per level after 1st.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What armor and weapons is the Cleric proficient with?",
		back: "Light armor, medium armor, shields; simple weapons.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What saving throws is the Cleric proficient in?",
		back: "Wisdom and Charisma.",
		tags: ["rule", "ability", "class"],
	},
	{
		front: "What skills can a Cleric choose from at character creation?",
		back: "Choose 2 from: History, Insight, Medicine, Persuasion, Religion.",
		tags: ["rule", "skill", "class"],
	},

	// Spellcasting
	{
		front: "What is the Cleric's spellcasting ability?",
		back: "Wisdom. Spell save DC = 8 + proficiency bonus + Wis modifier. Spell attack modifier = proficiency bonus + Wis modifier.",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "How many cantrips does a Cleric start with?",
		back: "3 cantrips at 1st level; up to 5 by 10th level.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "How does the Cleric prepare spells?",
		back: "After a long rest, choose a number of cleric spells equal to Wisdom modifier + cleric level (minimum 1). Must be of a level for which you have spell slots. Can change the list on each long rest (1 minute of prayer per spell level per spell).",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "How does the Cleric regain spell slots?",
		back: "All expended spell slots are regained on a long rest.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What is Ritual Casting (Cleric)?",
		back: "You can cast a cleric spell as a ritual if it has the ritual tag and you have it prepared.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What can a Cleric use as a spellcasting focus?",
		back: "A holy symbol.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What are Domain Spells (Cleric)?",
		back: "Each Divine Domain grants a spell list. You always have these spells prepared and they don't count against your daily preparation limit. Even if a domain spell isn't on the cleric list, it counts as a cleric spell for you.",
		tags: ["spell", "rule", "class"],
	},

	// Divine Domain
	{
		front: "What is Divine Domain (Cleric, 1st level)?",
		back: "Choose a domain related to your deity. Grants domain spells and features at 1st level, plus additional Channel Divinity uses at 2nd, and features at 6th, 8th, and 17th levels.",
		tags: ["rule", "lore", "class"],
	},

	// Channel Divinity
	{
		front: "What is Channel Divinity (Cleric, 2nd level)?",
		back: "Channel divine energy to fuel magical effects. Starts with Turn Undead plus one domain effect. Uses per rest: 1 (levels 2–5), 2 (levels 6–17), 3 (level 18+). Recharges on short or long rest.",
		tags: ["action", "ability", "class"],
	},
	{
		front: "How does Channel Divinity: Turn Undead work?",
		back: "Action: present holy symbol. Each undead within 30 feet that can see or hear you makes a Wisdom save or is turned for 1 minute (or until it takes damage). A turned creature must flee, can't willingly move within 30 feet of you, can't take reactions, and can only Dash or escape effects that restrain it.",
		tags: ["action", "combat", "class"],
	},

	// ASI
	{
		front: "At what levels does the Cleric gain Ability Score Improvement?",
		back: "4th, 8th, 12th, 16th, and 19th levels.",
		tags: ["rule", "ability", "class"],
	},

	// Destroy Undead
	{
		front: "What is Destroy Undead, and how does the CR threshold scale?",
		back: "From 5th level: undead that fail Turn Undead are instantly destroyed if their CR is at or below the threshold. CR 1/2 (5th), CR 1 (8th), CR 2 (11th), CR 3 (14th), CR 4 (17th).",
		tags: ["combat", "ability", "class"],
	},

	// Divine Intervention
	{
		front: "What is Divine Intervention (Cleric, 10th level)?",
		back: "Action: describe aid sought and roll percentile dice. If roll ≤ cleric level, deity intervenes (GM chooses effect). On success, can't use again for 7 days. On failure, recharges after a long rest. At 20th level, succeeds automatically.",
		tags: ["action", "ability", "class"],
	},

	// Life Domain
	{
		front: "What are the Life Domain spells?",
		back: "1st: bless, cure wounds. 3rd: lesser restoration, spiritual weapon. 5th: beacon of hope, revivify. 7th: death ward, guardian of faith. 9th: mass cure wounds, raise dead.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What bonus proficiency does the Life Domain grant?",
		back: "Proficiency with heavy armor.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What is Disciple of Life (Life Domain, 1st level)?",
		back: "When you use a spell of 1st level or higher to restore hit points, the creature regains additional HP equal to 2 + the spell's level.",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "What is Channel Divinity: Preserve Life (Life Domain, 2nd level)?",
		back: "Action: restore HP equal to 5 × your cleric level, divided among any creatures within 30 feet. Cannot restore a creature above half its HP maximum. Can't target undead or constructs.",
		tags: ["action", "ability", "class"],
	},
	{
		front: "What is Blessed Healer (Life Domain, 6th level)?",
		back: "When you cast a spell of 1st level or higher that restores HP to a creature other than yourself, you also regain HP equal to 2 + the spell's level.",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "What is Divine Strike (Life Domain, 8th level)?",
		back: "Once per turn when you hit a creature with a weapon attack, deal an extra 1d8 radiant damage. Increases to 2d8 at 14th level.",
		tags: ["combat", "ability", "class"],
	},
	{
		front: "What is Supreme Healing (Life Domain, 17th level)?",
		back: "When you would roll dice to restore HP with a spell, you instead use the highest number possible for each die (e.g. 2d6 becomes 12).",
		tags: ["spell", "ability", "class"],
	},
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: "Cleric",
			description: "SRD 5.1 Cleric class features and Life Domain.",
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
