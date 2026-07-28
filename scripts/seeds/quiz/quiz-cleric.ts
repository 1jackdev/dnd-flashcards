const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Cleric";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What hit die does the Cleric use?": [
		{
			type: "true_false",
			question: "The Cleric's hit die is 1d8.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the Cleric's hit die?",
			choices: ["1d8", "1d6", "1d10", "1d12"],
			correctChoiceIndex: 0,
		},
	],
	"What armor and weapons is the Cleric proficient with?": [
		{
			type: "true_false",
			question: "Clerics are proficient with medium armor.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What weapon proficiency does the Cleric have?",
			choices: ["Simple weapons", "Martial weapons", "Only maces", "All weapons"],
			correctChoiceIndex: 0,
		},
	],
	"What saving throws is the Cleric proficient in?": [
		{
			type: "true_false",
			question: "Clerics are proficient in Wisdom and Charisma saving throws.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which saving throw proficiencies does the Cleric have?",
			choices: [
				"Wisdom and Charisma",
				"Intelligence and Wisdom",
				"Constitution and Charisma",
				"Strength and Constitution",
			],
			correctChoiceIndex: 0,
		},
	],
	"What skills can a Cleric choose from at character creation?": [
		{
			type: "true_false",
			question: "A Cleric can choose Medicine and Religion among their starting skill options.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is NOT one of the Cleric's class skill options?",
			choices: ["Arcana", "History", "Insight", "Medicine"],
			correctChoiceIndex: 0,
		},
	],
	"What is the Cleric's spellcasting ability?": [
		{
			type: "true_false",
			question: "The Cleric's spellcasting ability is Wisdom.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the Cleric's spellcasting ability?",
			choices: ["Wisdom", "Intelligence", "Charisma", "Constitution"],
			correctChoiceIndex: 0,
		},
	],
	"How many cantrips does a Cleric start with?": [
		{
			type: "true_false",
			question: "A Cleric knows 3 cantrips at 1st level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "By what level does a Cleric know 5 cantrips?",
			choices: ["10th", "4th", "14th", "20th"],
			correctChoiceIndex: 0,
		},
	],
	"How does the Cleric prepare spells?": [
		{
			type: "true_false",
			question: "A Cleric can change their prepared spell list after a long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many spells can a Cleric prepare?",
			choices: [
				"Wisdom modifier + cleric level (minimum 1)",
				"Intelligence modifier + cleric level",
				"A fixed number determined by class level alone",
				"Charisma modifier + cleric level",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does the Cleric regain spell slots?": [
		{
			type: "true_false",
			question: "Clerics regain all expended spell slots after a short rest.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "When does a Cleric regain all expended spell slots?",
			choices: [
				"After a long rest",
				"After a short rest",
				"After casting a cantrip",
				"Only at dawn",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Ritual Casting (Cleric)?": [
		{
			type: "true_false",
			question:
				"A Cleric can cast a spell as a ritual even if they don't have it prepared, as long as it's on the cleric spell list.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What is required for a Cleric to cast a spell as a ritual?",
			choices: [
				"The spell has the ritual tag and is prepared",
				"The spell has the ritual tag and is in the cleric's spellbook",
				"The spell is any cantrip",
				"The cleric must expend a spell slot",
			],
			correctChoiceIndex: 0,
		},
	],
	"What can a Cleric use as a spellcasting focus?": [
		{
			type: "true_false",
			question: "A Cleric can use a holy symbol as a spellcasting focus.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What can a Cleric use as a spellcasting focus?",
			choices: [
				"A holy symbol",
				"An arcane focus crystal",
				"A druidic focus",
				"A component pouch only",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are Domain Spells (Cleric)?": [
		{
			type: "true_false",
			question: "Domain spells count against a Cleric's number of prepared spells.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What is true of a Cleric's domain spells?",
			choices: [
				"They are always prepared and don't count against the daily preparation limit",
				"They must be chosen each long rest like other spells",
				"They can only be cast as rituals",
				"They replace the cleric's cantrips",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Divine Domain (Cleric, 1st level)?": [
		{
			type: "true_false",
			question: "Divine Domain grants an additional Channel Divinity option at 2nd level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At which levels (besides 1st) does the Divine Domain grant features?",
			choices: [
				"2nd, 6th, 8th, and 17th",
				"3rd, 9th, and 15th",
				"5th, 10th, and 15th",
				"2nd, 4th, and 6th",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Channel Divinity (Cleric, 2nd level)?": [
		{
			type: "true_false",
			question: "Channel Divinity uses recharge on a short or long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many uses of Channel Divinity does a Cleric have at 6th level?",
			choices: ["2", "1", "3", "4"],
			correctChoiceIndex: 0,
		},
	],
	"How does Channel Divinity: Turn Undead work?": [
		{
			type: "true_false",
			question: "A turned undead creature can still take reactions.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What must a turned creature do?",
			choices: [
				"Flee from the cleric by the safest means available",
				"Attack the cleric with disadvantage",
				"Remain motionless",
				"Make a Constitution save each turn to resist",
			],
			correctChoiceIndex: 0,
		},
	],
	"At what levels does the Cleric gain Ability Score Improvement?": [
		{
			type: "true_false",
			question: "Clerics gain an Ability Score Improvement at 19th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At which levels does the Cleric gain an Ability Score Improvement?",
			choices: [
				"4th, 8th, 12th, 16th, and 19th",
				"4th, 6th, 8th, 12th, 14th, 16th, and 19th",
				"4th, 8th, 12th, 16th, and 20th",
				"3rd, 6th, 9th, 12th, 15th, and 18th",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Destroy Undead, and how does the CR threshold scale?": [
		{
			type: "true_false",
			question:
				"At 8th level, a Cleric's Destroy Undead destroys undead that fail Turn Undead if their CR is 1 or lower.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Cleric gain the Destroy Undead feature?",
			choices: ["5th", "2nd", "8th", "11th"],
			correctChoiceIndex: 0,
		},
	],
	"What is Divine Intervention (Cleric, 10th level)?": [
		{
			type: "true_false",
			question: "At 20th level, a Cleric's Divine Intervention succeeds automatically.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What happens if a Cleric's Divine Intervention succeeds?",
			choices: [
				"The cleric can't use it again for 7 days",
				"The cleric can't use it again until they level up",
				"The cleric gains a level of exhaustion",
				"The cleric's spell slots are all expended",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the Life Domain spells?": [
		{
			type: "true_false",
			question: "Revivify is one of the Life Domain's 5th-level domain spells.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which spell is granted by the Life Domain at 1st level?",
			choices: ["Cure wounds", "Spiritual weapon", "Beacon of hope", "Death ward"],
			correctChoiceIndex: 0,
		},
	],
	"What bonus proficiency does the Life Domain grant?": [
		{
			type: "true_false",
			question: "The Life Domain grants proficiency with heavy armor.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What bonus proficiency does the Life Domain grant?",
			choices: ["Heavy armor", "Martial weapons", "Medium armor", "Shields"],
			correctChoiceIndex: 0,
		},
	],
	"What is Disciple of Life (Life Domain, 1st level)?": [
		{
			type: "true_false",
			question:
				"Disciple of Life adds extra healing equal to 2 plus the spell's level when the cleric restores HP with a 1st-level-or-higher spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Disciple of Life applies its bonus healing to spells of what level?",
			choices: [
				"1st level or higher",
				"Cantrips only",
				"3rd level or higher",
				"Any level, including cantrips",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Channel Divinity: Preserve Life (Life Domain, 2nd level)?": [
		{
			type: "true_false",
			question: "Preserve Life can restore a creature above half its hit point maximum.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Preserve Life cannot be used to restore HP to which of the following?",
			choices: [
				"Undead and constructs",
				"Creatures below half HP",
				"Allies only",
				"Creatures more than 10 feet away",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Blessed Healer (Life Domain, 6th level)?": [
		{
			type: "true_false",
			question: "Blessed Healer causes the cleric to regain HP only when healing themselves.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"Blessed Healer grants the cleric HP equal to what, when they heal another creature with a 1st-level-or-higher spell?",
			choices: [
				"2 + the spell's level",
				"The full amount healed",
				"1d8 + Wisdom modifier",
				"Half the amount healed",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Divine Strike (Life Domain, 8th level)?": [
		{
			type: "true_false",
			question: "Divine Strike's extra damage increases to 2d8 at 14th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What type of damage does Divine Strike deal?",
			choices: ["Radiant", "Necrotic", "Force", "Fire"],
			correctChoiceIndex: 0,
		},
	],
	"What is Supreme Healing (Life Domain, 17th level)?": [
		{
			type: "true_false",
			question: "Supreme Healing causes healing spell dice to always roll their maximum value.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Supreme Healing applies to which kind of spells?",
			choices: [
				"Spells that restore hit points",
				"Spells that deal damage",
				"Spells that grant temporary hit points",
				"Cantrips only",
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
