const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Environment & Resting";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What are the rules for falling damage?": [
		{
			type: "true_false",
			question: "Falling damage is capped at a maximum of 20d6, no matter how far you fall.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What happens to a creature after taking falling damage, unless it avoids the damage entirely?",
			choices: [
				"It lands prone",
				"It is knocked unconscious",
				"It gains one level of exhaustion",
				"It is restrained until its next turn",
			],
			correctChoiceIndex: 0,
		},
	],
	"How long can a creature hold its breath, and what happens when it runs out?": [
		{
			type: "true_false",
			question:
				"A creature can hold its breath for a number of minutes equal to 1 plus its Constitution modifier, with a minimum of 30 seconds.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What happens to a creature at the start of its turn after surviving the extra rounds equal to its Constitution modifier once it runs out of breath?",
			choices: [
				"It drops to 0 hit points and begins dying",
				"It gains one level of exhaustion",
				"It falls unconscious but remains stable",
				"It takes 1d6 damage per round",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are lightly and heavily obscured areas?": [
		{
			type: "true_false",
			question:
				"A heavily obscured area only imposes disadvantage on Wisdom (Perception) checks, without blocking vision entirely.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"What is the effect of a heavily obscured area on a creature trying to see into it?",
			choices: [
				"Vision is blocked entirely, effectively giving the creature the blinded condition",
				"Disadvantage on Wisdom (Perception) checks that rely on sight",
				"Disadvantage on attack rolls only",
				"No effect on creatures with darkvision",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the three categories of illumination?": [
		{
			type: "true_false",
			question: "Dim light counts as a lightly obscured area.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of these is an example of dim light?",
			choices: [
				"Twilight, dawn, or the light of a brilliant full moon",
				"An unlit dungeon corridor",
				"An area affected by magical darkness",
				"A room lit by several torches",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Darkvision?": [
		{
			type: "true_false",
			question:
				"A creature with Darkvision can see in darkness as if it were dim light, but only in shades of gray.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is a limitation of Darkvision?",
			choices: [
				"It can't discern color in darkness",
				"It doesn't function in dim light at all",
				"It requires echolocation to work",
				"It doesn't let you see invisible creatures",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Blindsight?": [
		{
			type: "true_false",
			question:
				"Blindsight allows a creature to perceive its surroundings without relying on sight, within a specific radius.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of these creatures is a typical example of one with Blindsight?",
			choices: [
				"A bat using echolocation",
				"A creature with Darkvision out to 60 feet",
				"A creature with Truesight",
				"A creature that can see into the Ethereal Plane",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Truesight?": [
		{
			type: "true_false",
			question:
				"Truesight lets a creature automatically detect visual illusions and succeed on saving throws against them.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a benefit of Truesight not shared by Darkvision?",
			choices: [
				"Seeing invisible creatures and objects",
				"Seeing in dim light as though it were bright light",
				"Perceiving surroundings without needing sight at all",
				"Seeing normally in areas of dense foliage",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the food and water requirements and consequences?": [
		{
			type: "true_false",
			question:
				"A creature that drinks less than half the water it needs in a day automatically gains one level of exhaustion.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What happens to a character who drinks only half the water they need in a day?",
			choices: [
				"They must succeed on a DC 15 Constitution save or gain 1 exhaustion level at day's end",
				"They automatically gain 1 exhaustion level with no save",
				"They immediately gain 2 exhaustion levels",
				"They take 1d6 damage at day's end",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the rules for damaging objects?": [
		{
			type: "true_false",
			question: "Objects always fail Strength and Dexterity saving throws.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following are objects immune to?",
			choices: [
				"Poison and psychic damage",
				"Bludgeoning and fire damage",
				"Magical attacks",
				"All damage types",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is a Short Rest?": [
		{
			type: "true_false",
			question: "A Short Rest requires at least 8 hours of downtime.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "During a Short Rest, how does a character recover hit points?",
			choices: [
				"By spending Hit Dice, rolling them and adding their Constitution modifier",
				"By regaining all lost hit points automatically",
				"By regaining half their total Hit Dice",
				"By resting for at least 8 hours",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is a Long Rest?": [
		{
			type: "true_false",
			question:
				"A Long Rest can be taken more than once in a 24-hour period as long as each one lasts 8 hours.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "How many Hit Dice does a character regain after finishing a Long Rest?",
			choices: [
				"Up to half their total Hit Dice (minimum 1)",
				"All spent Hit Dice",
				"One Hit Die regardless of level",
				"None; Hit Dice only recover during a Short Rest",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the downtime activities available between adventures?": [
		{
			type: "true_false",
			question:
				"The Recuperating downtime activity takes 3 days and requires a DC 15 Constitution saving throw.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which downtime activity takes 250 days at a cost of 1 gp per day to gain a new language or tool proficiency?",
			choices: ["Training", "Researching", "Practicing a Profession", "Crafting"],
			correctChoiceIndex: 0,
		},
	],
	"What are the crafting downtime rules?": [
		{
			type: "true_false",
			question:
				"While crafting, a character can maintain a comfortable lifestyle at half its normal cost.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the cost of the raw materials needed to craft an item?",
			choices: [
				"Half the item's market value",
				"The full market value",
				"A flat 5 gp regardless of the item",
				"There is no cost for raw materials",
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
