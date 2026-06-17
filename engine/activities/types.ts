import type { Character, ConsequenceType, EligibilityReq, Relationship } from '../types';

// ─── Activities ─────────────────────────────────────────────────────────────
// Player-initiated actions taken within a year, before aging up. Each resolves
// immediately through applyConsequences — the same mutation path as events — so
// activities can move hidden systems (wounds, values, reputation), not just
// visible stats.

export type ActivityCategory =
  | 'mind_body'
  | 'love'
  | 'money'
  | 'social'
  | 'education'
  | 'vice'
  | 'crime';

export interface ActivityOutcome {
  id: string;
  weight: number; // relative probability within the activity
  // Optional contextual multiplier on weight (e.g. higher fitness → more likely
  // to make progress at the gym). Returns a factor applied to `weight`.
  weightMod?: (c: Character) => number;
  requires?: EligibilityReq; // outcome-level gate
  narrative: string; // interpolated; supports {target} for targeted activities
  consequences: ConsequenceType[]; // a key of '{target}' resolves to the chosen relationship
}

export interface Activity {
  id: string;
  category: ActivityCategory;
  label: string; // menu text; supports {target}
  blurb?: string; // one-line description for the menu
  ageRange: [number, number];
  cost?: number; // money deducted when performed
  cooldown?: 'year' | 'life'; // reuse limit; defaults to 'year'
  // If set, the player picks one living relationship of these types as the
  // target. The chosen id is substituted into '{target}' tokens and into any
  // consequence whose key is '{target}'.
  requiresTarget?: Relationship['type'][];
  requires?: EligibilityReq;
  outcomes: ActivityOutcome[];
}
