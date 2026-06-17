import type { Character, ConsequenceType, ActiveCondition, StatType } from '../types';
import { CONDITIONS, getCondition, type ConditionDef } from '../../content/health/conditions';

function hasCondition(character: Character, id: string): boolean {
  return character.conditions.some((c) => c.id === id);
}

// Contextual multiplier on a condition's base onset weight.
function contextWeight(def: ConditionDef, character: Character, age: number): number {
  let w = def.onsetWeight;
  if (def.requiresFlag && !character.flags[def.requiresFlag]) return 0;
  if (def.id === 'depression') {
    if (character.stats.happiness < 35) w *= 2.5;
    const woundLoad = Object.values(character.wounds).reduce((s, n) => s + (n ?? 0), 0);
    if (woundLoad >= 4) w *= 1.5;
  }
  if (def.id === 'anxiety' && character.stats.happiness < 40) w *= 1.8;
  if (def.id === 'heart_disease' && character.stats.fitness < 40) w *= 2;
  if (def.id === 'diabetes' && character.stats.fitness < 40) w *= 1.8;
  if (def.id === 'cancer' && age > 60) w *= 1.6;
  return w;
}

// ─── Yearly drain from active conditions ──────────────────────────────────────

export function conditionYearlyEffects(character: Character, years: number): ConsequenceType[] {
  const out: ConsequenceType[] = [];
  for (const active of character.conditions) {
    const def = getCondition(active.id);
    if (!def?.yearly) continue;
    for (const e of def.yearly) {
      out.push({ type: 'stat', key: e.stat as StatType, delta: e.delta * years });
    }
  }
  return out;
}

// ─── Onset ────────────────────────────────────────────────────────────────────

export function rollOnset(character: Character, age: number, years: number): ActiveCondition | null {
  const base = age < 30 ? 0.03 : age < 50 ? 0.06 : age < 70 ? 0.1 : 0.15;
  if (Math.random() > Math.min(0.6, base * years)) return null;

  const eligible = CONDITIONS
    .filter((d) => age >= d.minAge && !hasCondition(character, d.id))
    .map((d) => ({ d, w: contextWeight(d, character, age) }))
    .filter((x) => x.w > 0);
  if (eligible.length === 0) return null;

  const total = eligible.reduce((s, x) => s + x.w, 0);
  let roll = Math.random() * total;
  for (const x of eligible) {
    roll -= x.w;
    if (roll <= 0) return { id: x.d.id, name: x.d.name, since: age };
  }
  return null;
}

// ─── Spontaneous resolution ───────────────────────────────────────────────────

export function rollResolve(character: Character): ActiveCondition | null {
  for (const active of character.conditions) {
    const def = getCondition(active.id);
    if (def?.resolveChance && Math.random() < def.resolveChance) return active;
  }
  return null;
}

// ─── Condition-driven mortality ───────────────────────────────────────────────

export function rollConditionDeath(character: Character, years: number): string | null {
  for (const active of character.conditions) {
    const def = getCondition(active.id);
    if (def?.fatalChance) {
      const risk = 1 - Math.pow(1 - def.fatalChance, years);
      if (Math.random() < risk) return `complications from ${def.name.replace(/^(a |an |the )/, '')}`;
    }
  }
  return null;
}

// ─── Treatment ────────────────────────────────────────────────────────────────

export type Availability = { ok: true } | { ok: false; reason: string };

export function treatAvailability(active: ActiveCondition, character: Character): Availability {
  const def = getCondition(active.id);
  if (!def) return { ok: false, reason: 'Unknown' };
  if (def.treatCost && character.money < def.treatCost) {
    return { ok: false, reason: `$${def.treatCost.toLocaleString()}` };
  }
  return { ok: true };
}

export interface TreatOutcome {
  cured: boolean;
  narrative: string;
  consequences: ConsequenceType[];
}

export function treat(active: ActiveCondition, character: Character): TreatOutcome {
  const def = getCondition(active.id)!;
  const cost = def.treatCost ?? 0;
  const cured = Math.random() < (def.cureChance ?? 0.5);
  const name = def.name.replace(/^(a |an |the )/, '');
  if (cured) {
    return {
      cured: true,
      narrative: `You sought treatment for ${name}, and this time it took. The weight of it lifted — slowly, then all at once.`,
      consequences: [
        { type: 'money', delta: -cost },
        { type: 'condition_remove', id: active.id },
        { type: 'stat', key: 'health', delta: 4 },
        { type: 'stat', key: 'happiness', delta: 4 },
      ],
    };
  }
  return {
    cured: false,
    narrative: `You sought treatment for ${name}. It helped at the edges, but the thing itself stayed. You'd try again.`,
    consequences: [
      { type: 'money', delta: -cost },
      { type: 'stat', key: 'health', delta: 1 },
    ],
  };
}
