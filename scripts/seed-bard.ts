const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Core stats
	{ front: "What hit die does the Bard use?", back: "1d8. HP at 1st level: 8 + Con modifier. Higher levels: 1d8 (or 5) + Con modifier per level after 1st.", tags: ["rule", "combat", "class"] },
	{ front: "What armor and weapons is the Bard proficient with?", back: "Light armor; simple weapons, hand crossbows, longswords, rapiers, shortswords.", tags: ["rule", "combat", "class"] },
	{ front: "What saving throws is the Bard proficient in?", back: "Dexterity and Charisma.", tags: ["rule", "ability", "class"] },
	{ front: "How many skills can a Bard choose at character creation?", back: "Any three skills.", tags: ["rule", "skill", "class"] },
	{ front: "What tools is the Bard proficient with?", back: "Three musical instruments of your choice.", tags: ["rule", "skill", "class"] },

	// Spellcasting
	{ front: "What is the Bard's spellcasting ability?", back: "Charisma. Spell save DC = 8 + proficiency bonus + Cha modifier. Spell attack modifier = proficiency bonus + Cha modifier.", tags: ["spell", "ability", "class"] },
	{ front: "How many cantrips does a Bard start with, and how many total at 20th level?", back: "2 cantrips at 1st level; 4 cantrips by 10th level (stays at 4).", tags: ["spell", "rule", "class"] },
	{ front: "How does the Bard regain spell slots?", back: "All expended spell slots are regained on a long rest.", tags: ["spell", "rule", "class"] },
	{ front: "Can a Bard replace spells they know?", back: "Yes. Each time you gain a level in this class, you can replace one known bard spell with another from the bard spell list of a level you can cast.", tags: ["spell", "rule", "class"] },
	{ front: "What is Ritual Casting (Bard)?", back: "You can cast any bard spell you know as a ritual if that spell has the ritual tag.", tags: ["spell", "rule", "class"] },
	{ front: "What can a Bard use as a spellcasting focus?", back: "A musical instrument.", tags: ["spell", "rule", "class"] },

	// Bardic Inspiration
	{ front: "How do you grant Bardic Inspiration?", back: "Bonus action: choose one creature other than yourself within 60 feet who can hear you. They gain a Bardic Inspiration die.", tags: ["action", "ability", "class"] },
	{ front: "How does a creature use a Bardic Inspiration die?", back: "Within 10 minutes, roll the die and add it to one ability check, attack roll, or saving throw. Can decide after rolling the d20 but before the GM declares success or failure. Die is lost once rolled.", tags: ["rule", "ability", "class"] },
	{ front: "How many times per rest can the Bard use Bardic Inspiration, and when does it recharge?", back: "A number of times equal to your Charisma modifier (minimum 1). Recharges on a long rest. From 5th level (Font of Inspiration), recharges on a short or long rest.", tags: ["rule", "ability", "class"] },
	{ front: "How does the Bardic Inspiration die scale?", back: "d6 at levels 1–4. d8 at 5th level. d10 at 10th level. d12 at 15th level.", tags: ["rule", "ability", "class"] },

	// Level 2
	{ front: "What is Jack of All Trades (Bard, 2nd level)?", back: "Add half your proficiency bonus (rounded down) to any ability check that doesn't already include your proficiency bonus.", tags: ["skill", "ability", "class"] },
	{ front: "What is Song of Rest (Bard, 2nd level)?", back: "During a short rest, friendly creatures who can hear your performance and spend Hit Dice to regain HP also regain extra HP. Starts at 1d6; scales to 1d8 (9th), 1d10 (13th), 1d12 (17th).", tags: ["ability", "rule", "class"] },

	// Level 3
	{ front: "What is Bard College (3rd level)?", back: "Choose a Bard College (e.g. College of Lore). Grants features at 3rd, 6th, and 14th levels.", tags: ["rule", "lore", "class"] },
	{ front: "What is Expertise (Bard, 3rd level)?", back: "Choose two skill proficiencies — your proficiency bonus is doubled for ability checks using those skills. Choose two more at 10th level.", tags: ["skill", "ability", "class"] },

	// Level 4/8/12/16/19
	{ front: "At what levels does the Bard gain Ability Score Improvement?", back: "4th, 8th, 12th, 16th, and 19th levels.", tags: ["rule", "ability", "class"] },

	// Level 5
	{ front: "What is Font of Inspiration (Bard, 5th level)?", back: "You regain all expended uses of Bardic Inspiration when you finish a short or long rest (instead of only long rest).", tags: ["rule", "ability", "class"] },

	// Level 6
	{ front: "What is Countercharm (Bard, 6th level)?", back: "Action: start a performance lasting until end of your next turn. You and friendly creatures within 30 feet who can hear you have advantage on saving throws against being frightened or charmed. Ends early if you are incapacitated, silenced, or choose to end it.", tags: ["action", "ability", "class"] },

	// Level 10/14/18
	{ front: "What is Magical Secrets (Bard)?", back: "Choose two spells from any class that you can cast (any level or cantrip). They count as bard spells. Gained at 10th, 14th, and 18th levels (2 spells each time).", tags: ["spell", "rule", "class"] },

	// Level 20
	{ front: "What is Superior Inspiration (Bard, 20th level)?", back: "When you roll initiative and have no uses of Bardic Inspiration remaining, you regain one use.", tags: ["rule", "ability", "class"] },

	// College of Lore
	{ front: "What is Bonus Proficiencies (College of Lore, 3rd level)?", back: "Gain proficiency in three skills of your choice.", tags: ["skill", "rule", "class"] },
	{ front: "What is Cutting Words (College of Lore, 3rd level)?", back: "Reaction: when a creature you can see within 60 feet makes an attack roll, ability check, or damage roll, expend a Bardic Inspiration die and subtract the result from that roll. Can be used after the roll but before the GM determines outcome. Immune if the creature can't hear you or is immune to being charmed.", tags: ["action", "combat", "class"] },
	{ front: "What is Additional Magical Secrets (College of Lore, 6th level)?", back: "Learn two spells of your choice from any class (any level you can cast, or cantrip). These don't count against your number of bard spells known.", tags: ["spell", "rule", "class"] },
	{ front: "What is Peerless Skill (College of Lore, 14th level)?", back: "When you make an ability check, you can expend one Bardic Inspiration use, roll the die, and add it to the check. Can decide after rolling but before the GM reveals success or failure.", tags: ["skill", "ability", "class"] },
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: "Bard", description: "SRD 5.1 Bard class features and College of Lore." }),
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
