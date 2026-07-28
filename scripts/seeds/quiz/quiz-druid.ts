const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Druid";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What hit die does the Druid use?": [
		{ type: "true_false", question: "The Druid's hit die is 1d8.", correctAnswer: true },
		{
			type: "multiple_choice",
			question:
				"What die does a Druid roll for hit points at each level after 1st (in addition to Constitution modifier)?",
			choices: ["1d8", "1d6", "1d10", "1d12"],
			correctChoiceIndex: 0,
		},
	],
	"What armor and weapons is the Druid proficient with?": [
		{
			type: "true_false",
			question: "Druids will not wear armor or use shields made of metal.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of these weapons is a Druid proficient with?",
			choices: ["Scimitar", "Longsword", "Rapier", "Battleaxe"],
			correctChoiceIndex: 0,
		},
	],
	"What saving throws is the Druid proficient in?": [
		{
			type: "true_false",
			question: "Druids are proficient in Intelligence and Wisdom saving throws.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which two saving throws is the Druid proficient in?",
			choices: [
				"Intelligence and Wisdom",
				"Strength and Constitution",
				"Dexterity and Charisma",
				"Wisdom and Charisma",
			],
			correctChoiceIndex: 0,
		},
	],
	"What skills can a Druid choose from at character creation?": [
		{
			type: "true_false",
			question: "A Druid chooses 3 skills from the class skill list at character creation.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which skill is on the Druid's class skill list?",
			choices: ["Nature", "Stealth", "Deception", "Acrobatics"],
			correctChoiceIndex: 0,
		},
	],
	"What tool is the Druid proficient with?": [
		{
			type: "true_false",
			question: "The Druid is proficient with the herbalism kit.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What tool proficiency does a Druid gain at character creation?",
			choices: ["Herbalism kit", "Thieves' tools", "Alchemist's supplies", "Disguise kit"],
			correctChoiceIndex: 0,
		},
	],
	"What is Druidic (Druid, 1st level)?": [
		{
			type: "true_false",
			question:
				"A non-Druidic speaker needs a DC 15 Wisdom (Perception) check just to notice a hidden Druidic message exists.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What DC must a non-Druidic-speaking creature meet on a Wisdom (Perception) check to notice a hidden Druidic message exists?",
			choices: ["DC 15", "DC 10", "DC 20", "DC 12"],
			correctChoiceIndex: 0,
		},
	],
	"What is the Druid's spellcasting ability?": [
		{
			type: "true_false",
			question: "The Druid's spellcasting ability is Wisdom.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the Druid's spell save DC formula?",
			choices: [
				"8 + proficiency bonus + Wisdom modifier",
				"8 + proficiency bonus + Intelligence modifier",
				"10 + proficiency bonus + Wisdom modifier",
				"8 + proficiency bonus + Charisma modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"How many cantrips does a Druid start with?": [
		{
			type: "true_false",
			question: "A Druid knows 2 cantrips at 1st level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "By what level does a Druid know up to 4 cantrips?",
			choices: ["10th level", "4th level", "14th level", "20th level"],
			correctChoiceIndex: 0,
		},
	],
	"How does the Druid prepare spells?": [
		{
			type: "true_false",
			question: "A Druid can change their prepared spell list after a long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many spells can a Druid prepare after a long rest (minimum 1)?",
			choices: [
				"Wisdom modifier + druid level",
				"Intelligence modifier + druid level",
				"Wisdom modifier + proficiency bonus",
				"Half druid level + Wisdom modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Ritual Casting (Druid)?": [
		{
			type: "true_false",
			question:
				"A Druid can cast any spell they have prepared that has the ritual tag as a ritual.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is required for a Druid to cast a spell as a ritual?",
			choices: [
				"It must have the ritual tag and be prepared",
				"It must be a cantrip",
				"It must be cast using a spell slot",
				"It must be on the Wizard spell list",
			],
			correctChoiceIndex: 0,
		},
	],
	"What can a Druid use as a spellcasting focus?": [
		{
			type: "true_false",
			question: "A Druid can use a druidic focus as a spellcasting focus.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What can a Druid use in place of material components for their spells that don't have a cost?",
			choices: ["A druidic focus", "A component pouch only", "An arcane focus", "A holy symbol"],
			correctChoiceIndex: 0,
		},
	],
	"How do you use Wild Shape?": [
		{
			type: "true_false",
			question:
				"Wild Shape is an action, and you regain expended uses after finishing a short or long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many times can a Druid use Wild Shape before needing a rest to regain uses?",
			choices: ["Twice", "Once", "Three times", "Unlimited"],
			correctChoiceIndex: 0,
		},
	],
	"What are the Beast Shapes limits for Wild Shape?": [
		{
			type: "true_false",
			question:
				"At 2nd level, a Druid using Wild Shape can only turn into a beast with no flying or swimming speed.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level can a Druid Wild Shape into a beast with a flying speed?",
			choices: ["8th level", "2nd level", "4th level", "6th level"],
			correctChoiceIndex: 0,
		},
	],
	"How long can a Druid stay in Wild Shape?": [
		{
			type: "true_false",
			question: "Using a bonus action while Wild Shaped forces you to revert to your normal form.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How long can a Druid remain in Wild Shape form?",
			choices: [
				"A number of hours equal to half your druid level, rounded down",
				"A number of hours equal to your druid level",
				"Until you choose to revert, with no limit",
				"One hour per Wild Shape use, regardless of level",
			],
			correctChoiceIndex: 0,
		},
	],
	"What do you retain and lose in Wild Shape?": [
		{
			type: "true_false",
			question: "While Wild Shaped, you retain your Intelligence, Wisdom, and Charisma scores.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What does a Druid lose access to while in Wild Shape, unless the beast form has it?",
			choices: [
				"Special senses like darkvision",
				"Their personality",
				"Their alignment",
				"Their skill proficiencies",
			],
			correctChoiceIndex: 0,
		},
	],
	"What happens to your HP when you enter and leave Wild Shape?": [
		{
			type: "true_false",
			question:
				"If you drop to 0 HP while Wild Shaped and revert, excess damage carries over to your normal form.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What happens to a Druid's original hit points while Wild Shaped?",
			choices: [
				"They are unaffected and you return to them when you revert",
				"They are permanently lost",
				"They are added to the beast's hit points",
				"They are halved for the duration",
			],
			correctChoiceIndex: 0,
		},
	],
	"What happens to your equipment in Wild Shape?": [
		{
			type: "true_false",
			question:
				"Worn equipment that merges into your new form has no effect until you revert to your normal shape.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What are the Druid's options for their equipment when using Wild Shape?",
			choices: [
				"It falls to the ground, merges into the new form, or is worn by it",
				"It is automatically destroyed",
				"It is stored in an extradimensional space",
				"It transforms to match the new form's size",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Druid Circle (2nd level)?": [
		{
			type: "true_false",
			question: "Druid Circle grants additional features at 2nd, 6th, 10th, and 14th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Druid choose their Druid Circle?",
			choices: ["2nd level", "1st level", "3rd level", "6th level"],
			correctChoiceIndex: 0,
		},
	],
	"At what levels does the Druid gain Ability Score Improvement?": [
		{
			type: "true_false",
			question: "A Druid gains an Ability Score Improvement at 19th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which of these is NOT a level at which a Druid gains an Ability Score Improvement?",
			choices: ["14th level", "4th level", "12th level", "16th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Timeless Body (Druid, 18th level)?": [
		{
			type: "true_false",
			question: "Timeless Body causes a Druid to age only 1 year for every 10 years that pass.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Druid gain Timeless Body?",
			choices: ["18th level", "20th level", "15th level", "14th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Beast Spells (Druid, 18th level)?": [
		{
			type: "true_false",
			question: "Beast Spells lets a Druid provide material components while in a beast shape.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"What does Beast Spells allow a Druid to do while in a beast shape from Wild Shape?",
			choices: [
				"Perform the somatic and verbal components of druid spells",
				"Provide material components",
				"Cast spells with a longer duration than normal",
				"Use Wild Shape an unlimited number of times",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Archdruid (Druid, 20th level)?": [
		{
			type: "true_false",
			question:
				"At 20th level, a Druid can ignore non-costly, non-consumed material components of their spells.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What does the Archdruid feature grant regarding Wild Shape?",
			choices: [
				"Unlimited uses of Wild Shape",
				"Two additional uses of Wild Shape per rest",
				"The ability to Wild Shape into any creature",
				"Immunity to reverting when falling unconscious",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Bonus Cantrip (Circle of the Land, 2nd level)?": [
		{
			type: "true_false",
			question: "Bonus Cantrip lets a Circle of the Land Druid learn one additional druid cantrip.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Circle of the Land Druid gain Bonus Cantrip?",
			choices: ["2nd level", "1st level", "3rd level", "4th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Natural Recovery (Circle of the Land, 2nd level)?": [
		{
			type: "true_false",
			question: "Natural Recovery lets a Druid recover a 6th-level spell slot.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "How often can a Circle of the Land Druid use Natural Recovery?",
			choices: [
				"Once per long rest",
				"Once per short rest",
				"Twice per long rest",
				"Unlimited times per day",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are Circle Spells (Circle of the Land)?": [
		{
			type: "true_false",
			question:
				"Circle Spells are always prepared and don't count against the number of spells a Druid can prepare.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At which levels does a Circle of the Land Druid gain Circle Spells?",
			choices: [
				"3rd, 5th, 7th, and 9th",
				"2nd, 6th, 10th, and 14th",
				"1st, 4th, 8th, and 12th",
				"4th, 8th, 12th, and 16th",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the Arctic Circle Spells?": [
		{
			type: "true_false",
			question: "The Arctic Circle Spells include cone of cold at 9th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which spell is part of the Arctic Circle Spells list?",
			choices: ["Ice storm", "Control water", "Wall of stone", "Insect plague"],
			correctChoiceIndex: 0,
		},
	],
	"What are the Coast Circle Spells?": [
		{
			type: "true_false",
			question: "The Coast Circle Spells include water breathing at 5th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which spell is part of the Coast Circle Spells list?",
			choices: ["Control water", "Spike growth", "Stone shape", "Insect plague"],
			correctChoiceIndex: 0,
		},
	],
	"What are the Desert Circle Spells?": [
		{
			type: "true_false",
			question: "The Desert Circle Spells include create food and water at 5th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which spell is part of the Desert Circle Spells list?",
			choices: ["Hallucinatory terrain", "Water walk", "Call lightning", "Passwall"],
			correctChoiceIndex: 0,
		},
	],
	"What are the Forest Circle Spells?": [
		{
			type: "true_false",
			question: "The Forest Circle Spells include tree stride at 9th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which spell is part of the Forest Circle Spells list?",
			choices: ["Barkskin", "Sleet storm", "Blight", "Darkness"],
			correctChoiceIndex: 0,
		},
	],
	"What are the Grassland Circle Spells?": [
		{
			type: "true_false",
			question: "The Grassland Circle Spells include haste at 5th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which spell is part of the Grassland Circle Spells list?",
			choices: ["Pass without trace", "Misty step", "Meld into stone", "Acid arrow"],
			correctChoiceIndex: 0,
		},
	],
	"What are the Mountain Circle Spells?": [
		{
			type: "true_false",
			question: "The Mountain Circle Spells include stoneskin at 7th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which spell is part of the Mountain Circle Spells list?",
			choices: ["Lightning bolt", "Silence", "Water walk", "Dream"],
			correctChoiceIndex: 0,
		},
	],
	"What are the Swamp Circle Spells?": [
		{
			type: "true_false",
			question: "The Swamp Circle Spells' 9th-level spells are not specified in this SRD excerpt.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which spell is part of the Swamp Circle Spells list?",
			choices: ["Stinking cloud", "Haste", "Blur", "Divination"],
			correctChoiceIndex: 0,
		},
	],
	"What is Land's Stride (Circle of the Land, 6th level)?": [
		{
			type: "true_false",
			question:
				"Land's Stride grants advantage on saving throws against magically created or manipulated plants that impede movement.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Circle of the Land Druid gain Land's Stride?",
			choices: ["6th level", "2nd level", "10th level", "14th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Nature's Ward (Circle of the Land, 10th level)?": [
		{
			type: "true_false",
			question: "Nature's Ward makes a Druid immune to poison and disease.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Nature's Ward prevents a Druid from being charmed or frightened by which creature types?",
			choices: [
				"Elementals and fey",
				"Undead and fiends",
				"Beasts and plants",
				"Aberrations and constructs",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Nature's Sanctuary (Circle of the Land, 14th level)?": [
		{
			type: "true_false",
			question:
				"A creature that succeeds on its save against Nature's Sanctuary is immune to the effect for 24 hours.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What must a beast or plant creature do before it can attack a Druid protected by Nature's Sanctuary?",
			choices: [
				"Succeed on a Wisdom saving throw against the Druid's spell save DC",
				"Succeed on a Constitution saving throw",
				"Roll with disadvantage on its attack",
				"Be within 30 feet of the Druid",
			],
			correctChoiceIndex: 0,
		},
	],
};

async function run() {
	const headers = { "Content-Type": "application/json", Authorization: `Bearer ${AUTH_TOKEN}` };

	const decksRes = await fetch(`${API}/decks`, { headers });
	if (!decksRes.ok) throw new Error(`List decks failed: ${await decksRes.text()}`);
	const decks = (await decksRes.json()) as Array<{ id: string; name: string }>;
	const deck = decks.find((d) => d.name === DECK_NAME);
	if (!deck) throw new Error(`Deck not found: ${DECK_NAME}`);

	const cardsRes = await fetch(`${API}/decks/${deck.id}/cards`, { headers });
	if (!cardsRes.ok) throw new Error(`List cards failed: ${await cardsRes.text()}`);
	const cards = (await cardsRes.json()) as Array<{ id: string; front: string }>;

	let cardsMatched = 0;
	let quizOk = 0;
	let quizTotal = 0;

	for (const card of cards) {
		const quiz = quizByFront[card.front];
		if (!quiz) {
			console.error(`  No quiz defined for card: "${card.front.slice(0, 60)}"`);
			continue;
		}
		cardsMatched++;
		quizTotal += quiz.length;
		for (const question of quiz) {
			const res = await fetch(`${API}/flashcards/${card.id}/quiz`, {
				method: "POST",
				headers,
				body: JSON.stringify(question),
			});
			if (res.ok) {
				quizOk++;
			} else {
				console.error(`  FAIL quiz "${question.question.slice(0, 50)}": ${await res.text()}`);
			}
		}
	}

	console.log(
		`Matched ${cardsMatched}/${cards.length} cards. Created ${quizOk}/${quizTotal} quiz questions.`,
	);
}

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
