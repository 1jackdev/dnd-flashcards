const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Wizard";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What hit die does the Wizard use?": [
		{ type: "true_false", question: "The Wizard's hit die is 1d6.", correctAnswer: true },
		{
			type: "multiple_choice",
			question:
				"How much HP does a 1st-level Wizard have, before adding their Constitution modifier?",
			choices: ["6", "8", "10", "4"],
			correctChoiceIndex: 0,
		},
	],
	"What armor and weapons is the Wizard proficient with?": [
		{
			type: "true_false",
			question: "Wizards are not proficient with any armor.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of these weapons is a Wizard proficient with?",
			choices: ["Quarterstaff", "Longsword", "Battleaxe", "Rapier"],
			correctChoiceIndex: 0,
		},
	],
	"What saving throws is the Wizard proficient in?": [
		{
			type: "true_false",
			question: "Wizards are proficient in Intelligence and Wisdom saving throws.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which two saving throws is the Wizard proficient in?",
			choices: [
				"Intelligence and Wisdom",
				"Strength and Constitution",
				"Constitution and Charisma",
				"Wisdom and Charisma",
			],
			correctChoiceIndex: 0,
		},
	],
	"What skills can a Wizard choose from at character creation?": [
		{
			type: "true_false",
			question:
				"A Wizard can choose skill proficiencies from Arcana, History, Insight, Investigation, Medicine, and Religion.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many skills does a Wizard choose at character creation?",
			choices: ["2", "3", "4", "1"],
			correctChoiceIndex: 0,
		},
	],
	"What is the Wizard's spellcasting ability?": [
		{
			type: "true_false",
			question: "A Wizard's spell save DC equals 8 plus proficiency bonus plus Charisma modifier.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What is the Wizard's spellcasting ability?",
			choices: ["Intelligence", "Charisma", "Wisdom", "Constitution"],
			correctChoiceIndex: 0,
		},
	],
	"How many cantrips does a Wizard start with?": [
		{
			type: "true_false",
			question: "A Wizard knows 5 cantrips at 1st level.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "How many cantrips does a Wizard know at 1st level?",
			choices: ["3", "4", "2", "5"],
			correctChoiceIndex: 0,
		},
	],
	"How does the Wizard prepare spells?": [
		{
			type: "true_false",
			question:
				"A Wizard can prepare a number of spells equal to their Intelligence modifier plus their wizard level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"How long does it take a Wizard to swap out one spell on their prepared list during a long rest?",
			choices: [
				"1 minute per level of the spell",
				"10 minutes total, regardless of spell level",
				"1 hour per spell",
				"A full 8-hour long rest per spell",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is the Wizard's Spellbook?": [
		{
			type: "true_false",
			question: "A Wizard's spellbook starts with 6 first-level wizard spells.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"How much does it cost to copy a newly found spell into your spellbook, per spell level?",
			choices: ["2 hours and 50 gp", "1 hour and 10 gp", "1 hour and 25 gp", "8 hours and 100 gp"],
			correctChoiceIndex: 0,
		},
	],
	"What is Ritual Casting (Wizard)?": [
		{
			type: "true_false",
			question:
				"A Wizard can cast a ritual-tagged spell from their spellbook even if it isn't currently prepared.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is required for a Wizard to cast a spell as a ritual?",
			choices: [
				"The spell has the ritual tag and is in the spellbook",
				"The spell must currently be prepared",
				"The spell must be 1st level or lower",
				"The Wizard must expend a spell slot",
			],
			correctChoiceIndex: 0,
		},
	],
	"What can a Wizard use as a spellcasting focus?": [
		{
			type: "true_false",
			question: "A Wizard can use a druidic focus as a spellcasting focus.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What can a Wizard use as a spellcasting focus?",
			choices: ["An arcane focus", "A holy symbol", "A druidic focus", "A musical instrument"],
			correctChoiceIndex: 0,
		},
	],
	"How much does copying a spell into a Wizard spellbook cost?": [
		{
			type: "true_false",
			question: "Copying your own spellbook as a backup costs 1 hour and 10 gp per spell level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"How much does copying a newly acquired spell (not your own spellbook) cost per spell level?",
			choices: ["2 hours and 50 gp", "1 hour and 10 gp", "1 hour and 25 gp", "4 hours and 100 gp"],
			correctChoiceIndex: 0,
		},
	],
	"What is Arcane Recovery (Wizard, 1st level)?": [
		{
			type: "true_false",
			question: "Arcane Recovery can be used once per day when you finish a short rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What is the maximum combined level of spell slots you can recover with Arcane Recovery?",
			choices: [
				"Half your wizard level, rounded up",
				"Your full wizard level",
				"Half your wizard level, rounded down",
				"Equal to your Intelligence modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Arcane Tradition (Wizard, 2nd level)?": [
		{
			type: "true_false",
			question: "Arcane Tradition grants features at 2nd, 6th, 10th, and 14th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Wizard choose their Arcane Tradition?",
			choices: ["2nd level", "1st level", "3rd level", "6th level"],
			correctChoiceIndex: 0,
		},
	],
	"At what levels does the Wizard gain Ability Score Improvement?": [
		{
			type: "true_false",
			question: "A Wizard gains an Ability Score Improvement at 19th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At which of these levels does a Wizard NOT gain an Ability Score Improvement?",
			choices: ["14th", "4th", "8th", "12th"],
			correctChoiceIndex: 0,
		},
	],
	"What is Spell Mastery (Wizard, 18th level)?": [
		{
			type: "true_false",
			question:
				"Spell Mastery lets you cast your chosen 1st- and 2nd-level spells at their lowest level without expending a spell slot.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Wizard gain Spell Mastery?",
			choices: ["18th", "20th", "14th", "16th"],
			correctChoiceIndex: 0,
		},
	],
	"What is Signature Spells (Wizard, 20th level)?": [
		{
			type: "true_false",
			question:
				"Signature Spells are always prepared and don't count against the Wizard's normal preparation limit.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What do Signature Spells grant a Wizard per short or long rest?",
			choices: [
				"One free casting each of two chosen 3rd-level spells",
				"Unlimited castings of any 3rd-level spell",
				"One free casting of a single chosen spell",
				"Two free castings each of two chosen spells",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Evocation Savant (School of Evocation, 2nd level)?": [
		{
			type: "true_false",
			question:
				"Evocation Savant halves the gold and time needed to copy an evocation spell into your spellbook.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"With Evocation Savant, how much gold per spell level does copying an evocation spell cost?",
			choices: ["25 gp", "50 gp", "10 gp", "100 gp"],
			correctChoiceIndex: 0,
		},
	],
	"What is Sculpt Spells (School of Evocation, 2nd level)?": [
		{
			type: "true_false",
			question:
				"With Sculpt Spells, chosen creatures automatically succeed on their saving throw and take no damage.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"How many creatures can you shield from an evocation spell's effects using Sculpt Spells?",
			choices: [
				"1 plus the spell's level",
				"Equal to your Intelligence modifier",
				"Equal to your wizard level",
				"Unlimited",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Potent Cantrip (School of Evocation, 6th level)?": [
		{
			type: "true_false",
			question:
				"With Potent Cantrip, a creature that succeeds on its save against your cantrip takes no damage at all.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"What happens when a creature succeeds on its save against your cantrip with Potent Cantrip?",
			choices: [
				"It takes half the cantrip's damage but no additional effect",
				"It takes no damage",
				"It takes full damage",
				"It becomes immune to that cantrip for 24 hours",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Empowered Evocation (School of Evocation, 10th level)?": [
		{
			type: "true_false",
			question:
				"Empowered Evocation adds your Intelligence modifier to one damage roll of a wizard evocation spell you cast.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Wizard gain Empowered Evocation?",
			choices: ["10th", "6th", "14th", "2nd"],
			correctChoiceIndex: 0,
		},
	],
	"What is Overchannel (School of Evocation, 14th level)?": [
		{
			type: "true_false",
			question:
				"The necrotic damage a Wizard takes from repeated Overchannel use ignores resistance and immunity.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What happens the first time per long rest you use Overchannel?",
			choices: [
				"No additional cost — you deal maximum damage with no drawback",
				"You take 2d12 necrotic damage",
				"You must make a Constitution saving throw",
				"You lose one spell slot",
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
