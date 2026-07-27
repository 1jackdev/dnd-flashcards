const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Time
	{ front: "What time scales does D&D 5e use for different situations?", back: "Dungeon exploration: minutes. City/wilderness travel: hours. Long journeys: days. Combat and fast-paced situations: rounds (6 seconds each).", tags: ["rule"] },

	// Travel pace
	{ front: "What are the three travel paces and their distances?", back: "Fast: 400 ft/min, 4 miles/hr, 30 miles/day — -5 penalty to passive Wisdom (Perception). Normal: 300 ft/min, 3 miles/hr, 24 miles/day — no effect. Slow: 200 ft/min, 2 miles/hr, 18 miles/day — able to use stealth.", tags: ["rule", "skill"] },
	{ front: "What is a Forced March?", back: "The Travel Pace table assumes 8 hours of travel per day. Each additional hour beyond 8: cover normal pace distance for that hour, and each character makes a Con saving throw (DC 10 + 1 per hour past 8 hours). Failure = one level of exhaustion.", tags: ["rule", "ability"] },
	{ front: "How do mounts and vehicles affect travel speed?", back: "Mounts can gallop for ~1 hour at twice the fast pace distance. With fresh mounts every 8–10 miles, greater distances are possible. Land vehicles travel at chosen pace normally. Waterborne vessels travel at the vessel's speed — no fast/slow pace penalties or benefits. Ships may travel up to 24 hrs/day.", tags: ["rule", "item"] },

	// Difficult terrain
	{ front: "What is difficult terrain and how does it affect movement?", back: "Dense forests, deep swamps, rubble, steep mountains, ice, etc. Moving 1 foot costs 2 feet of speed. You cover only half the normal distance per minute, hour, or day.", tags: ["rule", "combat"] },

	// Climbing, swimming, crawling
	{ front: "How does climbing, swimming, and crawling affect movement cost?", back: "Each foot costs 1 extra foot of movement (2 extra feet in difficult terrain), unless you have a climbing or swimming speed. Slippery/sparse-handhold climbing and rough water swimming may require a Strength (Athletics) check at GM's option.", tags: ["rule", "combat"] },

	// Jumping
	{ front: "What are the rules for a Long Jump?", back: "With a 10-ft running start: jump up to your Strength score in feet. Standing long jump: half that distance. Each foot cleared costs 1 foot of movement. To clear a low obstacle (≤ 1/4 jump distance): DC 10 Str (Athletics) check or you hit it. Landing in difficult terrain: DC 10 Dex (Acrobatics) check or land prone.", tags: ["rule", "combat"] },
	{ front: "What are the rules for a High Jump?", back: "With a 10-ft running start: jump up 3 + your Strength modifier feet. Standing high jump: half that distance. Each foot cleared costs 1 foot of movement. You can extend your arms half your height above yourself during the jump, reaching a total of jump height + 1.5× your height.", tags: ["rule", "combat"] },
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: "Movement & Travel", description: "SRD 5.1 movement rules: time scales, travel pace, forced march, difficult terrain, climbing, swimming, and jumping." }),
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
