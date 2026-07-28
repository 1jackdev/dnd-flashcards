const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Sorcerer";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What hit die does the Sorcerer use?": [
		{
			type: "true_false",
			question: "The Sorcerer's hit die is 1d6.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the Sorcerer's hit die?",
			choices: ["1d6", "1d8", "1d10", "1d12"],
			correctChoiceIndex: 0,
		},
	],
	"What armor and weapons is the Sorcerer proficient with?": [
		{
			type: "true_false",
			question: "Sorcerers are proficient with no armor.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of these weapons is a Sorcerer proficient with?",
			choices: ["Dagger", "Longsword", "Longbow", "Rapier"],
			correctChoiceIndex: 0,
		},
	],
	"What saving throws is the Sorcerer proficient in?": [
		{
			type: "true_false",
			question: "A Sorcerer is proficient in Constitution and Charisma saving throws.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which two saving throws is the Sorcerer proficient in?",
			choices: [
				"Constitution and Charisma",
				"Intelligence and Wisdom",
				"Strength and Dexterity",
				"Wisdom and Charisma",
			],
			correctChoiceIndex: 0,
		},
	],
	"What skills can a Sorcerer choose from at character creation?": [
		{
			type: "true_false",
			question: "A Sorcerer can choose Stealth as one of their starting skills.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "How many skills does a Sorcerer choose at character creation?",
			choices: ["2", "3", "4", "1"],
			correctChoiceIndex: 0,
		},
	],
	"What is the Sorcerer's spellcasting ability?": [
		{
			type: "true_false",
			question:
				"The Sorcerer's spell save DC is calculated as 8 + proficiency bonus + Charisma modifier.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the Sorcerer's spellcasting ability?",
			choices: ["Charisma", "Intelligence", "Wisdom", "Constitution"],
			correctChoiceIndex: 0,
		},
	],
	"How many cantrips does a Sorcerer start with?": [
		{
			type: "true_false",
			question: "A Sorcerer knows 4 cantrips at 1st level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many cantrips does a Sorcerer know by 10th level?",
			choices: ["6", "4", "5", "8"],
			correctChoiceIndex: 0,
		},
	],
	"How many spells does a Sorcerer know, and how are they chosen?": [
		{
			type: "true_false",
			question: "A Sorcerer can swap one known spell for another each time they gain a level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many spells does a Sorcerer know at 1st level?",
			choices: ["2", "4", "1", "3"],
			correctChoiceIndex: 0,
		},
	],
	"What can a Sorcerer use as a spellcasting focus?": [
		{
			type: "true_false",
			question: "A Sorcerer can use an arcane focus as a spellcasting focus.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What can a Sorcerer use as a spellcasting focus?",
			choices: ["An arcane focus", "A holy symbol", "A component pouch only", "A druidic focus"],
			correctChoiceIndex: 0,
		},
	],
	"What is Sorcerous Origin (Sorcerer, 1st level)?": [
		{
			type: "true_false",
			question: "Sorcerous Origin grants additional features at 6th, 14th, and 18th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what levels (besides 1st) does Sorcerous Origin grant additional features?",
			choices: [
				"6th, 14th, and 18th",
				"4th, 8th, and 12th",
				"3rd, 10th, and 17th",
				"2nd, 6th, and 20th",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Font of Magic (Sorcerer, 2nd level)?": [
		{
			type: "true_false",
			question: "Sorcery points are regained after a short rest.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "How many sorcery points does a 2nd-level Sorcerer have?",
			choices: ["2", "3", "5", "6"],
			correctChoiceIndex: 0,
		},
	],
	"What is Flexible Casting?": [
		{
			type: "true_false",
			question:
				"Converting sorcery points into a spell slot with Flexible Casting requires a bonus action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"How many sorcery points does it cost to create a 3rd-level spell slot via Flexible Casting?",
			choices: ["5", "3", "6", "7"],
			correctChoiceIndex: 0,
		},
	],
	"What is Metamagic (Sorcerer, 3rd level)?": [
		{
			type: "true_false",
			question:
				"You can normally use only one Metamagic option on a spell you cast, except in special cases.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what levels (besides 3rd) does a Sorcerer gain additional Metamagic options?",
			choices: ["10th and 17th", "6th and 14th", "4th and 8th", "2nd and 20th"],
			correctChoiceIndex: 0,
		},
	],
	"What does Careful Spell (Metamagic) do?": [
		{
			type: "true_false",
			question:
				"Careful Spell lets you choose creatures who automatically succeed on their saving throw against your spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which Metamagic option lets you make certain creatures automatically succeed on a saving throw against your spell?",
			choices: ["Careful Spell", "Heightened Spell", "Twinned Spell", "Empowered Spell"],
			correctChoiceIndex: 0,
		},
	],
	"What does Distant Spell (Metamagic) do?": [
		{
			type: "true_false",
			question: "Distant Spell can turn a touch-range spell into a spell with a range of 30 feet.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which Metamagic option doubles the range of a spell?",
			choices: ["Distant Spell", "Extended Spell", "Quickened Spell", "Subtle Spell"],
			correctChoiceIndex: 0,
		},
	],
	"What does Empowered Spell (Metamagic) do?": [
		{
			type: "true_false",
			question:
				"Empowered Spell can be used together with another Metamagic option on the same spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which Metamagic option lets you reroll damage dice on a spell?",
			choices: ["Empowered Spell", "Heightened Spell", "Careful Spell", "Distant Spell"],
			correctChoiceIndex: 0,
		},
	],
	"What does Extended Spell (Metamagic) do?": [
		{
			type: "true_false",
			question: "Extended Spell can double a spell's duration up to a maximum of 24 hours.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which Metamagic option doubles a spell's duration?",
			choices: ["Extended Spell", "Distant Spell", "Quickened Spell", "Twinned Spell"],
			correctChoiceIndex: 0,
		},
	],
	"What does Heightened Spell (Metamagic) do?": [
		{
			type: "true_false",
			question: "Heightened Spell costs 3 sorcery points.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which Metamagic option gives a target disadvantage on its saving throw against your spell?",
			choices: ["Heightened Spell", "Careful Spell", "Empowered Spell", "Subtle Spell"],
			correctChoiceIndex: 0,
		},
	],
	"What does Quickened Spell (Metamagic) do?": [
		{
			type: "true_false",
			question: "Quickened Spell changes a spell's casting time from 1 action to 1 bonus action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many sorcery points does Quickened Spell cost?",
			choices: ["2", "1", "3", "5"],
			correctChoiceIndex: 0,
		},
	],
	"What does Subtle Spell (Metamagic) do?": [
		{
			type: "true_false",
			question: "Subtle Spell lets you cast a spell without verbal or somatic components.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which Metamagic option removes the need for verbal and somatic components?",
			choices: ["Subtle Spell", "Distant Spell", "Careful Spell", "Twinned Spell"],
			correctChoiceIndex: 0,
		},
	],
	"What does Twinned Spell (Metamagic) do?": [
		{
			type: "true_false",
			question:
				"Twinned Spell can be used on a spell that already targets more than one creature at its current level.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "How many sorcery points does Twinned Spell cost to twin a cantrip?",
			choices: ["1", "2", "3", "5"],
			correctChoiceIndex: 0,
		},
	],
	"At what levels does the Sorcerer gain Ability Score Improvement?": [
		{
			type: "true_false",
			question: "A Sorcerer gains an Ability Score Improvement at 19th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what levels does a Sorcerer gain Ability Score Improvement?",
			choices: [
				"4th, 8th, 12th, 16th, and 19th",
				"3rd, 10th, and 17th",
				"1st, 6th, 14th, and 18th",
				"2nd, 6th, and 20th",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Sorcerous Restoration (Sorcerer, 20th level)?": [
		{
			type: "true_false",
			question: "Sorcerous Restoration lets you regain sorcery points after a short rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many sorcery points does Sorcerous Restoration return after a short rest?",
			choices: ["4", "2", "5", "All expended sorcery points"],
			correctChoiceIndex: 0,
		},
	],
	"What is Dragon Ancestor (Draconic Bloodline, 1st level)?": [
		{
			type: "true_false",
			question: "Dragon Ancestor lets you speak, read, and write Draconic.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What damage type is associated with a Red dragon ancestor?",
			choices: ["Fire", "Cold", "Acid", "Lightning"],
			correctChoiceIndex: 0,
		},
	],
	"What is Draconic Resilience (Draconic Bloodline, 1st level)?": [
		{
			type: "true_false",
			question:
				"Draconic Resilience increases your HP maximum by 1 for each level you have in sorcerer.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is your AC while unarmored, from Draconic Resilience?",
			choices: [
				"13 + Dexterity modifier",
				"10 + Dexterity modifier",
				"13 + Constitution modifier",
				"12 + Dexterity modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Elemental Affinity (Draconic Bloodline, 6th level)?": [
		{
			type: "true_false",
			question:
				"Elemental Affinity lets you spend a sorcery point to gain resistance to your draconic damage type for 1 hour.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What does Elemental Affinity add to one damage roll of your draconic damage type?",
			choices: [
				"Your Charisma modifier",
				"Your sorcerer level",
				"Your proficiency bonus",
				"Your Constitution modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Dragon Wings (Draconic Bloodline, 14th level)?": [
		{
			type: "true_false",
			question: "Dragon Wings gives you a flying speed equal to your current speed.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How do you activate Dragon Wings?",
			choices: [
				"As a bonus action",
				"As an action",
				"As a reaction",
				"Automatically whenever you cast a spell",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Draconic Presence (Draconic Bloodline, 18th level)?": [
		{
			type: "true_false",
			question: "Draconic Presence costs 5 sorcery points to activate.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What saving throw must hostile creatures make against Draconic Presence?",
			choices: ["Wisdom", "Charisma", "Constitution", "Intelligence"],
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
