const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	{ front: "What are the effects of the Blinded condition?", back: "Can't see; automatically fail any ability check requiring sight. Attack rolls against you have advantage; your attack rolls have disadvantage.", tags: ["condition", "rule"] },
	{ front: "What are the effects of the Charmed condition?", back: "Can't attack the charmer or target them with harmful abilities or magical effects. Charmer has advantage on social ability checks against you.", tags: ["condition", "rule"] },
	{ front: "What are the effects of the Deafened condition?", back: "Can't hear; automatically fail any ability check requiring hearing.", tags: ["condition", "rule"] },
	{ front: "What are the six levels of Exhaustion and their effects?", back: "1: Disadvantage on ability checks. 2: Speed halved. 3: Disadvantage on attack rolls and saving throws. 4: HP maximum halved. 5: Speed reduced to 0. 6: Death. Effects are cumulative. Each long rest removes one level. DC 15 Con save to avoid gaining a level after forced march.", tags: ["condition", "rule"] },
	{ front: "How do you remove Exhaustion?", back: "Finishing a long rest removes one exhaustion level, provided you have had food and water. All levels removed when exhaustion reaches 0.", tags: ["condition", "rule"] },
	{ front: "What are the effects of the Frightened condition?", back: "Disadvantage on ability checks and attack rolls while the source of fear is within line of sight. Can't willingly move closer to the source of fear.", tags: ["condition", "rule"] },
	{ front: "What are the effects of the Grappled condition?", back: "Speed becomes 0; can't benefit from any bonus to speed. Ends if the grappler is incapacitated. Ends if you are moved outside grappler's reach (by an effect moving you, not grappler moving you).", tags: ["condition", "rule", "combat"] },
	{ front: "What are the effects of the Incapacitated condition?", back: "Can't take actions or reactions.", tags: ["condition", "rule"] },
	{ front: "What are the effects of the Invisible condition?", back: "Impossible to see without special sense; considered heavily obscured for hiding. Can still be detected by noise or tracks. Attack rolls against you have disadvantage; your attack rolls have advantage.", tags: ["condition", "rule", "combat"] },
	{ front: "What are the effects of the Paralyzed condition?", back: "Incapacitated (no actions or reactions). Can't move or speak. Automatically fail Strength and Dexterity saving throws. Attack rolls against you have advantage. Any attack that hits while within 5 ft is a critical hit.", tags: ["condition", "rule", "combat"] },
	{ front: "What are the effects of the Petrified condition?", back: "Transformed into solid inanimate substance (usually stone) along with all nonmagical worn/carried objects. Weight ×10; doesn't age. Incapacitated, can't move or speak, unaware of surroundings. Attack rolls against you have advantage. Automatically fail Str and Dex saves. Resistance to all damage. Immune to poison and disease (existing poison/disease suspended, not neutralized).", tags: ["condition", "rule"] },
	{ front: "What are the effects of the Poisoned condition?", back: "Disadvantage on attack rolls and ability checks.", tags: ["condition", "rule"] },
	{ front: "What are the effects of the Prone condition?", back: "Only movement option is crawling (costs 1 extra foot per foot) or teleporting. Disadvantage on attack rolls. Attack rolls against you: advantage if attacker is within 5 ft, disadvantage if attacker is further away. Stand up costs movement equal to half your speed.", tags: ["condition", "rule", "combat"] },
	{ front: "What are the effects of the Restrained condition?", back: "Speed becomes 0; can't benefit from any bonus to speed. Attack rolls against you have advantage; your attack rolls have disadvantage. Disadvantage on Dexterity saving throws.", tags: ["condition", "rule", "combat"] },
	{ front: "What are the effects of the Stunned condition?", back: "Incapacitated (no actions or reactions), can't move, can only speak falteringly. Automatically fail Strength and Dexterity saving throws. Attack rolls against you have advantage.", tags: ["condition", "rule", "combat"] },
	{ front: "What are the effects of the Unconscious condition?", back: "Incapacitated (no actions or reactions), can't move or speak, unaware of surroundings. Drop whatever you're holding and fall prone. Automatically fail Strength and Dexterity saving throws. Attack rolls against you have advantage. Any attack that hits while within 5 ft is a critical hit.", tags: ["condition", "rule", "combat"] },
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: "Conditions", description: "SRD 5.1 conditions: all 15 conditions (Blinded, Charmed, Deafened, Exhaustion, Frightened, Grappled, Incapacitated, Invisible, Paralyzed, Petrified, Poisoned, Prone, Restrained, Stunned, Unconscious) with full mechanical effects." }),
	});
	if (!deckRes.ok) throw new Error(`Create deck failed: ${await deckRes.text()}`);
	const { id: deckId } = (await deckRes.json()) as { id: string };
	console.log(`Deck created: ${deckId}`);

	let ok = 0;
	for (const card of cards) {
		const res = await fetch(`${API}/decks/${deckId}/cards`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(card),
		});
		if (res.ok) {
			ok++;
			process.stdout.write(`\r  ${ok}/${cards.length}`);
		} else {
			console.error(`\n  FAIL "${card.front.slice(0, 50)}": ${await res.text()}`);
		}
	}
	console.log(`\nDone. ${ok}/${cards.length} cards imported.`);
}

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
