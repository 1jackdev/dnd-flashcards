const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Movement & Travel";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What time scales does D&D 5e use for different situations?": [
		{
			type: "true_false",
			question: "In D&D 5e, combat rounds represent 6 seconds each.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which time scale is used for dungeon exploration?",
			choices: ["Minutes", "Hours", "Days", "Rounds (6 seconds each)"],
			correctChoiceIndex: 0,
		},
	],
	"What are the three travel paces and their distances?": [
		{
			type: "true_false",
			question:
				"Traveling at a Fast pace imposes a -5 penalty to a character's passive Wisdom (Perception) score.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At a Normal travel pace, how far can a group travel in a day?",
			choices: ["24 miles", "30 miles", "18 miles", "36 miles"],
			correctChoiceIndex: 0,
		},
	],
	"What is a Forced March?": [
		{
			type: "true_false",
			question: "The Travel Pace table assumes 8 hours of travel per day.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What happens to a character who fails the Constitution saving throw during a Forced March?",
			choices: [
				"The character gains one level of exhaustion",
				"The character's speed becomes 0, as with the Grappled condition",
				"The character can only travel at a Slow pace for the rest of the journey",
				"The character takes 1d6 bludgeoning damage from fatigue",
			],
			correctChoiceIndex: 0,
		},
	],
	"How do mounts and vehicles affect travel speed?": [
		{
			type: "true_false",
			question: "A mount can gallop for about 1 hour, covering twice the distance of a fast pace.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How does travel pace (fast/normal/slow) affect a waterborne vessel?",
			choices: [
				"It has no effect — the vessel travels at its own speed",
				"Fast pace grants the vessel a -5 penalty to passive Perception, same as travelers on foot",
				"Slow pace lets the vessel's crew use stealth, same as travelers on foot",
				"Fast pace increases the vessel's speed by 30 miles per day",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is difficult terrain and how does it affect movement?": [
		{
			type: "true_false",
			question: "Moving through difficult terrain, each foot of movement costs 2 feet of speed.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "When moving through difficult terrain, how does your travel distance change?",
			choices: [
				"You cover only half the normal distance in a given minute, hour, or day",
				"You cover only a third of the normal distance",
				"Your speed becomes 0 until you leave the terrain",
				"You automatically fail Dexterity saving throws while in it",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does climbing, swimming, and crawling affect movement cost?": [
		{
			type: "true_false",
			question:
				"Climbing, swimming, or crawling without an appropriate speed costs 1 extra foot of movement per foot moved.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"If you are climbing in difficult terrain and don't have a climbing speed, how much does each foot of movement cost in total?",
			choices: [
				"3 feet total (1 normal foot + 2 extra feet)",
				"2 feet total, same as difficult terrain alone",
				"4 feet total",
				"1 foot total — climbing without a climbing speed costs no extra movement",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the rules for a Long Jump?": [
		{
			type: "true_false",
			question:
				"With a 10-foot running start, you can make a long jump covering a distance in feet up to your Strength score.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What check might you need to make if you land in difficult terrain after a Long Jump?",
			choices: [
				"DC 10 Dexterity (Acrobatics) check or land prone",
				"DC 10 Strength (Athletics) check or fall prone",
				"DC 15 Constitution save or gain a level of exhaustion",
				"DC 10 Wisdom (Perception) check to notice the terrain",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the rules for a High Jump?": [
		{
			type: "true_false",
			question:
				"With a 10-foot running start, a High Jump lets you jump up a number of feet equal to 3 plus your Strength modifier.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "In a standing high jump (no running start), how far up can you jump?",
			choices: [
				"Half the running-start distance (i.e., half of 3 + your Strength modifier)",
				"The same distance as a running start",
				"Your Strength score in feet, as with a long jump",
				"3 feet, regardless of Strength modifier",
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
