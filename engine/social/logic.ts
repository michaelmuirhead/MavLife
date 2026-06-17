import type { Character, ConsequenceType } from '../types';
import { PLATFORMS, getPlatform, type PlatformDef } from '../../content/social/platforms';

export function joined(character: Character, id: string): boolean {
  return character.socials[id] !== undefined;
}

export function followers(character: Character, id: string): number {
  return character.socials[id] ?? 0;
}

export function totalFollowers(character: Character): number {
  return Object.values(character.socials).reduce((s, n) => s + n, 0);
}

// A 0–100 fame score from total following, on a log scale (1k≈25, 100k≈55, 10M≈90).
export function fameScore(character: Character): number {
  const f = totalFollowers(character);
  if (f < 1) return 0;
  return Math.min(100, Math.round(Math.log10(f) * 15));
}

export function fameTitle(score: number): string {
  if (score >= 80) return 'Global celebrity';
  if (score >= 60) return 'Famous';
  if (score >= 40) return 'Internet-famous';
  if (score >= 20) return 'Rising creator';
  if (score > 0) return 'Small following';
  return 'Unknown';
}

export function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}

// ─── Join ─────────────────────────────────────────────────────────────────────

export type Availability = { ok: true } | { ok: false; reason: string };

export function joinAvailability(def: PlatformDef, character: Character, age: number): Availability {
  if (joined(character, def.id)) return { ok: false, reason: 'Joined' };
  if (age < def.minAge) return { ok: false, reason: `Age ${def.minAge}+` };
  return { ok: true };
}

// ─── Posting ──────────────────────────────────────────────────────────────────

export interface PostOutcome {
  narrative: string;
  consequences: ConsequenceType[];
}

export function post(def: PlatformDef, character: Character): PostOutcome {
  const cur = followers(character, def.id);
  // Looks + charisma improve reach; a bigger audience compounds.
  const appeal = (character.stats.looks * 0.5 + character.stats.charisma * 0.5) / 100; // 0..1
  const audienceMult = 1 + cur / 5000;
  const viralChance = Math.min(0.5, def.viralChance + appeal * 0.15);

  const roll = Math.random();

  // Scandal — small, always-present risk
  if (roll < 0.08) {
    const lost = Math.round(cur * 0.25);
    return {
      narrative: `Your post on ${def.name} went wrong — taken out of context, screenshotted, passed around with commentary. You lost ${lost.toLocaleString()} followers and some sleep.`,
      consequences: [
        { type: 'social_followers', platform: def.id, delta: -lost },
        { type: 'stat', key: 'happiness', delta: -5 },
        { type: 'flag', key: 'had_scandal', value: true },
      ],
    };
  }

  if (roll < 0.08 + viralChance) {
    const gain = Math.round((def.baseGain * 20 + cur * 1.5) * (0.6 + Math.random()));
    return {
      narrative: `Your ${def.name} post broke out. The numbers climbed all day and didn't stop — ${gain.toLocaleString()} new followers, strangers in your replies, the strange vertigo of being seen.`,
      consequences: [
        { type: 'social_followers', platform: def.id, delta: gain },
        { type: 'stat', key: 'happiness', delta: 5 },
      ],
    };
  }

  // Ordinary post
  const gain = Math.max(5, Math.round(def.baseGain * audienceMult * (0.4 + appeal + Math.random() * 0.4)));
  return {
    narrative: `You posted on ${def.name}. It did its quiet work — ${gain.toLocaleString()} new followers, a few hundred likes, the small steady drip of an audience being built.`,
    consequences: [{ type: 'social_followers', platform: def.id, delta: gain }],
  };
}

// ─── Yearly monetization + organic drift ──────────────────────────────────────

export interface SocialYear {
  income: number;
  socials: Record<string, number>;
}

export function settleSocialYear(character: Character, years: number): SocialYear {
  let income = 0;
  const socials: Record<string, number> = {};
  for (const [id, count] of Object.entries(character.socials)) {
    const def = getPlatform(id);
    if (!def) { socials[id] = count; continue; }
    income += Math.round(count * def.payPerFollower) * years;
    // Followings drift down slightly without fresh posts.
    socials[id] = Math.max(0, Math.round(count * Math.pow(0.97, years)));
  }
  return { income, socials };
}

export { PLATFORMS };
