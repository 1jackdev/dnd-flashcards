const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Rogue";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What hit die does the Rogue use?": [
		{
			type: "true_false",
			question: "The Rogue's hit die is 1d8.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How much HP does a 1st-level Rogue start with (before Constitution modifier)?",
			choices: ["8", "10", "6", "12"],
			correctChoiceIndex: 0,
		},
	],
	"What armor and weapons is the Rogue proficient with?": [
		{
			type: "true_false",
			question: "Rogues are proficient with medium armor.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of these weapons is a Rogue proficient with by class?",
			choices: ["Rapier", "Greatsword", "Warhammer", "Longbow"],
			correctChoiceIndex: 0,
		},
	],
	"What saving throws is the Rogue proficient in?": [
		{
			type: "true_false",
			question: "Rogues have proficiency in Wisdom saving throws at 1st level.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which two saving throws is the Rogue proficient in at 1st level?",
			choices: [
				"Dexterity and Intelligence",
				"Strength and Constitution",
				"Wisdom and Charisma",
				"Dexterity and Wisdom",
			],
			correctChoiceIndex: 0,
		},
	],
	"What tools is the Rogue proficient with?": [
		{
			type: "true_false",
			question: "The Rogue is proficient with thieves' tools.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What tool proficiency does the Rogue gain at 1st level?",
			choices: ["Thieves' tools", "Herbalism kit", "Poisoner's kit", "Disguise kit"],
			correctChoiceIndex: 0,
		},
	],
	"How many skills can a Rogue choose at character creation?": [
		{
			type: "true_false",
			question: "A Rogue chooses four skill proficiencies at character creation.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"How many skill proficiencies does a Rogue choose from the class list at 1st level?",
			choices: ["Four", "Two", "Three", "Six"],
			correctChoiceIndex: 0,
		},
	],
	"What is Expertise (Rogue, 1st level)?": [
		{
			type: "true_false",
			question: "Expertise doubles your proficiency bonus for the chosen ability checks.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Rogue gain a second application of Expertise?",
			choices: ["6th level", "3rd level", "9th level", "11th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Sneak Attack (Rogue, 1st level)?": [
		{
			type: "true_false",
			question: "You can use Sneak Attack more than once per turn if you make multiple attacks.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which condition allows Sneak Attack without advantage on the attack roll?",
			choices: [
				"An unincapacitated ally is within 5 feet of the target and you don't have disadvantage",
				"You are hidden from all enemies",
				"You are wielding two weapons",
				"The target is prone",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does Sneak Attack damage scale?": [
		{
			type: "true_false",
			question: "At levels 19–20, Sneak Attack damage is 10d6.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How much Sneak Attack damage does a 5th-level Rogue deal?",
			choices: ["3d6", "2d6", "4d6", "1d6"],
			correctChoiceIndex: 0,
		},
	],
	"What is Thieves' Cant (Rogue, 1st level)?": [
		{
			type: "true_false",
			question: "Thieves' Cant conveys hidden messages within an otherwise normal conversation.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Besides hidden messages in speech, what else does knowing Thieves' Cant give you?",
			choices: [
				"A set of secret signs and symbols",
				"Advantage on Deception checks",
				"The ability to speak with animals",
				"Truespeech comprehensible to all creatures",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Cunning Action (Rogue, 2nd level)?": [
		{
			type: "true_false",
			question: "Cunning Action lets you take the Hide action as a bonus action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which action can you NOT take as a bonus action via Cunning Action?",
			choices: ["Attack", "Dash", "Disengage", "Hide"],
			correctChoiceIndex: 0,
		},
	],
	"What is Roguish Archetype (Rogue, 3rd level)?": [
		{
			type: "true_false",
			question: "Roguish Archetype features are gained at 3rd, 9th, 13th, and 17th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Rogue choose their Roguish Archetype?",
			choices: ["3rd", "1st", "6th", "9th"],
			correctChoiceIndex: 0,
		},
	],
	"At what levels does the Rogue gain Ability Score Improvement?": [
		{
			type: "true_false",
			question: "A Rogue can gain an Ability Score Improvement at 10th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which level is NOT one of the Rogue's Ability Score Improvement levels?",
			choices: ["14th", "4th", "8th", "12th"],
			correctChoiceIndex: 0,
		},
	],
	"What is Uncanny Dodge (Rogue, 5th level)?": [
		{
			type: "true_false",
			question:
				"Uncanny Dodge lets you halve damage from an attack made by an attacker you can't see.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What resource does Uncanny Dodge use?",
			choices: ["Your reaction", "Your bonus action", "Your action", "Your movement"],
			correctChoiceIndex: 0,
		},
	],
	"What is Evasion (Rogue, 7th level)?": [
		{
			type: "true_false",
			question:
				"With Evasion, a successful Dexterity saving throw against a fireball means you take no damage.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Rogue gain Evasion?",
			choices: ["7th", "5th", "11th", "15th"],
			correctChoiceIndex: 0,
		},
	],
	"What is Reliable Talent (Rogue, 11th level)?": [
		{
			type: "true_false",
			question: "Reliable Talent applies only to ability checks that add your proficiency bonus.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "With Reliable Talent, a d20 roll of 6 on an applicable check is treated as what?",
			choices: ["10", "6", "9", "20"],
			correctChoiceIndex: 0,
		},
	],
	"What is Blindsense (Rogue, 14th level)?": [
		{
			type: "true_false",
			question: "Blindsense requires you to be able to hear in order to function.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the range of a Rogue's Blindsense?",
			choices: ["10 feet", "5 feet", "30 feet", "60 feet"],
			correctChoiceIndex: 0,
		},
	],
	"What is Slippery Mind (Rogue, 15th level)?": [
		{
			type: "true_false",
			question: "Slippery Mind grants proficiency in Wisdom saving throws.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What saving throw proficiency does Slippery Mind grant?",
			choices: ["Wisdom", "Charisma", "Constitution", "Intelligence"],
			correctChoiceIndex: 0,
		},
	],
	"What is Elusive (Rogue, 18th level)?": [
		{
			type: "true_false",
			question:
				"Elusive prevents attack rolls from having advantage against you even while incapacitated.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What does Elusive prevent, provided you aren't incapacitated?",
			choices: [
				"Attack rolls having advantage against you",
				"Your own attack rolls having disadvantage",
				"Being surprised",
				"Falling prone",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Stroke of Luck (Rogue, 20th level)?": [
		{
			type: "true_false",
			question: "Stroke of Luck can turn a failed ability check into a 20.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How does Stroke of Luck recharge?",
			choices: [
				"On a short or long rest",
				"Only on a long rest",
				"At the start of each turn",
				"When you roll initiative",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Fast Hands (Thief, 3rd level)?": [
		{
			type: "true_false",
			question:
				"Fast Hands lets you use thieves' tools to disarm a trap as part of Cunning Action's bonus action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of these is NOT a use of Fast Hands?",
			choices: [
				"Cast a spell with a bonus action casting time",
				"Make a Sleight of Hand check",
				"Use thieves' tools to disarm a trap or open a lock",
				"Take the Use an Object action",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Second-Story Work (Thief, 3rd level)?": [
		{
			type: "true_false",
			question: "Second-Story Work removes the extra movement cost of climbing.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Second-Story Work increases running jump distance by an amount equal to what?",
			choices: [
				"Your Dexterity modifier",
				"Your Strength modifier",
				"Your proficiency bonus",
				"Your Rogue level",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Supreme Sneak (Thief, 9th level)?": [
		{
			type: "true_false",
			question:
				"Supreme Sneak grants advantage on Stealth checks even if you move your full speed.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"Supreme Sneak grants advantage on Dexterity (Stealth) checks under what condition?",
			choices: [
				"You move no more than half your speed that turn",
				"You are within 5 feet of an ally",
				"You are in dim light or darkness",
				"You haven't attacked that turn",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Use Magic Device (Thief, 13th level)?": [
		{
			type: "true_false",
			question:
				"Use Magic Device lets you ignore class, race, and level requirements on magic items.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What does Use Magic Device let a Rogue ignore?",
			choices: [
				"Class, race, and level requirements on magic items",
				"Attunement limits",
				"Spell components",
				"Curses on magic items",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Thief's Reflexes (Thief, 17th level)?": [
		{
			type: "true_false",
			question: "Thief's Reflexes can be used even when you are surprised.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"Thief's Reflexes lets you take an extra turn in the first round at what initiative?",
			choices: [
				"Your initiative minus 10",
				"Your initiative plus 10",
				"Initiative count 20",
				"The same initiative as your allies",
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
