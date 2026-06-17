import type { Character, ConsequenceType } from '../types';
import { meetsRequirements } from '../eventSelector';
import { ALL_JOBS } from '../../content/career/jobs';
import type { Job } from './types';

const clamp01 = (n: number) => Math.max(0.05, Math.min(0.95, n));

function performance(character: Character): number {
  const p = character.flags['job_performance'];
  return typeof p === 'number' ? p : 50;
}

// ─── Eligibility ────────────────────────────────────────────────────────────

export type JobAvailability = { ok: true } | { ok: false; reason: string };

export function jobAvailability(job: Job, character: Character, age: number): JobAvailability {
  if (age < job.ageRange[0]) return { ok: false, reason: `Age ${job.ageRange[0]}+` };
  if (age > job.ageRange[1]) return { ok: false, reason: 'Too late' };
  if (!meetsRequirements(job.requires, character)) {
    // Surface the binding stat requirement, if any, for a useful hint.
    const need = job.requires?.minStat;
    if (need) {
      const parts = Object.entries(need).map(([k, v]) => `${k} ${v}+`);
      return { ok: false, reason: parts.join(', ') };
    }
    return { ok: false, reason: 'Not qualified' };
  }
  return { ok: true };
}

export function eligibleJobs(character: Character, age: number): Job[] {
  return ALL_JOBS.filter((j) => jobAvailability(j, character, age).ok)
    .sort((a, b) => a.baseSalary - b.baseSalary);
}

// ─── Hire chance ────────────────────────────────────────────────────────────

export function hireChance(job: Job, character: Character): number {
  const { smarts, charisma, looks } = character.stats;
  const merit = (smarts * 0.5 + charisma * 0.3 + looks * 0.2) / 100; // 0..1
  return clamp01(0.2 + merit * 0.7 - (job.difficulty ?? 0));
}

// ─── Actions (pure: return narrative + consequences) ──────────────────────────

export interface CareerOutcome {
  success: boolean;
  narrative: string;
  consequences: ConsequenceType[];
}

export function applyToJob(job: Job, character: Character): CareerOutcome {
  const success = Math.random() < hireChance(job, character);
  if (success) {
    return {
      success: true,
      narrative: `You applied to be a ${job.title.toLowerCase()}, and they said yes. A start at $${job.baseSalary.toLocaleString()} a year — not a fortune, but a door that opened.`,
      consequences: [
        { type: 'job', title: job.title, salary: job.baseSalary },
        { type: 'flag', key: 'job_performance', value: 50 },
        { type: 'flag', key: 'employed', value: true },
        // Marks an explicitly-chosen career job so the legacy narrative
        // occupation events stop firing and can't clobber this title.
        { type: 'flag', key: 'real_job', value: true },
        { type: 'stat', key: 'happiness', delta: 5 },
      ],
    };
  }
  return {
    success: false,
    narrative: `You applied to be a ${job.title.toLowerCase()}. The rejection, when it came, was polite and entirely forgettable, which somehow made it worse.`,
    consequences: [{ type: 'stat', key: 'happiness', delta: -3 }],
  };
}

export function workHarder(character: Character): CareerOutcome {
  const perf = Math.min(100, performance(character) + 15);
  return {
    success: true,
    narrative:
      'You put in the longer hours, took the work no one wanted, made yourself useful in ways people would remember at review time. The body felt it. So did the part of you that had wanted an evening.',
    consequences: [
      { type: 'flag', key: 'job_performance', value: perf },
      { type: 'stat', key: 'fitness', delta: -2 },
      { type: 'stat', key: 'happiness', delta: -2 },
      { type: 'value', key: 'ambition', delta: 1 },
    ],
  };
}

export function askForRaise(character: Character): CareerOutcome {
  const perf = performance(character);
  const chance = clamp01((perf * 0.6 + character.stats.charisma * 0.4) / 100);
  const success = Math.random() < chance;
  if (success) {
    const bump = Math.max(2000, Math.round(character.salary * 0.15));
    return {
      success: true,
      narrative: `You made your case for a raise, and — to your faint surprise — it worked. An extra $${bump.toLocaleString()} a year. You'd earned it; it was still strange to be told so.`,
      consequences: [
        { type: 'salary', delta: bump },
        { type: 'flag', key: 'job_performance', value: Math.max(0, perf - 25) },
        { type: 'stat', key: 'happiness', delta: 5 },
      ],
    };
  }
  return {
    success: false,
    narrative:
      'You asked for the raise. Your manager talked about budgets and timing and the word "soon," which you both knew meant nothing. You went back to your desk.',
    consequences: [{ type: 'stat', key: 'happiness', delta: -3 }],
  };
}

export function quitJob(character: Character): CareerOutcome {
  const title = character.occupation?.toLowerCase() ?? 'job';
  return {
    success: true,
    narrative: `You handed in your notice. Being a ${title} had taken something from you that a paycheck didn't quite replace. The relief was immediate; the worry came later.`,
    consequences: [
      { type: 'job', title: null, salary: 0 },
      { type: 'flag', key: 'employed', value: false },
      { type: 'stat', key: 'happiness', delta: 3 },
    ],
  };
}
