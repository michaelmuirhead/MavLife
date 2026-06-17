import type { Character, GameEvent, EligibilityReq, StatType } from './types';
import { ALL_EVENTS } from '../content';

// ─── Shared Requirement Check ──────────────────────────────────────────────
// One gate for events, activities, and individual activity outcomes.

export function meetsRequirements(
  req: EligibilityReq | undefined,
  character: Character
): boolean {
  if (!req) return true;

  // Required flags must all be present
  if (req.flags) {
    for (const flag of req.flags) {
      if (!character.flags[flag]) return false;
    }
  }

  // Excluded flags must all be absent
  if (req.notFlags) {
    for (const flag of req.notFlags) {
      if (character.flags[flag]) return false;
    }
  }

  // Family class filter
  if (req.familyClass && !req.familyClass.includes(character.familyClass)) return false;

  // Family stability filter
  if (req.familyStability && !req.familyStability.includes(character.familyStability)) return false;

  // Wound threshold checks
  if (req.minWound) {
    for (const [woundKey, minVal] of Object.entries(req.minWound)) {
      const actual = character.wounds[woundKey as keyof typeof character.wounds] ?? 0;
      if (actual < (minVal ?? 0)) return false;
    }
  }

  // Stat thresholds
  if (req.minStat) {
    for (const [statKey, minVal] of Object.entries(req.minStat)) {
      if ((character.stats[statKey as StatType] ?? 0) < (minVal ?? 0)) return false;
    }
  }
  if (req.maxStat) {
    for (const [statKey, maxVal] of Object.entries(req.maxStat)) {
      if ((character.stats[statKey as StatType] ?? 0) > (maxVal ?? 100)) return false;
    }
  }

  // Money floor
  if (req.minMoney !== undefined && (character.money ?? 0) < req.minMoney) return false;

  // Must have at least one living relationship of a given type
  if (req.hasRelationshipType) {
    const has = Object.values(character.relationships).some(
      (r) => r.alive && req.hasRelationshipType!.includes(r.type)
    );
    if (!has) return false;
  }

  return true;
}

// ─── Event Eligibility ─────────────────────────────────────────────────────

function isEligible(event: GameEvent, age: number, character: Character, firedIds: Set<string>): boolean {
  // Don't fire the same event twice
  if (firedIds.has(event.id)) return false;

  // Age check
  if (age < event.ageRange[0] || age > event.ageRange[1]) return false;

  return meetsRequirements(event.requires, character);
}

// ─── Event Selection — 70/30 Engine ───────────────────────────────────────
// 70% of the time: pick from consequence-weighted events (context-sensitive)
// 30% of the time: pick from chaos events (random, unexpected)

export function selectEvent(
  age: number,
  character: Character,
  firedIds: Set<string>
): GameEvent | null {
  const eligible = ALL_EVENTS.filter((e) => isEligible(e, age, character, firedIds));

  if (eligible.length === 0) return null;

  const consequencePool = eligible.filter((e) => e.weight === 'consequence');
  const chaosPool = eligible.filter((e) => e.weight === 'chaos');

  // Decide which pool to draw from
  const roll = Math.random();
  let pool: GameEvent[];

  if (roll < 0.7 && consequencePool.length > 0) {
    pool = consequencePool;
  } else if (chaosPool.length > 0) {
    pool = chaosPool;
  } else {
    pool = eligible; // fallback to any eligible event
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Text Interpolation ────────────────────────────────────────────────────
// Replace {name}, {location} etc. in event narrative

export function interpolate(
  text: string,
  character: Character,
  extra?: Record<string, string>
): string {
  let out = text
    .replace(/\{name\}/g, character.name)
    .replace(/\{location\}/g, character.location)
    .replace(/\{mother\}/g, character.relationships['mother']?.name ?? 'your mother')
    .replace(/\{father\}/g, character.relationships['father']?.name ?? 'your father')
    .replace(/\{sibling\}/g, character.relationships['sibling']?.name ?? 'your sibling');

  if (extra) {
    for (const [token, value] of Object.entries(extra)) {
      out = out.replace(new RegExp(`\\{${token}\\}`, 'g'), value);
    }
  }

  return out;
}
