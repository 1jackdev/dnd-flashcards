const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Planes of Existence";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What is the Material Plane?": [
		{
			type: "true_false",
			question:
				"The Material Plane is defined in relation to the other planes, rather than the other way around.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"Which plane serves as the reference point that all other planes are defined in relation to?",
			choices: ["Material Plane", "Astral Plane", "Ethereal Plane", "Outlands"],
			correctChoiceIndex: 0,
		},
	],
	"What are the Transitive Planes?": [
		{
			type: "true_false",
			question: "The Transitive Planes have no fixed geography and shift and change.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which two planes make up the Transitive Planes?",
			choices: [
				"The Ethereal Plane and the Astral Plane",
				"The Elemental Chaos and the Astral Plane",
				"The Ethereal Plane and the Elemental Chaos",
				"The Border Ethereal and the Outlands",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is the Ethereal Plane?": [
		{
			type: "true_false",
			question:
				"The Border Ethereal is the region of the Ethereal Plane closest to the Material Plane.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What lies deeper within the Ethereal Plane, beyond the Border Ethereal?",
			choices: [
				"The Deep Ethereal",
				"The Elemental Chaos",
				"The Astral Plane's silvery sea",
				"The Outlands",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is the Astral Plane?": [
		{
			type: "true_false",
			question: "Traveling through the Astral Plane requires leaving your physical body behind.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What does the Astral Plane's silvery sea contain, according to the lore?",
			choices: [
				"Solidified chunks of thought and the remnants of dead gods",
				"The endless sea of flame that forms the Plane of Fire",
				"The crushing rock and soil of the Plane of Earth",
				"The endless open sky of the Plane of Air",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the Inner Planes?": [
		{
			type: "true_false",
			question: "Where the four Elemental Planes meet, they merge into the para-elemental planes.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What lies at the outermost reaches of the Inner Planes?",
			choices: ["The Elemental Chaos", "The Astral Plane", "Mount Celestia", "The Border Ethereal"],
			correctChoiceIndex: 0,
		},
	],
	"What are the four Elemental Planes?": [
		{
			type: "true_false",
			question: "The City of Brass is the heart of the Plane of Fire.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which genie race is native to the Plane of Earth?",
			choices: ["Dao", "Djinn", "Efreet", "Marid"],
			correctChoiceIndex: 0,
		},
	],
	"What is the Elemental Chaos?": [
		{
			type: "true_false",
			question:
				"The Elemental Chaos is a place of ceaseless conflict where the four elements collide.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "The Elemental Chaos lies at the outer edge of which group of planes?",
			choices: [
				"The Inner Planes",
				"The Outer Planes",
				"The Transitive Planes",
				"The Ethereal Plane",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the Outer Planes?": [
		{
			type: "true_false",
			question:
				"The Outlands is the truly neutral plane at the center of the Outer Planes, home to Sigil, the City of Doors.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which plane is the seat of chaotic evil among the Outer Planes?",
			choices: ["The Abyss", "The Nine Hells of Baator", "Mechanus", "Limbo"],
			correctChoiceIndex: 0,
		},
	],
	"What is the Great Wheel cosmology's outer plane alignment structure?": [
		{
			type: "true_false",
			question: "Mechanus is the Outer Plane associated with lawful neutral alignment.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which Outer Plane represents lawful good, sitting at the highest point of the Upper Planes?",
			choices: ["Mount Celestia", "Bytopia", "Elysium", "Arcadia"],
			correctChoiceIndex: 0,
		},
	],
	"What are Demiplanes?": [
		{
			type: "true_false",
			question: "A bag of holding contains a pocket dimension that is an example of a demiplane.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which spell creates a demiplane, a small extradimensional space with its own rules?",
			choices: ["Demiplane", "Plane Shift", "Gate", "Etherealness"],
			correctChoiceIndex: 0,
		},
	],
	"What spells allow planar travel?": [
		{
			type: "true_false",
			question: "Plane Shift can teleport up to eight willing creatures to another plane.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which spell opens a portal to an exact location on another plane?",
			choices: ["Gate", "Plane Shift", "Etherealness", "Astral Projection"],
			correctChoiceIndex: 0,
		},
	],
	"What are portals in the context of planar travel?": [
		{
			type: "true_false",
			question: "Portals connecting planes are usually permanent rather than temporary.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of these is given as a typical shape a portal takes?",
			choices: [
				"A shimmering wall, a door, or an arch",
				"A swirling silvery sea studded with solidified thought",
				"A curtain of multicolored fog",
				"A turbulent whirl of colliding elements",
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
