const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Core stats
	{
		front: "What hit die does the Paladin use?",
		back: "1d10. HP at 1st level: 10 + Con modifier. Higher levels: 1d10 (or 6) + Con modifier per level after 1st.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What armor and weapons is the Paladin proficient with?",
		back: "All armor and shields; simple weapons and martial weapons.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What saving throws is the Paladin proficient in?",
		back: "Wisdom and Charisma.",
		tags: ["rule", "ability", "class"],
	},
	{
		front: "What skills can a Paladin choose from at character creation?",
		back: "Choose 2 from: Athletics, Insight, Intimidation, Medicine, Persuasion, Religion.",
		tags: ["rule", "skill", "class"],
	},

	// Divine Sense
	{
		front: "What is Divine Sense (Paladin, 1st level)?",
		back: "Action: until end of your next turn, know the location of any celestial, fiend, or undead within 60 feet that isn't behind total cover. You also know if a place or object is consecrated or desecrated. Uses: 1 + Charisma modifier per long rest.",
		tags: ["action", "ability", "class"],
	},

	// Lay on Hands
	{
		front: "What is Lay on Hands (Paladin, 1st level)?",
		back: "You have a pool of HP equal to 5 × your paladin level. Action: touch a creature, restore any HP from the pool. Alternatively, spend 5 HP from the pool to cure one disease or neutralize one poison. No effect on undead or constructs.",
		tags: ["action", "ability", "class"],
	},

	// Fighting Style
	{
		front: "What Fighting Styles can a Paladin choose from?",
		back: "Defense (+1 AC while wearing armor), Dueling (+2 damage with melee weapon in one hand and no other weapons), Great Weapon Fighting (reroll 1s or 2s on damage with two-handed/versatile weapons), Protection (reaction: impose disadvantage on attack against adjacent ally, requires shield).",
		tags: ["combat", "ability", "class"],
	},

	// Spellcasting
	{
		front: "What is the Paladin's spellcasting ability?",
		back: "Charisma. Spell save DC = 8 + proficiency bonus + Cha modifier. Spell attack modifier = proficiency bonus + Cha modifier.",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "How does the Paladin prepare spells?",
		back: "After a long rest, prepare a number of paladin spells equal to your Charisma modifier + half your paladin level (rounded down, minimum 1). Must be of a level for which you have spell slots.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What can a Paladin use as a spellcasting focus?",
		back: "A holy symbol.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "When does a Paladin gain spell slots?",
		back: "Starting at 2nd level. The Paladin is a half-caster: spell slots progress more slowly than full casters, based on half paladin level.",
		tags: ["spell", "rule", "class"],
	},

	// Divine Smite
	{
		front: "What is Divine Smite (Paladin, 2nd level)?",
		back: "When you hit a creature with a melee weapon attack, you can expend one spell slot to deal radiant damage: 2d8 for a 1st-level slot + 1d8 per slot level above 1st, maximum 5d8. Deals 1 extra d8 if target is an undead or fiend.",
		tags: ["combat", "action", "class"],
	},

	// Divine Health
	{
		front: "What is Divine Health (Paladin, 3rd level)?",
		back: "The divine magic flowing through you makes you immune to disease.",
		tags: ["ability", "condition", "class"],
	},

	// Sacred Oath
	{
		front: "What is Sacred Oath (Paladin, 3rd level)?",
		back: "Choose an oath (e.g. Oath of Devotion). Grants oath spells (always prepared, don't count against limit), two Channel Divinity options, and features at 7th, 15th, and 20th levels. Channel Divinity recharges on a short or long rest.",
		tags: ["rule", "lore", "class"],
	},
	{
		front: "What happens if a Paladin breaks their Sacred Oath?",
		back: "At the DM's discretion: loss of paladin spells and Channel Divinity. Must seek atonement from a cleric or paladin of the same faith, or may fall and become an oathbreaker (a DM-controlled path).",
		tags: ["rule", "lore", "class"],
	},

	// ASI
	{
		front: "At what levels does the Paladin gain Ability Score Improvement?",
		back: "4th, 8th, 12th, 16th, and 19th levels.",
		tags: ["rule", "ability", "class"],
	},

	// Extra Attack
	{
		front: "What is Extra Attack (Paladin, 5th level)?",
		back: "Attack twice instead of once whenever you take the Attack action on your turn.",
		tags: ["combat", "ability", "class"],
	},

	// Aura of Protection
	{
		front: "What is Aura of Protection (Paladin, 6th level)?",
		back: "You and friendly creatures within 10 feet of you (while you're conscious) add your Charisma modifier (minimum +1) to all saving throws. Expands to 30 feet at 18th level.",
		tags: ["ability", "combat", "class"],
	},

	// Aura of Courage
	{
		front: "What is Aura of Courage (Paladin, 10th level)?",
		back: "You and friendly creatures within 10 feet of you (while you're conscious) can't be frightened. Expands to 30 feet at 18th level.",
		tags: ["ability", "condition", "class"],
	},

	// Improved Divine Smite
	{
		front: "What is Improved Divine Smite (Paladin, 11th level)?",
		back: "Whenever you hit a creature with a melee weapon, the creature takes an extra 1d8 radiant damage. This is in addition to any Divine Smite you may apply.",
		tags: ["combat", "ability", "class"],
	},

	// Cleansing Touch
	{
		front: "What is Cleansing Touch (Paladin, 14th level)?",
		back: "Action: end one spell on yourself or on one willing creature you touch. Uses per long rest: Charisma modifier (minimum 1).",
		tags: ["action", "ability", "class"],
	},

	// Oath of Devotion
	{
		front: "What are the tenets of the Oath of Devotion?",
		back: "Honesty (don't lie or cheat), Courage (never fear acting), Compassion (aid others and punish those who harm the innocent), Honor (treat others with fairness, let virtue be an example), Duty (be responsible to those under your care and obey just laws).",
		tags: ["lore", "rule", "class"],
	},
	{
		front: "What are the Oath of Devotion spells?",
		back: "3rd: protection from evil and good, sanctuary. 5th: lesser restoration, zone of truth. 9th: beacon of hope, dispel magic. 13th: freedom of movement, guardian of faith. 17th: commune, flame strike.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What is Channel Divinity: Sacred Weapon (Oath of Devotion, 3rd level)?",
		back: "Action: imbue one weapon with positive energy. For 1 minute: add Charisma modifier (minimum +1) to attack rolls with that weapon. The weapon also emits bright light in a 20-foot radius (and dim light 20 feet beyond). If the weapon isn't magic, it's treated as magical for this duration. Ends early if you're incapacitated or drop the weapon.",
		tags: ["action", "combat", "class"],
	},
	{
		front: "What is Channel Divinity: Turn the Unholy (Oath of Devotion, 3rd level)?",
		back: "Action: present holy symbol. Each fiend or undead within 30 feet that can see or hear you must make a Wisdom save or be turned for 1 minute (or until it takes damage).",
		tags: ["action", "combat", "class"],
	},
	{
		front: "What is Aura of Devotion (Oath of Devotion, 7th level)?",
		back: "You and friendly creatures within 10 feet of you (while you're conscious) can't be charmed. Expands to 30 feet at 18th level.",
		tags: ["ability", "condition", "class"],
	},
	{
		front: "What is Purity of Spirit (Oath of Devotion, 15th level)?",
		back: "You are always under the effects of a protection from evil and good spell.",
		tags: ["ability", "spell", "class"],
	},
	{
		front: "What is Holy Nimbus (Oath of Devotion, 20th level)?",
		back: "Action: emanate an aura of sunlight. For 1 minute: bright light in 30-foot radius (dim 30 feet beyond). Enemies that start their turn in the aura take 10 radiant damage. You have advantage on saving throws against spells cast by fiends and undead. Once per long rest.",
		tags: ["action", "combat", "class"],
	},
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: "Paladin",
			description: "SRD 5.1 Paladin class features and Oath of Devotion.",
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
