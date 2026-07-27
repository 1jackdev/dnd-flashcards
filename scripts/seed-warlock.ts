const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Core stats
	{ front: "What hit die does the Warlock use?", back: "1d8. HP at 1st level: 8 + Con modifier. Higher levels: 1d8 (or 5) + Con modifier per level after 1st.", tags: ["rule", "combat", "class"] },
	{ front: "What armor and weapons is the Warlock proficient with?", back: "Light armor; simple weapons.", tags: ["rule", "combat", "class"] },
	{ front: "What saving throws is the Warlock proficient in?", back: "Wisdom and Charisma.", tags: ["rule", "ability", "class"] },
	{ front: "What skills can a Warlock choose from at character creation?", back: "Choose 2 from: Arcana, Deception, History, Intimidation, Investigation, Nature, Religion.", tags: ["rule", "skill", "class"] },

	// Otherworldly Patron
	{ front: "What is Otherworldly Patron (Warlock, 1st level)?", back: "Choose a patron (e.g. The Fiend). Grants features at 1st, 6th, 10th, and 14th levels.", tags: ["rule", "lore", "class"] },

	// Pact Magic
	{ front: "What is Pact Magic, and how does it differ from normal spellcasting?", back: "Warlock spellcasting. All spell slots are the same level. Spell slots: 1 at 1st–2nd, 2 at 2nd–10th, 3 at 11th–16th, 4 at 17th+. Slot level scales from 1st (levels 1–4) up to 5th (levels 9–20). All expended slots regained on a short or long rest.", tags: ["spell", "rule", "class"] },
	{ front: "What is the Warlock's spellcasting ability?", back: "Charisma. Spell save DC = 8 + proficiency bonus + Cha modifier. Spell attack modifier = proficiency bonus + Cha modifier.", tags: ["spell", "ability", "class"] },
	{ front: "How many spells does a Warlock know?", back: "2 at 1st level; up to 15 at 20th level. Must be of a level no higher than your current slot level. Can replace one known spell per level gained.", tags: ["spell", "rule", "class"] },

	// Eldritch Invocations
	{ front: "What are Eldritch Invocations (Warlock, 2nd level)?", back: "Gain 2 invocations at 2nd level; total increases to 8 by 20th level. When you gain a warlock level, you can replace one known invocation with another you qualify for.", tags: ["ability", "rule", "class"] },
	{ front: "What does Agonizing Blast (invocation) do?", back: "Prerequisite: eldritch blast cantrip. Add your Charisma modifier to the damage eldritch blast deals on a hit.", tags: ["spell", "combat", "class"] },
	{ front: "What does Armor of Shadows (invocation) do?", back: "Cast mage armor on yourself at will, without expending a spell slot or material components.", tags: ["spell", "ability", "class"] },
	{ front: "What does Devil's Sight (invocation) do?", back: "See normally in darkness, both magical and nonmagical, to a distance of 120 feet.", tags: ["ability", "combat", "class"] },
	{ front: "What does Eldritch Spear (invocation) do?", back: "Prerequisite: eldritch blast cantrip. The range of eldritch blast becomes 300 feet.", tags: ["spell", "combat", "class"] },
	{ front: "What does Repelling Blast (invocation) do?", back: "Prerequisite: eldritch blast cantrip. When you hit with eldritch blast, push the creature up to 10 feet away from you in a straight line.", tags: ["spell", "combat", "class"] },
	{ front: "What does Thirsting Blade (invocation) do?", back: "Prerequisite: 5th level, Pact of the Blade. Attack with your pact weapon twice whenever you take the Attack action.", tags: ["combat", "ability", "class"] },
	{ front: "What does Lifedrinker (invocation) do?", back: "Prerequisite: 12th level, Pact of the Blade. When you hit with your pact weapon, deal extra necrotic damage equal to your Charisma modifier (minimum 1).", tags: ["combat", "ability", "class"] },
	{ front: "What does Book of Ancient Secrets (invocation) do?", back: "Prerequisite: Pact of the Tome. Inscribe two 1st-level ritual spells from any class into your Book of Shadows; can cast them as rituals. Can add other ritual spells found on adventures (level ≤ half warlock level rounded up; 2 hours + 50 gp per spell level to transcribe). Can also cast known warlock spells with the ritual tag as rituals.", tags: ["spell", "rule", "class"] },
	{ front: "What does Voice of the Chain Master (invocation) do?", back: "Prerequisite: Pact of the Chain. Communicate telepathically with your familiar and perceive through its senses while on the same plane. Also speak through your familiar in your own voice.", tags: ["ability", "lore", "class"] },

	// Pact Boon
	{ front: "What is Pact Boon (Warlock, 3rd level)?", back: "Choose one: Pact of the Chain (learn find familiar as ritual; familiar can be imp/pseudodragon/quasit/sprite; forgo attack to let familiar attack), Pact of the Blade (create a magical melee pact weapon; proficient with it; can bond a magic weapon via 1-hour ritual), or Pact of the Tome (receive Book of Shadows; choose 3 cantrips from any class list cast at will).", tags: ["ability", "rule", "class"] },

	// ASI
	{ front: "At what levels does the Warlock gain Ability Score Improvement?", back: "4th, 8th, 12th, 16th, and 19th levels.", tags: ["rule", "ability", "class"] },

	// Mystic Arcanum
	{ front: "What is Mystic Arcanum (Warlock, 11th level)?", back: "Your patron grants a magical secret: choose one 6th-level spell from the warlock list. Cast it once without a spell slot per long rest. Gain one 7th-level spell at 13th, one 8th-level at 15th, one 9th-level at 17th. All uses regain on long rest.", tags: ["spell", "ability", "class"] },

	// Eldritch Master
	{ front: "What is Eldritch Master (Warlock, 20th level)?", back: "Spend 1 minute entreating your patron to regain all expended Pact Magic spell slots. Once per long rest.", tags: ["ability", "rule", "class"] },

	// The Fiend patron
	{ front: "What expanded spells does The Fiend patron grant?", back: "1st: burning hands, command. 2nd: blindness/deafness, scorching ray. 3rd: fireball, stinking cloud. 4th: fire shield, wall of fire. 5th: flame strike, hallow.", tags: ["spell", "rule", "class"] },
	{ front: "What is Dark One's Blessing (The Fiend, 1st level)?", back: "When you reduce a hostile creature to 0 HP, gain temporary HP equal to your Charisma modifier + your warlock level (minimum 1).", tags: ["combat", "ability", "class"] },
	{ front: "What is Dark One's Own Luck (The Fiend, 6th level)?", back: "When you make an ability check or saving throw, add a d10 to the roll after seeing the initial result but before effects occur. Recharges on short or long rest.", tags: ["ability", "rule", "class"] },
	{ front: "What is Fiendish Resilience (The Fiend, 10th level)?", back: "When you finish a short or long rest, choose one damage type. Gain resistance to that type until you choose a different one. Magical weapons and silver weapons bypass this resistance.", tags: ["ability", "combat", "class"] },
	{ front: "What is Hurl Through Hell (The Fiend, 14th level)?", back: "When you hit a creature with an attack, instantly transport it through the lower planes. It disappears and returns to its space at the end of your next turn. If not a fiend, it takes 10d10 psychic damage. Once per long rest.", tags: ["combat", "action", "class"] },
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: "Warlock", description: "SRD 5.1 Warlock class features, Eldritch Invocations, and The Fiend patron." }),
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
