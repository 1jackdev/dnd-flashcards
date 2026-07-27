const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Core stats
	{
		front: "What hit die does the Fighter use?",
		back: "1d10. HP at 1st level: 10 + Con modifier. Higher levels: 1d10 (or 6) + Con modifier per level after 1st.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What armor and weapons is the Fighter proficient with?",
		back: "All armor and shields; simple weapons and martial weapons.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What saving throws is the Fighter proficient in?",
		back: "Strength and Constitution.",
		tags: ["rule", "ability", "class"],
	},
	{
		front: "What skills can a Fighter choose from at character creation?",
		back: "Choose 2 from: Acrobatics, Animal Handling, Athletics, History, Insight, Intimidation, Perception, Survival.",
		tags: ["rule", "skill", "class"],
	},

	// Fighting Styles
	{
		front: "What does the Archery fighting style do?",
		back: "+2 bonus to attack rolls with ranged weapons.",
		tags: ["combat", "ability", "class"],
	},
	{
		front: "What does the Defense fighting style do?",
		back: "+1 bonus to AC while wearing armor.",
		tags: ["combat", "ability", "class"],
	},
	{
		front: "What does the Dueling fighting style do?",
		back: "+2 bonus to damage rolls when wielding a melee weapon in one hand and no other weapons.",
		tags: ["combat", "ability", "class"],
	},
	{
		front: "What does the Great Weapon Fighting style do?",
		back: "When you roll a 1 or 2 on a damage die for a melee attack with a two-handed or versatile weapon, reroll and use the new result (even if it's a 1 or 2).",
		tags: ["combat", "ability", "class"],
	},
	{
		front: "What does the Protection fighting style do?",
		back: "Reaction: when a creature you can see attacks a target other than you within 5 feet of you, impose disadvantage on the attack roll. Requires a shield.",
		tags: ["combat", "action", "class"],
	},
	{
		front: "What does the Two-Weapon Fighting style do?",
		back: "When engaging in two-weapon fighting, you can add your ability modifier to the damage of the second attack.",
		tags: ["combat", "ability", "class"],
	},
	{
		front: "Can a Fighter take the same Fighting Style more than once?",
		back: "No. Even if you get to choose again later, you can't take the same option twice.",
		tags: ["rule", "combat", "class"],
	},

	// Second Wind
	{
		front: "What is Second Wind (Fighter, 1st level)?",
		back: "Bonus action: regain HP equal to 1d10 + your fighter level. Recharges on a short or long rest.",
		tags: ["combat", "action", "class"],
	},

	// Action Surge
	{
		front: "What is Action Surge (Fighter, 2nd level)?",
		back: "On your turn, take one additional action on top of your regular action and possible bonus action. Recharges on a short or long rest. At 17th level, usable twice per rest, but only once per turn.",
		tags: ["combat", "action", "class"],
	},

	// Martial Archetype
	{
		front: "What is Martial Archetype (Fighter, 3rd level)?",
		back: "Choose an archetype (e.g. Champion). Grants features at 3rd, 7th, 10th, 15th, and 18th levels.",
		tags: ["rule", "lore", "class"],
	},

	// ASI
	{
		front: "At what levels does the Fighter gain Ability Score Improvement?",
		back: "4th, 6th, 8th, 12th, 14th, 16th, and 19th levels — more than any other class.",
		tags: ["rule", "ability", "class"],
	},

	// Extra Attack
	{
		front: "How does Fighter Extra Attack scale?",
		back: "2 attacks at 5th level. 3 attacks at 11th level. 4 attacks at 20th level.",
		tags: ["combat", "ability", "class"],
	},

	// Indomitable
	{
		front: "What is Indomitable (Fighter), and how does it scale?",
		back: "Reroll a failed saving throw, must use the new roll. 1 use per long rest (9th level). 2 uses (13th level). 3 uses (17th level).",
		tags: ["combat", "ability", "class"],
	},

	// Champion
	{
		front: "What is Improved Critical (Champion, 3rd level)?",
		back: "Your weapon attacks score a critical hit on a roll of 19 or 20.",
		tags: ["combat", "ability", "class"],
	},
	{
		front: "What is Remarkable Athlete (Champion, 7th level)?",
		back: "Add half your proficiency bonus (rounded up) to any Strength, Dexterity, or Constitution check that doesn't already use your proficiency bonus. Running long jump distance increases by your Strength modifier in feet.",
		tags: ["skill", "ability", "class"],
	},
	{
		front: "What is Additional Fighting Style (Champion, 10th level)?",
		back: "Choose a second option from the Fighting Style class feature.",
		tags: ["combat", "ability", "class"],
	},
	{
		front: "What is Superior Critical (Champion, 15th level)?",
		back: "Your weapon attacks score a critical hit on a roll of 18, 19, or 20.",
		tags: ["combat", "ability", "class"],
	},
	{
		front: "What is Survivor (Champion, 18th level)?",
		back: "At the start of each of your turns, if you have no more than half your HP remaining (and more than 0 HP), regain HP equal to 5 + your Constitution modifier.",
		tags: ["combat", "ability", "class"],
	},
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: "Fighter",
			description: "SRD 5.1 Fighter class features and Champion archetype.",
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
