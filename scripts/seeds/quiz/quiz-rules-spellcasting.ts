const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Spellcasting Rules";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What are spell levels, and how do they relate to character level?": [
		{
			type: "true_false",
			question:
				"A 17th-level character is typically needed to cast a 9th-level spell, since character level and spell level don't correspond directly.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the spell level of a cantrip?",
			choices: ["Level 0", "Level 1", "Level 9", "It varies by class"],
			correctChoiceIndex: 0,
		},
	],
	"What is the difference between known and prepared spells?": [
		{
			type: "true_false",
			question:
				"Bards and sorcerers prepare a fresh selection of spells each day from a larger spellbook.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"Which classes prepare spells each day from a larger list or spellbook, rather than having a fixed list of known spells?",
			choices: [
				"Clerics and wizards",
				"Bards and sorcerers",
				"Warlocks and rangers",
				"Paladins and rangers",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are spell slots?": [
		{
			type: "true_false",
			question: "All expended spell slots are restored on a long rest, with no exceptions.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"Which class's spell slots (Pact Magic) restore on a short rest as well as a long rest?",
			choices: ["Warlock", "Wizard", "Cleric", "Sorcerer"],
			correctChoiceIndex: 0,
		},
	],
	"What happens when you cast a spell at a higher level?": [
		{
			type: "true_false",
			question:
				"Many spells have enhanced effects when cast using a higher-level spell slot, as described in the spell's entry.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What happens to a spell cast using a higher-level slot than its base level?",
			choices: [
				"It assumes the higher level for that casting",
				"It fails automatically",
				"It costs two spell slots instead of one",
				"It becomes a ritual spell",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is a cantrip?": [
		{
			type: "true_false",
			question: "Casting a cantrip requires expending a spell slot.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What is the spell level of a cantrip?",
			choices: ["Level 0", "Level 1", "Level 3", "Level 9"],
			correctChoiceIndex: 0,
		},
	],
	"What is a ritual spell?": [
		{
			type: "true_false",
			question:
				"Casting a spell as a ritual adds 10 minutes to its casting time but doesn't expend a spell slot.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is true about ritual casting?",
			choices: [
				"A ritual spell can't be cast at a higher level than its base level this way",
				"It doubles the spell's duration",
				"It requires concentration regardless of the spell",
				"It grants advantage on the spell attack roll",
			],
			correctChoiceIndex: 0,
		},
	],
	"Can you cast spells while wearing armor?": [
		{
			type: "true_false",
			question:
				"You can cast a spell while wearing armor you aren't proficient with, but with disadvantage.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"What happens if you attempt to cast a spell while wearing armor you aren't proficient with?",
			choices: [
				"You can't cast the spell",
				"You cast it with disadvantage on the spell attack roll",
				"You take damage",
				"You must make a Constitution saving throw",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the three types of spell components?": [
		{
			type: "true_false",
			question:
				"A Verbal component can be blocked by being in an area of silence or by being gagged.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which spell component requires precise gestures and at least one free hand?",
			choices: ["Somatic", "Verbal", "Material", "Concentration"],
			correctChoiceIndex: 0,
		},
	],
	"What are the spell casting time options?": [
		{
			type: "true_false",
			question:
				"A spell with a casting time of 1 reaction can be cast in response to a trigger specified in the spell's description.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What must a caster do to cast a spell with a casting time of 1 reaction?",
			choices: [
				"Respond to a specific trigger described in the spell",
				"Wait until the start of their next turn",
				"Expend two spell slots",
				"Maintain concentration for the rest of the encounter",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is the rule when casting a bonus action spell?": [
		{
			type: "true_false",
			question:
				"If you cast a spell as a bonus action, you can still cast a cantrip with a casting time of 1 action on the same turn.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"After casting a spell as a bonus action, which spell can you still cast on the same turn?",
			choices: [
				"A cantrip with a casting time of 1 action",
				"Any 1st-level spell",
				"A ritual spell",
				"A spell with a casting time of 1 reaction",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the spell duration types?": [
		{
			type: "true_false",
			question: "An instantaneous spell's effect can be dispelled after it resolves.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"Which duration type lasts only as long as the caster maintains focus, up to a stated maximum?",
			choices: ["Concentration", "Instantaneous", "Until dispelled", "Fixed duration"],
			correctChoiceIndex: 0,
		},
	],
	"What breaks Concentration?": [
		{
			type: "true_false",
			question:
				"Taking damage while concentrating requires a Constitution saving throw with a DC of at least 10.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following breaks concentration on a spell?",
			choices: [
				"Casting another spell that requires concentration",
				"Taking the Dodge action",
				"Moving your full speed",
				"Making a ranged weapon attack",
			],
			correctChoiceIndex: 0,
		},
	],
	"Can you end concentration voluntarily?": [
		{
			type: "true_false",
			question: "Ending concentration voluntarily requires using your reaction.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What is required to voluntarily end concentration on a spell?",
			choices: [
				"Nothing — it can be done at any time with no action required",
				"Your action",
				"Your bonus action",
				"A successful Constitution saving throw",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the five area of effect shapes?": [
		{
			type: "true_false",
			question:
				"A cube's point of origin, which sits on one of its faces, is not included in its area.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which area-of-effect shape includes its point of origin within the area?",
			choices: ["Sphere", "Cube", "Line", "Cone"],
			correctChoiceIndex: 0,
		},
	],
	"What are the rules for spell targeting and cover?": [
		{
			type: "true_false",
			question:
				"You can target yourself with a spell that targets a creature of your choice, unless the spell says otherwise.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"If you can't see the area where you want to place a spell's area of effect and a wall blocks the path, where does the point of origin appear?",
			choices: [
				"On the near side of the wall",
				"On the far side of the wall",
				"The spell automatically fails",
				"You must target a different area entirely",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is the spell save DC formula?": [
		{
			type: "true_false",
			question: "The spell save DC formula includes your proficiency bonus.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the spell save DC formula?",
			choices: [
				"8 + spellcasting ability modifier + proficiency bonus",
				"10 + spellcasting ability modifier",
				"8 + proficiency bonus only",
				"15 + spellcasting ability modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is the spell attack bonus formula?": [
		{
			type: "true_false",
			question:
				"Ranged spell attacks have disadvantage if made within 5 feet of a hostile creature that can see you and isn't incapacitated.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the spell attack bonus formula?",
			choices: [
				"Spellcasting ability modifier + proficiency bonus",
				"8 + spellcasting ability modifier + proficiency bonus",
				"Proficiency bonus only",
				"Spellcasting ability modifier only",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the eight schools of magic?": [
		{
			type: "true_false",
			question:
				"Necromancy is the school of magic concerned with manipulating energy, such as fire and lightning.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"Which school of magic governs spells that reveal hidden information or grant glimpses of the future?",
			choices: ["Divination", "Enchantment", "Illusion", "Abjuration"],
			correctChoiceIndex: 0,
		},
	],
	"How do multiple spell effects stack?": [
		{
			type: "true_false",
			question:
				"If the same spell is cast on a target multiple times, its effects combine and stack.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"How do the effects of two different spells interact while their durations overlap?",
			choices: [
				"They add together",
				"Only the stronger effect applies",
				"They cancel each other out",
				"The most recently cast spell replaces the other",
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
