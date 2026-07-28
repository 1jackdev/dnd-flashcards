const API = process.env.API_URL ?? "http://localhost:3000";
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (!AUTH_TOKEN) throw new Error("AUTH_TOKEN env var is required");

const DECK_NAME = "Spell Lists";

type QuizQuestion =
	| { type: "true_false"; question: string; correctAnswer: boolean }
	| { type: "multiple_choice"; question: string; choices: string[]; correctChoiceIndex: number };

const quizByFront: Record<string, QuizQuestion[]> = {
	"What are the Bard cantrips?": [
		{
			type: "true_false",
			question: "Cure Wounds is one of the Bard's cantrips.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Bard cantrip?",
			choices: ["Vicious Mockery", "Cure Wounds", "Bane", "Healing Word"],
			correctChoiceIndex: 0,
		},
	],
	"What are the Bard 1st-level spells?": [
		{
			type: "true_false",
			question: "Charm Person is a Bard 1st-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Bard 1st-level spell?",
			choices: ["Vicious Mockery", "Message", "Healing Word", "Mage Hand"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Bard 2nd-level spells?": [
		{
			type: "true_false",
			question: "Charm Person is a Bard 2nd-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Bard 2nd-level spell?",
			choices: ["Dispel Magic", "Suggestion", "Fear", "Tongues"],
			correctChoiceIndex: 1,
		},
	],
	"What are the Bard 3rd-level spells?": [
		{
			type: "true_false",
			question: "Dispel Magic is a Bard 3rd-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Bard 3rd-level spell?",
			choices: ["Confusion", "Polymorph", "Hypnotic Pattern", "Dimension Door"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Bard 4th-level spells?": [
		{
			type: "true_false",
			question: "Confusion is a Bard 3rd-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Bard 4th-level spell?",
			choices: ["Geas", "Dominate Person", "Polymorph", "Raise Dead"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Bard 5th-level spells?": [
		{
			type: "true_false",
			question: "Geas is a Bard 5th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Bard 5th-level spell?",
			choices: ["Eyebite", "Dominate Person", "True Seeing", "Mass Suggestion"],
			correctChoiceIndex: 1,
		},
	],
	"What are the Bard 6th-level spells?": [
		{
			type: "true_false",
			question: "Eyebite is a Bard 5th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Bard 6th-level spell?",
			choices: ["Teleport", "Etherealness", "True Seeing", "Forcecage"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Bard 7th-level spells?": [
		{
			type: "true_false",
			question: "Teleport is a Bard 7th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Bard 7th-level spell?",
			choices: ["Feeblemind", "Mind Blank", "Etherealness", "Dominate Monster"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Bard 8th-level spells?": [
		{
			type: "true_false",
			question: "Feeblemind is a Bard 7th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Bard 8th-level spell?",
			choices: ["Foresight", "Power Word Kill", "Mind Blank", "True Polymorph"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Bard 9th-level spells?": [
		{
			type: "true_false",
			question: "Power Word Kill is a Bard 9th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Bard 9th-level spell?",
			choices: ["Glibness", "Dominate Monster", "True Polymorph", "Power Word Stun"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Cleric cantrips?": [
		{
			type: "true_false",
			question: "Bane is one of the Cleric's cantrips.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Cleric cantrip?",
			choices: ["Bless", "Sacred Flame", "Command", "Cure Wounds"],
			correctChoiceIndex: 1,
		},
	],
	"What are the Cleric 1st-level spells?": [
		{
			type: "true_false",
			question: "Bless is a Cleric 1st-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Cleric 1st-level spell?",
			choices: ["Guidance", "Guiding Bolt", "Thaumaturgy", "Spare the Dying"],
			correctChoiceIndex: 1,
		},
	],
	"What are the Cleric 2nd-level spells?": [
		{
			type: "true_false",
			question: "Guiding Bolt is a Cleric 2nd-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Cleric 2nd-level spell?",
			choices: ["Dispel Magic", "Daylight", "Spiritual Weapon", "Revivify"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Cleric 3rd-level spells?": [
		{
			type: "true_false",
			question: "Spirit Guardians is a Cleric 3rd-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Cleric 3rd-level spell?",
			choices: ["Death Ward", "Divination", "Revivify", "Banishment"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Cleric 4th-level spells?": [
		{
			type: "true_false",
			question: "Death Ward is a Cleric 3rd-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Cleric 4th-level spell?",
			choices: ["Geas", "Raise Dead", "Guardian of Faith", "Contagion"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Cleric 5th-level spells?": [
		{
			type: "true_false",
			question: "Raise Dead is a Cleric 5th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Cleric 5th-level spell?",
			choices: ["Heal", "True Seeing", "Greater Restoration", "Blade Barrier"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Cleric 6th-level spells?": [
		{
			type: "true_false",
			question: "Heal is a Cleric 5th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Cleric 6th-level spell?",
			choices: ["Etherealness", "Resurrection", "Blade Barrier", "Divine Word"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Cleric 7th-level spells?": [
		{
			type: "true_false",
			question: "Divine Word is a Cleric 7th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Cleric 7th-level spell?",
			choices: ["Antimagic Field", "Earthquake", "Regenerate", "Holy Aura"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Cleric 8th-level spells?": [
		{
			type: "true_false",
			question: "Antimagic Field is a Cleric 7th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Cleric 8th-level spell?",
			choices: ["Gate", "Mass Heal", "Control Weather", "Astral Projection"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Cleric 9th-level spells?": [
		{
			type: "true_false",
			question: "Gate is a Cleric 9th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Cleric 9th-level spell?",
			choices: ["Holy Aura", "Earthquake", "True Resurrection", "Control Weather"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Druid cantrips?": [
		{
			type: "true_false",
			question: "Entangle is one of the Druid's cantrips.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Druid cantrip?",
			choices: ["Goodberry", "Shillelagh", "Faerie Fire", "Thunderwave"],
			correctChoiceIndex: 1,
		},
	],
	"What are the Druid 1st-level spells?": [
		{
			type: "true_false",
			question: "Goodberry is a Druid 1st-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Druid 1st-level spell?",
			choices: ["Druidcraft", "Produce Flame", "Entangle", "Poison Spray"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Druid 2nd-level spells?": [
		{
			type: "true_false",
			question: "Entangle is a Druid 2nd-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Druid 2nd-level spell?",
			choices: ["Call Lightning", "Daylight", "Moonbeam", "Sleet Storm"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Druid 3rd-level spells?": [
		{
			type: "true_false",
			question: "Call Lightning is a Druid 3rd-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Druid 3rd-level spell?",
			choices: ["Confusion", "Polymorph", "Conjure Animals", "Ice Storm"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Druid 4th-level spells?": [
		{
			type: "true_false",
			question: "Conjure Animals is a Druid 4th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Druid 4th-level spell?",
			choices: ["Geas", "Contagion", "Polymorph", "Reincarnate"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Druid 5th-level spells?": [
		{
			type: "true_false",
			question: "Reincarnate is a Druid 5th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Druid 5th-level spell?",
			choices: ["Sunbeam", "Heal", "Conjure Elemental", "Conjure Fey"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Druid 6th-level spells?": [
		{
			type: "true_false",
			question: "Conjure Elemental is a Druid 6th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Druid 6th-level spell?",
			choices: ["Reverse Gravity", "Regenerate", "Sunbeam", "Plane Shift"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Druid 7th-level spells?": [
		{
			type: "true_false",
			question: "Reverse Gravity is a Druid 7th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Druid 7th-level spell?",
			choices: ["Earthquake", "Feeblemind", "Fire Storm", "Sunburst"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Druid 8th-level spells?": [
		{
			type: "true_false",
			question: "Earthquake is a Druid 7th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Druid 8th-level spell?",
			choices: ["Foresight", "Shapechange", "Sunburst", "True Resurrection"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Druid 9th-level spells?": [
		{
			type: "true_false",
			question: "Shapechange is a Druid 9th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Druid 9th-level spell?",
			choices: ["Animal Shapes", "Control Weather", "Storm of Vengeance", "Antipathy/Sympathy"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Paladin 1st-level spells?": [
		{
			type: "true_false",
			question: "Find Steed is a Paladin 1st-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Paladin 1st-level spell?",
			choices: ["Aid", "Find Steed", "Divine Favor", "Magic Weapon"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Paladin 2nd-level spells?": [
		{
			type: "true_false",
			question: "Find Steed is a Paladin 2nd-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Paladin 2nd-level spell?",
			choices: ["Bless", "Heroism", "Branding Smite", "Divine Favor"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Paladin 3rd-level spells?": [
		{
			type: "true_false",
			question: "Magic Circle is a Paladin 2nd-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Paladin 3rd-level spell?",
			choices: ["Banishment", "Death Ward", "Locate Creature", "Revivify"],
			correctChoiceIndex: 3,
		},
	],
	"What are the Paladin 4th-level spells?": [
		{
			type: "true_false",
			question: "Banishment is a Paladin 4th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Paladin 4th-level spell?",
			choices: ["Daylight", "Dispel Magic", "Death Ward", "Remove Curse"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Paladin 5th-level spells?": [
		{
			type: "true_false",
			question: "Dispel Evil and Good is a Paladin 4th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Paladin 5th-level spell?",
			choices: ["Locate Creature", "Banishment", "Geas", "Death Ward"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Ranger 1st-level spells?": [
		{
			type: "true_false",
			question: "Barkskin is a Ranger 1st-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Ranger 1st-level spell?",
			choices: ["Barkskin", "Silence", "Hunter's Mark", "Spike Growth"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Ranger 2nd-level spells?": [
		{
			type: "true_false",
			question: "Barkskin is a Ranger 2nd-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Ranger 2nd-level spell?",
			choices: ["Goodberry", "Alarm", "Pass without Trace", "Hunter's Mark"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Ranger 3rd-level spells?": [
		{
			type: "true_false",
			question: "Conjure Woodland Beings is a Ranger 3rd-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Ranger 3rd-level spell?",
			choices: ["Conjure Woodland Beings", "Stoneskin", "Conjure Animals", "Freedom of Movement"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Ranger 4th-level spells?": [
		{
			type: "true_false",
			question: "Freedom of Movement is a Ranger 4th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Ranger 4th-level spell?",
			choices: ["Nondetection", "Water Walk", "Stoneskin", "Wind Wall"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Ranger 5th-level spells?": [
		{
			type: "true_false",
			question: "Freedom of Movement is a Ranger 5th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Ranger 5th-level spell?",
			choices: ["Locate Creature", "Conjure Woodland Beings", "Tree Stride", "Stoneskin"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Sorcerer cantrips?": [
		{
			type: "true_false",
			question: "Magic Missile is one of the Sorcerer's cantrips.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Sorcerer cantrip?",
			choices: ["Magic Missile", "Shield", "Fire Bolt", "Burning Hands"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Sorcerer 1st-level spells?": [
		{
			type: "true_false",
			question: "Magic Missile is a Sorcerer 1st-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Sorcerer 1st-level spell?",
			choices: ["Fire Bolt", "Ray of Frost", "Shield", "Shocking Grasp"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Sorcerer 2nd-level spells?": [
		{
			type: "true_false",
			question: "Fireball is a Sorcerer 2nd-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Sorcerer 2nd-level spell?",
			choices: ["Fireball", "Haste", "Misty Step", "Lightning Bolt"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Sorcerer 3rd-level spells?": [
		{
			type: "true_false",
			question: "Fireball is a Sorcerer 3rd-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Sorcerer 3rd-level spell?",
			choices: ["Misty Step", "Invisibility", "Lightning Bolt", "Scorching Ray"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Sorcerer 4th-level spells?": [
		{
			type: "true_false",
			question: "Polymorph is a Sorcerer 3rd-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Sorcerer 4th-level spell?",
			choices: ["Cone of Cold", "Telekinesis", "Banishment", "Hold Monster"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Sorcerer 5th-level spells?": [
		{
			type: "true_false",
			question: "Cone of Cold is a Sorcerer 5th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Sorcerer 5th-level spell?",
			choices: ["Polymorph", "Banishment", "Telekinesis", "Dimension Door"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Sorcerer 6th-level spells?": [
		{
			type: "true_false",
			question: "Chain Lightning is a Sorcerer 5th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Sorcerer 6th-level spell?",
			choices: ["Teleport", "Etherealness", "Disintegrate", "Reverse Gravity"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Sorcerer 7th-level spells?": [
		{
			type: "true_false",
			question: "Teleport is a Sorcerer 7th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Sorcerer 7th-level spell?",
			choices: ["Chain Lightning", "Disintegrate", "Prismatic Spray", "True Seeing"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Sorcerer 8th-level spells?": [
		{
			type: "true_false",
			question: "Meteor Swarm is a Sorcerer 8th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Sorcerer 8th-level spell?",
			choices: ["Meteor Swarm", "Wish", "Earthquake", "Time Stop"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Sorcerer 9th-level spells?": [
		{
			type: "true_false",
			question: "Wish is a Sorcerer 9th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Sorcerer 9th-level spell?",
			choices: ["Dominate Monster", "Sunburst", "Time Stop", "Power Word Stun"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Warlock cantrips?": [
		{
			type: "true_false",
			question: "Hellish Rebuke is one of the Warlock's cantrips.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Warlock cantrip?",
			choices: ["Hellish Rebuke", "Charm Person", "Eldritch Blast", "Unseen Servant"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Warlock 1st-level spells?": [
		{
			type: "true_false",
			question: "Hellish Rebuke is a Warlock 1st-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Warlock 1st-level spell?",
			choices: ["Eldritch Blast", "Chill Touch", "Charm Person", "Poison Spray"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Warlock 2nd-level spells?": [
		{
			type: "true_false",
			question: "Counterspell is a Warlock 2nd-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Warlock 2nd-level spell?",
			choices: ["Counterspell", "Fear", "Misty Step", "Vampiric Touch"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Warlock 3rd-level spells?": [
		{
			type: "true_false",
			question: "Counterspell is a Warlock 3rd-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Warlock 3rd-level spell?",
			choices: ["Misty Step", "Darkness", "Vampiric Touch", "Suggestion"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Warlock 4th-level spells?": [
		{
			type: "true_false",
			question: "Contact Other Plane is a Warlock 4th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Warlock 4th-level spell?",
			choices: ["Dream", "Hold Monster", "Banishment", "Scrying"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Warlock 5th-level spells?": [
		{
			type: "true_false",
			question: "Contact Other Plane is a Warlock 5th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Warlock 5th-level spell?",
			choices: ["Banishment", "Blight", "Scrying", "Dimension Door"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Warlock 6th-level spells?": [
		{
			type: "true_false",
			question: "Finger of Death is a Warlock 6th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Warlock 6th-level spell?",
			choices: ["Finger of Death", "Etherealness", "Eyebite", "Plane Shift"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Warlock 7th-level spells?": [
		{
			type: "true_false",
			question: "Finger of Death is a Warlock 7th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Warlock 7th-level spell?",
			choices: ["Eyebite", "Create Undead", "Forcecage", "True Seeing"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Warlock 8th-level spells?": [
		{
			type: "true_false",
			question: "Astral Projection is a Warlock 8th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Warlock 8th-level spell?",
			choices: ["Astral Projection", "Foresight", "Dominate Monster", "Power Word Kill"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Warlock 9th-level spells?": [
		{
			type: "true_false",
			question: "Astral Projection is a Warlock 9th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Warlock 9th-level spell?",
			choices: ["Demiplane", "Glibness", "Power Word Kill", "Feeblemind"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Wizard cantrips?": [
		{
			type: "true_false",
			question: "Magic Missile is one of the Wizard's cantrips.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Wizard cantrip?",
			choices: ["Magic Missile", "Shield", "Fire Bolt", "Mage Armor"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Wizard 1st-level spells?": [
		{
			type: "true_false",
			question: "Magic Missile is a Wizard 1st-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Wizard 1st-level spell?",
			choices: ["Fire Bolt", "Ray of Frost", "Find Familiar", "Prestidigitation"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Wizard 2nd-level spells?": [
		{
			type: "true_false",
			question: "Scorching Ray is a Wizard 1st-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Wizard 2nd-level spell?",
			choices: ["Fireball", "Haste", "Misty Step", "Scorching Ray"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Wizard 3rd-level spells?": [
		{
			type: "true_false",
			question: "Fireball is a Wizard 3rd-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Wizard 3rd-level spell?",
			choices: ["Misty Step", "Invisibility", "Counterspell", "Web"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Wizard 4th-level spells?": [
		{
			type: "true_false",
			question: "Polymorph is a Wizard 3rd-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Wizard 4th-level spell?",
			choices: ["Cone of Cold", "Telekinesis", "Banishment", "Dominate Person"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Wizard 5th-level spells?": [
		{
			type: "true_false",
			question: "Cone of Cold is a Wizard 5th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Wizard 5th-level spell?",
			choices: ["Polymorph", "Banishment", "Telekinesis", "Dimension Door"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Wizard 6th-level spells?": [
		{
			type: "true_false",
			question: "Chain Lightning is a Wizard 5th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Wizard 6th-level spell?",
			choices: ["Teleport", "Etherealness", "Disintegrate", "Reverse Gravity"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Wizard 7th-level spells?": [
		{
			type: "true_false",
			question: "Teleport is a Wizard 7th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Wizard 7th-level spell?",
			choices: ["Chain Lightning", "Disintegrate", "Simulacrum", "True Seeing"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Wizard 8th-level spells?": [
		{
			type: "true_false",
			question: "Meteor Swarm is a Wizard 8th-level spell.",
			correctAnswer: false,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Wizard 8th-level spell?",
			choices: ["Meteor Swarm", "Wish", "Clone", "Time Stop"],
			correctChoiceIndex: 2,
		},
	],
	"What are the Wizard 9th-level spells?": [
		{
			type: "true_false",
			question: "Wish is a Wizard 9th-level spell.",
			correctAnswer: true,
		},
		{
			type: "multiple_choice",
			question: "Which of the following is a Wizard 9th-level spell?",
			choices: ["Dominate Monster", "Feeblemind", "Time Stop", "Mind Blank"],
			correctChoiceIndex: 2,
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
