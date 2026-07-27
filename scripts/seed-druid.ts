const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Core stats
	{
		front: "What hit die does the Druid use?",
		back: "1d8. HP at 1st level: 8 + Con modifier. Higher levels: 1d8 (or 5) + Con modifier per level after 1st.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What armor and weapons is the Druid proficient with?",
		back: "Light armor, medium armor, shields — but druids will not wear armor or use shields made of metal. Weapons: clubs, daggers, darts, javelins, maces, quarterstaffs, scimitars, sickles, slings, spears.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What saving throws is the Druid proficient in?",
		back: "Intelligence and Wisdom.",
		tags: ["rule", "ability", "class"],
	},
	{
		front: "What skills can a Druid choose from at character creation?",
		back: "Choose 2 from: Arcana, Animal Handling, Insight, Medicine, Nature, Perception, Religion, Survival.",
		tags: ["rule", "skill", "class"],
	},
	{
		front: "What tool is the Druid proficient with?",
		back: "Herbalism kit.",
		tags: ["rule", "skill", "class"],
	},

	// Druidic
	{
		front: "What is Druidic (Druid, 1st level)?",
		back: "You know Druidic, the secret language of druids. You can speak it and leave hidden messages. You and other Druidic speakers automatically spot such messages. Others need a DC 15 Wisdom (Perception) check to notice a message exists, but can't decipher it without magic.",
		tags: ["lore", "rule", "class"],
	},

	// Spellcasting
	{
		front: "What is the Druid's spellcasting ability?",
		back: "Wisdom. Spell save DC = 8 + proficiency bonus + Wis modifier. Spell attack modifier = proficiency bonus + Wis modifier.",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "How many cantrips does a Druid start with?",
		back: "2 cantrips at 1st level; up to 4 by 10th level.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "How does the Druid prepare spells?",
		back: "After a long rest, prepare a number of druid spells equal to Wisdom modifier + druid level (minimum 1). Spells must be of a level for which you have slots. Changing the list on a long rest takes 1 minute of prayer per spell level per spell.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What is Ritual Casting (Druid)?",
		back: "You can cast a druid spell as a ritual if it has the ritual tag and you have it prepared.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What can a Druid use as a spellcasting focus?",
		back: "A druidic focus.",
		tags: ["spell", "rule", "class"],
	},

	// Wild Shape
	{
		front: "How do you use Wild Shape?",
		back: "Action. You can use it twice, regaining uses on a short or long rest. You must have seen the beast before.",
		tags: ["action", "ability", "class"],
	},
	{
		front: "What are the Beast Shapes limits for Wild Shape?",
		back: "2nd level: CR 1/4, no flying or swimming speed (e.g. wolf). 4th level: CR 1/2, no flying speed (e.g. crocodile). 8th level: CR 1, no restrictions (e.g. giant eagle).",
		tags: ["rule", "ability", "class"],
	},
	{
		front: "How long can a Druid stay in Wild Shape?",
		back: "A number of hours equal to half your druid level (rounded down). You revert early if you use a bonus action, fall unconscious, drop to 0 HP, or die.",
		tags: ["rule", "ability", "class"],
	},
	{
		front: "What do you retain and lose in Wild Shape?",
		back: "Retain: alignment, personality, Intelligence/Wisdom/Charisma scores, skill and saving throw proficiencies, class/race features (if physically possible). Lose: ability to cast spells, use of special senses (unless beast has them), hands-dependent actions. You do not lose concentration on spells already cast.",
		tags: ["rule", "ability", "class"],
	},
	{
		front: "What happens to your HP when you enter and leave Wild Shape?",
		back: "You assume the beast's HP when you transform. When you revert, you return to your HP before transforming. If you revert from dropping to 0 HP, excess damage carries over to your normal form.",
		tags: ["rule", "combat", "class"],
	},
	{
		front: "What happens to your equipment in Wild Shape?",
		back: "You choose: it falls to the ground, merges into your new form (no effect until you revert), or is worn by it. Worn equipment functions normally if practical. Equipment doesn't change size to fit the new form.",
		tags: ["rule", "ability", "class"],
	},

	// Druid Circle
	{
		front: "What is Druid Circle (2nd level)?",
		back: "Choose a circle (e.g. Circle of the Land). Grants features at 2nd, 6th, 10th, and 14th levels.",
		tags: ["rule", "lore", "class"],
	},

	// ASI
	{
		front: "At what levels does the Druid gain Ability Score Improvement?",
		back: "4th, 8th, 12th, 16th, and 19th levels.",
		tags: ["rule", "ability", "class"],
	},

	// Level 18
	{
		front: "What is Timeless Body (Druid, 18th level)?",
		back: "For every 10 years that pass, your body ages only 1 year.",
		tags: ["ability", "lore", "class"],
	},
	{
		front: "What is Beast Spells (Druid, 18th level)?",
		back: "You can perform the somatic and verbal components of druid spells while in a beast shape from Wild Shape. You still can't provide material components.",
		tags: ["spell", "ability", "class"],
	},

	// Level 20
	{
		front: "What is Archdruid (Druid, 20th level)?",
		back: "Wild Shape uses are unlimited. You can also ignore verbal, somatic, and non-costly, non-consumed material components of druid spells — in both normal and beast form.",
		tags: ["ability", "rule", "class"],
	},

	// Circle of the Land
	{
		front: "What is Bonus Cantrip (Circle of the Land, 2nd level)?",
		back: "Learn one additional druid cantrip of your choice.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What is Natural Recovery (Circle of the Land, 2nd level)?",
		back: "During a short rest, recover expended spell slots with a combined level ≤ half your druid level (rounded up). No slot can be 6th level or higher. Once per long rest.",
		tags: ["spell", "ability", "class"],
	},
	{
		front: "What are Circle Spells (Circle of the Land)?",
		back: "At 3rd, 5th, 7th, and 9th level you gain spells based on your chosen land (arctic, coast, desert, forest, grassland, mountain, or swamp). They are always prepared and don't count against your daily limit. Non-druid-list spells still count as druid spells for you.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What are the Arctic Circle Spells?",
		back: "3rd: hold person, spike growth. 5th: sleet storm, slow. 7th: freedom of movement, ice storm. 9th: commune with nature, cone of cold.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What are the Coast Circle Spells?",
		back: "3rd: mirror image, misty step. 5th: water breathing, water walk. 7th: control water, freedom of movement. 9th: conjure elemental, scrying.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What are the Desert Circle Spells?",
		back: "3rd: blur, silence. 5th: create food and water, protection from energy. 7th: blight, hallucinatory terrain. 9th: insect plague, wall of stone.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What are the Forest Circle Spells?",
		back: "3rd: barkskin, spider climb. 5th: call lightning, plant growth. 7th: divination, freedom of movement. 9th: commune with nature, tree stride.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What are the Grassland Circle Spells?",
		back: "3rd: invisibility, pass without trace. 5th: daylight, haste. 7th: divination, freedom of movement. 9th: dream, insect plague.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What are the Mountain Circle Spells?",
		back: "3rd: spider climb, spike growth. 5th: lightning bolt, meld into stone. 7th: stone shape, stoneskin. 9th: passwall, wall of stone.",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What are the Swamp Circle Spells?",
		back: "3rd: acid arrow, darkness. 5th: water walk, stinking cloud. 7th: freedom of movement, locate creature. 9th: (not specified in SRD excerpt).",
		tags: ["spell", "rule", "class"],
	},
	{
		front: "What is Land's Stride (Circle of the Land, 6th level)?",
		back: "Moving through nonmagical difficult terrain costs no extra movement. You can pass through nonmagical plants without being slowed or damaged by thorns/spines. Advantage on saving throws against magically created or manipulated plants that impede movement.",
		tags: ["ability", "rule", "class"],
	},
	{
		front: "What is Nature's Ward (Circle of the Land, 10th level)?",
		back: "You can't be charmed or frightened by elementals or fey. You are immune to poison and disease.",
		tags: ["ability", "condition", "class"],
	},
	{
		front: "What is Nature's Sanctuary (Circle of the Land, 14th level)?",
		back: "When a beast or plant creature attacks you, it must make a Wisdom save against your spell save DC or choose a different target (or the attack misses). On a success, that creature is immune to this effect for 24 hours. The creature is aware of this effect before attacking.",
		tags: ["ability", "combat", "class"],
	},
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: "Druid",
			description: "SRD 5.1 Druid class features and Circle of the Land.",
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
