const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Ranger";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What hit die does the Ranger use?": [
		{
			type: "true_false",
			question: "The Ranger's hit die is 1d10.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the Ranger's hit point maximum at 1st level?",
			choices: [
				"10 + Constitution modifier",
				"8 + Constitution modifier",
				"6 + Constitution modifier",
				"12 + Constitution modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"What armor and weapons is the Ranger proficient with?": [
		{
			type: "true_false",
			question: "The Ranger is proficient with medium armor and shields.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which weapons is the Ranger proficient with?",
			choices: [
				"Simple and martial weapons",
				"Simple weapons only",
				"Martial weapons only",
				"Simple weapons, plus longswords, rapiers, shortswords, and hand crossbows",
			],
			correctChoiceIndex: 0,
		},
	],
	"What saving throws is the Ranger proficient in?": [
		{
			type: "true_false",
			question: "The Ranger is proficient in Strength and Dexterity saving throws.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which two saving throws is the Ranger proficient in?",
			choices: [
				"Strength and Dexterity",
				"Strength and Constitution",
				"Dexterity and Intelligence",
				"Wisdom and Charisma",
			],
			correctChoiceIndex: 0,
		},
	],
	"What skills can a Ranger choose from at character creation?": [
		{
			type: "true_false",
			question: "A Ranger chooses 3 skills from the class skill list at character creation.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which skill is on the Ranger's class skill list?",
			choices: ["Survival", "Persuasion", "Arcana", "Medicine"],
			correctChoiceIndex: 0,
		},
	],
	"What is Favored Enemy (Ranger, 1st level)?": [
		{
			type: "true_false",
			question:
				"Favored Enemy grants advantage on Wisdom (Survival) checks to track your favored enemies.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what levels does a Ranger gain an additional favored enemy and language?",
			choices: ["6th and 14th", "6th and 10th", "3rd and 11th", "4th and 8th"],
			correctChoiceIndex: 0,
		},
	],
	"What is Natural Explorer (Ranger, 1st level)?": [
		{
			type: "true_false",
			question:
				"While traveling in favored terrain, a Ranger doesn't suffer the movement penalty for difficult terrain.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what levels does a Ranger gain additional favored terrain types?",
			choices: ["6th and 10th", "6th and 14th", "3rd and 7th", "4th and 8th"],
			correctChoiceIndex: 0,
		},
	],
	"What Fighting Styles can a Ranger choose from?": [
		{
			type: "true_false",
			question: "The Defense fighting style grants +1 to AC while wearing armor.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which Fighting Style grants a +2 bonus to damage rolls with a melee weapon held in one hand, provided you're wielding no other weapons?",
			choices: ["Dueling", "Archery", "Two-Weapon Fighting", "Defense"],
			correctChoiceIndex: 0,
		},
	],
	"What is the Ranger's spellcasting ability?": [
		{
			type: "true_false",
			question: "The Ranger's spellcasting ability is Wisdom.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the Ranger's spell save DC formula?",
			choices: [
				"8 + proficiency bonus + Wisdom modifier",
				"8 + proficiency bonus + Intelligence modifier",
				"8 + proficiency bonus + Charisma modifier",
				"10 + Wisdom modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"When does a Ranger gain spellcasting, and how many spells do they know?": [
		{
			type: "true_false",
			question:
				"The Ranger is a half-caster who knows a limited number of spells rather than preparing from the full class list.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Ranger gain the ability to cast spells?",
			choices: ["2nd level", "1st level", "3rd level", "4th level"],
			correctChoiceIndex: 0,
		},
	],
	"How does the Ranger regain spell slots?": [
		{
			type: "true_false",
			question: "A Ranger regains all expended spell slots after a long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How does a Ranger recover spent spell slots?",
			choices: [
				"Finishing a long rest",
				"Finishing a short rest",
				"Finishing a long rest restores only half your slots, rounded down",
				"Slots are only regained by leveling up",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Ranger Archetype (3rd level)?": [
		{
			type: "true_false",
			question: "A Ranger chooses their archetype at 3rd level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At which levels does a Ranger's archetype grant additional features?",
			choices: [
				"3rd, 7th, 11th, and 15th",
				"3rd, 6th, 10th, and 14th",
				"4th, 8th, 12th, and 16th",
				"1st, 5th, 9th, and 13th",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Primeval Awareness (Ranger, 3rd level)?": [
		{
			type: "true_false",
			question: "Primeval Awareness requires expending a ranger spell slot.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What is the base range of Primeval Awareness, before accounting for favored terrain?",
			choices: ["1 mile", "6 miles", "30 feet", "300 feet"],
			correctChoiceIndex: 0,
		},
	],
	"At what levels does the Ranger gain Ability Score Improvement?": [
		{
			type: "true_false",
			question: "A Ranger gains an Ability Score Improvement at 19th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At which levels does a Ranger gain an Ability Score Improvement?",
			choices: [
				"4th, 8th, 12th, 16th, and 19th",
				"4th, 8th, 12th, 16th, and 20th",
				"3rd, 7th, 11th, and 15th",
				"6th, 10th, 14th, and 18th",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Extra Attack (Ranger, 5th level)?": [
		{
			type: "true_false",
			question:
				"Extra Attack allows a Ranger to attack twice instead of once when they take the Attack action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Ranger gain Extra Attack?",
			choices: ["5th level", "6th level", "8th level", "11th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Land's Stride (Ranger, 8th level)?": [
		{
			type: "true_false",
			question:
				"Land's Stride grants advantage on saving throws against magically created or manipulated plants that impede movement.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Ranger gain Land's Stride?",
			choices: ["8th level", "10th level", "14th level", "5th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Hide in Plain Sight (Ranger, 10th level)?": [
		{
			type: "true_false",
			question:
				"Hide in Plain Sight grants a +10 bonus to Dexterity (Stealth) checks while pressed against a suitable surface.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Ranger gain Hide in Plain Sight?",
			choices: ["10th level", "8th level", "14th level", "18th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Vanish (Ranger, 14th level)?": [
		{
			type: "true_false",
			question: "Vanish allows a Ranger to take the Hide action as a bonus action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Ranger gain Vanish?",
			choices: ["14th level", "10th level", "18th level", "20th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Feral Senses (Ranger, 18th level)?": [
		{
			type: "true_false",
			question:
				"Feral Senses lets a Ranger know the location of invisible creatures within 30 feet, unless the creature is hidden from them.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Ranger gain Feral Senses?",
			choices: ["18th level", "14th level", "20th level", "10th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Foe Slayer (Ranger, 20th level)?": [
		{
			type: "true_false",
			question:
				"Foe Slayer lets a Ranger add their Wisdom modifier to an attack or damage roll against a favored enemy once per turn.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Ranger gain Foe Slayer?",
			choices: ["20th level", "18th level", "19th level", "15th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Hunter's Prey (Hunter, 3rd level)?": [
		{
			type: "true_false",
			question:
				"Colossus Slayer deals extra damage once per turn to a target that is below its hit point maximum.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which Hunter's Prey option lets you make a reaction attack against a Large or larger creature that hits or misses you?",
			choices: ["Giant Killer", "Colossus Slayer", "Horde Breaker", "Whirlwind Attack"],
			correctChoiceIndex: 0,
		},
	],
	"What is Defensive Tactics (Hunter, 7th level)?": [
		{
			type: "true_false",
			question: "Steel Will grants advantage on saving throws against being frightened.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which Defensive Tactics option grants +4 AC against all subsequent attacks from a creature that just hit you, until the end of that creature's turn?",
			choices: ["Multiattack Defense", "Escape the Horde", "Steel Will", "Uncanny Dodge"],
			correctChoiceIndex: 0,
		},
	],
	"What is Hunter Multiattack (Hunter, 11th level)?": [
		{
			type: "true_false",
			question:
				"Volley lets a Ranger make a ranged attack against any number of creatures within 10 feet of a point they can see.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which Hunter Multiattack option is a melee-only feature?",
			choices: ["Whirlwind Attack", "Volley", "Horde Breaker", "Giant Killer"],
			correctChoiceIndex: 0,
		},
	],
	"What is Superior Hunter's Defense (Hunter, 15th level)?": [
		{
			type: "true_false",
			question:
				"Evasion lets a Ranger take no damage on a successful Dexterity saving throw that would normally deal half damage, and half damage on a failure.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which Superior Hunter's Defense option lets you force a hostile creature that just missed you with a melee attack to target another creature of your choice instead?",
			choices: ["Stand Against the Tide", "Uncanny Dodge", "Evasion", "Multiattack Defense"],
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
