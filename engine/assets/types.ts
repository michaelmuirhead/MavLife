import type { AssetCategory, EligibilityReq } from '../types';

// ─── Assets ──────────────────────────────────────────────────────────────────
// Things to spend money on. Each has a price, annual upkeep, and a yearly value
// drift (homes appreciate, cars/pets depreciate). Some give a yearly stat
// effect — a pet's companionship, a sports car's vanity.

export interface AssetDef {
  id: string;
  name: string;
  category: AssetCategory;
  price: number;
  upkeep: number; // annual cost
  drift: number; // yearly value change as a fraction (+0.03 appreciates, -0.1 depreciates)
  ageRange?: [number, number];
  requires?: EligibilityReq;
  // Applied each year the asset is owned (e.g. a pet's happiness).
  yearlyEffect?: { stat: 'happiness' | 'health' | 'fitness' | 'looks'; delta: number };
}
