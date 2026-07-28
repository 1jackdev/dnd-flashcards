const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Paladin";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What hit die does the Paladin use?": [
		{ type: "true_false", question: "A Paladin's hit die is 1d10.", correctAnswer: true },
		{
			type: "multiple_choice",
			question: "What is a Paladin's HP at 1st level?",
			choices: [
				"10 + Constitution modifier",
				"8 + Constitution modifier",
				"6 + Constitution modifier",
				"12 + Constitution modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"What armor and weapons is the Paladin proficient with?": [
		{
			type: "true_false",
			question: "A Paladin is proficient with all armor and shields.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which weapons is a Paladin proficient with?",
			choices: [
				"Simple and martial weapons",
				"Simple weapons only",
				"Martial weapons only",
				"Simple weapons and martial melee weapons only",
			],
			correctChoiceIndex: 0,
		},
	],
	"What saving throws is the Paladin proficient in?": [
		{
			type: "true_false",
			question: "A Paladin is proficient in Wisdom and Charisma saving throws.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which saving throws is the Paladin proficient in?",
			choices: [
				"Wisdom and Charisma",
				"Strength and Constitution",
				"Dexterity and Intelligence",
				"Constitution and Charisma",
			],
			correctChoiceIndex: 0,
		},
	],
	"What skills can a Paladin choose from at character creation?": [
		{
			type: "true_false",
			question:
				"A Paladin chooses 2 skills at character creation from a list that includes Athletics and Persuasion.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of these skills can a Paladin choose from at character creation?",
			choices: ["Persuasion", "Stealth", "Arcana", "Acrobatics"],
			correctChoiceIndex: 0,
		},
	],
	"What is Divine Sense (Paladin, 1st level)?": [
		{
			type: "true_false",
			question:
				"Divine Sense lets you detect celestial, fiend, or undead creatures within 60 feet.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many uses of Divine Sense do you get per long rest?",
			choices: [
				"1 + Charisma modifier",
				"1 + Wisdom modifier",
				"Proficiency bonus",
				"Unlimited, but only once per turn",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Lay on Hands (Paladin, 1st level)?": [
		{
			type: "true_false",
			question:
				"Lay on Hands can cure a disease or neutralize a poison by spending 5 HP from the pool.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How large is the Lay on Hands healing pool?",
			choices: [
				"5 × paladin level",
				"Paladin level × Charisma modifier",
				"5 × character level",
				"Charisma modifier × long rests taken",
			],
			correctChoiceIndex: 0,
		},
	],
	"What Fighting Styles can a Paladin choose from?": [
		{
			type: "true_false",
			question:
				"The Dueling fighting style grants +2 damage when wielding a melee weapon in one hand with no other weapons.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which Fighting Style requires you to have a shield?",
			choices: ["Protection", "Defense", "Dueling", "Great Weapon Fighting"],
			correctChoiceIndex: 0,
		},
	],
	"What is the Paladin's spellcasting ability?": [
		{
			type: "true_false",
			question: "A Paladin's spell save DC uses their Charisma modifier.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the Paladin's spellcasting ability?",
			choices: ["Charisma", "Wisdom", "Intelligence", "Constitution"],
			correctChoiceIndex: 0,
		},
	],
	"How does the Paladin prepare spells?": [
		{
			type: "true_false",
			question: "A Paladin prepares spells after finishing a long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many spells does a Paladin prepare?",
			choices: [
				"Charisma modifier + half paladin level (rounded down, minimum 1)",
				"Charisma modifier + full paladin level",
				"Intelligence modifier + half paladin level (rounded down)",
				"A fixed number set by a class table, unrelated to ability modifiers",
			],
			correctChoiceIndex: 0,
		},
	],
	"What can a Paladin use as a spellcasting focus?": [
		{
			type: "true_false",
			question: "A Paladin can use a holy symbol as a spellcasting focus.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What can a Paladin use as a spellcasting focus?",
			choices: ["A holy symbol", "An arcane focus", "A druidic focus", "A component pouch"],
			correctChoiceIndex: 0,
		},
	],
	"When does a Paladin gain spell slots?": [
		{
			type: "true_false",
			question: "A Paladin gains spell slots starting at 2nd level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Paladin gain spell slots?",
			choices: ["2nd level", "1st level", "3rd level", "5th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Divine Smite (Paladin, 2nd level)?": [
		{
			type: "true_false",
			question:
				"Divine Smite deals an extra 1d8 radiant damage if the target is an undead or fiend.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How much radiant damage does Divine Smite deal using a 1st-level spell slot?",
			choices: ["2d8", "1d8", "3d8", "1d6"],
			correctChoiceIndex: 0,
		},
	],
	"What is Divine Health (Paladin, 3rd level)?": [
		{
			type: "true_false",
			question: "Divine Health makes a Paladin immune to disease.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What does Divine Health grant a Paladin?",
			choices: [
				"Immunity to disease",
				"Immunity to poison",
				"Immunity to being frightened",
				"Immunity to being charmed",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Sacred Oath (Paladin, 3rd level)?": [
		{
			type: "true_false",
			question: "Channel Divinity recharges on a short or long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what levels does Sacred Oath grant additional features?",
			choices: [
				"7th, 15th, and 20th",
				"6th, 10th, and 14th",
				"4th, 8th, and 12th",
				"3rd, 11th, and 17th",
			],
			correctChoiceIndex: 0,
		},
	],
	"What happens if a Paladin breaks their Sacred Oath?": [
		{
			type: "true_false",
			question:
				"A Paladin who breaks their Sacred Oath can seek atonement from a cleric or paladin of the same faith.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What can happen to a Paladin who breaks their Sacred Oath, at the DM's discretion?",
			choices: [
				"Loss of paladin spells and Channel Divinity, potentially becoming an oathbreaker",
				"Automatic permanent loss of all class features",
				"Immediate conversion into a DM-controlled NPC with no recourse",
				"Loss of Lay on Hands only",
			],
			correctChoiceIndex: 0,
		},
	],
	"At what levels does the Paladin gain Ability Score Improvement?": [
		{
			type: "true_false",
			question: "A Paladin gains an Ability Score Improvement at 19th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At which levels does a Paladin gain Ability Score Improvement?",
			choices: [
				"4th, 8th, 12th, 16th, and 19th",
				"4th, 6th, 8th, 12th, 14th, 16th, and 19th",
				"3rd, 6th, 9th, and 12th",
				"5th, 10th, 15th, and 20th",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Extra Attack (Paladin, 5th level)?": [
		{
			type: "true_false",
			question:
				"Extra Attack lets a Paladin attack twice instead of once when taking the Attack action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Paladin gain Extra Attack?",
			choices: ["5th level", "6th level", "11th level", "3rd level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Aura of Protection (Paladin, 6th level)?": [
		{
			type: "true_false",
			question:
				"Aura of Protection adds your Charisma modifier to saving throws for you and friendly creatures within 10 feet.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does Aura of Protection's range expand to 30 feet?",
			choices: ["18th level", "20th level", "15th level", "10th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Aura of Courage (Paladin, 10th level)?": [
		{
			type: "true_false",
			question: "Aura of Courage prevents you and nearby friendly creatures from being frightened.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What condition does Aura of Courage protect against?",
			choices: ["Frightened", "Charmed", "Poisoned", "Paralyzed"],
			correctChoiceIndex: 0,
		},
	],
	"What is Improved Divine Smite (Paladin, 11th level)?": [
		{
			type: "true_false",
			question:
				"Improved Divine Smite's extra radiant damage applies in addition to any Divine Smite you use.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What does Improved Divine Smite grant?",
			choices: [
				"An extra 1d8 radiant damage on every melee weapon hit",
				"An extra spell slot usable for Divine Smite",
				"Double damage whenever Divine Smite is used",
				"1d8 extra damage, but only against undead and fiends",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Cleansing Touch (Paladin, 14th level)?": [
		{
			type: "true_false",
			question: "Cleansing Touch can end a spell affecting a willing creature you touch.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How many uses of Cleansing Touch does a Paladin get per long rest?",
			choices: [
				"Charisma modifier (minimum 1)",
				"Wisdom modifier (minimum 1)",
				"Proficiency bonus",
				"Unlimited uses",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the tenets of the Oath of Devotion?": [
		{
			type: "true_false",
			question: "The Oath of Devotion's tenets include Honesty and Compassion.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of these is a tenet of the Oath of Devotion?",
			choices: ["Honor", "Vengeance", "Redemption", "Conquest"],
			correctChoiceIndex: 0,
		},
	],
	"What are the Oath of Devotion spells?": [
		{
			type: "true_false",
			question:
				"At 3rd level, the Oath of Devotion grants protection from evil and good and sanctuary.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which spells does the Oath of Devotion grant at 9th level?",
			choices: [
				"Beacon of hope and dispel magic",
				"Freedom of movement and guardian of faith",
				"Lesser restoration and zone of truth",
				"Commune and flame strike",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Channel Divinity: Sacred Weapon (Oath of Devotion, 3rd level)?": [
		{
			type: "true_false",
			question: "Sacred Weapon adds your Charisma modifier to attack rolls with the imbued weapon.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How long does the Sacred Weapon effect last?",
			choices: ["1 minute", "10 minutes", "Until the end of your next turn", "1 hour"],
			correctChoiceIndex: 0,
		},
	],
	"What is Channel Divinity: Turn the Unholy (Oath of Devotion, 3rd level)?": [
		{
			type: "true_false",
			question:
				"Turn the Unholy forces fiends or undead within 30 feet that can see or hear you to make a Wisdom saving throw.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What ends the turned effect from Turn the Unholy early?",
			choices: [
				"The creature taking damage",
				"The Paladin moving away from the creature",
				"The creature succeeding on a second saving throw",
				"A short rest",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is Aura of Devotion (Oath of Devotion, 7th level)?": [
		{
			type: "true_false",
			question: "Aura of Devotion prevents you and nearby friendly creatures from being charmed.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "At what level does a Paladin gain Aura of Devotion?",
			choices: ["7th level", "6th level", "10th level", "15th level"],
			correctChoiceIndex: 0,
		},
	],
	"What is Purity of Spirit (Oath of Devotion, 15th level)?": [
		{
			type: "true_false",
			question:
				"Purity of Spirit means you are always under the effect of protection from evil and good.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What spell effect does Purity of Spirit permanently grant?",
			choices: ["Protection from evil and good", "Sanctuary", "Freedom of movement", "Death ward"],
			correctChoiceIndex: 0,
		},
	],
	"What is Holy Nimbus (Oath of Devotion, 20th level)?": [
		{
			type: "true_false",
			question: "Holy Nimbus can be used once per long rest.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"How much radiant damage does Holy Nimbus deal to enemies that start their turn in the aura?",
			choices: [
				"10 radiant damage",
				"1d8 radiant damage",
				"5 radiant damage",
				"2d8 radiant damage",
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
