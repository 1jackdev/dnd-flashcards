const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Currency
	{ front: "What is the standard coin exchange rate in D&D 5e?", back: "1 pp = 10 gp = 20 ep = 100 sp = 1,000 cp. Electrum (ep) and platinum (pp) are rare and sometimes arouse suspicion. A standard coin weighs ~1/3 oz; 50 coins = 1 pound.", tags: ["rule", "item"] },
	{ front: "What can you buy with 1 gp, 1 sp, and 1 cp?", back: "1 gp: a bedroll, 50 ft of rope, or a goat (skilled artisan earns ~1 gp/day). 1 sp: half a day of laborer's work, lamp oil, or a night at a poor inn. 1 cp: a candle, torch, or chalk.", tags: ["rule", "item"] },
	{ front: "How much do you get when selling equipment?", back: "Undamaged weapons, armor, and equipment sell for half their cost. Gems, jewelry, art objects, and trade goods retain full value. Magic items are difficult to sell — only wealthy buyers; treat as far more valuable than gold.", tags: ["rule", "item"] },

	// Armor proficiency and rules
	{ front: "What happens if you wear armor you're not proficient with?", back: "Disadvantage on any ability check, saving throw, or attack roll involving Strength or Dexterity, and you can't cast spells.", tags: ["rule", "combat"] },
	{ front: "How does AC work for light, medium, and heavy armor?", back: "Light: AC = base + full Dex modifier. Medium: AC = base + Dex modifier (max +2). Heavy: AC = base only (no Dex modifier, but negative Dex doesn't penalize you either). Shield: +2 AC, one at a time.", tags: ["rule", "combat"] },
	{ front: "What are the Strength requirements and Stealth penalties for heavy armor?", back: "Chain mail: Str 13, Stealth disadvantage. Splint: Str 15, Stealth disadvantage. Plate: Str 15, Stealth disadvantage. Ring mail: no Str req., Stealth disadvantage. If Str requirement not met, speed reduced by 10 ft.", tags: ["rule", "combat"] },
	{ front: "What are the AC values for all armor types?", back: "Light: Padded 11, Leather 11, Studded leather 12 (all +Dex). Medium: Hide 12, Chain shirt 13, Scale mail 14, Breastplate 14, Half plate 15 (all +Dex max 2). Heavy: Ring mail 14, Chain mail 16, Splint 17, Plate 18. Shield: +2.", tags: ["rule", "combat"] },
	{ front: "How long does it take to don and doff armor?", back: "Light: 1 min don / 1 min doff. Medium: 5 min don / 1 min doff. Heavy: 10 min don / 5 min doff. Shield: 1 action don or doff. With help, halve doff time.", tags: ["rule", "combat"] },

	// Weapons
	{ front: "What is the difference between simple and martial weapons?", back: "Simple weapons are usable by most people (clubs, maces, etc.). Martial weapons (swords, axes, polearms) require specialized training. Proficiency lets you add your proficiency bonus to attack rolls.", tags: ["rule", "combat"] },
	{ front: "What does the Ammunition weapon property mean?", back: "Can only make ranged attacks if you have ammo. Each attack expends one piece. Drawing ammo is part of the attack (need a free hand for one-handed weapons). After battle, recover half expended ammo in 1 minute. Used as a melee weapon, treat as improvised (1d4).", tags: ["rule", "combat"] },
	{ front: "What does the Finesse weapon property mean?", back: "Use either Strength or Dexterity modifier for attack and damage rolls. Must use the same modifier for both rolls.", tags: ["rule", "combat"] },
	{ front: "What does the Heavy weapon property mean?", back: "Small creatures have disadvantage on attack rolls with heavy weapons.", tags: ["rule", "combat"] },
	{ front: "What does the Light weapon property mean?", back: "Small and easy to handle; ideal for two-weapon fighting.", tags: ["rule", "combat"] },
	{ front: "What does the Loading weapon property mean?", back: "You can fire only one piece of ammunition per action, bonus action, or reaction, regardless of how many attacks you can normally make.", tags: ["rule", "combat"] },
	{ front: "What does the Range weapon property mean?", back: "Listed as (normal/long). Attacking beyond normal range gives disadvantage. You can't attack beyond long range.", tags: ["rule", "combat"] },
	{ front: "What does the Reach weapon property mean?", back: "Adds 5 feet to your reach when attacking with it and for opportunity attacks.", tags: ["rule", "combat"] },
	{ front: "What does the Thrown weapon property mean?", back: "Throw the weapon for a ranged attack. Use the same ability modifier as for a melee attack with it (e.g. Str for handaxe, Str or Dex for dagger because it's also finesse).", tags: ["rule", "combat"] },
	{ front: "What does the Two-Handed weapon property mean?", back: "Requires two hands to attack with.", tags: ["rule", "combat"] },
	{ front: "What does the Versatile weapon property mean?", back: "Can be used one-handed or two-handed. The damage value in parentheses is the two-handed damage die.", tags: ["rule", "combat"] },

	// Improvised weapons
	{ front: "What are the rules for improvised weapons?", back: "Any wielded object not a proper weapon. If similar to a real weapon, GM may let you use it as that weapon (with proficiency if applicable). Otherwise: 1d4 damage, type chosen by GM. Using a ranged weapon in melee or throwing a non-thrown melee weapon also deals 1d4. Improvised thrown weapon: range 20/60 ft.", tags: ["rule", "combat"] },

	// Silvered weapons
	{ front: "What are silvered weapons, and how much do they cost?", back: "Weapons plated with silver to affect monsters immune/resistant to nonmagical attacks but vulnerable to silver. Cost: 100 gp per weapon (or per 10 pieces of ammunition). Includes the silver and the expertise to plate it without reducing effectiveness.", tags: ["rule", "combat", "item"] },

	// Special weapons
	{ front: "What are the special rules for the Lance?", back: "Disadvantage when attacking a target within 5 feet of you. Requires two hands to wield when not mounted.", tags: ["rule", "combat"] },
	{ front: "What are the special rules for the Net?", back: "Hits Large or smaller creatures with the restrained condition. No effect on formless or Huge+ creatures. Creature (or adjacent ally) can free themselves with a DC 10 Strength check (action). Dealing 5 slashing to the net (AC 10) also frees the creature and destroys the net. Only one attack per action/bonus action/reaction regardless of normal attack count.", tags: ["rule", "combat", "condition"] },
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: "Equipment", description: "SRD 5.1 equipment rules: currency, armor, weapons, and weapon properties." }),
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
