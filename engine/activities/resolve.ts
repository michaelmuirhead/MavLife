import type { Character, ConsequenceType } from '../types';
import { meetsRequirements } from '../eventSelector';
import type { Activity, ActivityOutcome } from './types';

// ─── Cooldown Keys ──────────────────────────────────────────────────────────
// Targeted activities track cooldowns per target, so you can reach out to two
// different people in one year, but each only once.

export function cooldownKey(activityId: string, targetId?: string): string {
  return targetId ? `${activityId}:${targetId}` : activityId;
}

// ─── Availability ───────────────────────────────────────────────────────────

export type Availability = { ok: true } | { ok: false; reason: string };

export function isActivityAvailable(
  a: Activity,
  character: Character,
  age: number,
  log: Record<string, number>,
  targetId?: string
): Availability {
  if (age < a.ageRange[0]) return { ok: false, reason: `Available at ${a.ageRange[0]}` };
  if (age > a.ageRange[1]) return { ok: false, reason: 'No longer available' };

  if (a.requiresTarget && !targetId) {
    return { ok: false, reason: 'No one to do this with' };
  }

  if (!meetsRequirements(a.requires, character)) {
    return { ok: false, reason: 'Not available right now' };
  }

  if (a.cost && (character.money ?? 0) < a.cost) {
    return { ok: false, reason: `Costs $${a.cost}` };
  }

  const key = cooldownKey(a.id, targetId);
  const last = log[key];
  if (last !== undefined) {
    if (a.cooldown === 'life') return { ok: false, reason: 'Already done' };
    // default cooldown is once per year
    if (last === age) return { ok: false, reason: 'Already done this year' };
  }

  return { ok: true };
}

// ─── Outcome Selection ──────────────────────────────────────────────────────

function effectiveWeight(o: ActivityOutcome, character: Character): number {
  const base = Math.max(0, o.weight);
  const mod = o.weightMod ? Math.max(0, o.weightMod(character)) : 1;
  return base * mod;
}

function pickOutcome(a: Activity, character: Character): ActivityOutcome {
  const pool = a.outcomes.filter((o) => meetsRequirements(o.requires, character));
  const candidates = pool.length > 0 ? pool : a.outcomes;

  const total = candidates.reduce((sum, o) => sum + effectiveWeight(o, character), 0);
  if (total <= 0) return candidates[0];

  let roll = Math.random() * total;
  for (const o of candidates) {
    roll -= effectiveWeight(o, character);
    if (roll <= 0) return o;
  }
  return candidates[candidates.length - 1];
}

// ─── Target Substitution ────────────────────────────────────────────────────
// Replace a '{target}' consequence key with the chosen relationship id so the
// closeness change lands on the right person.

function bindTarget(consequences: ConsequenceType[], targetId?: string): ConsequenceType[] {
  if (!targetId) return consequences;
  return consequences.map((c) =>
    'key' in c && c.key === '{target}' ? ({ ...c, key: targetId } as ConsequenceType) : c
  );
}

// ─── Resolve ────────────────────────────────────────────────────────────────

export interface ResolvedActivity {
  outcomeId: string;
  narrative: string; // already interpolated for {target}; caller interpolates the rest
  consequences: ConsequenceType[];
}

export function resolveActivity(
  a: Activity,
  character: Character,
  targetId?: string
): ResolvedActivity {
  const outcome = pickOutcome(a, character);

  const targetName = targetId ? character.relationships[targetId]?.name ?? 'them' : '';
  const narrative = targetId
    ? outcome.narrative.replace(/\{target\}/g, targetName)
    : outcome.narrative;

  const consequences: ConsequenceType[] = [];
  if (a.cost) consequences.push({ type: 'money', delta: -a.cost });
  consequences.push(...bindTarget(outcome.consequences, targetId));

  return { outcomeId: outcome.id, narrative, consequences };
}
