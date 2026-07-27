const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Core ability scores
	{ front: "What do the six ability scores measure?", back: "Strength (physical power), Dexterity (agility), Constitution (endurance), Intelligence (reasoning and memory), Wisdom (perception and insight), Charisma (force of personality).", tags: ["rule", "ability"] },
	{ front: "How do you calculate an ability modifier from a score?", back: "Subtract 10 from the score, then divide by 2 (round down). E.g. score 14 → (14-10)/2 = +2. Range: score 1 = -5, score 30 = +10.", tags: ["rule", "ability"] },
	{ front: "What are the ability score modifier breakpoints?", back: "1: -5. 2–3: -4. 4–5: -3. 6–7: -2. 8–9: -1. 10–11: +0. 12–13: +1. 14–15: +2. 16–17: +3. 18–19: +4. 20–21: +5. 22–23: +6. 24–25: +7. 26–27: +8. 28–29: +9. 30: +10.", tags: ["rule", "ability"] },

	// Advantage and disadvantage
	{ front: "How does advantage/disadvantage work?", back: "Roll two d20s. Advantage: use the higher. Disadvantage: use the lower. Multiple sources of advantage or disadvantage never grant more than one extra die. Advantage and disadvantage together cancel out — roll one d20 regardless of how many sources of each you have.", tags: ["rule", "ability"] },
	{ front: "When you have advantage or disadvantage and can reroll (e.g. Halfling Lucky), which die do you reroll?", back: "You choose which of the two dice to reroll.", tags: ["rule", "ability"] },

	// Proficiency bonus
	{ front: "What are the rules for applying proficiency bonus?", back: "Never add it more than once to the same roll. If doubled or halved (e.g. Expertise), only multiply it once. If you lack proficiency in a skill but a feature says to double your proficiency bonus for it, your bonus is 0 (doubling 0 = 0). Generally not multiplied for attack rolls or saves unless a feature explicitly allows it.", tags: ["rule", "ability"] },

	// Ability checks
	{ front: "What is an ability check, and what are the typical DCs?", back: "Roll d20 + relevant ability modifier vs. a Difficulty Class. Very easy: 5. Easy: 10. Medium: 15. Hard: 20. Very hard: 25. Nearly impossible: 30. Meeting or exceeding the DC is a success.", tags: ["rule", "ability"] },
	{ front: "What is a Contest?", back: "Both participants make ability checks appropriate to their efforts; no DC. The higher total wins. On a tie, the situation stays the same as before the contest (e.g. a tied grab attempt means no one gets the object).", tags: ["rule", "ability"] },
	{ front: "What is a Passive Check?", back: "An ability check without a die roll. Total = 10 + all normal modifiers. Add 5 if the character would have advantage; subtract 5 for disadvantage. Used when the GM wants a consistent baseline (e.g. passive Perception to notice hidden creatures).", tags: ["rule", "ability"] },
	{ front: "How does Working Together (helping) affect ability checks?", back: "The lead character (or one with the highest modifier) makes the check with advantage. In combat, requires the Help action. A helper must be capable of attempting the task alone; some tasks can't be helped with (e.g. threading a needle).", tags: ["rule", "ability"] },
	{ front: "What is a Group Check?", back: "Everyone in the group makes the ability check. If at least half succeed, the whole group succeeds. Used when the group succeeds or fails as a unit (e.g. group Survival to navigate a swamp).", tags: ["rule", "ability"] },

	// Skills by ability
	{ front: "Which skills are associated with each ability score?", back: "Strength: Athletics. Dexterity: Acrobatics, Sleight of Hand, Stealth. Constitution: none. Intelligence: Arcana, History, Investigation, Nature, Religion. Wisdom: Animal Handling, Insight, Medicine, Perception, Survival. Charisma: Deception, Intimidation, Performance, Persuasion.", tags: ["rule", "skill"] },
	{ front: "Can skills ever be used with a different ability score than normal?", back: "Yes, at GM's option. E.g. a Constitution (Athletics) check to swim a long distance, or a Strength (Intimidation) check for a barbarian physically menacing someone. Proficiency applies if you have it in the skill, regardless of which ability is used.", tags: ["rule", "skill"] },

	// Strength
	{ front: "What does the Strength (Athletics) skill cover?", back: "Difficult climbing (sheer cliffs, hazardous walls), unusual jumps or mid-jump stunts, swimming in treacherous water. Also used for forcing doors, breaking bonds, pushing through tight spaces, and other raw Strength tasks.", tags: ["rule", "skill"] },
	{ front: "How does carrying capacity work?", back: "Carrying capacity = Strength score × 15 lbs. Push/drag/lift max = Strength score × 30 lbs (speed drops to 5 ft when exceeding carrying capacity). Size adjustment: double capacity for each size above Medium; halve for Tiny.", tags: ["rule", "ability"] },
	{ front: "What are the variant encumbrance thresholds?", back: "Encumbered (> 5 × Str score): speed -10 ft. Heavily encumbered (> 10 × Str score, up to max capacity): speed -20 ft and disadvantage on ability checks, attack rolls, and saves using Strength, Dexterity, or Constitution.", tags: ["rule", "ability"] },

	// Dexterity
	{ front: "What does each Dexterity skill cover?", back: "Acrobatics: staying upright on tricky footing, acrobatic stunts (dives, rolls, flips). Sleight of Hand: legerdemain, pickpocketing, planting objects on others. Stealth: hiding, sneaking, slipping away unnoticed.", tags: ["rule", "skill"] },
	{ front: "What is the Hiding rule?", back: "Make Dex (Stealth) check. Total is contested by Wis (Perception) of any creature actively searching. Can't hide from a creature that clearly sees you. Noise gives away position. Passive Perception beats you if your Stealth check is lower. Invisible creatures can always try to hide but must stay quiet.", tags: ["rule", "combat"] },
	{ front: "What uses Dexterity in combat and defense?", back: "Ranged weapon attack and damage rolls. Finesse melee weapon attack and damage. Adds to AC (all of it for light armor, max +2 for medium, none for heavy). Initiative roll (Dex check).", tags: ["rule", "combat"] },

	// Constitution
	{ front: "What does Constitution affect mechanically?", back: "HP maximum (add Con modifier to each Hit Die rolled). Con modifier changes retroactively update HP max for all levels attained. Constitution checks are uncommon (no skills) — used for holding breath, marching without rest, surviving without food/water, etc.", tags: ["rule", "ability"] },

	// Intelligence
	{ front: "What does each Intelligence skill cover?", back: "Arcana: spells, magic items, eldritch symbols, planes and their inhabitants. History: historical events, legendary people, ancient kingdoms, past wars. Investigation: deducing clues, finding hidden objects, analyzing wounds or weaknesses. Nature: terrain, plants, animals, weather, natural cycles. Religion: deities, rites, holy symbols, secret cults.", tags: ["rule", "skill"] },

	// Wisdom
	{ front: "What does each Wisdom skill cover?", back: "Animal Handling: calming animals, controlling mounts in risky maneuvers. Insight: reading true intentions, detecting lies, reading body language. Medicine: stabilizing dying creatures, diagnosing illness. Perception: spotting, hearing, detecting presence — general environmental awareness. Survival: tracking, hunting, navigating wilderness, identifying natural hazards, predicting weather.", tags: ["rule", "skill"] },

	// Charisma
	{ front: "What does each Charisma skill cover?", back: "Deception: hiding truth verbally or through actions (bluffing, lying, disguises, false assurances). Intimidation: influencing through threats, hostile actions, or physical violence. Performance: entertaining with music, dance, acting, or storytelling. Persuasion: influencing with tact, social graces, or good nature (fostering friendship, making requests, proper etiquette).", tags: ["rule", "skill"] },
	{ front: "Which classes use Charisma as their spellcasting ability?", back: "Bard, Paladin, Sorcerer, and Warlock.", tags: ["spell", "ability"] },

	// Saving throws
	{ front: "What is a saving throw?", back: "A d20 roll + relevant ability modifier to resist a spell, trap, poison, disease, or similar effect. You don't choose to make one — you are forced to. DC is set by the effect (e.g. caster's spell save DC). Proficiency in a save adds your proficiency bonus. Success usually means no harm or reduced harm.", tags: ["rule", "ability"] },
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: "Ability Scores", description: "SRD 5.1 ability scores, modifiers, skills, checks, saving throws, and related rules." }),
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
