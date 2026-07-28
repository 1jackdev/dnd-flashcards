const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	{
		front: "What are the effects of the Blinded condition?",
		back: "Can't see; automatically fail any ability check requiring sight. Attack rolls against you have advantage; your attack rolls have disadvantage.",
		tags: ["condition", "rule"],
		quiz: [
			{
				type: "true_false" as const,
				question: "While Blinded, you automatically fail any ability check that requires sight.",
				correctAnswer: true,
			},
			{
				type: "multiple_choice" as const,
				question: "What happens to attack rolls made against a Blinded creature?",
				choices: [
					"They have advantage",
					"They have disadvantage",
					"They are unaffected",
					"They automatically miss",
				],
				correctChoiceIndex: 0,
			},
		],
	},
	{
		front: "What are the effects of the Charmed condition?",
		back: "Can't attack the charmer or target them with harmful abilities or magical effects. Charmer has advantage on social ability checks against you.",
		tags: ["condition", "rule"],
		quiz: [
			{
				type: "true_false" as const,
				question:
					"A Charmed creature can attack the creature that charmed it as long as it uses a ranged weapon.",
				correctAnswer: false,
			},
			{
				type: "multiple_choice" as const,
				question: "What can the charmer do against a Charmed creature that it normally couldn't?",
				choices: [
					"Gain advantage on social ability checks against it",
					"Force it to use its reaction every turn",
					"Automatically win initiative against it",
					"Read its surface thoughts at will",
				],
				correctChoiceIndex: 0,
			},
		],
	},
	{
		front: "What are the effects of the Deafened condition?",
		back: "Can't hear; automatically fail any ability check requiring hearing.",
		tags: ["condition", "rule"],
		quiz: [
			{
				type: "true_false" as const,
				question: "A Deafened creature automatically fails ability checks that require hearing.",
				correctAnswer: true,
			},
			{
				type: "multiple_choice" as const,
				question: "Which of the following does the Deafened condition affect?",
				choices: [
					"Ability checks that require hearing",
					"Attack rolls made against you",
					"Your speed",
					"Saving throws against spells",
				],
				correctChoiceIndex: 0,
			},
		],
	},
	{
		front: "What are the six levels of Exhaustion and their effects?",
		back: "1: Disadvantage on ability checks. 2: Speed halved. 3: Disadvantage on attack rolls and saving throws. 4: HP maximum halved. 5: Speed reduced to 0. 6: Death. Effects are cumulative. Each long rest removes one level. DC 15 Con save to avoid gaining a level after forced march.",
		tags: ["condition", "rule"],
		quiz: [
			{
				type: "true_false" as const,
				question:
					"Exhaustion effects are cumulative, so a creature at level 3 also suffers the effects of levels 1 and 2.",
				correctAnswer: true,
			},
			{
				type: "multiple_choice" as const,
				question: "At which level of Exhaustion does a creature's speed become 0?",
				choices: ["Level 5", "Level 2", "Level 4", "Level 6"],
				correctChoiceIndex: 0,
			},
		],
	},
	{
		front: "How do you remove Exhaustion?",
		back: "Finishing a long rest removes one exhaustion level, provided you have had food and water. All levels removed when exhaustion reaches 0.",
		tags: ["condition", "rule"],
		quiz: [
			{
				type: "true_false" as const,
				question: "Finishing a short rest removes one level of Exhaustion.",
				correctAnswer: false,
			},
			{
				type: "multiple_choice" as const,
				question: "What is required to remove a level of Exhaustion?",
				choices: [
					"Finishing a long rest, having had food and water",
					"Finishing a short rest",
					"Sleeping for 24 hours straight",
					"Waiting until the next dawn",
				],
				correctChoiceIndex: 0,
			},
		],
	},
	{
		front: "What are the effects of the Frightened condition?",
		back: "Disadvantage on ability checks and attack rolls while the source of fear is within line of sight. Can't willingly move closer to the source of fear.",
		tags: ["condition", "rule"],
		quiz: [
			{
				type: "true_false" as const,
				question:
					"A Frightened creature can willingly move closer to the source of its fear if it has no other options.",
				correctAnswer: false,
			},
			{
				type: "multiple_choice" as const,
				question:
					"A Frightened creature has disadvantage on ability checks and attack rolls under what condition?",
				choices: [
					"While the source of its fear is within line of sight",
					"Only during its own turn",
					"While it is underwater",
					"Only against the creature that frightened it",
				],
				correctChoiceIndex: 0,
			},
		],
	},
	{
		front: "What are the effects of the Grappled condition?",
		back: "Speed becomes 0; can't benefit from any bonus to speed. Ends if the grappler is incapacitated. Ends if you are moved outside grappler's reach (by an effect moving you, not grappler moving you).",
		tags: ["condition", "rule", "combat"],
		quiz: [
			{
				type: "true_false" as const,
				question:
					"A Grappled creature's speed becomes 0 and it can't benefit from any bonus to its speed.",
				correctAnswer: true,
			},
			{
				type: "multiple_choice" as const,
				question: "When does the Grappled condition end?",
				choices: [
					"When the grappler is incapacitated",
					"When the grappled creature takes any damage",
					"At the end of the grappled creature's next turn",
					"When the grappled creature casts a spell",
				],
				correctChoiceIndex: 0,
			},
		],
	},
	{
		front: "What are the effects of the Incapacitated condition?",
		back: "Can't take actions or reactions.",
		tags: ["condition", "rule"],
		quiz: [
			{
				type: "true_false" as const,
				question: "An Incapacitated creature can't take actions or reactions.",
				correctAnswer: true,
			},
			{
				type: "multiple_choice" as const,
				question: "What can an Incapacitated creature NOT do?",
				choices: [
					"Take actions or reactions",
					"Move at all",
					"Speak",
					"Automatically fail Dexterity saving throws",
				],
				correctChoiceIndex: 0,
			},
		],
	},
	{
		front: "What are the effects of the Invisible condition?",
		back: "Impossible to see without special sense; considered heavily obscured for hiding. Can still be detected by noise or tracks. Attack rolls against you have disadvantage; your attack rolls have advantage.",
		tags: ["condition", "rule", "combat"],
		quiz: [
			{
				type: "true_false" as const,
				question: "An Invisible creature's own attack rolls have disadvantage.",
				correctAnswer: false,
			},
			{
				type: "multiple_choice" as const,
				question:
					"What effect does the Invisible condition have on attack rolls made against the invisible creature?",
				choices: ["Disadvantage", "Advantage", "No effect", "Automatic miss"],
				correctChoiceIndex: 0,
			},
		],
	},
	{
		front: "What are the effects of the Paralyzed condition?",
		back: "Incapacitated (no actions or reactions). Can't move or speak. Automatically fail Strength and Dexterity saving throws. Attack rolls against you have advantage. Any attack that hits while within 5 ft is a critical hit.",
		tags: ["condition", "rule", "combat"],
		quiz: [
			{
				type: "true_false" as const,
				question: "A Paralyzed creature automatically fails Strength and Dexterity saving throws.",
				correctAnswer: true,
			},
			{
				type: "multiple_choice" as const,
				question:
					"What additional effect applies to attacks against a Paralyzed creature from within 5 feet?",
				choices: [
					"The attack is a critical hit if it hits",
					"The attacker must make a Wisdom save first",
					"The attack automatically misses",
					"The attacker takes damage in return",
				],
				correctChoiceIndex: 0,
			},
		],
	},
	{
		front: "What are the effects of the Petrified condition?",
		back: "Transformed into solid inanimate substance (usually stone) along with all nonmagical worn/carried objects. Weight ×10; doesn't age. Incapacitated, can't move or speak, unaware of surroundings. Attack rolls against you have advantage. Automatically fail Str and Dex saves. Resistance to all damage. Immune to poison and disease (existing poison/disease suspended, not neutralized).",
		tags: ["condition", "rule"],
		quiz: [
			{
				type: "true_false" as const,
				question: "A Petrified creature has resistance to all damage.",
				correctAnswer: true,
			},
			{
				type: "multiple_choice" as const,
				question: "What happens to a creature's weight when Petrified?",
				choices: ["It multiplies by 10", "It is unaffected", "It is reduced to zero", "It doubles"],
				correctChoiceIndex: 0,
			},
		],
	},
	{
		front: "What are the effects of the Poisoned condition?",
		back: "Disadvantage on attack rolls and ability checks.",
		tags: ["condition", "rule"],
		quiz: [
			{
				type: "true_false" as const,
				question: "A Poisoned creature has disadvantage on attack rolls and ability checks.",
				correctAnswer: true,
			},
			{
				type: "multiple_choice" as const,
				question: "What does the Poisoned condition impose?",
				choices: [
					"Disadvantage on attack rolls and ability checks",
					"Disadvantage on saving throws only",
					"Speed reduced to 0",
					"Immunity to further poison",
				],
				correctChoiceIndex: 0,
			},
		],
	},
	{
		front: "What are the effects of the Prone condition?",
		back: "Only movement option is crawling (costs 1 extra foot per foot) or teleporting. Disadvantage on attack rolls. Attack rolls against you: advantage if attacker is within 5 ft, disadvantage if attacker is further away. Stand up costs movement equal to half your speed.",
		tags: ["condition", "rule", "combat"],
		quiz: [
			{
				type: "true_false" as const,
				question: "A Prone creature has disadvantage on the attack rolls it makes.",
				correctAnswer: true,
			},
			{
				type: "multiple_choice" as const,
				question:
					"How does the Prone condition affect attack rolls against the prone creature from an attacker within 5 feet?",
				choices: ["Advantage", "Disadvantage", "No effect", "Automatic critical"],
				correctChoiceIndex: 0,
			},
		],
	},
	{
		front: "What are the effects of the Restrained condition?",
		back: "Speed becomes 0; can't benefit from any bonus to speed. Attack rolls against you have advantage; your attack rolls have disadvantage. Disadvantage on Dexterity saving throws.",
		tags: ["condition", "rule", "combat"],
		quiz: [
			{
				type: "true_false" as const,
				question: "A Restrained creature has advantage on Dexterity saving throws.",
				correctAnswer: false,
			},
			{
				type: "multiple_choice" as const,
				question: "What happens to a Restrained creature's speed?",
				choices: ["It becomes 0", "It is halved", "It doubles", "It is unaffected"],
				correctChoiceIndex: 0,
			},
		],
	},
	{
		front: "What are the effects of the Stunned condition?",
		back: "Incapacitated (no actions or reactions), can't move, can only speak falteringly. Automatically fail Strength and Dexterity saving throws. Attack rolls against you have advantage.",
		tags: ["condition", "rule", "combat"],
		quiz: [
			{
				type: "true_false" as const,
				question: "A Stunned creature can move normally but can't take actions.",
				correctAnswer: false,
			},
			{
				type: "multiple_choice" as const,
				question: "What can a Stunned creature still do?",
				choices: ["Speak falteringly", "Move its full speed", "Take reactions", "Take its action"],
				correctChoiceIndex: 0,
			},
		],
	},
	{
		front: "What are the effects of the Unconscious condition?",
		back: "Incapacitated (no actions or reactions), can't move or speak, unaware of surroundings. Drop whatever you're holding and fall prone. Automatically fail Strength and Dexterity saving throws. Attack rolls against you have advantage. Any attack that hits while within 5 ft is a critical hit.",
		tags: ["condition", "rule", "combat"],
		quiz: [
			{
				type: "true_false" as const,
				question: "An Unconscious creature drops whatever it is holding and falls prone.",
				correctAnswer: true,
			},
			{
				type: "multiple_choice" as const,
				question: "Which saving throws does an Unconscious creature automatically fail?",
				choices: [
					"Strength and Dexterity",
					"Constitution and Wisdom",
					"All saving throws",
					"Intelligence and Charisma",
				],
				correctChoiceIndex: 0,
			},
		],
	},
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: "Conditions",
			description:
				"SRD 5.1 conditions: all 15 conditions (Blinded, Charmed, Deafened, Exhaustion, Frightened, Grappled, Incapacitated, Invisible, Paralyzed, Petrified, Poisoned, Prone, Restrained, Stunned, Unconscious) with full mechanical effects.",
		}),
	});
	if (!deckRes.ok) throw new Error(`Create deck failed: ${await deckRes.text()}`);
	const { id: deckId } = (await deckRes.json()) as { id: string };
	console.log(`Deck created: ${deckId}`);

	let ok = 0;
	let quizOk = 0;
	let quizTotal = 0;
	for (const { quiz, ...card } of cards) {
		quizTotal += quiz.length;
		const res = await fetch(`${API}/decks/${deckId}/cards`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(card),
		});
		if (!res.ok) {
			console.error(`\n  FAIL "${card.front.slice(0, 50)}": ${await res.text()}`);
			continue;
		}
		ok++;
		process.stdout.write(`\r  ${ok}/${cards.length}`);
		const { id: cardId } = (await res.json()) as { id: string };

		for (const question of quiz) {
			const quizRes = await fetch(`${API}/flashcards/${cardId}/quiz`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(question),
			});
			if (quizRes.ok) {
				quizOk++;
			} else {
				console.error(`\n  FAIL quiz "${question.question.slice(0, 50)}": ${await quizRes.text()}`);
			}
		}
	}
	console.log(
		`\nDone. ${ok}/${cards.length} cards imported. ${quizOk}/${quizTotal} quiz questions imported.`,
	);
}

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
