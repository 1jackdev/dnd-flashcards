const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Monk";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What hit die does the Monk use?": [
		{ type: "true_false", question: "The Monk's hit die is 1d8.", correctAnswer: true },
		{
			type: "multiple_choice",
			question: "What is a Monk's HP at 1st level?",
			choices: ["8 + Con modifier", "10 + Con modifier", "6 + Con modifier", "1d10 + Con modifier"],
			correctChoiceIndex: 0,
		},
	],
	"What armor and weapons is the Monk proficient with?": [
		{
			type: "true_false",
			question: "A Monk is proficient with shortswords.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which weapon/armor proficiency does the Monk have?",
			choices: [
				"Simple weapons and shortswords, no armor or shields",
				"Simple and martial weapons, light armor",
				"Simple weapons only, no shortswords",
				"Martial weapons and shortswords, no armor",
			],
			correctChoiceIndex: 0,
		},
	],
	"What saving throws is the Monk proficient in?": [
		{
			type: "true_false",
			question: "A Monk is proficient in Strength and Dexterity saving throws.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which pair of saving throws is the Monk proficient in?",
			choices: [
				"Strength and Dexterity",
				"Dexterity and Wisdom",
				"Strength and Constitution",
				"Wisdom and Charisma",
			],
			correctChoiceIndex: 0,
		},
	],
	"What skills can a Monk choose from at character creation?": [
		{
			type: "true_false",
			question: "A Monk chooses 2 skills from a list that includes Stealth and Acrobatics.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many skills does a Monk choose from their skill list at 1st level?",
			choices: ["2", "3", "1", "4"],
			correctChoiceIndex: 0,
		},
	],
	"What is Unarmored Defense (Monk)?": [
		{
			type: "true_false",
			question: "A Monk's Unarmored Defense AC is 10 + Dexterity modifier + Wisdom modifier.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which ability modifier does Monk Unarmored Defense add that a Barbarian's does not?",
			choices: [
				"Wisdom modifier",
				"Constitution modifier",
				"Intelligence modifier",
				"Charisma modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are monk weapons?": [
		{
			type: "true_false",
			question:
				"Monk weapons include shortswords and simple melee weapons without the two-handed or heavy property.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of these would NOT qualify as a monk weapon?",
			choices: [
				"A greatsword (heavy, two-handed)",
				"A shortsword",
				"A dagger",
				"A quarterstaff (used one-handed)",
			],
			correctChoiceIndex: 0,
		},
	],
	"What three benefits does Martial Arts provide?": [
		{
			type: "true_false",
			question:
				"Martial Arts lets a Monk use Dexterity instead of Strength for unarmed strike and monk weapon attack and damage rolls.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What bonus action does Martial Arts grant when you take the Attack action with an unarmed strike or monk weapon?",
			choices: [
				"One unarmed strike",
				"The Dodge action",
				"Two unarmed strikes (Flurry of Blows)",
				"The Disengage action",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does the Martial Arts damage die scale?": [
		{
			type: "true_false",
			question: "The Martial Arts die is a d6 at levels 5–10.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the Martial Arts die at levels 17–20?",
			choices: ["d10", "d8", "d12", "d6"],
			correctChoiceIndex: 0,
		},
	],
	"What is Ki, and how many points does a Monk have?": [
		{
			type: "true_false",
			question:
				"A Monk's number of ki points equals their monk level, and spent ki is regained on a short or long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How much meditation time is required to regain spent ki points on a rest?",
			choices: [
				"At least 30 minutes",
				"At least 10 minutes",
				"At least 1 hour",
				"No time requirement",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is the Ki save DC formula?": [
		{
			type: "true_false",
			question: "The Ki save DC is 8 + proficiency bonus + Wisdom modifier.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which ability modifier is used in the Monk's Ki save DC?",
			choices: ["Wisdom", "Dexterity", "Constitution", "Intelligence"],
			correctChoiceIndex: 0,
		},
	],
	"What is Flurry of Blows?": [
		{
			type: "true_false",
			question:
				"Flurry of Blows costs 1 ki point and lets you make two unarmed strikes as a bonus action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many ki points does Flurry of Blows cost?",
			choices: ["1", "2", "0 (free)", "3"],
			correctChoiceIndex: 0,
		},
	],
	"What is Patient Defense?": [
		{
			type: "true_false",
			question: "Patient Defense lets you take the Dodge action as a bonus action for 1 ki point.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which action does Patient Defense let you take as a bonus action?",
			choices: ["Dodge", "Disengage", "Dash", "Attack"],
			correctChoiceIndex: 0,
		},
	],
	"What is Step of the Wind?": [
		{
			type: "true_false",
			question:
				"Step of the Wind doubles your jump distance for the turn in addition to letting you Disengage or Dash as a bonus action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which two actions can Step of the Wind let you take as a bonus action?",
			choices: ["Disengage or Dash", "Dodge or Dash", "Disengage or Attack", "Dash or Attack"],
			correctChoiceIndex: 0,
		},
	],
	"How does Unarmored Movement scale?": [
		{
			type: "true_false",
			question:
				"At 9th level, Unarmored Movement lets you move along vertical surfaces and across liquids without falling.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the Unarmored Movement speed bonus at levels 10–13?",
			choices: ["+20 ft.", "+15 ft.", "+25 ft.", "+10 ft."],
			correctChoiceIndex: 0,
		},
	],
	"What is Monastic Tradition (Monk, 3rd level)?": [
		{
			type: "true_false",
			question: "Monastic Tradition grants additional features at 3rd, 6th, 11th, and 17th levels.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Monk choose their Monastic Tradition?",
			choices: ["3rd level", "1st level", "6th level", "5th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Deflect Missiles (Monk, 3rd level)?": [
		{
			type: "true_false",
			question:
				"Deflect Missiles can reduce ranged weapon attack damage by 1d10 + Dex modifier + monk level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What must you spend to throw a caught missile back as a ranged attack with Deflect Missiles?",
			choices: ["1 ki point", "2 ki points", "Your reaction (a second one)", "Nothing extra"],
			correctChoiceIndex: 0,
		},
	],
	"At what levels does the Monk gain Ability Score Improvement?": [
		{
			type: "true_false",
			question: "A Monk gains Ability Score Improvement at 4th, 8th, 12th, 16th, and 19th levels.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which level is NOT one of the Monk's Ability Score Improvement levels?",
			choices: ["14th", "4th", "8th", "19th"],
			correctChoiceIndex: 0,
		},
	],
	"What is Slow Fall (Monk, 4th level)?": [
		{
			type: "true_false",
			question: "Slow Fall reduces falling damage by 5 times your monk level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How much does Slow Fall reduce falling damage by?",
			choices: [
				"5 × your monk level",
				"1d10 + Dex modifier + monk level",
				"10 × your monk level",
				"Half the damage",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Extra Attack (Monk, 5th level)?": [
		{
			type: "true_false",
			question:
				"Extra Attack lets a Monk attack twice instead of once when taking the Attack action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Monk gain Extra Attack?",
			choices: ["5th level", "4th level", "6th level", "11th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Stunning Strike (Monk, 5th level)?": [
		{
			type: "true_false",
			question:
				"Stunning Strike forces a Constitution saving throw, and failure stuns the target until the end of your next turn.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many ki points does Stunning Strike cost to attempt?",
			choices: ["1", "2", "3", "0 (free)"],
			correctChoiceIndex: 0,
		},
	],
	"What is Ki-Empowered Strikes (Monk, 6th level)?": [
		{
			type: "true_false",
			question:
				"Ki-Empowered Strikes makes your unarmed strikes count as magical for overcoming resistance and immunity to nonmagical attacks and damage.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What does Ki-Empowered Strikes let your unarmed strikes overcome?",
			choices: [
				"Resistance and immunity to nonmagical attacks and damage",
				"Resistance to all damage types",
				"Immunity to poison damage specifically",
				"Advantage on attack rolls against you",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Evasion (Monk, 7th level)?": [
		{
			type: "true_false",
			question:
				"With Evasion, a Monk takes no damage on a successful Dexterity save against an effect that allows half damage on a success.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"With Evasion, what happens on a failed Dexterity saving throw against a half-damage effect?",
			choices: [
				"You take half damage",
				"You take no damage",
				"You take full damage",
				"You take double damage",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Stillness of Mind (Monk, 7th level)?": [
		{
			type: "true_false",
			question:
				"Stillness of Mind lets you use your action to end an effect on yourself causing you to be charmed or frightened.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which conditions can Stillness of Mind end on yourself?",
			choices: [
				"Charmed or frightened",
				"Poisoned or diseased",
				"Stunned or paralyzed",
				"Blinded or deafened",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Purity of Body (Monk, 10th level)?": [
		{
			type: "true_false",
			question: "Purity of Body grants immunity to disease and poison.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What does Purity of Body make a Monk immune to?",
			choices: [
				"Disease and poison",
				"Charmed and frightened effects",
				"All damage types",
				"Aging effects",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Tongue of the Sun and Moon (Monk, 13th level)?": [
		{
			type: "true_false",
			question:
				"Tongue of the Sun and Moon lets you understand all spoken languages, and creatures that understand a language can understand what you say.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What does Tongue of the Sun and Moon grant?",
			choices: [
				"Understanding of all spoken languages",
				"Telepathy with any creature",
				"Immunity to being deafened",
				"The ability to read any written text",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Diamond Soul (Monk, 14th level)?": [
		{
			type: "true_false",
			question:
				"Diamond Soul grants proficiency in all saving throws and lets you spend 1 ki point to reroll a failed save.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many ki points does Diamond Soul's reroll cost?",
			choices: ["1", "2", "4", "0 (free)"],
			correctChoiceIndex: 0,
		},
	],
	"What is Timeless Body (Monk, 15th level)?": [
		{
			type: "true_false",
			question:
				"With Timeless Body, a Monk no longer needs food or water but can still die of old age.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What does Timeless Body protect against?",
			choices: [
				"The frailty of old age and magical aging",
				"All forms of death",
				"Disease and poison",
				"Charmed and frightened effects",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Empty Body (Monk, 18th level)?": [
		{
			type: "true_false",
			question:
				"Empty Body can be used to become invisible and gain resistance to all damage except force for 4 ki points.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many ki points does Empty Body cost to cast astral projection (self only)?",
			choices: ["8", "4", "3", "1"],
			correctChoiceIndex: 0,
		},
	],
	"What is Perfect Self (Monk, 20th level)?": [
		{
			type: "true_false",
			question:
				"Perfect Self regains 4 ki points when you roll initiative and have no ki points remaining.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many ki points does Perfect Self restore?",
			choices: ["4", "1", "8", "All of them"],
			correctChoiceIndex: 0,
		},
	],
	"What is Open Hand Technique (Way of the Open Hand, 3rd level)?": [
		{
			type: "true_false",
			question:
				"Open Hand Technique triggers when you hit with a Flurry of Blows attack, letting you impose an effect like knocking the target prone.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which saving throw does the target make to avoid being pushed 15 feet by Open Hand Technique?",
			choices: ["Strength", "Dexterity", "Constitution", "Wisdom"],
			correctChoiceIndex: 0,
		},
	],
	"What is Wholeness of Body (Way of the Open Hand, 6th level)?": [
		{
			type: "true_false",
			question:
				"Wholeness of Body lets you regain HP equal to 3 times your monk level, once per long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How often can you use Wholeness of Body?",
			choices: ["Once per long rest", "Once per short rest", "Twice per long rest", "At will"],
			correctChoiceIndex: 0,
		},
	],
	"What is Tranquility (Way of the Open Hand, 11th level)?": [
		{
			type: "true_false",
			question:
				"Tranquility grants the effect of a sanctuary spell at the end of a long rest, lasting until the start of your next long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the save DC for Tranquility's sanctuary effect?",
			choices: [
				"8 + Wis modifier + proficiency bonus",
				"8 + Dex modifier + proficiency bonus",
				"8 + Con modifier + proficiency bonus",
				"10 + Wis modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Quivering Palm (Way of the Open Hand, 17th level)?": [
		{
			type: "true_false",
			question:
				"Quivering Palm requires you to spend 3 ki points when you hit with an unarmed strike to set lethal vibrations.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which saving throw does the target make when you trigger Quivering Palm's vibrations?",
			choices: ["Constitution", "Strength", "Wisdom", "Dexterity"],
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
