const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// Combat structure
	{ front: "What are the steps of combat in order?", back: "1. Determine surprise. 2. Establish positions. 3. Roll initiative (Dexterity check). 4. Take turns in initiative order. 5. Begin next round when everyone has gone. A round = ~6 seconds.", tags: ["rule", "combat"] },
	{ front: "What does being surprised mean in combat?", back: "On your first turn: can't move or take an action. Can't take a reaction until that turn ends. Surprise is determined by comparing Dex (Stealth) checks of hiding creatures vs. passive Wis (Perception) of opponents. Members of a group can be surprised individually.", tags: ["rule", "combat"] },
	{ front: "How does initiative work?", back: "Everyone makes a Dexterity check. GM ranks highest to lowest — this is the initiative order for all rounds. Ties: players decide among player characters; GM decides among their creatures (or both roll d20, highest goes first). GM rolls once for groups of identical creatures.", tags: ["rule", "combat"] },

	// Your turn
	{ front: "What can you do on your turn?", back: "Move up to your speed AND take one action (in either order). Free: communicate briefly, interact with one object or environmental feature. Bonus action: only if a feature explicitly grants one. You can forgo any or all of these.", tags: ["rule", "combat"] },
	{ front: "What is a Bonus Action?", back: "An extra action granted by a specific class feature, spell, or ability. You can take only one per turn. You choose when during your turn (unless timing is specified). You only have a bonus action if something explicitly gives you one.", tags: ["rule", "combat"] },
	{ front: "What is a Reaction?", back: "An instant response to a trigger, usable on your turn or anyone else's. You can take only one reaction per round; can't take another until the start of your next turn. If the reaction interrupts another creature's turn, that creature continues after.", tags: ["rule", "combat"] },

	// Movement
	{ front: "How can you split your movement on your turn?", back: "Use some movement before your action and some after. With Extra Attack (or similar), you can also move between individual attacks within the Attack action.", tags: ["rule", "combat"] },
	{ front: "How does moving through other creatures' spaces work?", back: "Can move through nonhostile creature's space freely. Can move through hostile creature's space only if they are 2+ size categories different from you. Any other creature's space counts as difficult terrain. Can't willingly end your move in another creature's space.", tags: ["rule", "combat"] },
	{ front: "What are the rules for being Prone?", back: "Drop prone: free (no movement cost). Stand up: costs movement equal to half your speed. Can't stand if no movement remaining or speed = 0. Moving while prone: must crawl (1 extra foot per foot) or use teleportation. Crawling in difficult terrain = 3 feet per foot.", tags: ["rule", "combat", "condition"] },
	{ front: "What are the size categories and their space?", back: "Tiny: 2.5×2.5 ft. Small: 5×5 ft. Medium: 5×5 ft. Large: 10×10 ft. Huge: 15×15 ft. Gargantuan: 20×20 ft or larger.", tags: ["rule", "combat"] },
	{ front: "What are the rules for squeezing into a smaller space?", back: "Can squeeze through a space sized for one category smaller. Costs 1 extra foot per foot moved. While squeezing: disadvantage on attack rolls and Dex saves. Attack rolls against you have advantage.", tags: ["rule", "combat"] },
	{ front: "What happens to a flying creature that is knocked prone or has its speed reduced to 0?", back: "It falls, unless it can hover or is held aloft by magic (e.g. fly spell).", tags: ["rule", "combat"] },

	// Actions in combat
	{ front: "What are the standard actions available in combat?", back: "Attack, Cast a Spell, Dash (double movement this turn), Disengage (movement doesn't provoke opportunity attacks), Dodge (attacks against you have disadvantage if you can see attacker; advantage on Dex saves; lost if incapacitated or speed = 0), Help, Hide, Ready, Search, Use an Object.", tags: ["rule", "combat", "action"] },
	{ front: "How does the Ready action work?", back: "Declare a perceivable trigger and a response (an action or movement up to your speed). When the trigger occurs, use your reaction to take the response or ignore it. Readying a spell: cast it normally but hold it (requires concentration); if concentration breaks, spell dissipates. Spell must have 1-action casting time.", tags: ["rule", "combat", "action"] },
	{ front: "How does the Help action work?", back: "Aid a creature on an ability check: they gain advantage on the next check for that task before the start of your next turn. Aid an ally attacking a creature within 5 ft of you: the ally's first attack roll against that target has advantage (if made before your next turn).", tags: ["rule", "combat", "action"] },

	// Attack rolls
	{ front: "How do attack rolls work?", back: "Roll d20 + ability modifier + proficiency bonus (if proficient). Meets or exceeds target AC = hit. Melee weapon: Strength modifier. Ranged weapon: Dexterity modifier. Finesse/thrown weapons may use either. Spell attack: use spellcasting ability modifier.", tags: ["rule", "combat"] },
	{ front: "What happens on a natural 1 or natural 20 on an attack roll?", back: "Natural 20: critical hit — hits regardless of AC. Roll all damage dice twice, then add modifiers. Natural 1: automatic miss, regardless of modifiers or AC.", tags: ["rule", "combat"] },
	{ front: "What are the rules for unseen attackers and targets?", back: "Attacking a target you can't see: disadvantage on attack roll. If target isn't in the location you targeted: automatic miss. Attacking a creature that can't see you: advantage on attack roll. If hidden (unseen and unheard) when attacking: reveal your location on hit or miss.", tags: ["rule", "combat"] },
	{ front: "What are the rules for ranged attacks in close combat?", back: "If you are within 5 feet of a hostile creature that can see you and isn't incapacitated, you have disadvantage on ranged attack rolls (weapons, spells, or other means).", tags: ["rule", "combat"] },

	// Melee-specific
	{ front: "What is an unarmed strike?", back: "A punch, kick, headbutt, or similar forceful blow. On a hit, deals bludgeoning damage = 1 + Strength modifier. You are always proficient with unarmed strikes.", tags: ["rule", "combat"] },
	{ front: "What is an Opportunity Attack?", back: "Reaction: when a hostile creature you can see moves out of your reach, you can make one melee attack against it (occurs just before it leaves reach). Avoided by taking the Disengage action, teleporting, or being moved without using your movement/action/reaction.", tags: ["rule", "combat", "action"] },
	{ front: "How does Two-Weapon Fighting work?", back: "When you take the Attack action and attack with a light melee weapon in one hand, use a bonus action to attack with a different light melee weapon in the other hand. Don't add ability modifier to the bonus attack's damage (unless the modifier is negative). Can throw instead of melee attack if weapon has thrown property.", tags: ["rule", "combat", "action"] },
	{ front: "How does Grappling work?", back: "Use Attack action (replaces one attack if you have multiple). Target must be within reach and no more than one size larger than you; you need one free hand. Make a Strength (Athletics) check contested by target's Str (Athletics) or Dex (Acrobatics) (their choice). Win = target is grappled. Escape: target uses action to make Str (Athletics) or Dex (Acrobatics) vs. your Str (Athletics). Moving grappled creature: speed halved (unless creature is 2+ sizes smaller than you).", tags: ["rule", "combat", "condition"] },
	{ front: "How does Shoving work?", back: "Use Attack action (replaces one attack if you have multiple). Target must be within reach and no more than one size larger. Make Str (Athletics) check contested by target's Str (Athletics) or Dex (Acrobatics) (their choice). Win = knock prone OR push 5 ft away.", tags: ["rule", "combat", "action"] },

	// Cover
	{ front: "What are the three degrees of cover and their effects?", back: "Half cover (obstacle blocks at least half the body): +2 to AC and Dex saves. Three-quarters cover (~3/4 obscured): +5 to AC and Dex saves. Total cover (completely concealed): can't be directly targeted by attacks or spells (area effects can still reach). Only the most protective degree applies, never stacked.", tags: ["rule", "combat"] },

	// Damage
	{ front: "What are the 13 damage types?", back: "Acid, Bludgeoning, Cold, Fire, Force (pure magic — magic missile, spiritual weapon), Lightning, Necrotic, Piercing, Poison, Psychic, Radiant, Slashing, Thunder.", tags: ["rule", "combat"] },
	{ front: "How do damage resistance and vulnerability work?", back: "Resistance: damage of that type is halved. Vulnerability: damage of that type is doubled. Both are applied after all other modifiers. Multiple instances of resistance or vulnerability to the same type count as only one instance.", tags: ["rule", "combat"] },
	{ front: "What is a Critical Hit and how is damage calculated?", back: "Triggered by a natural 20 on an attack roll. Roll all of the attack's damage dice twice and add together, then add relevant modifiers once as normal. Includes extra dice from features like Sneak Attack.", tags: ["rule", "combat"] },

	// Healing and 0 HP
	{ front: "What happens when you drop to 0 hit points?", back: "You fall unconscious (unless instant death applies). Instant death: if remaining damage after reducing you to 0 equals or exceeds your HP maximum, you die immediately.", tags: ["rule", "combat", "condition"] },
	{ front: "How do Death Saving Throws work?", back: "At the start of your turn at 0 HP: roll d20. 10+: success. 1–9: failure. Three successes: become stable. Three failures: die. Nat 1: counts as 2 failures. Nat 20: regain 1 HP. Taking damage at 0 HP: 1 death save failure (2 if a crit). All successes/failures reset when you regain any HP or stabilize.", tags: ["rule", "combat", "condition"] },
	{ front: "How do you stabilize a dying creature?", back: "Heal it (any HP ends death save throws). Or use an action to make a DC 10 Wisdom (Medicine) check. Stable creatures: don't make death saves but remain unconscious at 0 HP. Regain 1 HP after 1d4 hours if not healed. Takes any damage = unstable again.", tags: ["rule", "combat", "action"] },
	{ front: "How do Temporary Hit Points work?", back: "A buffer that absorbs damage before your actual HP. Lost first; overflow carries to normal HP. Can exceed HP maximum. Can't be healed (only depleted or expire). Multiple sources don't stack — choose to keep old or take new. Last until depleted or long rest (unless duration specified). Don't restore consciousness at 0 HP.", tags: ["rule", "combat"] },
	{ front: "Can you knock a creature unconscious instead of killing it?", back: "Yes. When a melee attack reduces a creature to 0 HP, the attacker can choose at that moment to knock it out instead. The creature falls unconscious and is stable.", tags: ["rule", "combat"] },

	// Mounted combat
	{ front: "What are the rules for mounting and dismounting?", back: "Mount or dismount once during your move; costs movement equal to half your speed. If mount is moved against its will while you're on it: DC 10 Dex save or fall prone within 5 ft. Knocked prone while mounted: same save. Mount knocked prone: use reaction to dismount and land on feet, or fall prone within 5 ft.", tags: ["rule", "combat"] },
	{ front: "What is the difference between a controlled and independent mount?", back: "Controlled: initiative matches yours when mounted; can only Dash, Disengage, or Dodge; moves as directed. Independent: keeps its own initiative, acts freely, can do anything. Intelligent creatures (e.g. dragons) always act independently. Either way, opportunity attacks can target you or the mount.", tags: ["rule", "combat"] },

	// Underwater combat
	{ front: "What are the rules for underwater combat?", back: "Melee attacks without a swimming speed: disadvantage unless weapon is a dagger, javelin, shortsword, spear, or trident. Ranged attacks automatically miss beyond normal range; disadvantage within normal range unless weapon is a crossbow, net, or thrown weapon (javelin, spear, trident, dart). Fully immersed creatures and objects have resistance to fire damage.", tags: ["rule", "combat"] },
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: "Combat Rules", description: "SRD 5.1 combat rules: initiative, actions, movement, attacks, cover, damage, death saves, and special combat situations." }),
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
