const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Ability Scores";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What do the six ability scores measure?": [
		{
			type: "true_false",
			question: "Wisdom measures a character's force of personality.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which ability score measures endurance?",
			choices: ["Constitution", "Strength", "Dexterity", "Wisdom"],
			correctChoiceIndex: 0,
		},
	],
	"How do you calculate an ability modifier from a score?": [
		{
			type: "true_false",
			question: "A score of 14 gives an ability modifier of +2.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What ability modifier corresponds to a score of 1?",
			choices: ["-5", "-4", "-1", "0"],
			correctChoiceIndex: 0,
		},
	],
	"What are the ability score modifier breakpoints?": [
		{
			type: "true_false",
			question: "A score of 20 gives a +5 modifier.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"According to the modifier breakpoints, what modifier corresponds to a score of 12?",
			choices: ["+1", "+2", "+0", "+3"],
			correctChoiceIndex: 0,
		},
	],
	"How does advantage/disadvantage work?": [
		{
			type: "true_false",
			question:
				"If a creature has two separate sources of advantage, it rolls three d20s and takes the highest.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"If a character has advantage from one source and disadvantage from another at the same time, what happens?",
			choices: [
				"They cancel out and a single d20 is rolled",
				"Advantage always wins",
				"Disadvantage always wins",
				"Roll three d20s and take the middle result",
			],
			correctChoiceIndex: 0,
		},
	],
	"When you have advantage or disadvantage and can reroll (e.g. Halfling Lucky), which die do you reroll?":
		[
			{
				type: "true_false",
				question:
					"The GM chooses which of the two dice gets rerolled under advantage or disadvantage.",
				correctAnswer: false,
			},
			{
				type: "multiple_choice",
				question:
					"When you have advantage or disadvantage and can reroll one of the two d20s (e.g. Halfling Lucky), who decides which die is rerolled?",
				choices: [
					"The player",
					"The GM",
					"Whichever die is higher is always rerolled",
					"Whichever die is lower is always rerolled",
				],
				correctChoiceIndex: 0,
			},
		],
	"What are the rules for applying proficiency bonus?": [
		{
			type: "true_false",
			question:
				"If a feature would double your proficiency bonus for a skill you aren't proficient in, you still gain some bonus.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "How many times can your proficiency bonus be added to the same roll?",
			choices: [
				"Only once",
				"Twice, if you have Expertise",
				"Once per ability score involved",
				"Unlimited, stacking with each applicable source",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is an ability check, and what are the typical DCs?": [
		{
			type: "true_false",
			question: "A DC of 15 represents a Medium difficulty task.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What DC represents a Hard task?",
			choices: ["20", "15", "25", "10"],
			correctChoiceIndex: 0,
		},
	],
	"What is a Contest?": [
		{
			type: "true_false",
			question:
				"In a Contest, if both participants tie, the situation stays the same as it was before the contest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What determines the outcome of a Contest?",
			choices: [
				"The higher total between the two competing ability checks",
				"Whoever has proficiency wins automatically",
				"A fixed DC of 15",
				"The GM's discretion regardless of the rolls",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is a Passive Check?": [
		{
			type: "true_false",
			question:
				"A Passive Check adds 5 to the total if the character would have advantage on the check.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the base number used to calculate a Passive Check before modifiers?",
			choices: ["10", "15", "20", "0"],
			correctChoiceIndex: 0,
		},
	],
	"How does Working Together (helping) affect ability checks?": [
		{
			type: "true_false",
			question:
				"In combat, granting advantage by helping another character requires using the Help action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"When Working Together, how does helping typically affect the lead character's check?",
			choices: [
				"The lead character makes the check with advantage",
				"Both characters roll and add their totals together",
				"The helper makes the check instead of the lead character",
				"Everyone involved must succeed individually",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is a Group Check?": [
		{
			type: "true_false",
			question:
				"A Group Check succeeds if at least half of the group members succeed on their individual checks.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What determines success in a Group Check?",
			choices: [
				"At least half the group succeeding on their individual checks",
				"Every member of the group must succeed",
				"Only the single highest roll in the group matters",
				"The GM assigns success arbitrarily",
			],
			correctChoiceIndex: 0,
		},
	],
	"Which skills are associated with each ability score?": [
		{
			type: "true_false",
			question: "Constitution has no skills associated with it.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which ability score governs the Stealth skill?",
			choices: ["Dexterity", "Strength", "Wisdom", "Charisma"],
			correctChoiceIndex: 0,
		},
	],
	"Can skills ever be used with a different ability score than normal?": [
		{
			type: "true_false",
			question:
				"Proficiency in a skill only applies if the check uses that skill's normal associated ability score.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which is a valid example of using a skill with an atypical ability score?",
			choices: [
				"A Constitution (Athletics) check to swim a long distance",
				"A Strength (Arcana) check to identify a magic item",
				"A Charisma (Perception) check to notice a hidden trap",
				"A Wisdom (Athletics) check to climb a cliff",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does the Strength (Athletics) skill cover?": [
		{
			type: "true_false",
			question: "The Athletics skill can be used to force open a stuck door.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of these is covered by the Strength (Athletics) skill?",
			choices: [
				"Swimming in treacherous water",
				"Picking a lock",
				"Tracking a creature through the forest",
				"Recalling historical facts",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does carrying capacity work?": [
		{
			type: "true_false",
			question: "A Large creature has double the normal carrying capacity for its Strength score.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What is a character's push/drag/lift maximum, in relation to their Strength score?",
			choices: [
				"Strength score x 30 lbs.",
				"Strength score x 15 lbs.",
				"Strength score x 10 lbs.",
				"Strength score x 5 lbs.",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the variant encumbrance thresholds?": [
		{
			type: "true_false",
			question:
				"Heavily encumbered creatures have disadvantage on ability checks, attack rolls, and saving throws that use Strength, Dexterity, or Constitution.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"At what carrying weight threshold does a character become Encumbered (not yet Heavily Encumbered) under the variant rule?",
			choices: [
				"More than 5 x Strength score",
				"More than 10 x Strength score",
				"More than 15 x Strength score",
				"More than 30 x Strength score",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does each Dexterity skill cover?": [
		{
			type: "true_false",
			question: "Sleight of Hand covers pickpocketing and planting objects on others.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which Dexterity skill covers staying upright on tricky footing and acrobatic stunts like dives and rolls?",
			choices: ["Acrobatics", "Sleight of Hand", "Stealth", "Athletics"],
			correctChoiceIndex: 0,
		},
	],
	"What is the Hiding rule?": [
		{
			type: "true_false",
			question:
				"An invisible creature can always attempt to hide, but must stay quiet for the attempt to succeed.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What is contested against a Dexterity (Stealth) check when a creature tries to hide?",
			choices: [
				"The Wisdom (Perception) of a creature actively searching",
				"Intelligence (Investigation)",
				"A flat DC of 15",
				"Charisma (Deception)",
			],
			correctChoiceIndex: 0,
		},
	],
	"What uses Dexterity in combat and defense?": [
		{
			type: "true_false",
			question: "Dexterity adds its full modifier to AC when wearing heavy armor.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "How much of the Dexterity modifier is added to AC when wearing medium armor?",
			choices: [
				"Up to a maximum of +2",
				"All of it, with no cap",
				"None of it",
				"A flat +1 regardless of modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does Constitution affect mechanically?": [
		{
			type: "true_false",
			question:
				"If a character's Constitution modifier changes, their HP maximum is retroactively recalculated for all levels attained.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of these is an example of a Constitution check, per the rules?",
			choices: [
				"Holding your breath",
				"Picking a lock",
				"Recalling a historical fact",
				"Persuading a guard",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does each Intelligence skill cover?": [
		{
			type: "true_false",
			question:
				"The Investigation skill can be used to deduce clues and analyze wounds or weaknesses.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which Intelligence skill covers knowledge of deities, religious rites, and holy symbols?",
			choices: ["Religion", "Arcana", "History", "Nature"],
			correctChoiceIndex: 0,
		},
	],
	"What does each Wisdom skill cover?": [
		{
			type: "true_false",
			question: "The Medicine skill is used to stabilize a dying creature and diagnose illness.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which Wisdom skill covers tracking creatures and predicting weather?",
			choices: ["Survival", "Perception", "Animal Handling", "Insight"],
			correctChoiceIndex: 0,
		},
	],
	"What does each Charisma skill cover?": [
		{
			type: "true_false",
			question: "Intimidation involves influencing someone through threats or hostile actions.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which Charisma skill covers influencing others through tact and social graces rather than threats?",
			choices: ["Persuasion", "Intimidation", "Deception", "Performance"],
			correctChoiceIndex: 0,
		},
	],
	"Which classes use Charisma as their spellcasting ability?": [
		{
			type: "true_false",
			question: "The Paladin uses Charisma as its spellcasting ability.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which class does NOT use Charisma as its spellcasting ability?",
			choices: ["Wizard", "Bard", "Sorcerer", "Warlock"],
			correctChoiceIndex: 0,
		},
	],
	"What is a saving throw?": [
		{
			type: "true_false",
			question: "A character chooses whether or not to make a saving throw.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What determines the DC for a saving throw?",
			choices: [
				"The effect causing it (e.g. the caster's spell save DC)",
				"Always a flat DC of 15",
				"The target's own ability score",
				"The GM rolls a d20 to decide",
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
