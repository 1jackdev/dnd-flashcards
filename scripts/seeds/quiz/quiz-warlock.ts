const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Warlock";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What hit die does the Warlock use?": [
		{ type: "true_false", question: "The Warlock's hit die is 1d8.", correctAnswer: true },
		{
			type: "multiple_choice",
			question: "What is a Warlock's starting hit points at 1st level?",
			choices: [
				"8 + Constitution modifier",
				"10 + Constitution modifier",
				"6 + Constitution modifier",
				"12 + Constitution modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"What armor and weapons is the Warlock proficient with?": [
		{
			type: "true_false",
			question: "Warlocks are proficient with light armor and simple weapons.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which armor proficiency does a Warlock have?",
			choices: ["Light armor", "Medium armor", "Heavy armor", "No armor proficiency"],
			correctChoiceIndex: 0,
		},
	],
	"What saving throws is the Warlock proficient in?": [
		{
			type: "true_false",
			question: "Warlocks are proficient in Wisdom and Charisma saving throws.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which saving throw proficiencies does the Warlock have?",
			choices: [
				"Wisdom and Charisma",
				"Constitution and Charisma",
				"Intelligence and Wisdom",
				"Strength and Constitution",
			],
			correctChoiceIndex: 0,
		},
	],
	"What skills can a Warlock choose from at character creation?": [
		{
			type: "true_false",
			question: "A Warlock chooses 2 skills from a list that includes Arcana and Deception.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many skill proficiencies does a Warlock choose at character creation?",
			choices: ["2", "3", "4", "1"],
			correctChoiceIndex: 0,
		},
	],
	"What is Otherworldly Patron (Warlock, 1st level)?": [
		{
			type: "true_false",
			question: "Otherworldly Patron grants additional features at 6th, 10th, and 14th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"At what levels does Otherworldly Patron grant additional features (besides 1st level)?",
			choices: [
				"6th, 10th, and 14th",
				"3rd, 6th, and 9th",
				"2nd, 6th, and 10th",
				"5th, 9th, and 13th",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Pact Magic, and how does it differ from normal spellcasting?": [
		{
			type: "true_false",
			question:
				"Unlike most casters, a Warlock regains all expended Pact Magic spell slots on a short rest, not just a long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What distinguishes Pact Magic from a Wizard's normal spellcasting?",
			choices: [
				"All of the warlock's spell slots are the same level, and they recover on a short rest",
				"Spell slots recover only on a long rest, same as a Wizard",
				"The warlock prepares spells each day like a Cleric",
				"The warlock uses a spellbook to record known spells",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is the Warlock's spellcasting ability?": [
		{
			type: "true_false",
			question:
				"A Warlock's spell save DC is calculated as 8 + proficiency bonus + Charisma modifier.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is a Warlock's spellcasting ability?",
			choices: ["Charisma", "Intelligence", "Wisdom", "Constitution"],
			correctChoiceIndex: 0,
		},
	],
	"How many spells does a Warlock know?": [
		{
			type: "true_false",
			question:
				"A Warlock can only know spells of a level no higher than their current spell slot level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many spells does a Warlock know at 1st level?",
			choices: ["2", "1", "3", "4"],
			correctChoiceIndex: 0,
		},
	],
	"What are Eldritch Invocations (Warlock, 2nd level)?": [
		{
			type: "true_false",
			question: "A Warlock gains their first Eldritch Invocations at 2nd level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many total Eldritch Invocations does a Warlock know by 20th level?",
			choices: ["8", "10", "6", "4"],
			correctChoiceIndex: 0,
		},
	],
	"What does Agonizing Blast (invocation) do?": [
		{
			type: "true_false",
			question: "Agonizing Blast requires the eldritch blast cantrip as a prerequisite.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What does Agonizing Blast add to the damage of eldritch blast?",
			choices: [
				"Your Charisma modifier",
				"Your proficiency bonus",
				"Your Warlock level",
				"Your Constitution modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does Armor of Shadows (invocation) do?": [
		{
			type: "true_false",
			question:
				"Armor of Shadows lets you cast mage armor on yourself without expending a spell slot.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What spell can you cast at will with the Armor of Shadows invocation?",
			choices: ["Mage armor", "Shield", "False life", "Alarm"],
			correctChoiceIndex: 0,
		},
	],
	"What does Devil's Sight (invocation) do?": [
		{
			type: "true_false",
			question: "Devil's Sight lets you see in magical darkness, not just nonmagical darkness.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How far can you see in darkness with the Devil's Sight invocation?",
			choices: ["120 feet", "60 feet", "30 feet", "300 feet"],
			correctChoiceIndex: 0,
		},
	],
	"What does Eldritch Spear (invocation) do?": [
		{
			type: "true_false",
			question: "Eldritch Spear increases the range of eldritch blast to 300 feet.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the range of eldritch blast after taking Eldritch Spear?",
			choices: ["300 feet", "120 feet", "60 feet", "150 feet"],
			correctChoiceIndex: 0,
		},
	],
	"What does Repelling Blast (invocation) do?": [
		{
			type: "true_false",
			question:
				"Repelling Blast pushes a creature you hit with eldritch blast up to 10 feet away from you.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What does Repelling Blast do when you hit a creature with eldritch blast?",
			choices: [
				"Pushes the creature up to 10 feet away from you in a straight line",
				"Adds your Charisma modifier to the damage",
				"Increases the spell's range to 300 feet",
				"Grants you a bonus action attack",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does Thirsting Blade (invocation) do?": [
		{
			type: "true_false",
			question: "Thirsting Blade requires the Pact of the Blade feature as a prerequisite.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What level is required to take the Thirsting Blade invocation?",
			choices: ["5th level", "3rd level", "12th level", "1st level"],
			correctChoiceIndex: 0,
		},
	],
	"What does Lifedrinker (invocation) do?": [
		{
			type: "true_false",
			question:
				"Lifedrinker deals extra necrotic damage equal to your Charisma modifier, minimum of 1.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level can a Warlock take the Lifedrinker invocation?",
			choices: ["12th level", "5th level", "14th level", "10th level"],
			correctChoiceIndex: 0,
		},
	],
	"What does Book of Ancient Secrets (invocation) do?": [
		{
			type: "true_false",
			question: "Book of Ancient Secrets requires the Pact of the Tome as a prerequisite.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"How many 1st-level ritual spells can you initially inscribe with Book of Ancient Secrets?",
			choices: ["Two", "Three", "One", "Four"],
			correctChoiceIndex: 0,
		},
	],
	"What does Voice of the Chain Master (invocation) do?": [
		{
			type: "true_false",
			question: "Voice of the Chain Master requires the Pact of the Chain as a prerequisite.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What does the Voice of the Chain Master invocation let you do?",
			choices: [
				"Communicate telepathically with your familiar and perceive through its senses",
				"Attack twice with your pact weapon whenever you take the Attack action",
				"Cast ritual spells from your Book of Shadows",
				"Gain resistance to a damage type after finishing a rest",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Pact Boon (Warlock, 3rd level)?": [
		{
			type: "true_false",
			question:
				"Pact of the Tome grants you a Book of Shadows containing three cantrips chosen from any class's spell list.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which familiar options are available through Pact of the Chain?",
			choices: [
				"Imp, pseudodragon, quasit, or sprite",
				"Owl, cat, raven, or weasel (the standard find familiar forms only)",
				"Any celestial, fey, or fiend of challenge rating 1 or lower",
				"Homunculus, mephit, or pixie",
			],
			correctChoiceIndex: 0,
		},
	],
	"At what levels does the Warlock gain Ability Score Improvement?": [
		{
			type: "true_false",
			question: "A Warlock gains an Ability Score Improvement at 19th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what levels does a Warlock gain Ability Score Improvements?",
			choices: [
				"4th, 8th, 12th, 16th, and 19th",
				"4th, 8th, 12th, 16th, and 20th",
				"3rd, 6th, 9th, 12th, and 15th",
				"4th, 10th, 14th, and 18th",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Mystic Arcanum (Warlock, 11th level)?": [
		{
			type: "true_false",
			question:
				"Mystic Arcanum spells can be cast once without expending a spell slot, and the use recharges on a long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"At what level does a Warlock gain their first Mystic Arcanum spell (a 6th-level spell)?",
			choices: ["11th", "13th", "15th", "17th"],
			correctChoiceIndex: 0,
		},
	],
	"What is Eldritch Master (Warlock, 20th level)?": [
		{
			type: "true_false",
			question:
				"Eldritch Master lets you regain all expended Pact Magic spell slots once per long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How long does it take to use Eldritch Master?",
			choices: ["1 minute", "1 action", "10 minutes", "1 hour"],
			correctChoiceIndex: 0,
		},
	],
	"What expanded spells does The Fiend patron grant?": [
		{
			type: "true_false",
			question: "The Fiend patron's expanded spell list includes fireball at 3rd level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which spell is on The Fiend's expanded spell list at the 5th-spell-level tier?",
			choices: ["Flame strike", "Fire shield", "Scorching ray", "Command"],
			correctChoiceIndex: 0,
		},
	],
	"What is Dark One's Blessing (The Fiend, 1st level)?": [
		{
			type: "true_false",
			question:
				"Dark One's Blessing grants temporary hit points equal to your Charisma modifier plus your warlock level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What triggers Dark One's Blessing?",
			choices: [
				"Reducing a hostile creature to 0 hit points",
				"Finishing a short or long rest",
				"Taking damage from an attack",
				"Casting a spell using a Pact Magic slot",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Dark One's Own Luck (The Fiend, 6th level)?": [
		{
			type: "true_false",
			question:
				"Dark One's Own Luck lets you add a d10 to an ability check or saving throw after seeing the initial roll but before effects occur.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How does Dark One's Own Luck recharge?",
			choices: [
				"On a short or long rest",
				"Only on a long rest",
				"At the start of your turn",
				"When you reduce a creature to 0 hit points",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Fiendish Resilience (The Fiend, 10th level)?": [
		{
			type: "true_false",
			question:
				"Fiendish Resilience's resistance can be bypassed by magical weapons and silver weapons.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "When can you choose a new damage type for Fiendish Resilience?",
			choices: [
				"When you finish a short or long rest",
				"Only once per long rest, at dawn",
				"As a bonus action in combat",
				"Only when you take the Attack action",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Hurl Through Hell (The Fiend, 14th level)?": [
		{
			type: "true_false",
			question: "Hurl Through Hell can be used once per long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How much psychic damage does a non-fiend creature take from Hurl Through Hell?",
			choices: ["10d10", "8d6", "6d10", "12d8"],
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
