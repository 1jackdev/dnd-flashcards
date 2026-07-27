const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Core stats
	{ front: "What hit die does the Rogue use?", back: "1d8. HP at 1st level: 8 + Con modifier. Higher levels: 1d8 (or 5) + Con modifier per level after 1st.", tags: ["rule", "combat", "class"] },
	{ front: "What armor and weapons is the Rogue proficient with?", back: "Light armor; simple weapons, hand crossbows, longswords, rapiers, shortswords.", tags: ["rule", "combat", "class"] },
	{ front: "What saving throws is the Rogue proficient in?", back: "Dexterity and Intelligence.", tags: ["rule", "ability", "class"] },
	{ front: "What tools is the Rogue proficient with?", back: "Thieves' tools.", tags: ["rule", "skill", "class"] },
	{ front: "How many skills can a Rogue choose at character creation?", back: "Four from: Acrobatics, Athletics, Deception, Insight, Intimidation, Investigation, Perception, Performance, Persuasion, Sleight of Hand, Stealth.", tags: ["rule", "skill", "class"] },

	// Expertise
	{ front: "What is Expertise (Rogue, 1st level)?", back: "Choose two skill proficiencies or one skill proficiency and thieves' tools proficiency — your proficiency bonus is doubled for ability checks using those. Choose two more at 6th level.", tags: ["skill", "ability", "class"] },

	// Sneak Attack
	{ front: "What is Sneak Attack (Rogue, 1st level)?", back: "Once per turn, deal extra damage to one creature you hit if you have advantage on the attack roll. Attack must use a finesse or ranged weapon. You don't need advantage if an unincapacitated enemy of the target is within 5 ft. of it and you don't have disadvantage.", tags: ["combat", "ability", "class"] },
	{ front: "How does Sneak Attack damage scale?", back: "1d6 at levels 1–2. 2d6 at 3–4. 3d6 at 5–6. 4d6 at 7–8. 5d6 at 9–10. 6d6 at 11–12. 7d6 at 13–14. 8d6 at 15–16. 9d6 at 17–18. 10d6 at 19–20.", tags: ["combat", "ability", "class"] },

	// Thieves' Cant
	{ front: "What is Thieves' Cant (Rogue, 1st level)?", back: "A secret mix of dialect, jargon, and code that hides messages in normal conversation. Only other Thieves' Cant speakers understand the messages (takes 4× longer to convey). You also know a set of secret signs and symbols (dangerous areas, guild territory, loot nearby, safe houses, easy marks).", tags: ["lore", "skill", "class"] },

	// Cunning Action
	{ front: "What is Cunning Action (Rogue, 2nd level)?", back: "On each of your turns in combat, use a bonus action to take the Dash, Disengage, or Hide action.", tags: ["action", "combat", "class"] },

	// Roguish Archetype
	{ front: "What is Roguish Archetype (Rogue, 3rd level)?", back: "Choose an archetype (e.g. Thief). Grants features at 3rd, 9th, 13th, and 17th levels.", tags: ["rule", "lore", "class"] },

	// ASI
	{ front: "At what levels does the Rogue gain Ability Score Improvement?", back: "4th, 8th, 10th, 12th, 16th, and 19th levels.", tags: ["rule", "ability", "class"] },

	// Uncanny Dodge
	{ front: "What is Uncanny Dodge (Rogue, 5th level)?", back: "When an attacker you can see hits you with an attack, use your reaction to halve the attack's damage against you.", tags: ["combat", "action", "class"] },

	// Evasion
	{ front: "What is Evasion (Rogue, 7th level)?", back: "When subjected to an effect requiring a Dexterity saving throw for half damage: take no damage on a success, half damage on a failure.", tags: ["combat", "ability", "class"] },

	// Reliable Talent
	{ front: "What is Reliable Talent (Rogue, 11th level)?", back: "When you make an ability check that lets you add your proficiency bonus, treat a d20 roll of 9 or lower as a 10.", tags: ["skill", "ability", "class"] },

	// Blindsense
	{ front: "What is Blindsense (Rogue, 14th level)?", back: "If you can hear, you know the location of any hidden or invisible creature within 10 feet of you.", tags: ["ability", "combat", "class"] },

	// Slippery Mind
	{ front: "What is Slippery Mind (Rogue, 15th level)?", back: "You gain proficiency in Wisdom saving throws.", tags: ["ability", "rule", "class"] },

	// Elusive
	{ front: "What is Elusive (Rogue, 18th level)?", back: "No attack roll has advantage against you while you aren't incapacitated.", tags: ["combat", "ability", "class"] },

	// Stroke of Luck
	{ front: "What is Stroke of Luck (Rogue, 20th level)?", back: "If your attack misses a target within range, turn the miss into a hit. Or if you fail an ability check, treat the d20 roll as a 20. Recharges on a short or long rest.", tags: ["ability", "combat", "class"] },

	// Thief archetype
	{ front: "What is Fast Hands (Thief, 3rd level)?", back: "Use the bonus action from Cunning Action to make a Dexterity (Sleight of Hand) check, use thieves' tools to disarm a trap or open a lock, or take the Use an Object action.", tags: ["action", "skill", "class"] },
	{ front: "What is Second-Story Work (Thief, 3rd level)?", back: "Climbing no longer costs extra movement. When you make a running jump, the distance covered increases by a number of feet equal to your Dexterity modifier.", tags: ["ability", "skill", "class"] },
	{ front: "What is Supreme Sneak (Thief, 9th level)?", back: "You have advantage on Dexterity (Stealth) checks if you move no more than half your speed on the same turn.", tags: ["skill", "ability", "class"] },
	{ front: "What is Use Magic Device (Thief, 13th level)?", back: "You ignore all class, race, and level requirements on the use of magic items.", tags: ["ability", "item", "class"] },
	{ front: "What is Thief's Reflexes (Thief, 17th level)?", back: "In the first round of any combat, take two turns: one at your normal initiative and one at your initiative minus 10. Can't be used when surprised.", tags: ["combat", "ability", "class"] },
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: "Rogue", description: "SRD 5.1 Rogue class features and Thief archetype." }),
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
