import type { StatType } from '../../engine/types';

export type ConditionCategory = 'illness' | 'chronic' | 'mental' | 'addiction';

export interface ConditionDef {
  id: string;
  name: string;
  category: ConditionCategory;
  minAge: number;
  onsetWeight: number; // base likelihood relative to other eligible conditions
  yearly?: { stat: StatType; delta: number }[]; // applied each year while active
  fatalChance?: number; // per-year chance of death from it
  treatCost?: number;
  cureChance?: number; // chance a treatment clears it
  resolveChance?: number; // chance it clears on its own each year
  // Context gates/modifiers
  requiresFlag?: string; // only onsets if this flag is set (e.g. heavy drinking)
}

export const CONDITIONS: ConditionDef[] = [

  // ─── Acute illness (often self-resolves) ──────────────────────────────────
  {
    id: 'flu', name: 'the Flu', category: 'illness', minAge: 0, onsetWeight: 30,
    yearly: [{ stat: 'health', delta: -3 }, { stat: 'happiness', delta: -2 }],
    treatCost: 60, cureChance: 0.9, resolveChance: 0.7,
  },
  {
    id: 'mono', name: 'Mononucleosis', category: 'illness', minAge: 12, onsetWeight: 10,
    yearly: [{ stat: 'health', delta: -4 }, { stat: 'fitness', delta: -3 }],
    treatCost: 200, cureChance: 0.85, resolveChance: 0.5,
  },

  // ─── Mental health ────────────────────────────────────────────────────────
  {
    id: 'depression', name: 'Depression', category: 'mental', minAge: 12, onsetWeight: 16,
    yearly: [{ stat: 'happiness', delta: -6 }, { stat: 'health', delta: -1 }],
    treatCost: 1200, cureChance: 0.5, resolveChance: 0.1,
  },
  {
    id: 'anxiety', name: 'an Anxiety Disorder', category: 'mental', minAge: 12, onsetWeight: 14,
    yearly: [{ stat: 'happiness', delta: -4 }],
    treatCost: 1000, cureChance: 0.5, resolveChance: 0.15,
  },

  // ─── Addiction (needs a vice flag) ────────────────────────────────────────
  {
    id: 'alcoholism', name: 'Alcoholism', category: 'addiction', minAge: 16, onsetWeight: 40,
    requiresFlag: 'drinks_heavily',
    yearly: [{ stat: 'health', delta: -4 }, { stat: 'happiness', delta: -3 }, { stat: 'looks', delta: -2 }],
    fatalChance: 0.01, treatCost: 4000, cureChance: 0.45, resolveChance: 0.05,
  },

  // ─── Chronic / age-related (serious) ──────────────────────────────────────
  {
    id: 'diabetes', name: 'Type 2 Diabetes', category: 'chronic', minAge: 35, onsetWeight: 14,
    yearly: [{ stat: 'health', delta: -3 }],
    fatalChance: 0.01, treatCost: 2500, cureChance: 0.25, resolveChance: 0,
  },
  {
    id: 'heart_disease', name: 'Heart Disease', category: 'chronic', minAge: 45, onsetWeight: 12,
    yearly: [{ stat: 'health', delta: -5 }, { stat: 'fitness', delta: -3 }],
    fatalChance: 0.04, treatCost: 9000, cureChance: 0.3, resolveChance: 0,
  },
  {
    id: 'cancer', name: 'Cancer', category: 'chronic', minAge: 30, onsetWeight: 10,
    yearly: [{ stat: 'health', delta: -8 }, { stat: 'fitness', delta: -4 }],
    fatalChance: 0.12, treatCost: 25000, cureChance: 0.4, resolveChance: 0,
  },
];

export function getCondition(id: string): ConditionDef | undefined {
  return CONDITIONS.find((c) => c.id === id);
}
