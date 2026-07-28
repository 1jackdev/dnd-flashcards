const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Fighter";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What hit die does the Fighter use?": [
		{
			type: "true_false",
			question: "The Fighter's hit die is 1d10.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the Fighter's hit die?",
			choices: ["d10", "d8", "d12", "d6"],
			correctChoiceIndex: 0,
		},
	],
	"What armor and weapons is the Fighter proficient with?": [
		{
			type: "true_false",
			question:
				"Fighters are proficient with all armor, shields, and both simple and martial weapons.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which weapon proficiencies does the Fighter have?",
			choices: [
				"Simple and martial weapons",
				"Simple weapons only",
				"Martial weapons only, no simple weapons",
				"Simple weapons and light armor only",
			],
			correctChoiceIndex: 0,
		},
	],
	"What saving throws is the Fighter proficient in?": [
		{
			type: "true_false",
			question: "Fighters have proficiency in Strength and Constitution saving throws.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which saving throws is the Fighter proficient in?",
			choices: [
				"Strength and Constitution",
				"Strength and Dexterity",
				"Constitution and Wisdom",
				"Dexterity and Constitution",
			],
			correctChoiceIndex: 0,
		},
	],
	"What skills can a Fighter choose from at character creation?": [
		{
			type: "true_false",
			question: "A Fighter chooses 2 skills from a list that includes Athletics and Perception.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many skills does a Fighter choose from their class skill list at 1st level?",
			choices: ["2", "4", "3", "1"],
			correctChoiceIndex: 0,
		},
	],
	"What does the Archery fighting style do?": [
		{
			type: "true_false",
			question: "The Archery fighting style grants a +2 bonus to attack rolls with ranged weapons.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which fighting style grants a +2 bonus to attack rolls with ranged weapons?",
			choices: ["Archery", "Dueling", "Defense", "Two-Weapon Fighting"],
			correctChoiceIndex: 0,
		},
	],
	"What does the Defense fighting style do?": [
		{
			type: "true_false",
			question: "The Defense fighting style grants a +1 bonus to AC while wearing armor.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which fighting style grants a +1 bonus to AC while wearing armor?",
			choices: ["Defense", "Dueling", "Archery", "Great Weapon Fighting"],
			correctChoiceIndex: 0,
		},
	],
	"What does the Dueling fighting style do?": [
		{
			type: "true_false",
			question:
				"Dueling grants a +2 bonus to damage rolls when wielding a melee weapon in one hand and no other weapons.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which fighting style grants +2 to damage rolls when wielding a one-handed melee weapon with no other weapons?",
			choices: ["Dueling", "Defense", "Two-Weapon Fighting", "Great Weapon Fighting"],
			correctChoiceIndex: 0,
		},
	],
	"What does the Great Weapon Fighting style do?": [
		{
			type: "true_false",
			question:
				"With Great Weapon Fighting, if you reroll a 1 or 2 on a damage die and get another 1 or 2, you must still use that new result.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which fighting style lets you reroll 1s and 2s on damage dice for two-handed or versatile weapons?",
			choices: ["Great Weapon Fighting", "Dueling", "Archery", "Protection"],
			correctChoiceIndex: 0,
		},
	],
	"What does the Protection fighting style do?": [
		{
			type: "true_false",
			question: "The Protection fighting style requires you to be wielding a shield.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which fighting style requires a shield to use?",
			choices: ["Protection", "Defense", "Dueling", "Two-Weapon Fighting"],
			correctChoiceIndex: 0,
		},
	],
	"What does the Two-Weapon Fighting style do?": [
		{
			type: "true_false",
			question:
				"Two-Weapon Fighting lets you add your ability modifier to the damage of your second attack when engaging in two-weapon fighting.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which fighting style allows you to add your ability modifier to the damage of the second attack when two-weapon fighting?",
			choices: ["Two-Weapon Fighting", "Dueling", "Great Weapon Fighting", "Archery"],
			correctChoiceIndex: 0,
		},
	],
	"Can a Fighter take the same Fighting Style more than once?": [
		{
			type: "true_false",
			question: "A Fighter can choose the same Fighting Style twice to double its benefit.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"What happens if a Fighter is offered to choose a Fighting Style again but already has one?",
			choices: [
				"They must pick a different option from the list",
				"They can pick the same one again to double the bonus",
				"They lose their current Fighting Style and must pick fresh",
				"They gain all Fighting Styles automatically",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Second Wind (Fighter, 1st level)?": [
		{
			type: "true_false",
			question: "Second Wind is used as a bonus action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How much HP does Second Wind restore?",
			choices: [
				"1d10 + your fighter level",
				"1d8 + your fighter level",
				"2d10",
				"1d10 + your Constitution modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Action Surge (Fighter, 2nd level)?": [
		{
			type: "true_false",
			question:
				"At 17th level, a Fighter can use Action Surge twice per rest, but only once per turn.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How does Action Surge recharge?",
			choices: [
				"On a short or long rest",
				"On a long rest only",
				"On a short rest only",
				"It doesn't recharge; it's usable at will",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Martial Archetype (Fighter, 3rd level)?": [
		{
			type: "true_false",
			question:
				"Martial Archetype grants additional features at 3rd, 7th, 10th, 15th, and 18th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Fighter choose a Martial Archetype?",
			choices: ["3rd", "1st", "2nd", "4th"],
			correctChoiceIndex: 0,
		},
	],
	"At what levels does the Fighter gain Ability Score Improvement?": [
		{
			type: "true_false",
			question: "Fighters gain more Ability Score Improvements than any other class.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At which of these levels does a Fighter NOT gain an Ability Score Improvement?",
			choices: ["10th", "4th", "6th", "8th"],
			correctChoiceIndex: 0,
		},
	],
	"How does Fighter Extra Attack scale?": [
		{
			type: "true_false",
			question: "A 20th-level Fighter can make 4 attacks with the Attack action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Fighter gain a third attack from Extra Attack?",
			choices: ["11th", "5th", "17th", "20th"],
			correctChoiceIndex: 0,
		},
	],
	"What is Indomitable (Fighter), and how does it scale?": [
		{
			type: "true_false",
			question:
				"When you use Indomitable to reroll a failed saving throw, you must use the new roll, even if it's worse.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Fighter gain a third use of Indomitable per long rest?",
			choices: ["17th", "13th", "9th", "20th"],
			correctChoiceIndex: 0,
		},
	],
	"What is Improved Critical (Champion, 3rd level)?": [
		{
			type: "true_false",
			question: "Improved Critical scores a critical hit on a roll of 19 or 20.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What roll range scores a critical hit with Improved Critical?",
			choices: ["19-20", "18-20", "20 only", "17-20"],
			correctChoiceIndex: 0,
		},
	],
	"What is Remarkable Athlete (Champion, 7th level)?": [
		{
			type: "true_false",
			question:
				"Remarkable Athlete adds half your proficiency bonus, rounded up, to certain ability checks.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which ability checks does Remarkable Athlete apply its bonus to?",
			choices: [
				"Strength, Dexterity, or Constitution checks that don't already use your proficiency bonus",
				"Any ability check you make",
				"Intelligence and Wisdom checks only",
				"Only Athletics checks",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Additional Fighting Style (Champion, 10th level)?": [
		{
			type: "true_false",
			question: "Additional Fighting Style lets a Champion choose a second Fighting Style option.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What does Additional Fighting Style let a Champion do?",
			choices: [
				"Choose a second Fighting Style option",
				"Retrain their existing Fighting Style",
				"Use two Fighting Styles at once without choosing a new one",
				"Gain the Archery fighting style automatically",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Superior Critical (Champion, 15th level)?": [
		{
			type: "true_false",
			question: "Superior Critical scores a critical hit on a roll of 18, 19, or 20.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What roll range scores a critical hit with Superior Critical?",
			choices: ["18-20", "19-20", "17-20", "20 only"],
			correctChoiceIndex: 0,
		},
	],
	"What is Survivor (Champion, 18th level)?": [
		{
			type: "true_false",
			question: "Survivor only triggers if you have more than 0 hit points remaining.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How much HP does Survivor regain each turn when triggered?",
			choices: [
				"5 + your Constitution modifier",
				"1d10 + your Constitution modifier",
				"Half your Fighter level",
				"10 + your Constitution modifier",
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
