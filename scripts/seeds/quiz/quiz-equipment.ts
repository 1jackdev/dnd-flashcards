const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Equipment";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What is the standard coin exchange rate in D&D 5e?": [
		{
			type: "true_false",
			question: "10 gold pieces are worth the same as 1 platinum piece.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many silver pieces equal 1 gold piece?",
			choices: ["10", "2", "100", "1000"],
			correctChoiceIndex: 0,
		},
	],
	"What can you buy with 1 gp, 1 sp, and 1 cp?": [
		{
			type: "true_false",
			question: "A skilled artisan earns roughly 1 gold piece per day.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What can 1 copper piece buy?",
			choices: [
				"A candle, torch, or piece of chalk",
				"A bedroll",
				"A night's stay at a poor inn",
				"50 feet of rope",
			],
			correctChoiceIndex: 0,
		},
	],
	"How much do you get when selling equipment?": [
		{
			type: "true_false",
			question: "Undamaged weapons and armor sell for half their listed cost.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of these items retains its full value when sold, unlike ordinary equipment?",
			choices: [
				"Gems and jewelry",
				"A suit of studded leather armor",
				"A simple weapon",
				"A shield",
			],
			correctChoiceIndex: 0,
		},
	],
	"What happens if you wear armor you're not proficient with?": [
		{
			type: "true_false",
			question: "Wearing armor you're not proficient with prevents you from casting spells.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Besides preventing spellcasting, wearing armor without proficiency imposes disadvantage on which rolls?",
			choices: [
				"Ability checks, saving throws, and attack rolls involving Strength or Dexterity",
				"Only attack rolls",
				"Only Constitution saving throws",
				"Ability checks involving Intelligence or Wisdom",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does AC work for light, medium, and heavy armor?": [
		{
			type: "true_false",
			question: "Medium armor allows you to add your full Dexterity modifier to AC with no cap.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What is the maximum Dexterity bonus to AC when wearing medium armor?",
			choices: [
				"+2",
				"+0 (no Dex bonus allowed)",
				"Full Dex modifier, uncapped",
				"+2, but only while wielding a shield",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the Strength requirements and Stealth penalties for heavy armor?": [
		{
			type: "true_false",
			question: "All heavy armor imposes disadvantage on Stealth checks.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which heavy armor has no Strength requirement?",
			choices: ["Ring mail", "Chain mail", "Splint", "Plate"],
			correctChoiceIndex: 0,
		},
	],
	"What are the AC values for all armor types?": [
		{
			type: "true_false",
			question: "Studded leather armor has a base AC of 12.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the base AC of Breastplate armor?",
			choices: ["14", "13", "15", "16"],
			correctChoiceIndex: 0,
		},
	],
	"How long does it take to don and doff armor?": [
		{
			type: "true_false",
			question: "Doffing heavy armor takes 5 minutes without help.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How long does it take to don medium armor?",
			choices: ["5 minutes", "1 minute", "10 minutes", "1 action"],
			correctChoiceIndex: 0,
		},
	],
	"What is the difference between simple and martial weapons?": [
		{
			type: "true_false",
			question:
				"Proficiency with a weapon lets you add your proficiency bonus to attack rolls made with it.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of these is a martial weapon requiring specialized training?",
			choices: ["Longsword", "Club", "Mace", "Quarterstaff"],
			correctChoiceIndex: 0,
		},
	],
	"What does the Ammunition weapon property mean?": [
		{
			type: "true_false",
			question:
				"After a battle, you can recover half your expended ammunition by spending 1 minute searching the battlefield.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "If you use an ammunition weapon (like a bow) in melee, how is the attack treated?",
			choices: [
				"As an improvised weapon dealing 1d4 damage",
				"With the weapon's normal damage die",
				"At disadvantage but with normal damage",
				"As a thrown weapon",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does the Finesse weapon property mean?": [
		{
			type: "true_false",
			question:
				"With a finesse weapon, you can use your Strength modifier for the attack roll and your Dexterity modifier for the damage roll.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which ability modifiers can be used with a finesse weapon?",
			choices: [
				"Either Strength or Dexterity, but the same one for both rolls",
				"Strength only",
				"Dexterity only",
				"Strength for damage and Dexterity for attack, always",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does the Heavy weapon property mean?": [
		{
			type: "true_false",
			question: "A Small creature has disadvantage on attack rolls when using a heavy weapon.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which creature size suffers disadvantage when attacking with a heavy weapon?",
			choices: [
				"Small creatures",
				"Only Tiny creatures, not Small creatures",
				"Medium creatures",
				"Large creatures",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does the Light weapon property mean?": [
		{
			type: "true_false",
			question: "Light weapons are well-suited for two-weapon fighting.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "The Light property is most associated with which combat style?",
			choices: ["Two-weapon fighting", "Mounted combat", "Reach attacks", "Grappling"],
			correctChoiceIndex: 0,
		},
	],
	"What does the Loading weapon property mean?": [
		{
			type: "true_false",
			question:
				"A weapon with the Loading property can only be fired once per action, bonus action, or reaction, even if you can normally make multiple attacks.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which weapon property limits you to firing one piece of ammunition per action regardless of extra attacks?",
			choices: ["Loading", "Ammunition", "Range", "Two-Handed"],
			correctChoiceIndex: 0,
		},
	],
	"What does the Range weapon property mean?": [
		{
			type: "true_false",
			question: "Attacking a target beyond a weapon's long range is impossible.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What happens when you attack a target between a ranged weapon's normal and long range?",
			choices: [
				"You have disadvantage on the attack roll",
				"You automatically miss",
				"You have advantage",
				"You take a -5 penalty to damage",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does the Reach weapon property mean?": [
		{
			type: "true_false",
			question:
				"The Reach property adds 5 feet to your reach for opportunity attacks as well as normal attacks.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How much extra reach does the Reach property grant?",
			choices: ["5 feet", "10 feet", "It doubles your reach", "15 feet"],
			correctChoiceIndex: 0,
		},
	],
	"What does the Thrown weapon property mean?": [
		{
			type: "true_false",
			question:
				"When you throw a weapon with the Thrown property, you use the same ability modifier you'd use for a melee attack with it.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"A dagger has both the Thrown and Finesse properties. Which ability modifier can you use when throwing it?",
			choices: [
				"Either Strength or Dexterity",
				"Strength only, never Dexterity",
				"Dexterity only, never Strength",
				"Neither; thrown attacks always use a flat +0",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does the Two-Handed weapon property mean?": [
		{
			type: "true_false",
			question: "A weapon with the Two-Handed property requires two hands to attack with it.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which property means a weapon can be used one-handed or two-handed, unlike Two-Handed weapons?",
			choices: ["Versatile", "Light", "Heavy", "Finesse"],
			correctChoiceIndex: 0,
		},
	],
	"What does the Versatile weapon property mean?": [
		{
			type: "true_false",
			question:
				"A versatile weapon's parenthetical damage die applies when wielded with two hands.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which property lets a weapon be wielded either one-handed or two-handed?",
			choices: ["Versatile", "Two-Handed", "Light", "Reach"],
			correctChoiceIndex: 0,
		},
	],
	"What are the rules for improvised weapons?": [
		{
			type: "true_false",
			question: "An improvised weapon typically deals 1d4 damage of a type chosen by the GM.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the range for throwing an improvised weapon?",
			choices: ["20/60 feet", "30/120 feet", "80/320 feet", "150/600 feet"],
			correctChoiceIndex: 0,
		},
	],
	"What are silvered weapons, and how much do they cost?": [
		{
			type: "true_false",
			question: "Silvering a weapon costs 100 gp per piece of ammunition, individually.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "How much does it cost to silver a weapon (or a batch of ammunition)?",
			choices: [
				"100 gp for the weapon, or 100 gp per 10 pieces of ammunition",
				"10 gp per weapon",
				"100 gp per single piece of ammunition",
				"1,000 gp per weapon",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the special rules for the Lance?": [
		{
			type: "true_false",
			question: "A Lance requires two hands to wield when you are not mounted.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What penalty does a Lance impose when attacking a target within 5 feet of you?",
			choices: [
				"Disadvantage on the attack roll",
				"It can't be used at all",
				"Advantage is lost but no disadvantage applies",
				"You provoke an opportunity attack",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the special rules for the Net?": [
		{
			type: "true_false",
			question: "A Net has no effect on formless creatures or creatures that are Huge or larger.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How can a creature restrained by a Net free itself?",
			choices: [
				"A DC 10 Strength check as an action",
				"A DC 15 Dexterity saving throw",
				"Automatically at the start of its turn",
				"A DC 10 Constitution check as a bonus action",
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
