const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Bard";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What hit die does the Bard use?": [
		{ type: "true_false", question: "The Bard's hit die is 1d8.", correctAnswer: true },
		{
			type: "multiple_choice",
			question: "What is a Bard's hit point maximum at 1st level?",
			choices: [
				"8 + Constitution modifier",
				"10 + Constitution modifier",
				"6 + Constitution modifier",
				"12 + Constitution modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"What armor and weapons is the Bard proficient with?": [
		{
			type: "true_false",
			question:
				"A Bard is proficient with hand crossbows, longswords, rapiers, and shortswords in addition to simple weapons.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which armor category are Bards proficient with?",
			choices: ["Light armor", "Medium armor", "Heavy armor", "No armor"],
			correctChoiceIndex: 0,
		},
	],
	"What saving throws is the Bard proficient in?": [
		{
			type: "true_false",
			question: "Bards are proficient in Dexterity and Charisma saving throws.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which two saving throws is the Bard proficient in?",
			choices: [
				"Dexterity and Charisma",
				"Intelligence and Wisdom",
				"Strength and Constitution",
				"Wisdom and Charisma",
			],
			correctChoiceIndex: 0,
		},
	],
	"How many skills can a Bard choose at character creation?": [
		{
			type: "true_false",
			question: "A Bard can choose any three skills at character creation.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many skills can a Bard choose at 1st level?",
			choices: ["Three", "Two", "Four", "Any number, with no limit"],
			correctChoiceIndex: 0,
		},
	],
	"What tools is the Bard proficient with?": [
		{
			type: "true_false",
			question: "A Bard chooses three musical instruments to be proficient with.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What kind of tool proficiency does a Bard start with?",
			choices: [
				"Three musical instruments of their choice",
				"One type of artisan's tools",
				"Thieves' tools",
				"Two musical instruments of their choice",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is the Bard's spellcasting ability?": [
		{
			type: "true_false",
			question: "The Bard's spellcasting ability is Charisma.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the Bard's spellcasting ability?",
			choices: ["Charisma", "Intelligence", "Wisdom", "Strength"],
			correctChoiceIndex: 0,
		},
	],
	"How many cantrips does a Bard start with, and how many total at 20th level?": [
		{
			type: "true_false",
			question: "A Bard knows 4 cantrips by 10th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many cantrips does a Bard know at 1st level?",
			choices: ["2", "3", "4", "0"],
			correctChoiceIndex: 0,
		},
	],
	"How does the Bard regain spell slots?": [
		{
			type: "true_false",
			question: "A Bard regains all expended spell slots after a long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "When does a Bard regain expended spell slots?",
			choices: [
				"After a long rest",
				"After a short rest",
				"After finishing any rest, long or short",
				"At the start of each day, regardless of rest",
			],
			correctChoiceIndex: 0,
		},
	],
	"Can a Bard replace spells they know?": [
		{
			type: "true_false",
			question: "A Bard can replace one known spell each time they gain a level in the class.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many known bard spells can a Bard replace when they gain a level?",
			choices: ["One", "All of them", "Two", "None — bard spells known are fixed"],
			correctChoiceIndex: 0,
		},
	],
	"What is Ritual Casting (Bard)?": [
		{
			type: "true_false",
			question:
				"A Bard can cast any bard spell they know as a ritual, provided the spell has the ritual tag.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How does Bard Ritual Casting work?",
			choices: [
				"They can cast any known bard spell with the ritual tag as a ritual",
				"They must have the spell written in a ritual book, like a Wizard's spellbook",
				"They can only cast rituals that aren't on the bard spell list",
				"They must expend a spell slot each time they cast a ritual",
			],
			correctChoiceIndex: 0,
		},
	],
	"What can a Bard use as a spellcasting focus?": [
		{
			type: "true_false",
			question: "A Bard can use a musical instrument as a spellcasting focus.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What can a Bard use as a spellcasting focus?",
			choices: [
				"A musical instrument",
				"An arcane focus like a wand or crystal",
				"A holy symbol",
				"A druidic focus like a sprig of mistletoe",
			],
			correctChoiceIndex: 0,
		},
	],
	"How do you grant Bardic Inspiration?": [
		{
			type: "true_false",
			question: "Granting Bardic Inspiration requires a bonus action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Within what range can a Bard grant Bardic Inspiration?",
			choices: [
				"60 feet",
				"30 feet",
				"120 feet",
				"Unlimited range, as long as there is line of sight",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does a creature use a Bardic Inspiration die?": [
		{
			type: "true_false",
			question:
				"A creature can decide to use its Bardic Inspiration die after rolling the d20 but before the GM says whether the roll succeeds.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How long does a creature have to use a Bardic Inspiration die once granted?",
			choices: ["10 minutes", "1 minute", "1 hour", "Until the end of the encounter"],
			correctChoiceIndex: 0,
		},
	],
	"How many times per rest can the Bard use Bardic Inspiration, and when does it recharge?": [
		{
			type: "true_false",
			question:
				"The number of Bardic Inspiration uses a Bard has equals their Charisma modifier, with a minimum of one.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"At what level does Bardic Inspiration begin recharging on a short rest as well as a long rest?",
			choices: ["5th level", "2nd level", "10th level", "1st level"],
			correctChoiceIndex: 0,
		},
	],
	"How does the Bardic Inspiration die scale?": [
		{
			type: "true_false",
			question: "The Bardic Inspiration die becomes a d8 at 5th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What size is the Bardic Inspiration die at 10th level?",
			choices: ["d10", "d8", "d12", "d6"],
			correctChoiceIndex: 0,
		},
	],
	"What is Jack of All Trades (Bard, 2nd level)?": [
		{
			type: "true_false",
			question:
				"Jack of All Trades adds half your proficiency bonus, rounded down, to ability checks that don't already include your proficiency bonus.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Bard gain Jack of All Trades?",
			choices: ["2nd level", "1st level", "3rd level", "5th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Song of Rest (Bard, 2nd level)?": [
		{
			type: "true_false",
			question:
				"Song of Rest grants extra hit points to friendly creatures who spend Hit Dice during a short rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What die does Song of Rest use when first gained at 2nd level?",
			choices: ["1d6", "1d8", "1d4", "1d10"],
			correctChoiceIndex: 0,
		},
	],
	"What is Bard College (3rd level)?": [
		{
			type: "true_false",
			question: "Choosing a Bard College grants features at 3rd, 6th, and 14th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Bard choose a Bard College?",
			choices: ["3rd level", "1st level", "2nd level", "6th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Expertise (Bard, 3rd level)?": [
		{
			type: "true_false",
			question: "Bard Expertise doubles your proficiency bonus for two chosen skill proficiencies.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Bard gain two additional Expertise skills?",
			choices: ["10th level", "6th level", "14th level", "3rd level"],
			correctChoiceIndex: 0,
		},
	],
	"At what levels does the Bard gain Ability Score Improvement?": [
		{
			type: "true_false",
			question: "A Bard gains an Ability Score Improvement at 19th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is one of the Bard's Ability Score Improvement levels?",
			choices: ["8th level", "5th level", "6th level", "10th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Font of Inspiration (Bard, 5th level)?": [
		{
			type: "true_false",
			question:
				"Font of Inspiration lets a Bard regain expended Bardic Inspiration uses after a short rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Bard gain Font of Inspiration?",
			choices: ["5th level", "2nd level", "6th level", "10th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Countercharm (Bard, 6th level)?": [
		{
			type: "true_false",
			question:
				"Countercharm grants advantage on saving throws against being frightened or charmed to you and friendly creatures within 30 feet who can hear you.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What action cost is required to start Countercharm?",
			choices: ["An action", "A bonus action", "A reaction", "No action — it is a passive ability"],
			correctChoiceIndex: 0,
		},
	],
	"What is Magical Secrets (Bard)?": [
		{
			type: "true_false",
			question:
				"Magical Secrets lets a Bard learn two spells of any level or cantrip from any class's spell list.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At which levels does a Bard gain Magical Secrets?",
			choices: [
				"10th, 14th, and 18th",
				"6th, 10th, and 14th",
				"3rd, 6th, and 14th",
				"5th, 10th, and 15th",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Superior Inspiration (Bard, 20th level)?": [
		{
			type: "true_false",
			question:
				"Superior Inspiration triggers when you roll initiative and have no uses of Bardic Inspiration remaining.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Bard gain Superior Inspiration?",
			choices: ["20th level", "18th level", "19th level", "14th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Bonus Proficiencies (College of Lore, 3rd level)?": [
		{
			type: "true_false",
			question:
				"College of Lore's Bonus Proficiencies feature grants proficiency in three skills of your choice.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a College of Lore Bard gain Bonus Proficiencies?",
			choices: ["3rd level", "1st level", "6th level", "14th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Cutting Words (College of Lore, 3rd level)?": [
		{
			type: "true_false",
			question: "Cutting Words requires expending a Bardic Inspiration die as a reaction.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What action does Cutting Words require?",
			choices: ["A reaction", "A bonus action", "An action", "No action — it is a passive ability"],
			correctChoiceIndex: 0,
		},
	],
	"What is Additional Magical Secrets (College of Lore, 6th level)?": [
		{
			type: "true_false",
			question:
				"Additional Magical Secrets spells don't count against the Bard's number of bard spells known.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a College of Lore Bard gain Additional Magical Secrets?",
			choices: ["6th level", "3rd level", "10th level", "14th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Peerless Skill (College of Lore, 14th level)?": [
		{
			type: "true_false",
			question:
				"Peerless Skill lets a Bard add a Bardic Inspiration die to an ability check after expending a use.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a College of Lore Bard gain Peerless Skill?",
			choices: ["14th level", "6th level", "10th level", "18th level"],
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
