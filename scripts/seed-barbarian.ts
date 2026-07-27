const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Core stats
	{
		front: "What hit die does the Barbarian use?",
		back: "1d12. HP at 1st level: 12 + Con modifier. Higher levels: 1d12 (or 7) + Con modifier per level after 1st.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What armor and weapons is the Barbarian proficient with?",
		back: "Light armor, medium armor, shields; simple weapons and martial weapons.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What saving throws is the Barbarian proficient in?",
		back: "Strength and Constitution.",
		tags: ["rule", "ability", "class"],
	},
	{
		front: "What skills can a Barbarian choose from at character creation?",
		back: "Choose 2 from: Animal Handling, Athletics, Intimidation, Nature, Perception, Survival.",
		tags: ["rule", "skill", "class"],
	},

	// Rage
	{
		front: "How do you enter Rage?",
		back: "Bonus action on your turn.",
		tags: ["combat", "action", "class"],
	},
	{
		front: "What three benefits does Rage provide (while not wearing heavy armor)?",
		back: "1) Advantage on Strength checks and saving throws. 2) Bonus damage on melee Strength attacks. 3) Resistance to bludgeoning, piercing, and slashing damage.",
		tags: ["combat", "ability", "class"],
	},
	{
		front: "Can a Barbarian cast or concentrate on spells while raging?",
		back: "No.",
		tags: ["combat", "rule", "class"],
	},
	{
		front: "How long does Rage last, and when does it end early?",
		back: "1 minute. Ends early if knocked unconscious, or if your turn ends without attacking a hostile creature or taking damage since your last turn. You can also end it voluntarily as a bonus action.",
		tags: ["combat", "rule", "class"],
	},
	{
		front: "How many times can a Barbarian rage per long rest, by level range?",
		back: "Levels 1–2: 2. Levels 3–5: 3. Levels 6–11: 4. Levels 12–16: 5. Levels 17–19: 6. Level 20: unlimited.",
		tags: ["combat", "rule", "class"],
	},
	{
		front: "What is the Barbarian's Rage Damage bonus by level range?",
		back: "+2 at levels 1–8. +3 at levels 9–15. +4 at levels 16–20.",
		tags: ["combat", "ability", "class"],
	},

	// Level 1 features
	{
		front: "What is Unarmored Defense (Barbarian)?",
		back: "While wearing no armor: AC = 10 + Dex modifier + Con modifier. You can use a shield and still gain this benefit.",
		tags: ["combat", "rule", "class"],
	},

	// Level 2
	{
		front: "What is Reckless Attack (Barbarian, 2nd level)?",
		back: "On your first attack of the turn, you can attack recklessly: advantage on melee Strength attack rolls this turn, but attack rolls against you have advantage until your next turn.",
		tags: ["combat", "action", "class"],
	},
	{
		front: "What is Danger Sense (Barbarian, 2nd level)?",
		back: "Advantage on Dexterity saving throws against effects you can see (e.g. traps, spells). Doesn't apply if you are blinded, deafened, or incapacitated.",
		tags: ["combat", "ability", "class"],
	},

	// Level 3
	{
		front: "What is Primal Path (Barbarian, 3rd level)?",
		back: "Choose Path of the Berserker or Path of the Totem Warrior. Grants features at 3rd, 6th, 10th, and 14th levels.",
		tags: ["rule", "lore", "class"],
	},

	// Level 4/8/12/16/19
	{
		front: "At what levels does the Barbarian gain Ability Score Improvement?",
		back: "4th, 8th, 12th, 16th, and 19th levels.",
		tags: ["rule", "ability", "class"],
	},

	// Level 5
	{
		front: "What is Extra Attack (Barbarian, 5th level)?",
		back: "Attack twice instead of once whenever you take the Attack action on your turn.",
		tags: ["combat", "action", "class"],
	},
	{
		front: "What is Fast Movement (Barbarian, 5th level)?",
		back: "Speed increases by 10 feet while not wearing heavy armor.",
		tags: ["combat", "rule", "class"],
	},

	// Level 7
	{
		front: "What is Feral Instinct (Barbarian, 7th level)?",
		back: "Advantage on initiative rolls. If surprised at the start of combat and not incapacitated, you can act normally on your first turn — but only if you enter rage before doing anything else.",
		tags: ["combat", "ability", "class"],
	},

	// Level 9/13/17
	{
		front: "What is Brutal Critical (Barbarian), and how does it scale?",
		back: "9th level: roll 1 additional weapon damage die on a critical hit with a melee attack. 2 additional dice at 13th level. 3 additional dice at 17th level.",
		tags: ["combat", "ability", "class"],
	},

	// Level 11
	{
		front: "What is Relentless Rage (Barbarian, 11th level)?",
		back: "If you drop to 0 HP while raging and don't die outright, make a DC 10 Con save to drop to 1 HP instead. DC increases by 5 each subsequent use; resets to 10 on a short or long rest.",
		tags: ["combat", "ability", "class"],
	},

	// Level 15
	{
		front: "What is Persistent Rage (Barbarian, 15th level)?",
		back: "Rage ends early only if you fall unconscious or choose to end it — no longer ends for inactivity.",
		tags: ["combat", "ability", "class"],
	},

	// Level 18
	{
		front: "What is Indomitable Might (Barbarian, 18th level)?",
		back: "If your total for a Strength check is less than your Strength score, you can use your Strength score in place of the total.",
		tags: ["ability", "rule", "class"],
	},

	// Level 20
	{
		front: "What is Primal Champion (Barbarian, 20th level)?",
		back: "Strength and Constitution each increase by 4. The maximum for those scores is now 24.",
		tags: ["ability", "rule", "class"],
	},

	// Path of the Berserker
	{
		front: "What is Frenzy (Path of the Berserker, 3rd level)?",
		back: "When you rage, you can frenzy: make one melee weapon attack as a bonus action on each of your turns after the first. When rage ends, you suffer one level of exhaustion.",
		tags: ["combat", "action", "class"],
	},
	{
		front: "What is Mindless Rage (Path of the Berserker, 6th level)?",
		back: "You can't be charmed or frightened while raging. If you are charmed or frightened when you enter rage, that effect is suspended for the rage's duration.",
		tags: ["combat", "condition", "class"],
	},
	{
		front: "What is Intimidating Presence (Path of the Berserker, 10th level)?",
		back: "Action: one creature within 30 feet must succeed on a Wisdom save (DC 8 + proficiency bonus + Cha modifier) or be frightened until end of your next turn. Effect ends if creature is out of line of sight or 60+ feet away. On a success, can't use against that creature for 24 hours.",
		tags: ["combat", "action", "class"],
	},
	{
		front: "What is Retaliation (Path of the Berserker, 14th level)?",
		back: "When you take damage from a creature within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.",
		tags: ["combat", "action", "class"],
	},
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: "Barbarian",
			description: "SRD 5.1 Barbarian class features and Path of the Berserker.",
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
