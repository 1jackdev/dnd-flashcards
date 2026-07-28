const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Core Rules";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"How do you gain HP when leveling up?": [
		{
			type: "true_false",
			question:
				"You can choose to use a fixed HP value instead of rolling your class's hit die when leveling up.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"If you choose to roll instead of using the fixed value, what do you roll and add when gaining HP at a new level?",
			choices: [
				"Your class's hit die plus your Constitution modifier",
				"Your class's hit die plus your Wisdom modifier",
				"A d20 plus your character level",
				"Your class's hit die plus your proficiency bonus",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the XP thresholds and proficiency bonuses by level?": [
		{
			type: "true_false",
			question: "A character needs 6,500 XP to reach 5th level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the proficiency bonus of a 5th-level character?",
			choices: ["+3", "+2", "+4", "+5"],
			correctChoiceIndex: 0,
		},
	],
	"What ability score minimums are required to multiclass into each class?": [
		{
			type: "true_false",
			question: "To multiclass into Monk, you need both Dexterity 13 and Wisdom 13.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What ability score minimum is required to multiclass into Barbarian?",
			choices: ["Strength 13", "Constitution 13", "Strength 15", "Dexterity 13"],
			correctChoiceIndex: 0,
		},
	],
	"What proficiencies do you gain when multiclassing into each class?": [
		{
			type: "true_false",
			question:
				"When multiclassing into Sorcerer or Wizard, you gain no new proficiencies from that class.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What proficiencies do you gain when multiclassing into Rogue?",
			choices: [
				"Light armor, one skill, and thieves' tools",
				"Light armor and two skills",
				"Medium armor and thieves' tools",
				"Simple weapons and one skill",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does XP cost work when multiclassing?": [
		{
			type: "true_false",
			question:
				"XP cost to gain a level is based on your total character level across all classes, not your level in any single class.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Per the example given, what must a cleric 6/fighter 1 do before gaining cleric 7 or fighter 2?",
			choices: [
				"Earn enough XP to reach 8th level total",
				"Earn enough XP to reach 7th level in fighter specifically",
				"Earn double the normal XP cost since they are multiclassed",
				"Earn enough XP based only on their fighter level",
			],
			correctChoiceIndex: 0,
		},
	],
	"How do Hit Dice work when multiclassing?": [
		{
			type: "true_false",
			question:
				"When multiclassing, you pool all your Hit Dice together, tracking dice of different types separately.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How much HP do you gain from a level in a new class gained through multiclassing?",
			choices: [
				"The amount described for levels after 1st, not the full 1st-level HP",
				"The full 1st-level HP for the new class",
				"The average of your current classes' hit dice",
				"Only your Constitution modifier",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does proficiency bonus work when multiclassing?": [
		{
			type: "true_false",
			question:
				"A fighter 3/rogue 2 has the same proficiency bonus (+3) as any other 5th-level character.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What determines your proficiency bonus if you have levels in multiple classes?",
			choices: [
				"Your total character level",
				"The average of your levels in each class",
				"Your level in your original starting class",
				"Your highest single-class level, doubled",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does Channel Divinity work when multiclassing?": [
		{
			type: "true_false",
			question:
				"Gaining Channel Divinity from a second class grants you an additional use of Channel Divinity.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"If you gain Channel Divinity from two different classes, how many uses do you have?",
			choices: [
				"Uses are still determined by the class level that grants additional uses, not extra uses from the second source",
				"One use per class that grants the feature",
				"Uses equal to your total character level",
				"Unlimited uses, once per short rest",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does Extra Attack work when multiclassing?": [
		{
			type: "true_false",
			question:
				"If you have Extra Attack from two different classes, you can make three attacks per turn.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What happens when you have Extra Attack from multiple classes?",
			choices: [
				"They don't stack — you still only get two attacks, unless a specific feature explicitly says otherwise",
				"They stack additively, granting one extra attack per source",
				"You get an extra attack only if one of the classes is Fighter",
				"They automatically unlock the Fighter's 11th-level three-attack benefit",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does Unarmored Defense work when multiclassing?": [
		{
			type: "true_false",
			question:
				"You can benefit from Unarmored Defense features from two different classes at the same time, stacking their bonuses.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"What happens if you already have Unarmored Defense and multiclass into another class that also grants it?",
			choices: [
				"You gain no additional benefit from the second class's version",
				"You add both classes' relevant ability modifiers to your AC",
				"You choose which version applies each day",
				"You can switch between them once per long rest",
			],
			correctChoiceIndex: 0,
		},
	],
	"How do spell slots work when you multiclass as a spellcaster?": [
		{
			type: "true_false",
			question:
				"When calculating your multiclass spellcaster level, you add your full levels in Paladin and Ranger, just like Wizard or Cleric.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "How do you calculate your level on the Multiclass Spellcaster table?",
			choices: [
				"Full levels in bard/cleric/druid/sorcerer/wizard, plus half your paladin/ranger levels rounded down",
				"Full levels in all spellcasting classes added together",
				"Half your levels in all spellcasting classes, rounded up",
				"Only your levels in your primary spellcasting class",
			],
			correctChoiceIndex: 0,
		},
	],
	"Can you use higher-level multiclass spell slots to cast lower-level spells?": [
		{
			type: "true_false",
			question: "You can use a higher-level spell slot to cast a spell you know at a lower level.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"What happens when you cast a spell using a spell slot of a higher level than the spell itself?",
			choices: [
				"Any upcast effects described in the spell apply",
				"The spell automatically fails",
				"The spell is cast at its base level with no benefit",
				"You must expend two slots instead of one",
			],
			correctChoiceIndex: 0,
		},
	],
	"How do Pact Magic (Warlock) slots interact with regular spell slots when multiclassing?": [
		{
			type: "true_false",
			question:
				"Pact Magic slots and regular spellcasting slots are interchangeable for casting spells from either source.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"How do a Warlock's Pact Magic slots interact with slots from another spellcasting class when multiclassing?",
			choices: [
				"They can be used interchangeably to cast spells from either class",
				"They must be kept entirely separate with no crossover",
				"Pact Magic slots can only be used to cast cantrips",
				"Regular slots permanently convert into Pact Magic slots",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the nine alignments?": [
		{
			type: "true_false",
			question:
				"Alignment combines a creature's morality (good, neutral, evil) with its attitude toward order (lawful, neutral, chaotic).",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which pair of alignments both share the 'Good' morality axis?",
			choices: [
				"Lawful Good and Neutral Good",
				"Lawful Good and Lawful Evil",
				"Neutral Good and Neutral Evil",
				"Chaotic Good and Chaotic Evil",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does each alignment mean in brief?": [
		{
			type: "true_false",
			question: "Lawful Evil creatures take what they want but work within a code or system.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which alignment 'follows whims and prizes personal freedom'?",
			choices: ["Chaotic Neutral", "Chaotic Good", "True Neutral", "Chaotic Evil"],
			correctChoiceIndex: 0,
		},
	],
	"What is an unaligned creature?": [
		{
			type: "true_false",
			question:
				"An unaligned creature lacks the capacity for rational moral choice and acts on instinct rather than ethics.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which example does the rule text give of an unaligned creature?",
			choices: ["Sharks", "Wolves", "Owlbears", "Zombies"],
			correctChoiceIndex: 0,
		},
	],
	"What are the Standard Languages of the SRD?": [
		{
			type: "true_false",
			question:
				"Orc is one of the Standard Languages, typically spoken by orcs and written in Dwarvish script.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Standard Language (not Exotic) in the SRD?",
			choices: ["Giant", "Draconic", "Abyssal", "Celestial"],
			correctChoiceIndex: 0,
		},
	],
	"What are the Exotic Languages of the SRD?": [
		{
			type: "true_false",
			question: "Draconic is spoken by dragons and dragonborn and uses its own script.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which language is classified as Exotic rather than Standard?",
			choices: ["Infernal", "Common", "Elvish", "Halfling"],
			correctChoiceIndex: 0,
		},
	],
	"What is Inspiration?": [
		{
			type: "true_false",
			question:
				"You can stockpile multiple uses of Inspiration if the GM grants it more than once.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "How does a character gain Inspiration?",
			choices: [
				"The GM grants it for playing true to the character's personality traits, ideals, bonds, or flaws",
				"It is gained automatically at the start of each session",
				"It is earned by defeating a certain number of enemies",
				"It regenerates after each long rest",
			],
			correctChoiceIndex: 0,
		},
	],
	"How do you use Inspiration?": [
		{
			type: "true_false",
			question:
				"You can give your Inspiration to another player character instead of using it yourself.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What benefit does spending Inspiration grant?",
			choices: [
				"Advantage on an attack roll, saving throw, or ability check",
				"A reroll of any failed death saving throw",
				"An extra bonus action on your next turn",
				"Immunity to critical hits for one round",
			],
			correctChoiceIndex: 0,
		},
	],
	"What does a background provide mechanically?": [
		{
			type: "true_false",
			question:
				"A background can be customized by replacing one feature, choosing any two skills, and choosing two tool proficiencies or languages.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What does a background provide mechanically, according to the rules?",
			choices: [
				"Two skill proficiencies, tool/language proficiencies, a starting equipment package, and a background feature",
				"Two feats and a starting equipment package",
				"An ability score increase and one skill proficiency",
				"A subclass choice and a background feature",
			],
			correctChoiceIndex: 0,
		},
	],
	"What proficiencies and feature does the Acolyte background grant?": [
		{
			type: "true_false",
			question: "The Acolyte background grants proficiency in Insight and Religion.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What feature does the Acolyte background grant?",
			choices: ["Shelter of the Faithful", "Criminal Contact", "Military Rank", "Ship's Passage"],
			correctChoiceIndex: 0,
		},
	],
	"What is the Shelter of the Faithful feature (Acolyte)?": [
		{
			type: "true_false",
			question:
				"Under Shelter of the Faithful, you must pay the full cost of healing and care received at a temple of your faith.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"What can an Acolyte with Shelter of the Faithful call upon while in good standing with their temple?",
			choices: [
				"Priests for non-hazardous assistance",
				"A free magic item once per year",
				"Free lodging at any inn in the realm",
				"A cleric to accompany them on adventures",
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
