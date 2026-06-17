import type { Character, ConsequenceType } from '../types';
import { PROGRAMS, getProgram, type Program } from '../../content/education';

export function enrolledProgram(character: Character): Program | undefined {
  const id = character.flags['enrolled_program'];
  return typeof id === 'string' ? getProgram(id) : undefined;
}

export function gradAge(character: Character): number | undefined {
  const g = character.flags['grad_age'];
  return typeof g === 'number' ? g : undefined;
}

export type Availability = { ok: true } | { ok: false; reason: string };

export function enrollAvailability(p: Program, character: Character, age: number): Availability {
  if (enrolledProgram(character)) return { ok: false, reason: 'Already enrolled' };
  if (character.flags[p.degreeFlag]) return { ok: false, reason: 'Already earned' };
  if (age < p.minAge) return { ok: false, reason: `Age ${p.minAge}+` };
  if (p.requiresFlag && !character.flags[p.requiresFlag]) {
    const need = PROGRAMS.find((q) => q.degreeFlag === p.requiresFlag);
    return { ok: false, reason: `Needs ${need ? need.name : p.requiresFlag}` };
  }
  if (character.money < p.tuition) return { ok: false, reason: `$${p.tuition.toLocaleString()}` };
  return { ok: true };
}

export function enroll(p: Program, age: number): { narrative: string; consequences: ConsequenceType[] } {
  return {
    narrative: `You enrolled at ${p.name}. Tuition of $${p.tuition.toLocaleString()} and ${p.years} years of your life, wagered on a version of yourself you hadn't met yet.`,
    consequences: [
      { type: 'money', delta: -p.tuition },
      { type: 'flag', key: 'enrolled_program', value: p.id },
      { type: 'flag', key: 'grad_age', value: age + p.years },
    ],
  };
}

// Called from the tap loop once the graduation age is reached.
export function graduate(p: Program): { narrative: string; consequences: ConsequenceType[] } {
  return {
    narrative: `You graduated from ${p.name}. The ceremony was long and the gown unflattering, but the thing under it — what you now knew, what you could now do — was real.`,
    consequences: [
      { type: 'flag', key: p.degreeFlag, value: true },
      { type: 'flag', key: 'enrolled_program', value: false },
      { type: 'flag', key: 'grad_age', value: 0 },
      { type: 'stat', key: 'smarts', delta: p.smartsBoost },
      { type: 'stat', key: 'happiness', delta: 5 },
    ],
  };
}

export function dropOut(p: Program): { narrative: string; consequences: ConsequenceType[] } {
  return {
    narrative: `You dropped out of ${p.name}. Maybe it wasn't for you; maybe the timing was wrong. The tuition didn't come back, but your evenings did.`,
    consequences: [
      { type: 'flag', key: 'enrolled_program', value: false },
      { type: 'flag', key: 'grad_age', value: 0 },
      { type: 'stat', key: 'happiness', delta: -3 },
    ],
  };
}
