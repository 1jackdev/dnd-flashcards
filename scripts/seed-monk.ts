const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Core stats
	{ front: "What hit die does the Monk use?", back: "1d8. HP at 1st level: 8 + Con modifier. Higher levels: 1d8 (or 5) + Con modifier per level after 1st.", tags: ["rule", "combat", "class"] },
	{ front: "What armor and weapons is the Monk proficient with?", back: "No armor, no shields. Simple weapons and shortswords.", tags: ["rule", "combat", "class"] },
	{ front: "What saving throws is the Monk proficient in?", back: "Strength and Dexterity.", tags: ["rule", "ability", "class"] },
	{ front: "What skills can a Monk choose from at character creation?", back: "Choose 2 from: Acrobatics, Athletics, History, Insight, Religion, Stealth.", tags: ["rule", "skill", "class"] },

	// Unarmored Defense
	{ front: "What is Unarmored Defense (Monk)?", back: "While wearing no armor and wielding no shield: AC = 10 + Dex modifier + Wis modifier.", tags: ["combat", "rule", "class"] },

	// Martial Arts
	{ front: "What are monk weapons?", back: "Shortswords and any simple melee weapons that don't have the two-handed or heavy property.", tags: ["combat", "rule", "class"] },
	{ front: "What three benefits does Martial Arts provide?", back: "1) Use Dexterity instead of Strength for attack and damage rolls with unarmed strikes and monk weapons. 2) Roll a Martial Arts die (d4→d10) in place of normal unarmed/monk weapon damage. 3) When you use the Attack action with an unarmed strike or monk weapon, make one unarmed strike as a bonus action.", tags: ["combat", "ability", "class"] },
	{ front: "How does the Martial Arts damage die scale?", back: "d4 at levels 1–4. d6 at levels 5–10. d8 at levels 11–16. d10 at levels 17–20.", tags: ["combat", "ability", "class"] },

	// Ki
	{ front: "What is Ki, and how many points does a Monk have?", back: "Ki represents mystic energy. Points equal your monk level (2 at 2nd, up to 20 at 20th). Spent ki is regained on a short or long rest, requiring at least 30 minutes of meditation.", tags: ["rule", "ability", "class"] },
	{ front: "What is the Ki save DC formula?", back: "8 + proficiency bonus + Wisdom modifier.", tags: ["rule", "ability", "class"] },
	{ front: "What is Flurry of Blows?", back: "Spend 1 ki point immediately after taking the Attack action: make two unarmed strikes as a bonus action.", tags: ["combat", "action", "class"] },
	{ front: "What is Patient Defense?", back: "Spend 1 ki point: take the Dodge action as a bonus action on your turn.", tags: ["combat", "action", "class"] },
	{ front: "What is Step of the Wind?", back: "Spend 1 ki point: take the Disengage or Dash action as a bonus action, and your jump distance is doubled for the turn.", tags: ["combat", "action", "class"] },

	// Unarmored Movement
	{ front: "How does Unarmored Movement scale?", back: "+10 ft. at levels 2–5. +15 ft. at levels 6–9. +20 ft. at levels 10–13. +25 ft. at levels 14–17. +30 ft. at levels 18–20. At 9th level, you can also move along vertical surfaces and across liquids without falling.", tags: ["combat", "ability", "class"] },

	// Monastic Tradition
	{ front: "What is Monastic Tradition (Monk, 3rd level)?", back: "Choose a tradition (e.g. Way of the Open Hand). Grants features at 3rd, 6th, 11th, and 17th levels.", tags: ["rule", "lore", "class"] },

	// Deflect Missiles
	{ front: "What is Deflect Missiles (Monk, 3rd level)?", back: "Reaction when hit by a ranged weapon attack: reduce damage by 1d10 + Dex modifier + monk level. If reduced to 0, you catch the missile (if one-hand-sized and a hand is free). Spend 1 ki point to throw it back as a ranged attack (proficiency, 20/60 ft range) as part of the same reaction.", tags: ["combat", "action", "class"] },

	// ASI
	{ front: "At what levels does the Monk gain Ability Score Improvement?", back: "4th, 8th, 12th, 16th, and 19th levels.", tags: ["rule", "ability", "class"] },

	// Slow Fall
	{ front: "What is Slow Fall (Monk, 4th level)?", back: "Reaction when you fall: reduce falling damage by 5 × your monk level.", tags: ["combat", "action", "class"] },

	// Extra Attack
	{ front: "What is Extra Attack (Monk, 5th level)?", back: "Attack twice instead of once whenever you take the Attack action on your turn.", tags: ["combat", "ability", "class"] },

	// Stunning Strike
	{ front: "What is Stunning Strike (Monk, 5th level)?", back: "When you hit a creature with a melee weapon attack, spend 1 ki point to attempt a stunning strike. Target makes a Constitution save or is stunned until the end of your next turn.", tags: ["combat", "action", "class"] },

	// Ki-Empowered Strikes
	{ front: "What is Ki-Empowered Strikes (Monk, 6th level)?", back: "Your unarmed strikes count as magical for overcoming resistance and immunity to nonmagical attacks and damage.", tags: ["combat", "ability", "class"] },

	// Evasion
	{ front: "What is Evasion (Monk, 7th level)?", back: "When subjected to an effect requiring a Dexterity saving throw for half damage: take no damage on a success, half damage on a failure.", tags: ["combat", "ability", "class"] },

	// Stillness of Mind
	{ front: "What is Stillness of Mind (Monk, 7th level)?", back: "Action: end one effect on yourself causing you to be charmed or frightened.", tags: ["action", "condition", "class"] },

	// Purity of Body
	{ front: "What is Purity of Body (Monk, 10th level)?", back: "You are immune to disease and poison.", tags: ["ability", "condition", "class"] },

	// Tongue of the Sun and Moon
	{ front: "What is Tongue of the Sun and Moon (Monk, 13th level)?", back: "You understand all spoken languages. Any creature that can understand a language can understand what you say.", tags: ["ability", "lore", "class"] },

	// Diamond Soul
	{ front: "What is Diamond Soul (Monk, 14th level)?", back: "Proficiency in all saving throws. Additionally, when you fail a saving throw, spend 1 ki point to reroll it and take the second result.", tags: ["ability", "rule", "class"] },

	// Timeless Body
	{ front: "What is Timeless Body (Monk, 15th level)?", back: "You suffer none of the frailty of old age and can't be aged magically (though you can still die of old age). You no longer need food or water.", tags: ["ability", "lore", "class"] },

	// Empty Body
	{ front: "What is Empty Body (Monk, 18th level)?", back: "Action, spend 4 ki points: become invisible for 1 minute and gain resistance to all damage except force. Alternatively, spend 8 ki points to cast astral projection without material components (you only, no other creatures).", tags: ["action", "ability", "class"] },

	// Perfect Self
	{ front: "What is Perfect Self (Monk, 20th level)?", back: "When you roll initiative and have no ki points remaining, regain 4 ki points.", tags: ["ability", "rule", "class"] },

	// Way of the Open Hand
	{ front: "What is Open Hand Technique (Way of the Open Hand, 3rd level)?", back: "When you hit with a Flurry of Blows attack, impose one effect: target makes Dex save or is knocked prone; target makes Str save or is pushed up to 15 ft.; or target can't take reactions until end of your next turn.", tags: ["combat", "action", "class"] },
	{ front: "What is Wholeness of Body (Way of the Open Hand, 6th level)?", back: "Action: regain HP equal to 3 × your monk level. Once per long rest.", tags: ["action", "ability", "class"] },
	{ front: "What is Tranquility (Way of the Open Hand, 11th level)?", back: "At the end of a long rest, gain the effect of a sanctuary spell lasting until the start of your next long rest. Save DC = 8 + Wis modifier + proficiency bonus.", tags: ["ability", "spell", "class"] },
	{ front: "What is Quivering Palm (Way of the Open Hand, 17th level)?", back: "When you hit with an unarmed strike, spend 3 ki points to set lethal vibrations lasting monk-level days. Use your action (same plane required) to trigger: target makes Con save or drops to 0 HP; on success, takes 10d10 necrotic damage. One target at a time.", tags: ["combat", "action", "class"] },
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: "Monk", description: "SRD 5.1 Monk class features and Way of the Open Hand." }),
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
