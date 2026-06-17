import type { Character, NewGameConfig, Relationship, StatType, FamilyClass, FamilyStability } from './types';

// ─── Stat Seeding ─────────────────────────────────────────────────────────
// Starting stats are shaped by family background + randomness.
// Kids start high on fitness (they're children), vary on the rest.

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function seedStats(
  familyClass: FamilyClass,
  familyStability: FamilyStability
): Record<StatType, number> {
  // Health — affected by class (nutrition, healthcare access)
  const healthBase = familyClass === 'poor' ? 65 : familyClass === 'working' ? 72 : 78;
  const health = clamp(healthBase + rand(0, 15));

  // Happiness — driven by stability
  const happinessBase =
    familyStability === 'strong' ? 72 :
    familyStability === 'stable' ? 62 :
    familyStability === 'struggling' ? 48 : 35;
  const happiness = clamp(happinessBase + rand(0, 15));

  // Looks — mostly genetic luck, slight class effect (nutrition)
  const looksBase = familyClass === 'poor' ? 42 : 48;
  const looks = clamp(looksBase + rand(0, 30));

  // Smarts — class affects access to stimulation and education early on
  const smartsBase =
    familyClass === 'upper' ? 58 :
    familyClass === 'middle' ? 52 :
    familyClass === 'working' ? 48 : 44;
  const smarts = clamp(smartsBase + rand(0, 25));

  // Fitness — kids are naturally active; volatility at home can suppress it
  const fitnessBase = familyStability === 'volatile' ? 60 : 70;
  const fitness = clamp(fitnessBase + rand(0, 20));

  // Charisma — random, slightly boosted by stable homes (security → openness)
  const charismaBase = familyStability === 'strong' || familyStability === 'stable' ? 48 : 42;
  const charisma = clamp(charismaBase + rand(0, 28));

  return { health, happiness, looks, smarts, fitness, charisma };
}

// ─── Default Relationship Templates ───────────────────────────────────────

function createMother(stability: Character['familyStability']): Relationship {
  const closeness = stability === 'strong' ? 4 : stability === 'stable' ? 3 : stability === 'struggling' ? 2 : 1;
  return {
    id: 'mother',
    name: 'your mother',
    type: 'mother',
    closeness,
    alive: true,
    flags: [],
  };
}

function createFather(
  stability: Character['familyStability'],
  familyClass: Character['familyClass']
): Relationship {
  const basCloseness = stability === 'strong' ? 3 : stability === 'stable' ? 2 : 1;
  const absent = stability === 'volatile' && Math.random() > 0.5;
  return {
    id: 'father',
    name: 'your father',
    type: 'father',
    closeness: absent ? -1 : basCloseness,
    alive: true,
    flags: absent ? ['absent'] : familyClass === 'poor' || familyClass === 'working' ? ['working_long_hours'] : [],
  };
}

// ─── Wound Seeding ─────────────────────────────────────────────────────────

function seedWounds(
  stability: Character['familyStability'],
  familyClass: Character['familyClass']
): Character['wounds'] {
  const wounds: Character['wounds'] = {};

  if (stability === 'volatile') {
    wounds.powerlessness = 2;
    wounds.abandonment = 1;
  } else if (stability === 'struggling') {
    wounds.powerlessness = 1;
  }

  if (familyClass === 'poor') {
    wounds.shame = 1;
  }

  return wounds;
}

// ─── Value Seeding ─────────────────────────────────────────────────────────

function seedValues(
  stability: Character['familyStability'],
  familyClass: Character['familyClass']
): Character['values'] {
  const values: Character['values'] = {};

  if (stability === 'strong' || stability === 'stable') {
    values.connection = 2;
  }

  if (familyClass === 'poor' || familyClass === 'working') {
    values.security = 2;
  } else if (familyClass === 'upper') {
    values.ambition = 1;
  }

  return values;
}

// ─── Create Character ──────────────────────────────────────────────────────

export function createCharacter(config: NewGameConfig): Character {
  const { name, gender, birthYear, location, familyClass, familyStability } = config;

  const mother = createMother(familyStability);
  const father = createFather(familyStability, familyClass);

  const hasSibling = Math.random() > 0.4;
  const relationships: Character['relationships'] = {
    mother,
    father,
  };

  if (hasSibling) {
    relationships.sibling = {
      id: 'sibling',
      name: 'your sibling',
      type: 'sibling',
      closeness: 2,
      alive: true,
      flags: ['older'],
    };
  }

  const flags: Character['flags'] = {
    has_mother: true,
    has_father: father.flags.includes('absent') ? false : true,
    has_sibling: hasSibling,
    father_absent: father.flags.includes('absent'),
    father_working_long_hours: father.flags.includes('working_long_hours'),
  };

  return {
    name,
    gender,
    birthYear,
    location,
    familyClass,
    familyStability,
    stats: seedStats(familyClass, familyStability),
    wounds: seedWounds(familyStability, familyClass),
    values: seedValues(familyStability, familyClass),
    desires: ['love', 'meaning'],
    relationships,
    flags,
    reputation: {},
    occupation: null,
    income: 'none',
    money: 0,
    salary: 0,
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

export function getRelationshipName(character: Character, id: string): string {
  return character.relationships[id]?.name ?? id;
}
