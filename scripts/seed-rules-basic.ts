const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Leveling up
	{ front: "How do you gain HP when leveling up?", back: "Roll your class's hit die and add your Constitution modifier. Alternatively, use the fixed value (average rounded up) listed in your class entry. If your Constitution modifier increases, your HP maximum increases by 1 per level attained.", tags: ["rule", "ability"] },
	{ front: "What are the XP thresholds and proficiency bonuses by level?", back: "1: 0 XP, +2. 2: 300, +2. 3: 900, +2. 4: 2,700, +2. 5: 6,500, +3. 6: 14,000, +3. 7: 23,000, +3. 8: 34,000, +3. 9: 48,000, +4. 10: 64,000, +4. 11: 85,000, +4. 12: 100,000, +4. 13: 120,000, +5. 14: 140,000, +5. 15: 165,000, +5. 16: 195,000, +5. 17: 225,000, +6. 18: 265,000, +6. 19: 305,000, +6. 20: 355,000, +6.", tags: ["rule", "ability"] },

	// Multiclassing prerequisites
	{ front: "What ability score minimums are required to multiclass into each class?", back: "Barbarian: Str 13. Bard: Cha 13. Cleric: Wis 13. Druid: Wis 13. Fighter: Str 13 or Dex 13. Monk: Dex 13 and Wis 13. Paladin: Str 13 and Cha 13. Ranger: Dex 13 and Wis 13. Rogue: Dex 13. Sorcerer: Cha 13. Warlock: Cha 13. Wizard: Int 13. Must also meet prerequisites for your current class.", tags: ["rule", "ability"] },
	{ front: "What proficiencies do you gain when multiclassing into each class?", back: "Barbarian: shields, simple weapons, martial weapons. Bard: light armor, 1 skill, 1 instrument. Cleric: light armor, medium armor, shields. Druid: light armor, medium armor, shields (no metal). Fighter: light/medium armor, shields, simple/martial weapons. Monk: simple weapons, shortswords. Paladin: light/medium armor, shields, simple/martial weapons. Ranger: light/medium armor, shields, simple/martial weapons, 1 skill. Rogue: light armor, 1 skill, thieves' tools. Sorcerer: none. Warlock: light armor, simple weapons. Wizard: none.", tags: ["rule", "ability"] },
	{ front: "How does XP cost work when multiclassing?", back: "XP cost is based on your total character level, not your level in any particular class. A cleric 6/fighter 1 must earn enough XP to reach 8th level total before gaining cleric 7 or fighter 2.", tags: ["rule", "ability"] },
	{ front: "How do Hit Dice work when multiclassing?", back: "You gain HP from a new class as described for levels after 1st (not 1st-level HP). Pool all Hit Dice from all classes together. Track separately if they are different die types (e.g. paladin 5/cleric 5 has 5d10 + 5d8).", tags: ["rule", "combat"] },
	{ front: "How does proficiency bonus work when multiclassing?", back: "Proficiency bonus is always based on total character level, not level in any one class. A fighter 3/rogue 2 has the proficiency bonus of a 5th-level character (+3).", tags: ["rule", "ability"] },

	// Multiclassing feature interactions
	{ front: "How does Channel Divinity work when multiclassing?", back: "Gaining Channel Divinity from a second class adds its effects to your options but does NOT grant an extra use. Uses are determined by the class level that explicitly grants additional uses. You can use any available Channel Divinity effect when you use the feature.", tags: ["rule", "action"] },
	{ front: "How does Extra Attack work when multiclassing?", back: "Multiple Extra Attack features from different classes do NOT stack. You can't make more than two attacks with this feature unless one version explicitly says so (e.g. fighter's Extra Attack at 11th level). Thirsting Blade also doesn't add attacks if you already have Extra Attack.", tags: ["rule", "combat"] },
	{ front: "How does Unarmored Defense work when multiclassing?", back: "You can only benefit from one Unarmored Defense feature. If you already have it, you cannot gain it again from another class.", tags: ["rule", "combat"] },

	// Multiclass spellcasting
	{ front: "How do spell slots work when you multiclass as a spellcaster?", back: "Add full levels in bard, cleric, druid, sorcerer, and wizard, plus half your paladin and ranger levels (rounded down). Use the total to look up slots on the Multiclass Spellcaster table. Spells known/prepared are still tracked per class individually.", tags: ["spell", "rule"] },
	{ front: "Can you use higher-level multiclass spell slots to cast lower-level spells?", back: "Yes. If you have spell slots of a higher level than the spells you know, you can use those slots to cast your lower-level spells. Upcast effects apply normally.", tags: ["spell", "rule"] },
	{ front: "How do Pact Magic (Warlock) slots interact with regular spell slots when multiclassing?", back: "They are interchangeable: you can use Pact Magic slots to cast spells from your Spellcasting classes, and Spellcasting slots to cast your warlock spells.", tags: ["spell", "rule"] },

	// Alignment
	{ front: "What are the nine alignments?", back: "Lawful Good, Neutral Good, Chaotic Good, Lawful Neutral, True Neutral, Chaotic Neutral, Lawful Evil, Neutral Evil, Chaotic Evil. Alignment combines morality (good/neutral/evil) and attitude toward order (lawful/neutral/chaotic).", tags: ["rule", "lore"] },
	{ front: "What does each alignment mean in brief?", back: "LG: does right as society expects. NG: helps others as needed. CG: acts by conscience, little regard for expectations. LN: acts by law or personal code. N: avoids moral questions, does what seems best. CN: follows whims, prizes personal freedom. LE: takes what it wants within a code. NE: does whatever it can get away with. CE: arbitrary violence driven by greed, hatred, or bloodlust.", tags: ["lore", "rule"] },
	{ front: "What is an unaligned creature?", back: "A creature that lacks the capacity for rational moral choice. It acts on instinct, not ethics. Sharks are savage but not evil — they are unaligned.", tags: ["lore", "rule"] },

	// Languages
	{ front: "What are the Standard Languages of the SRD?", back: "Common (Humans, Common script), Dwarvish (Dwarves, Dwarvish), Elvish (Elves, Elvish), Giant (Ogres/giants, Dwarvish), Gnomish (Gnomes, Dwarvish), Goblin (Goblinoids, Dwarvish), Halfling (Halflings, Common), Orc (Orcs, Dwarvish).", tags: ["lore", "rule"] },
	{ front: "What are the Exotic Languages of the SRD?", back: "Abyssal (Demons, Infernal script), Celestial (Celestials, Celestial), Draconic (Dragons/dragonborn, Draconic), Deep Speech (Aboleths/cloakers, no script), Infernal (Devils, Infernal), Primordial (Elementals, Dwarvish — includes Auran/Aquan/Ignan/Terran dialects), Sylvan (Fey, Elvish), Undercommon (Underworld traders, Elvish).", tags: ["lore", "rule"] },

	// Inspiration
	{ front: "What is Inspiration?", back: "A reward the GM can grant for playing your character true to their personality traits, ideals, bonds, and flaws. You either have it or you don't — you can't stockpile multiple uses.", tags: ["rule", "lore"] },
	{ front: "How do you use Inspiration?", back: "Spend it when you make an attack roll, saving throw, or ability check to gain advantage on that roll. Alternatively, give your Inspiration to another player character who contributed something exciting, clever, or fun to the story.", tags: ["rule", "action"] },

	// Backgrounds
	{ front: "What does a background provide mechanically?", back: "Proficiency in two skills, proficiency with one or more tools or languages, a starting equipment package, and a background feature. You can also customize: replace one feature, choose any two skills, and choose two tool proficiencies or languages.", tags: ["rule", "skill"] },
	{ front: "What proficiencies and feature does the Acolyte background grant?", back: "Skills: Insight and Religion. Languages: two of your choice. Feature: Shelter of the Faithful — free healing and care at temples of your faith, plus personal lodging at a modest lifestyle from coreligionists.", tags: ["rule", "skill"] },
	{ front: "What is the Shelter of the Faithful feature (Acolyte)?", back: "You and companions can receive free healing and care at a temple/shrine of your faith (you provide material components). Fellow believers support you personally at a modest lifestyle. You may have a residence at a temple and can call on priests for non-hazardous assistance while in good standing.", tags: ["rule", "lore"] },
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: "Core Rules", description: "SRD 5.1 core rules: leveling, multiclassing, alignment, languages, inspiration, and backgrounds." }),
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
