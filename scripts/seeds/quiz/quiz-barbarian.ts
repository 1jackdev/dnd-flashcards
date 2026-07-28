const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Barbarian";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What hit die does the Barbarian use?": [
		{
			type: "true_false",
			question: "The Barbarian's hit die is 1d12.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the Barbarian's hit die?",
			choices: ["1d12", "1d10", "1d8", "1d6"],
			correctChoiceIndex: 0,
		},
	],
	"What armor and weapons is the Barbarian proficient with?": [
		{
			type: "true_false",
			question: "Barbarians are proficient with heavy armor.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is the Barbarian NOT proficient with?",
			choices: ["Heavy armor", "Light armor", "Medium armor", "Shields"],
			correctChoiceIndex: 0,
		},
	],
	"What saving throws is the Barbarian proficient in?": [
		{
			type: "true_false",
			question: "Barbarians are proficient in Strength and Constitution saving throws.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which saving throws is the Barbarian proficient in?",
			choices: [
				"Strength and Constitution",
				"Strength and Dexterity",
				"Dexterity and Intelligence",
				"Wisdom and Charisma",
			],
			correctChoiceIndex: 0,
		},
	],
	"What skills can a Barbarian choose from at character creation?": [
		{
			type: "true_false",
			question: "A Barbarian can choose Athletics as one of their starting skill proficiencies.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which skill is NOT on the Barbarian's skill list at character creation?",
			choices: ["Persuasion", "Athletics", "Survival", "Intimidation"],
			correctChoiceIndex: 0,
		},
	],
	"How do you enter Rage?": [
		{
			type: "true_false",
			question: "A Barbarian enters Rage as a bonus action on their turn.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What action type is required to enter Rage?",
			choices: ["Bonus action", "Action", "Reaction", "Free action"],
			correctChoiceIndex: 0,
		},
	],
	"What three benefits does Rage provide (while not wearing heavy armor)?": [
		{
			type: "true_false",
			question:
				"While raging without heavy armor, a Barbarian has resistance to bludgeoning, piercing, and slashing damage.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is NOT one of the three benefits of Rage?",
			choices: [
				"Advantage on Dexterity saving throws",
				"Advantage on Strength checks and saving throws",
				"Bonus damage on melee Strength attacks",
				"Resistance to bludgeoning, piercing, and slashing damage",
			],
			correctChoiceIndex: 0,
		},
	],
	"Can a Barbarian cast or concentrate on spells while raging?": [
		{
			type: "true_false",
			question: "A raging Barbarian can maintain concentration on a spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What can a Barbarian NOT do while raging?",
			choices: [
				"Cast or concentrate on spells",
				"Make melee attacks",
				"Move at normal speed",
				"Take the Attack action",
			],
			correctChoiceIndex: 0,
		},
	],
	"How long does Rage last, and when does it end early?": [
		{
			type: "true_false",
			question: "Rage lasts for 1 minute unless it ends earlier.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following does NOT cause Rage to end early?",
			choices: [
				"Taking damage from a hostile creature",
				"Being knocked unconscious",
				"A full turn passing without attacking a hostile creature or taking damage",
				"Voluntarily ending it as a bonus action",
			],
			correctChoiceIndex: 0,
		},
	],
	"How many times can a Barbarian rage per long rest, by level range?": [
		{
			type: "true_false",
			question: "At 20th level, a Barbarian can rage an unlimited number of times per long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many times can a 5th-level Barbarian rage per long rest?",
			choices: ["3", "2", "4", "Unlimited"],
			correctChoiceIndex: 0,
		},
	],
	"What is the Barbarian's Rage Damage bonus by level range?": [
		{
			type: "true_false",
			question: "The Rage Damage bonus is +2 at levels 1–8.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the Rage Damage bonus at levels 9–15?",
			choices: ["+3", "+2", "+4", "+5"],
			correctChoiceIndex: 0,
		},
	],
	"What is Unarmored Defense (Barbarian)?": [
		{
			type: "true_false",
			question: "A Barbarian using Unarmored Defense can still use a shield and gain the benefit.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is a Barbarian's AC formula under Unarmored Defense?",
			choices: [
				"10 + Dexterity modifier + Constitution modifier",
				"10 + Dexterity modifier + Wisdom modifier",
				"10 + Dexterity modifier",
				"13 + Dexterity modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Reckless Attack (Barbarian, 2nd level)?": [
		{
			type: "true_false",
			question:
				"Reckless Attack grants advantage on melee Strength attack rolls for the turn, but attack rolls against you also have advantage until your next turn.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "When can a Barbarian decide to attack recklessly?",
			choices: [
				"On their first attack of the turn",
				"Only as a bonus action",
				"Only while raging",
				"At the start of combat before initiative is rolled",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Danger Sense (Barbarian, 2nd level)?": [
		{
			type: "true_false",
			question:
				"Danger Sense grants advantage on Dexterity saving throws against effects you can see.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Danger Sense doesn't apply if the Barbarian is...",
			choices: [
				"Blinded, deafened, or incapacitated",
				"Raging",
				"Wearing heavy armor",
				"Below half HP",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Primal Path (Barbarian, 3rd level)?": [
		{
			type: "true_false",
			question: "Primal Path grants features at 3rd, 6th, 10th, and 14th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At 3rd level, what choice does Primal Path require?",
			choices: [
				"Path of the Berserker or Path of the Totem Warrior",
				"A Fighting Style",
				"A Divine Domain",
				"A Roguish Archetype",
			],
			correctChoiceIndex: 0,
		},
	],
	"At what levels does the Barbarian gain Ability Score Improvement?": [
		{
			type: "true_false",
			question:
				"The Barbarian gains Ability Score Improvements at 4th, 8th, 12th, 16th, and 19th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At which level does the Barbarian NOT gain an Ability Score Improvement?",
			choices: ["14th", "4th", "8th", "12th"],
			correctChoiceIndex: 0,
		},
	],
	"What is Extra Attack (Barbarian, 5th level)?": [
		{
			type: "true_false",
			question:
				"Extra Attack lets a Barbarian attack twice, instead of once, whenever they take the Attack action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does the Barbarian gain Extra Attack?",
			choices: ["5th", "6th", "11th", "20th"],
			correctChoiceIndex: 0,
		},
	],
	"What is Fast Movement (Barbarian, 5th level)?": [
		{
			type: "true_false",
			question:
				"Fast Movement increases a Barbarian's speed by 10 feet while not wearing heavy armor.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Fast Movement's speed bonus applies as long as the Barbarian is not wearing...",
			choices: ["Heavy armor", "Any armor", "Medium armor", "A shield"],
			correctChoiceIndex: 0,
		},
	],
	"What is Feral Instinct (Barbarian, 7th level)?": [
		{
			type: "true_false",
			question: "Feral Instinct grants advantage on initiative rolls.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Under Feral Instinct, a surprised Barbarian can act normally on their first turn only if they...",
			choices: [
				"Enter rage before doing anything else",
				"Use their reaction",
				"Are wearing no armor",
				"Have already used Reckless Attack",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Brutal Critical (Barbarian), and how does it scale?": [
		{
			type: "true_false",
			question:
				"At 17th level, Brutal Critical adds 3 additional weapon damage dice on a critical hit with a melee attack.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"At what level does a Barbarian's Brutal Critical add a second additional weapon damage die?",
			choices: ["13th", "9th", "17th", "20th"],
			correctChoiceIndex: 0,
		},
	],
	"What is Relentless Rage (Barbarian, 11th level)?": [
		{
			type: "true_false",
			question: "Relentless Rage's save DC resets to 10 after a short or long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Relentless Rage's save DC increases by how much after each use?",
			choices: ["5", "2", "10", "It doesn't increase"],
			correctChoiceIndex: 0,
		},
	],
	"What is Persistent Rage (Barbarian, 15th level)?": [
		{
			type: "true_false",
			question:
				"At 15th level, Persistent Rage means a Barbarian's rage no longer ends early due to inactivity in combat.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "After gaining Persistent Rage, what can still end a Barbarian's rage early?",
			choices: [
				"Falling unconscious or choosing to end it",
				"Taking no damage for a full turn",
				"Failing a Constitution save",
				"Becoming frightened",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Indomitable Might (Barbarian, 18th level)?": [
		{
			type: "true_false",
			question:
				"Indomitable Might lets a Barbarian use their Strength score in place of a Strength check total that is lower.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Indomitable Might applies to which type of roll?",
			choices: [
				"Strength checks",
				"Strength saving throws",
				"Strength-based attack rolls",
				"Initiative rolls",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Primal Champion (Barbarian, 20th level)?": [
		{
			type: "true_false",
			question: "Primal Champion raises the maximum for Strength and Constitution to 24.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Primal Champion increases which ability scores by 4 each?",
			choices: [
				"Strength and Constitution",
				"Strength and Dexterity",
				"Constitution and Wisdom",
				"Strength and Charisma",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Frenzy (Path of the Berserker, 3rd level)?": [
		{
			type: "true_false",
			question:
				"Using Frenzy causes a Barbarian to suffer one level of exhaustion when the rage ends.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Frenzy lets a Barbarian make an additional melee weapon attack as a...",
			choices: [
				"Bonus action on each of their turns after the first",
				"Reaction",
				"Free action once per rage",
				"Bonus action only on the first turn",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Mindless Rage (Path of the Berserker, 6th level)?": [
		{
			type: "true_false",
			question:
				"Mindless Rage suspends an existing charmed or frightened effect for the duration of the rage.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Mindless Rage prevents a raging Barbarian from being affected by which conditions?",
			choices: [
				"Charmed and frightened",
				"Poisoned and stunned",
				"Paralyzed and restrained",
				"Blinded and deafened",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Intimidating Presence (Path of the Berserker, 10th level)?": [
		{
			type: "true_false",
			question:
				"Intimidating Presence uses the Barbarian's Wisdom modifier to determine the save DC.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What save must the target make to resist Intimidating Presence?",
			choices: ["Wisdom save", "Charisma save", "Strength save", "Constitution save"],
			correctChoiceIndex: 0,
		},
	],
	"What is Retaliation (Path of the Berserker, 14th level)?": [
		{
			type: "true_false",
			question:
				"Retaliation lets a Barbarian use their reaction to make a melee weapon attack against a creature that damaged them from within 5 feet.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Retaliation triggers when a Barbarian...",
			choices: [
				"Takes damage from a creature within 5 feet of them",
				"Is missed by an attack",
				"Reduces a creature to 0 hit points",
				"Starts their turn while raging",
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
