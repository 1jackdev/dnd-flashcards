const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
	// ── BARD ──────────────────────────────────────────────────────────────────
	{ front: "What are the Bard cantrips?", back: "Dancing Lights, Light, Mage Hand, Mending, Message, Minor Illusion, Prestidigitation, True Strike, Vicious Mockery.", tags: ["spell", "rule"] },
	{ front: "What are the Bard 1st-level spells?", back: "Animal Friendship, Bane, Charm Person, Comprehend Languages, Cure Wounds, Detect Magic, Disguise Self, Faerie Fire, Feather Fall, Healing Word, Heroism, Hideous Laughter, Identify, Illusory Script, Longstrider, Silent Image, Sleep, Speak with Animals, Thunderwave, Unseen Servant.", tags: ["spell", "rule"] },
	{ front: "What are the Bard 2nd-level spells?", back: "Animal Messenger, Blindness/Deafness, Calm Emotions, Detect Thoughts, Enhance Ability, Enthrall, Heat Metal, Hold Person, Invisibility, Knock, Lesser Restoration, Locate Animals or Plants, Locate Object, Magic Mouth, See Invisibility, Shatter, Silence, Suggestion, Zone of Truth.", tags: ["spell", "rule"] },
	{ front: "What are the Bard 3rd-level spells?", back: "Bestow Curse, Clairvoyance, Dispel Magic, Fear, Glyph of Warding, Hypnotic Pattern, Major Image, Nondetection, Plant Growth, Sending, Speak with Dead, Speak with Plants, Stinking Cloud, Tiny Hut, Tongues.", tags: ["spell", "rule"] },
	{ front: "What are the Bard 4th-level spells?", back: "Compulsion, Confusion, Dimension Door, Freedom of Movement, Greater Invisibility, Hallucinatory Terrain, Locate Creature, Polymorph.", tags: ["spell", "rule"] },
	{ front: "What are the Bard 5th-level spells?", back: "Animate Objects, Awaken, Dominate Person, Dream, Geas, Greater Restoration, Hold Monster, Legend Lore, Mass Cure Wounds, Mislead, Modify Memory, Planar Binding, Raise Dead, Scrying, Seeming, Teleportation Circle.", tags: ["spell", "rule"] },
	{ front: "What are the Bard 6th-level spells?", back: "Eyebite, Find the Path, Guards and Wards, Irresistible Dance, Mass Suggestion, Programmed Illusion, True Seeing.", tags: ["spell", "rule"] },
	{ front: "What are the Bard 7th-level spells?", back: "Arcane Sword, Etherealness, Forcecage, Magnificent Mansion, Mirage Arcane, Project Image, Regenerate, Resurrection, Symbol, Teleport.", tags: ["spell", "rule"] },
	{ front: "What are the Bard 8th-level spells?", back: "Dominate Monster, Feeblemind, Glibness, Mind Blank, Power Word Stun.", tags: ["spell", "rule"] },
	{ front: "What are the Bard 9th-level spells?", back: "Foresight, Power Word Kill, True Polymorph.", tags: ["spell", "rule"] },

	// ── CLERIC ────────────────────────────────────────────────────────────────
	{ front: "What are the Cleric cantrips?", back: "Guidance, Light, Mending, Resistance, Sacred Flame, Spare the Dying, Thaumaturgy.", tags: ["spell", "rule"] },
	{ front: "What are the Cleric 1st-level spells?", back: "Bane, Bless, Command, Create or Destroy Water, Cure Wounds, Detect Evil and Good, Detect Magic, Detect Poison and Disease, Guiding Bolt, Healing Word, Inflict Wounds, Protection from Evil and Good, Purify Food and Drink, Sanctuary, Shield of Faith.", tags: ["spell", "rule"] },
	{ front: "What are the Cleric 2nd-level spells?", back: "Aid, Augury, Blindness/Deafness, Calm Emotions, Continual Flame, Enhance Ability, Find Traps, Gentle Repose, Hold Person, Lesser Restoration, Locate Object, Prayer of Healing, Protection from Poison, Silence, Spiritual Weapon, Warding Bond, Zone of Truth.", tags: ["spell", "rule"] },
	{ front: "What are the Cleric 3rd-level spells?", back: "Animate Dead, Beacon of Hope, Bestow Curse, Clairvoyance, Create Food and Water, Daylight, Dispel Magic, Glyph of Warding, Magic Circle, Mass Healing Word, Meld into Stone, Protection from Energy, Remove Curse, Revivify, Sending, Speak with Dead, Spirit Guardians, Tongues, Water Walk.", tags: ["spell", "rule"] },
	{ front: "What are the Cleric 4th-level spells?", back: "Banishment, Control Water, Death Ward, Divination, Freedom of Movement, Guardian of Faith, Locate Creature, Stone Shape.", tags: ["spell", "rule"] },
	{ front: "What are the Cleric 5th-level spells?", back: "Commune, Contagion, Dispel Evil and Good, Flame Strike, Geas, Greater Restoration, Hallow, Insect Plague, Legend Lore, Mass Cure Wounds, Planar Binding, Raise Dead, Scrying.", tags: ["spell", "rule"] },
	{ front: "What are the Cleric 6th-level spells?", back: "Blade Barrier, Create Undead, Find the Path, Forbiddance, Harm, Heal, Heroes' Feast, Planar Ally, True Seeing, Word of Recall.", tags: ["spell", "rule"] },
	{ front: "What are the Cleric 7th-level spells?", back: "Conjure Celestial, Divine Word, Etherealness, Fire Storm, Plane Shift, Regenerate, Resurrection, Symbol.", tags: ["spell", "rule"] },
	{ front: "What are the Cleric 8th-level spells?", back: "Antimagic Field, Control Weather, Earthquake, Holy Aura.", tags: ["spell", "rule"] },
	{ front: "What are the Cleric 9th-level spells?", back: "Astral Projection, Gate, Mass Heal, True Resurrection.", tags: ["spell", "rule"] },

	// ── DRUID ─────────────────────────────────────────────────────────────────
	{ front: "What are the Druid cantrips?", back: "Druidcraft, Guidance, Mending, Poison Spray, Produce Flame, Resistance, Shillelagh.", tags: ["spell", "rule"] },
	{ front: "What are the Druid 1st-level spells?", back: "Animal Friendship, Charm Person, Create or Destroy Water, Cure Wounds, Detect Magic, Detect Poison and Disease, Entangle, Faerie Fire, Fog Cloud, Goodberry, Healing Word, Jump, Longstrider, Purify Food and Drink, Speak with Animals, Thunderwave.", tags: ["spell", "rule"] },
	{ front: "What are the Druid 2nd-level spells?", back: "Animal Messenger, Barkskin, Darkvision, Enhance Ability, Find Traps, Flame Blade, Flaming Sphere, Gust of Wind, Heat Metal, Hold Person, Lesser Restoration, Locate Animals or Plants, Locate Object, Moonbeam, Pass without Trace, Protection from Poison, Spike Growth.", tags: ["spell", "rule"] },
	{ front: "What are the Druid 3rd-level spells?", back: "Call Lightning, Conjure Animals, Daylight, Dispel Magic, Meld into Stone, Plant Growth, Protection from Energy, Sleet Storm, Speak with Plants, Water Breathing, Water Walk, Wind Wall.", tags: ["spell", "rule"] },
	{ front: "What are the Druid 4th-level spells?", back: "Blight, Confusion, Conjure Minor Elementals, Conjure Woodland Beings, Control Water, Dominate Beast, Freedom of Movement, Giant Insect, Hallucinatory Terrain, Ice Storm, Locate Creature, Polymorph, Stone Shape, Stoneskin, Wall of Fire.", tags: ["spell", "rule"] },
	{ front: "What are the Druid 5th-level spells?", back: "Antilife Shell, Awaken, Commune with Nature, Conjure Elemental, Contagion, Geas, Greater Restoration, Insect Plague, Mass Cure Wounds, Planar Binding, Reincarnate, Scrying, Tree Stride, Wall of Stone.", tags: ["spell", "rule"] },
	{ front: "What are the Druid 6th-level spells?", back: "Conjure Fey, Find the Path, Heal, Heroes' Feast, Move Earth, Sunbeam, Transport via Plants, Wall of Thorns, Wind Walk.", tags: ["spell", "rule"] },
	{ front: "What are the Druid 7th-level spells?", back: "Fire Storm, Mirage Arcane, Plane Shift, Regenerate, Reverse Gravity.", tags: ["spell", "rule"] },
	{ front: "What are the Druid 8th-level spells?", back: "Animal Shapes, Antipathy/Sympathy, Control Weather, Earthquake, Feeblemind, Sunburst.", tags: ["spell", "rule"] },
	{ front: "What are the Druid 9th-level spells?", back: "Foresight, Shapechange, Storm of Vengeance, True Resurrection.", tags: ["spell", "rule"] },

	// ── PALADIN ───────────────────────────────────────────────────────────────
	{ front: "What are the Paladin 1st-level spells?", back: "Bless, Command, Cure Wounds, Detect Evil and Good, Detect Magic, Detect Poison and Disease, Divine Favor, Heroism, Protection from Evil and Good, Purify Food and Drink, Shield of Faith.", tags: ["spell", "rule"] },
	{ front: "What are the Paladin 2nd-level spells?", back: "Aid, Branding Smite, Find Steed, Lesser Restoration, Locate Object, Magic Weapon, Protection from Poison, Zone of Truth.", tags: ["spell", "rule"] },
	{ front: "What are the Paladin 3rd-level spells?", back: "Create Food and Water, Daylight, Dispel Magic, Magic Circle, Remove Curse, Revivify.", tags: ["spell", "rule"] },
	{ front: "What are the Paladin 4th-level spells?", back: "Banishment, Death Ward, Locate Creature.", tags: ["spell", "rule"] },
	{ front: "What are the Paladin 5th-level spells?", back: "Dispel Evil and Good, Geas, Raise Dead.", tags: ["spell", "rule"] },

	// ── RANGER ────────────────────────────────────────────────────────────────
	{ front: "What are the Ranger 1st-level spells?", back: "Alarm, Animal Friendship, Cure Wounds, Detect Magic, Detect Poison and Disease, Fog Cloud, Goodberry, Hunter's Mark, Jump, Longstrider, Speak with Animals.", tags: ["spell", "rule"] },
	{ front: "What are the Ranger 2nd-level spells?", back: "Animal Messenger, Barkskin, Darkvision, Find Traps, Lesser Restoration, Locate Animals or Plants, Locate Object, Pass without Trace, Protection from Poison, Silence, Spike Growth.", tags: ["spell", "rule"] },
	{ front: "What are the Ranger 3rd-level spells?", back: "Conjure Animals, Daylight, Nondetection, Plant Growth, Protection from Energy, Speak with Plants, Water Breathing, Water Walk, Wind Wall.", tags: ["spell", "rule"] },
	{ front: "What are the Ranger 4th-level spells?", back: "Conjure Woodland Beings, Freedom of Movement, Locate Creature, Stoneskin.", tags: ["spell", "rule"] },
	{ front: "What are the Ranger 5th-level spells?", back: "Commune with Nature, Tree Stride.", tags: ["spell", "rule"] },

	// ── SORCERER ──────────────────────────────────────────────────────────────
	{ front: "What are the Sorcerer cantrips?", back: "Acid Splash, Chill Touch, Dancing Lights, Fire Bolt, Light, Mage Hand, Mending, Message, Minor Illusion, Poison Spray, Prestidigitation, Ray of Frost, Shocking Grasp, True Strike.", tags: ["spell", "rule"] },
	{ front: "What are the Sorcerer 1st-level spells?", back: "Burning Hands, Charm Person, Color Spray, Comprehend Languages, Detect Magic, Disguise Self, Expeditious Retreat, False Life, Feather Fall, Fog Cloud, Jump, Mage Armor, Magic Missile, Shield, Silent Image, Sleep, Thunderwave.", tags: ["spell", "rule"] },
	{ front: "What are the Sorcerer 2nd-level spells?", back: "Alter Self, Blindness/Deafness, Blur, Darkness, Darkvision, Detect Thoughts, Enhance Ability, Enlarge/Reduce, Gust of Wind, Hold Person, Invisibility, Knock, Levitate, Mirror Image, Misty Step, Scorching Ray, See Invisibility, Shatter, Spider Climb, Suggestion, Web.", tags: ["spell", "rule"] },
	{ front: "What are the Sorcerer 3rd-level spells?", back: "Blink, Clairvoyance, Counterspell, Daylight, Dispel Magic, Fear, Fireball, Fly, Gaseous Form, Haste, Hypnotic Pattern, Lightning Bolt, Major Image, Protection from Energy, Sleet Storm, Slow, Stinking Cloud, Tongues, Water Breathing, Water Walk.", tags: ["spell", "rule"] },
	{ front: "What are the Sorcerer 4th-level spells?", back: "Banishment, Blight, Confusion, Dimension Door, Dominate Beast, Greater Invisibility, Ice Storm, Polymorph, Stoneskin, Wall of Fire.", tags: ["spell", "rule"] },
	{ front: "What are the Sorcerer 5th-level spells?", back: "Animate Objects, Cloudkill, Cone of Cold, Creation, Dominate Person, Hold Monster, Insect Plague, Seeming, Telekinesis, Teleportation Circle, Wall of Stone.", tags: ["spell", "rule"] },
	{ front: "What are the Sorcerer 6th-level spells?", back: "Chain Lightning, Circle of Death, Disintegrate, Eyebite, Globe of Invulnerability, Mass Suggestion, Move Earth, Sunbeam, True Seeing.", tags: ["spell", "rule"] },
	{ front: "What are the Sorcerer 7th-level spells?", back: "Delayed Blast Fireball, Etherealness, Finger of Death, Fire Storm, Plane Shift, Prismatic Spray, Reverse Gravity, Teleport.", tags: ["spell", "rule"] },
	{ front: "What are the Sorcerer 8th-level spells?", back: "Dominate Monster, Earthquake, Incendiary Cloud, Power Word Stun, Sunburst.", tags: ["spell", "rule"] },
	{ front: "What are the Sorcerer 9th-level spells?", back: "Gate, Meteor Swarm, Power Word Kill, Time Stop, Wish.", tags: ["spell", "rule"] },

	// ── WARLOCK ───────────────────────────────────────────────────────────────
	{ front: "What are the Warlock cantrips?", back: "Chill Touch, Eldritch Blast, Mage Hand, Minor Illusion, Poison Spray, Prestidigitation, True Strike.", tags: ["spell", "rule"] },
	{ front: "What are the Warlock 1st-level spells?", back: "Charm Person, Comprehend Languages, Expeditious Retreat, Hellish Rebuke, Illusory Script, Protection from Evil and Good, Unseen Servant.", tags: ["spell", "rule"] },
	{ front: "What are the Warlock 2nd-level spells?", back: "Darkness, Enthrall, Hold Person, Invisibility, Mirror Image, Misty Step, Ray of Enfeeblement, Shatter, Spider Climb, Suggestion.", tags: ["spell", "rule"] },
	{ front: "What are the Warlock 3rd-level spells?", back: "Counterspell, Dispel Magic, Fear, Fly, Gaseous Form, Hypnotic Pattern, Magic Circle, Major Image, Remove Curse, Tongues, Vampiric Touch.", tags: ["spell", "rule"] },
	{ front: "What are the Warlock 4th-level spells?", back: "Banishment, Blight, Dimension Door, Hallucinatory Terrain.", tags: ["spell", "rule"] },
	{ front: "What are the Warlock 5th-level spells?", back: "Contact Other Plane, Dream, Hold Monster, Scrying.", tags: ["spell", "rule"] },
	{ front: "What are the Warlock 6th-level spells?", back: "Circle of Death, Conjure Fey, Create Undead, Eyebite, Flesh to Stone, Mass Suggestion, True Seeing.", tags: ["spell", "rule"] },
	{ front: "What are the Warlock 7th-level spells?", back: "Etherealness, Finger of Death, Forcecage, Plane Shift.", tags: ["spell", "rule"] },
	{ front: "What are the Warlock 8th-level spells?", back: "Demiplane, Dominate Monster, Feeblemind, Glibness, Power Word Stun.", tags: ["spell", "rule"] },
	{ front: "What are the Warlock 9th-level spells?", back: "Astral Projection, Foresight, Imprisonment, Power Word Kill, True Polymorph.", tags: ["spell", "rule"] },

	// ── WIZARD ────────────────────────────────────────────────────────────────
	{ front: "What are the Wizard cantrips?", back: "Acid Splash, Chill Touch, Dancing Lights, Fire Bolt, Light, Mage Hand, Mending, Message, Minor Illusion, Poison Spray, Prestidigitation, Ray of Frost, Shocking Grasp, True Strike.", tags: ["spell", "rule"] },
	{ front: "What are the Wizard 1st-level spells?", back: "Alarm, Burning Hands, Charm Person, Color Spray, Comprehend Languages, Detect Magic, Disguise Self, Expeditious Retreat, False Life, Feather Fall, Find Familiar, Floating Disk, Fog Cloud, Grease, Hideous Laughter, Identify, Illusory Script, Jump, Longstrider, Mage Armor, Magic Missile, Protection from Evil and Good, Shield, Silent Image, Sleep, Thunderwave, Unseen Servant.", tags: ["spell", "rule"] },
	{ front: "What are the Wizard 2nd-level spells?", back: "Acid Arrow, Alter Self, Arcane Lock, Arcanist's Magic Aura, Blindness/Deafness, Blur, Continual Flame, Darkness, Darkvision, Detect Thoughts, Enlarge/Reduce, Flaming Sphere, Gentle Repose, Gust of Wind, Hold Person, Invisibility, Knock, Levitate, Locate Object, Magic Mouth, Magic Weapon, Mirror Image, Misty Step, Ray of Enfeeblement, Rope Trick, Scorching Ray, See Invisibility, Shatter, Spider Climb, Suggestion, Web.", tags: ["spell", "rule"] },
	{ front: "What are the Wizard 3rd-level spells?", back: "Animate Dead, Bestow Curse, Blink, Clairvoyance, Counterspell, Dispel Magic, Fear, Fireball, Fly, Gaseous Form, Glyph of Warding, Haste, Hypnotic Pattern, Lightning Bolt, Magic Circle, Major Image, Nondetection, Phantom Steed, Protection from Energy, Remove Curse, Sending, Sleet Storm, Slow, Stinking Cloud, Tiny Hut, Tongues, Vampiric Touch, Water Breathing.", tags: ["spell", "rule"] },
	{ front: "What are the Wizard 4th-level spells?", back: "Arcane Eye, Banishment, Black Tentacles, Blight, Confusion, Conjure Minor Elementals, Control Water, Dimension Door, Fabricate, Faithful Hound, Fire Shield, Greater Invisibility, Hallucinatory Terrain, Ice Storm, Locate Creature, Phantasmal Killer, Polymorph, Private Sanctum, Resilient Sphere, Secret Chest, Stone Shape, Stoneskin, Wall of Fire.", tags: ["spell", "rule"] },
	{ front: "What are the Wizard 5th-level spells?", back: "Animate Objects, Arcane Hand, Cloudkill, Cone of Cold, Conjure Elemental, Contact Other Plane, Creation, Dominate Person, Dream, Geas, Hold Monster, Legend Lore, Mislead, Modify Memory, Passwall, Planar Binding, Scrying, Seeming, Telekinesis, Telepathic Bond, Teleportation Circle, Wall of Force, Wall of Stone.", tags: ["spell", "rule"] },
	{ front: "What are the Wizard 6th-level spells?", back: "Chain Lightning, Circle of Death, Contingency, Create Undead, Disintegrate, Eyebite, Flesh to Stone, Freezing Sphere, Globe of Invulnerability, Guards and Wards, Instant Summons, Irresistible Dance, Magic Jar, Mass Suggestion, Move Earth, Programmed Illusion, Sunbeam, True Seeing, Wall of Ice.", tags: ["spell", "rule"] },
	{ front: "What are the Wizard 7th-level spells?", back: "Arcane Sword, Delayed Blast Fireball, Etherealness, Finger of Death, Forcecage, Magnificent Mansion, Mirage Arcane, Plane Shift, Prismatic Spray, Project Image, Reverse Gravity, Sequester, Simulacrum, Symbol, Teleport.", tags: ["spell", "rule"] },
	{ front: "What are the Wizard 8th-level spells?", back: "Antimagic Field, Antipathy/Sympathy, Clone, Control Weather, Demiplane, Dominate Monster, Feeblemind, Incendiary Cloud, Maze, Mind Blank, Power Word Stun, Sunburst.", tags: ["spell", "rule"] },
	{ front: "What are the Wizard 9th-level spells?", back: "Astral Projection, Foresight, Gate, Imprisonment, Meteor Swarm, Power Word Kill, Prismatic Wall, Shapechange, Time Stop, True Polymorph, Weird, Wish.", tags: ["spell", "rule"] },
];

async function run() {
	const deckRes = await fetch(`${API}/decks`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name: "Spell Lists", description: "SRD 5.1 spell lists by class and level: Bard, Cleric, Druid, Paladin, Ranger, Sorcerer, Warlock, Wizard." }),
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
