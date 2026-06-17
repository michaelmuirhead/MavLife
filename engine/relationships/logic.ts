import type { Character, ConsequenceType, Relationship } from '../types';
import { randomFirstName, randomGender, surnameOf } from '../../content/names';

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function livingPartner(character: Character): Relationship | undefined {
  return Object.values(character.relationships).find((r) => r.type === 'romantic' && r.alive);
}

export function childCount(character: Character): number {
  return Object.values(character.relationships).filter((r) => r.type === 'child').length;
}

export function isMarried(character: Character): boolean {
  return Boolean(character.flags['married']);
}

export type Availability = { ok: true } | { ok: false; reason: string };

export interface RelOutcome {
  success: boolean;
  narrative: string;
  consequences: ConsequenceType[];
}

// ─── Find love ────────────────────────────────────────────────────────────────

export function canFindLove(character: Character, age: number): Availability {
  if (age < 16) return { ok: false, reason: 'Too young' };
  if (livingPartner(character)) return { ok: false, reason: 'Already seeing someone' };
  return { ok: true };
}

export function findLove(character: Character, age: number): RelOutcome {
  const chance = clamp((character.stats.looks * 0.5 + character.stats.charisma * 0.5) / 100 + 0.1, 0.12, 0.9);
  if (Math.random() < chance) {
    const gender = randomGender();
    const name = randomFirstName(gender);
    const partner: Relationship = {
      id: `partner_${age}`,
      name,
      type: 'romantic',
      closeness: 3,
      alive: true,
      flags: [],
    };
    return {
      success: true,
      narrative: `You met ${name}. It started as most of these do — a little awkward, a little electric — and then, without quite deciding to, you were seeing each other.`,
      consequences: [
        { type: 'relationship_add', relationship: partner },
        { type: 'flag', key: 'has_partner', value: true },
        { type: 'stat', key: 'happiness', delta: 6 },
        { type: 'wound', key: 'abandonment', delta: -1 },
      ],
    };
  }
  return {
    success: false,
    narrative:
      'You put yourself out there — the apps, the setups, the small humiliations of trying. Nothing took. You told yourself these things have their own timing.',
    consequences: [{ type: 'stat', key: 'happiness', delta: -2 }],
  };
}

// ─── Propose ──────────────────────────────────────────────────────────────────

export function canPropose(character: Character, age: number): Availability {
  const p = livingPartner(character);
  if (!p) return { ok: false, reason: 'No partner' };
  if (isMarried(character)) return { ok: false, reason: 'Already married' };
  if (p.closeness < 3) return { ok: false, reason: 'Too soon' };
  return { ok: true };
}

export function propose(character: Character): RelOutcome {
  const p = livingPartner(character)!;
  const chance = clamp(0.4 + p.closeness * 0.1, 0.2, 0.95);
  if (Math.random() < chance) {
    return {
      success: true,
      narrative: `You asked ${p.name} to marry you, and ${p.name} said yes. The day itself was a blur of people and weather; the promise underneath it was clear enough.`,
      consequences: [
        { type: 'flag', key: 'married', value: true },
        { type: 'relationship_closeness', key: p.id, delta: 1 },
        { type: 'stat', key: 'happiness', delta: 8 },
        { type: 'value', key: 'connection', delta: 1 },
      ],
    };
  }
  return {
    success: false,
    narrative: `You asked ${p.name} to marry you. ${p.name} hesitated, and the hesitation was its own answer, even before the careful words came. Something between you cooled.`,
    consequences: [
      { type: 'relationship_closeness', key: p.id, delta: -1 },
      { type: 'stat', key: 'happiness', delta: -5 },
      { type: 'wound', key: 'rejection', delta: 1 },
    ],
  };
}

// ─── Have a child ─────────────────────────────────────────────────────────────

export function canHaveChild(character: Character, age: number): Availability {
  if (!livingPartner(character) && !isMarried(character)) return { ok: false, reason: 'Need a partner' };
  if (age < 16 || age > 50) return { ok: false, reason: 'Not the season for it' };
  if (childCount(character) >= 6) return { ok: false, reason: 'Hands are full' };
  return { ok: true };
}

export function haveChild(character: Character, age: number): RelOutcome {
  // Mostly works; sometimes a year passes without it happening.
  if (Math.random() > 0.8) {
    return {
      success: false,
      narrative: 'You tried for a child this year. It didn’t happen. You held the disappointment quietly, the way people do.',
      consequences: [{ type: 'stat', key: 'happiness', delta: -2 }],
    };
  }
  const gender = randomGender();
  const name = randomFirstName(gender);
  const n = childCount(character) + 1;
  const child: Relationship = {
    id: `child_${n}`,
    name,
    type: 'child',
    closeness: 4,
    alive: true,
    flags: [`gender:${gender}`, `born:${age}`],
  };
  const motherCost = character.gender === 'female'
    ? [{ type: 'stat', key: 'health', delta: -3 } as ConsequenceType]
    : [];
  return {
    success: true,
    narrative: `${name} was born. Small and furious and entirely yours. Whatever you thought your life was about rearranged itself, quietly, around this.`,
    consequences: [
      { type: 'relationship_add', relationship: child },
      { type: 'flag', key: 'has_children', value: true },
      { type: 'stat', key: 'happiness', delta: 6 },
      { type: 'value', key: 'legacy', delta: 1 },
      ...motherCost,
    ],
  };
}

// Surname carried by this character's bloodline (for heirs).
export function lineageSurname(character: Character): string {
  return surnameOf(character.name);
}
