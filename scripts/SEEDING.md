# Seed Script Guide

Scripts in this directory import D&D 5e SRD flashcard decks into the app via the REST API.

## How it works

`seed.ts` auto-discovers every file matching `seed-*.ts` in alphabetical order and runs them. Add a new file with the right prefix; it runs automatically with `bun run db:seed`.

## File naming

| Content type | Pattern | Example |
|---|---|---|
| Class | `seed-<classname>.ts` | `seed-wizard.ts` |
| Rules subsystem | `seed-rules-<topic>.ts` | `seed-rules-combat.ts` |
| Lore / world | `seed-lore-<topic>.ts` | `seed-lore-planes.ts` |
| Spell lists | `seed-spell-lists.ts` | — |
| Other | `seed-<topic>.ts` | `seed-conditions.ts` |

## Template

Copy this exactly. Do not alter the `run()` function structure.

```typescript
const API = process.env.API_URL ?? "http://localhost:3000";

const cards = [
  { front: "Question?", back: "Answer.", tags: ["rule"] },
];

async function run() {
  const deckRes = await fetch(`${API}/decks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Deck Name", description: "One sentence description of what this deck covers." }),
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
```

## Card fields

| Field | Type | Notes |
|---|---|---|
| `front` | string | A question. End with `?`. |
| `back` | string | The answer. Dense but complete. |
| `tags` | string[] | One or more from the valid tag list below. |

## Valid tags

Tags are a **closed set** defined in `src/domain/tags.ts`. Using anything else will cause a 400 error.

```
spell      condition   action    creature
rule       item        ability   skill
combat     lore        class     race
```

Use the most specific tags that apply. A card can have multiple tags.

| Tag | Use for |
|---|---|
| `rule` | Mechanics, procedures, how things work |
| `combat` | Anything that applies specifically in combat |
| `spell` | Spell mechanics, spell lists, casting rules |
| `condition` | The 15 official conditions |
| `class` | Class features, subclass abilities |
| `race` | Racial traits |
| `ability` | Ability scores, saving throws, senses (darkvision etc) |
| `skill` | Skill checks and how to use them |
| `action` | Actions, bonus actions, reactions |
| `item` | Equipment, weapons, armor, magic items |
| `creature` | Monster traits, creature types |
| `lore` | World knowledge, planes, history, deities |

## Card writing guidelines

- `front`: phrase as a question the player might actually ask at the table
- `back`: answer completely but concisely; abbreviate only what's unambiguous (e.g. "Str" for Strength, "Wis" for Wisdom, "Con" for Constitution)
- Include all mechanical numbers — DCs, distances, durations, damage dice
- One card per discrete rule or concept; don't cram unrelated things together
- Exception: related short facts can share a card (e.g. all six exhaustion levels on one card)

## Running

```bash
# Run all seed scripts
bun run db:seed

# Run a single script
bun run scripts/seed-conditions.ts

# Target a different server
API_URL=https://my-server.example.com bun run db:seed
```

## Existing decks

| File | Deck name | Cards |
|---|---|---|
| `seed-races.ts` | Races | ~30 |
| `seed-barbarian.ts` | Barbarian | ~20 |
| `seed-bard.ts` | Bard | ~20 |
| `seed-cleric.ts` | Cleric | ~20 |
| `seed-druid.ts` | Druid | ~22 |
| `seed-fighter.ts` | Fighter | ~20 |
| `seed-monk.ts` | Monk | ~25 |
| `seed-paladin.ts` | Paladin | ~27 |
| `seed-ranger.ts` | Ranger | ~20 |
| `seed-rogue.ts` | Rogue | ~22 |
| `seed-sorcerer.ts` | Sorcerer | ~27 |
| `seed-warlock.ts` | Warlock | ~27 |
| `seed-wizard.ts` | Wizard | ~21 |
| `seed-ability-scores.ts` | Ability Scores | ~25 |
| `seed-equipment.ts` | Equipment | ~23 |
| `seed-rules-basic.ts` | Core Rules | ~23 |
| `seed-rules-combat.ts` | Combat Rules | ~36 |
| `seed-rules-environment.ts` | Environment & Resting | ~13 |
| `seed-rules-movement.ts` | Movement & Travel | ~8 |
| `seed-rules-spellcasting.ts` | Spellcasting Rules | ~19 |
| `seed-spell-lists.ts` | Spell Lists | ~72 |
| `seed-conditions.ts` | Conditions | 16 |
| `seed-lore-planes.ts` | Planes of Existence | 12 |
