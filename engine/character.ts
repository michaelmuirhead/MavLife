import type { Character, NewGameConfig, Relationship } from './types';

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
// Based on family stability — seeds starting wound profile invisibly

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
    wounds: seedWounds(familyStability, familyClass),
    values: seedValues(familyStability, familyClass),
    desires: ['love', 'meaning'],
    relationships,
    flags,
    reputation: {},
    occupation: null,
    income: 'none',
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

export function getRelationshipName(character: Character, id: string): string {
  return character.relationships[id]?.name ?? id;
}
