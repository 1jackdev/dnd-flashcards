const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Combat Rules";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What are the steps of combat in order?": [
		{
			type: "true_false",
			question: "A round of combat represents about 6 seconds.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What ability check is used to roll initiative?",
			choices: ["Dexterity", "Wisdom (Perception)", "Constitution", "Charisma"],
			correctChoiceIndex: 0,
		},
	],
	"What does being surprised mean in combat?": [
		{
			type: "true_false",
			question: "A surprised creature can't take an action on its first turn, but can still move.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What determines whether a creature is surprised in combat?",
			choices: [
				"Comparing hiding creatures' Dex (Stealth) checks vs. opponents' passive Wis (Perception)",
				"Comparing initiative rolls",
				"Comparing passive Perception scores only",
				"A flat DC 15 check",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does initiative work?": [
		{
			type: "true_false",
			question: "When two player characters tie initiative, the GM decides the order between them.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "How are initiative ties between two of the GM's creatures resolved?",
			choices: [
				"The GM decides, or both roll d20 with highest going first",
				"The players decide",
				"Alphabetical order by creature name",
				"Highest Dex score automatically wins",
			],
			correctChoiceIndex: 0,
		},
	],
	"What can you do on your turn?": [
		{
			type: "true_false",
			question: "You can move and take your action in either order on your turn.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following requires a feature that explicitly grants it?",
			choices: [
				"A bonus action",
				"Movement up to your speed",
				"Interacting with one object",
				"Communicating briefly",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is a Bonus Action?": [
		{
			type: "true_false",
			question:
				"You automatically gain a bonus action every turn, even without a class feature granting one.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "How many bonus actions can you take on your turn?",
			choices: ["One", "Two", "Unlimited", "One per short rest"],
			correctChoiceIndex: 0,
		},
	],
	"What is a Reaction?": [
		{
			type: "true_false",
			question: "You can take only one reaction per round.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"If your reaction interrupts another creature's turn, what happens after your reaction resolves?",
			choices: [
				"That creature continues its turn",
				"The interrupted creature's turn ends immediately",
				"Initiative order restarts",
				"You get to act again immediately",
			],
			correctChoiceIndex: 0,
		},
	],
	"How can you split your movement on your turn?": [
		{
			type: "true_false",
			question:
				"With Extra Attack, you can move between your individual attacks within the Attack action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Besides splitting movement before and after your action, when else can you move mid-turn if you have Extra Attack?",
			choices: [
				"Between individual attacks within the Attack action",
				"Only during your reaction",
				"Only if you Disengage first",
				"Only on a critical hit",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does moving through other creatures' spaces work?": [
		{
			type: "true_false",
			question:
				"You can move through a hostile creature's space only if it is at least two size categories larger or smaller than you.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What is the effect of moving through another creature's space (when allowed)?",
			choices: [
				"It counts as difficult terrain",
				"It costs no extra movement",
				"It provokes an opportunity attack automatically",
				"It requires an Athletics check",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the rules for being Prone?": [
		{
			type: "true_false",
			question: "Standing up from prone costs movement equal to half your speed.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How does crawling while prone interact with difficult terrain?",
			choices: [
				"It costs 3 feet of movement per foot moved",
				"It costs 1 foot per foot moved, same as normal crawling",
				"It is impossible",
				"You must stand up first",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the size categories and their space?": [
		{
			type: "true_false",
			question: "Small and Medium creatures occupy the same amount of space, 5 feet by 5 feet.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What space does a Huge creature occupy?",
			choices: ["15 by 15 feet", "10 by 10 feet", "20 by 20 feet", "5 by 5 feet"],
			correctChoiceIndex: 0,
		},
	],
	"What are the rules for squeezing into a smaller space?": [
		{
			type: "true_false",
			question:
				"While squeezing into a smaller space, you have disadvantage on attack rolls and Dexterity saving throws.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How much can a creature squeeze into a space?",
			choices: [
				"One size category smaller than itself",
				"Two size categories smaller",
				"Any size with enough time",
				"Only if it has a spell active",
			],
			correctChoiceIndex: 0,
		},
	],
	"What happens to a flying creature that is knocked prone or has its speed reduced to 0?": [
		{
			type: "true_false",
			question:
				"A flying creature knocked prone always falls, even if it has the ability to hover.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What can prevent a flying creature from falling when knocked prone?",
			choices: [
				"The ability to hover, or being held aloft by magic",
				"Having a Dexterity save bonus",
				"Rolling a natural 20 on a Constitution save",
				"Nothing — it always falls",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the standard actions available in combat?": [
		{
			type: "true_false",
			question:
				"The Disengage action prevents your movement from provoking opportunity attacks for the rest of the turn.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which action grants attacks made against you disadvantage (if the attacker can see you)?",
			choices: ["Dodge", "Disengage", "Dash", "Ready"],
			correctChoiceIndex: 0,
		},
	],
	"How does the Ready action work?": [
		{
			type: "true_false",
			question: "A readied spell requires concentration to hold until the trigger occurs.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What casting time must a spell have to be readied?",
			choices: ["1 action", "1 bonus action", "1 reaction", "1 minute"],
			correctChoiceIndex: 0,
		},
	],
	"How does the Help action work?": [
		{
			type: "true_false",
			question:
				"The Help action can grant an ally advantage on their next attack roll against a creature within 5 feet of you.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How long does the advantage from helping with an ability check last?",
			choices: [
				"Until the start of your next turn",
				"For the rest of the encounter",
				"Only for that same turn",
				"Until the target creature moves",
			],
			correctChoiceIndex: 0,
		},
	],
	"How do attack rolls work?": [
		{
			type: "true_false",
			question:
				"A finesse weapon lets you choose between Strength and Dexterity for your attack roll.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which ability modifier is used for a ranged weapon attack (non-finesse)?",
			choices: ["Dexterity", "Strength", "Constitution", "The spellcasting ability modifier"],
			correctChoiceIndex: 0,
		},
	],
	"What happens on a natural 1 or natural 20 on an attack roll?": [
		{
			type: "true_false",
			question: "A natural 20 on an attack roll always hits, regardless of the target's AC.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How is damage calculated on a critical hit?",
			choices: [
				"Roll all damage dice twice, then add modifiers once",
				"Double the total damage after modifiers",
				"Add the maximum die result automatically",
				"Roll damage dice three times",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the rules for unseen attackers and targets?": [
		{
			type: "true_false",
			question: "If you attack a target you can't see, you have disadvantage on the attack roll.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What happens if you're hidden and you make an attack?",
			choices: [
				"You reveal your location, whether you hit or miss",
				"You remain hidden regardless of outcome",
				"You automatically hit",
				"You gain an extra attack",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the rules for ranged attacks in close combat?": [
		{
			type: "true_false",
			question:
				"You have disadvantage on ranged attack rolls while within 5 feet of a hostile creature that can see you and isn't incapacitated.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What removes the ranged-attack penalty for being near a hostile creature?",
			choices: [
				"The hostile creature being incapacitated",
				"Having advantage from being unseen",
				"Using a crossbow",
				"Standing still on your turn",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is an unarmed strike?": [
		{
			type: "true_false",
			question: "You are always proficient with unarmed strikes.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How much bludgeoning damage does an unarmed strike deal on a hit?",
			choices: [
				"1 + your Strength modifier",
				"1d4 + your Strength modifier",
				"Your Strength modifier alone",
				"1d6",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is an Opportunity Attack?": [
		{
			type: "true_false",
			question:
				"Taking the Disengage action prevents your movement from provoking opportunity attacks that turn.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which of these avoids provoking an opportunity attack when leaving a creature's reach?",
			choices: [
				"Teleporting away",
				"Casting a ranged spell",
				"Taking the Dodge action",
				"Standing up from prone",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does Two-Weapon Fighting work?": [
		{
			type: "true_false",
			question:
				"You add your ability modifier to the damage of the bonus action attack in Two-Weapon Fighting, just like the first attack.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What weapon property is required for Two-Weapon Fighting?",
			choices: ["Light", "Finesse", "Thrown", "Versatile"],
			correctChoiceIndex: 0,
		},
	],
	"How does Grappling work?": [
		{
			type: "true_false",
			question:
				"Grappling replaces one of your attacks if you're making multiple attacks with the Attack action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "How does moving a creature you are grappling affect your speed?",
			choices: [
				"Your speed is halved, unless the creature is two or more sizes smaller than you",
				"Your speed becomes 0",
				"Your speed is unaffected",
				"You can't move at all while grappling",
			],
			correctChoiceIndex: 0,
		},
	],
	"How does Shoving work?": [
		{
			type: "true_false",
			question:
				"A successful shove lets you choose to either knock the target prone or push it 5 feet away.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What check contests a shove attempt, at the target's choice?",
			choices: [
				"Strength (Athletics) or Dexterity (Acrobatics)",
				"Constitution (Athletics) only",
				"Wisdom (Insight)",
				"A Dexterity saving throw",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the three degrees of cover and their effects?": [
		{
			type: "true_false",
			question:
				"Cover bonuses from multiple sources stack, so a creature could gain more than +5 to AC.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "What AC and Dex save bonus does three-quarters cover provide?",
			choices: ["+5", "+2", "+10", "No bonus, only resistance to damage"],
			correctChoiceIndex: 0,
		},
	],
	"What are the 13 damage types?": [
		{
			type: "true_false",
			question:
				"Force damage is a type of pure magical energy, as seen in spells like magic missile.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of these is NOT one of the 13 damage types?",
			choices: ["Stun", "Necrotic", "Radiant", "Thunder"],
			correctChoiceIndex: 0,
		},
	],
	"How do damage resistance and vulnerability work?": [
		{
			type: "true_false",
			question:
				"If a creature has resistance to fire damage from two different sources, the damage is quartered.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "When are resistance and vulnerability applied relative to other damage modifiers?",
			choices: [
				"After all other modifiers",
				"Before other modifiers",
				"Simultaneously averaged with other modifiers",
				"They replace other modifiers",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is a Critical Hit and how is damage calculated?": [
		{
			type: "true_false",
			question:
				"Extra damage dice from features like Sneak Attack are also doubled on a critical hit.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What triggers a critical hit?",
			choices: [
				"Rolling a natural 20 on the attack roll",
				"Rolling 20 or higher after modifiers",
				"Dealing maximum damage",
				"Attacking an unseen target",
			],
			correctChoiceIndex: 0,
		},
	],
	"What happens when you drop to 0 hit points?": [
		{
			type: "true_false",
			question:
				"Instant death occurs if the leftover damage after reducing you to 0 HP equals or exceeds your hit point maximum.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What happens to a creature that drops to 0 HP without triggering instant death?",
			choices: [
				"It falls unconscious",
				"It dies immediately",
				"It is stunned for 1 round",
				"It must make a Constitution save or die",
			],
			correctChoiceIndex: 0,
		},
	],
	"How do Death Saving Throws work?": [
		{
			type: "true_false",
			question: "Rolling a natural 20 on a death saving throw causes you to regain 1 hit point.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What happens if a creature at 0 HP takes damage from a critical hit?",
			choices: [
				"It suffers two death save failures",
				"It dies instantly regardless of damage",
				"It suffers one death save failure, only a natural 1 causes two",
				"Nothing changes; damage doesn't affect death saves",
			],
			correctChoiceIndex: 0,
		},
	],
	"How do you stabilize a dying creature?": [
		{
			type: "true_false",
			question:
				"A stable creature at 0 hit points regains 1 hit point after 1d4 hours if it isn't healed.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What check is used to stabilize a dying creature without healing magic?",
			choices: [
				"DC 10 Wisdom (Medicine) check",
				"DC 15 Intelligence (Medicine) check",
				"DC 10 Constitution saving throw",
				"DC 15 Wisdom (Survival) check",
			],
			correctChoiceIndex: 0,
		},
	],
	"How do Temporary Hit Points work?": [
		{
			type: "true_false",
			question: "Temporary hit points from multiple sources stack together.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question:
				"What happens to unused temporary hit points when you finish a long rest (if no duration was specified)?",
			choices: [
				"They are lost",
				"They convert to real HP",
				"They carry over indefinitely",
				"They double",
			],
			correctChoiceIndex: 0,
		},
	],
	"Can you knock a creature unconscious instead of killing it?": [
		{
			type: "true_false",
			question:
				"Choosing to knock a creature out instead of killing it is only possible with a ranged attack.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "When can an attacker choose to knock a creature out instead of killing it?",
			choices: [
				"When a melee attack reduces the creature to 0 HP",
				"When a ranged attack reduces the creature to 0 HP",
				"Any time the creature is below half HP",
				"Only with a specific class feature",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the rules for mounting and dismounting?": [
		{
			type: "true_false",
			question: "Mounting or dismounting a creature costs movement equal to half your speed.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "What can you do with your reaction if your mount is knocked prone?",
			choices: [
				"Dismount and land on your feet",
				"Make an opportunity attack",
				"Cast a spell to stabilize the mount",
				"Force the mount to stand back up",
			],
			correctChoiceIndex: 0,
		},
	],
	"What is the difference between a controlled and independent mount?": [
		{
			type: "true_false",
			question: "A controlled mount can only take the Dash, Disengage, or Dodge action.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which type of mount keeps its own initiative and acts freely?",
			choices: [
				"Independent mount",
				"Controlled mount",
				"Both act on the rider's initiative",
				"Neither — mounts never act independently",
			],
			correctChoiceIndex: 0,
		},
	],
	"What are the rules for underwater combat?": [
		{
			type: "true_false",
			question: "Creatures and objects fully immersed in water have resistance to fire damage.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question:
				"Which weapon type avoids the disadvantage penalty on melee attacks underwater (without a swimming speed)?",
			choices: ["A trident", "A longsword", "A greataxe", "A warhammer"],
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
