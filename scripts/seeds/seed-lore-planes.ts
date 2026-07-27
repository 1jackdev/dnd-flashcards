const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// The known planes
	{
		front: "What is the Material Plane?",
		back: "The nexus where the physical and spiritual meet, where mortals live. A hospitable and familiar place to most humanoids. The other planes are defined in relation to it.",
		tags: ["lore", "rule"],
	},
	{
		front: "What are the Transitive Planes?",
		back: "Planes that serve as connective tissue between other planes. The Ethereal Plane and the Astral Plane. They have no fixed geography — they shift and change.",
		tags: ["lore"],
	},
	{
		front: "What is the Ethereal Plane?",
		back: "A misty, fog-bound dimension coexisting with the Material Plane and the Inner Planes. The 'shore' near the Material Plane is the Border Ethereal; deeper in is the Deep Ethereal with swirling fogs, random curtains of color, and connections to the Inner Planes. Used to cross between planes and to spy on adjacent planes.",
		tags: ["lore", "rule"],
	},
	{
		front: "What is the Astral Plane?",
		back: "A realm of thought and dream reached by projecting your spirit, leaving your body behind. A vast silvery sea with chunks of solidified thoughts and the remnants of dead gods. Used as a conduit to reach the Outer Planes.",
		tags: ["lore", "rule"],
	},
	{
		front: "What are the Inner Planes?",
		back: "The four Elemental Planes (Air, Earth, Fire, Water) surround and enfold the Material Plane, providing raw elemental matter and energy for material creation. Where the planes meet, they merge into the para-elemental planes. At the outermost reaches lies the Elemental Chaos, where all elements collide in a turbulent whirl.",
		tags: ["lore"],
	},
	{
		front: "What are the four Elemental Planes?",
		back: "Plane of Air: endless open sky, home of aarakocra and djinn. Plane of Earth: crushing rock and soil, home of dao. Plane of Fire: sea of flame, home of efreet and fire giants; City of Brass is its heart. Plane of Water: endless ocean with no surface or seafloor, home of marid.",
		tags: ["lore"],
	},
	{
		front: "What is the Elemental Chaos?",
		back: "The outermost reaches of the Inner Planes where the four Elemental Planes collide and intermingle in an eternal turbulent whirl. A place of ceaseless conflict and raw power.",
		tags: ["lore"],
	},
	{
		front: "What are the Outer Planes?",
		back: "16 planes corresponding to the moral and ethical axis of alignment. Upper Planes = good-aligned (highest: Mount Celestia, plane of lawful good). Lower Planes = evil-aligned (depths: Nine Hells of Baator for lawful evil, the Abyss for chaotic evil). The plane of Mechanus is lawful neutral; Limbo is chaotic neutral; the Outlands is true neutral, with Sigil the City of Doors at its center.",
		tags: ["lore"],
	},
	{
		front: "What is the Great Wheel cosmology's outer plane alignment structure?",
		back: "Each Outer Plane corresponds to an alignment. Upper Planes (good): Mount Celestia (LG), Bytopia (NG/LG), Elysium (NG), Beastlands (NG/CG), Arborea (CG). Neutral edge: Mechanus (LN), Arcadia (LG/LN), Ysgard (CG/CN), Limbo (CN), Pandemonium (CE/CN). Lower Planes (evil): Gehenna (NE/LE), Nine Hells (LE), Carceri (NE/CE), Hades (NE), Gehenna, Abyss (CE), Acheron (LN/LE). Center: Outlands (TN) with Sigil.",
		tags: ["lore"],
	},
	{
		front: "What are Demiplanes?",
		back: "Small extradimensional spaces with their own rules. Created by spells (Mordenkainen's magnificent mansion, demiplane) or formed through the magic of extremely powerful creatures. Some are accessible only by certain methods — a specific location, time, item, or state. Examples: the demiplane created by the demiplane spell, or the pocket dimension of a bag of holding.",
		tags: ["lore", "rule"],
	},
	{
		front: "What spells allow planar travel?",
		back: "Plane Shift: teleports you and up to 8 willing creatures to another plane (or banishes an unwilling creature to a related plane). Gate: opens a portal to an exact location on another plane. Etherealness: enter the Border Ethereal. Astral Projection: project your spirit to the Astral Plane and travel to the Outer Planes.",
		tags: ["lore", "spell", "rule"],
	},
	{
		front: "What are portals in the context of planar travel?",
		back: "Fixed passages connecting specific locations on different planes. Usually permanent; often take specific shapes (a shimmering wall, a door, an arch). Some require special conditions: a key item, the right time of year, a specific phase of the moon, or a spoken command word.",
		tags: ["lore", "rule"],
	},
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: "Planes of Existence",
			description:
				"SRD 5.1 cosmology: Material Plane, Transitive Planes (Ethereal/Astral), Inner Planes (four Elemental Planes + Elemental Chaos), Outer Planes (alignment correspondence), Demiplanes, and planar travel methods.",
		}),
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
