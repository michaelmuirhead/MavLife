import type { AssetDef } from '../../engine/assets/types';

export const ASSET_CATALOG: AssetDef[] = [

  // ─── Homes (appreciate, real upkeep) ──────────────────────────────────────
  {
    id: 'studio_apartment', name: 'Studio Apartment', category: 'home',
    price: 90000, upkeep: 4000, drift: 0.03, ageRange: [18, 90],
    yearlyEffect: { stat: 'happiness', delta: 1 },
  },
  {
    id: 'townhouse', name: 'Townhouse', category: 'home',
    price: 240000, upkeep: 8000, drift: 0.035, ageRange: [21, 90],
    yearlyEffect: { stat: 'happiness', delta: 2 },
  },
  {
    id: 'family_house', name: 'Family House', category: 'home',
    price: 420000, upkeep: 12000, drift: 0.04, ageRange: [24, 90],
    yearlyEffect: { stat: 'happiness', delta: 3 },
  },
  {
    id: 'lake_house', name: 'Lake House', category: 'home',
    price: 850000, upkeep: 22000, drift: 0.045, ageRange: [30, 90],
    yearlyEffect: { stat: 'happiness', delta: 4 },
  },

  // ─── Vehicles (depreciate) ────────────────────────────────────────────────
  {
    id: 'used_sedan', name: 'Used Sedan', category: 'vehicle',
    price: 9000, upkeep: 1500, drift: -0.12, ageRange: [16, 90],
  },
  {
    id: 'new_hatchback', name: 'New Hatchback', category: 'vehicle',
    price: 26000, upkeep: 2200, drift: -0.14, ageRange: [18, 90],
  },
  {
    id: 'sports_car', name: 'Sports Car', category: 'vehicle',
    price: 78000, upkeep: 5000, drift: -0.1, ageRange: [21, 90],
    yearlyEffect: { stat: 'looks', delta: 1 },
  },

  // ─── Pets (companionship; small upkeep) ───────────────────────────────────
  {
    id: 'cat', name: 'a Cat', category: 'pet',
    price: 200, upkeep: 600, drift: -0.05, ageRange: [6, 90],
    yearlyEffect: { stat: 'happiness', delta: 2 },
  },
  {
    id: 'dog', name: 'a Dog', category: 'pet',
    price: 800, upkeep: 1200, drift: -0.05, ageRange: [6, 90],
    yearlyEffect: { stat: 'happiness', delta: 3 },
  },

  // ─── Luxury (status; depreciate hard) ─────────────────────────────────────
  {
    id: 'designer_watch', name: 'a Designer Watch', category: 'luxury',
    price: 18000, upkeep: 0, drift: -0.03, ageRange: [18, 90],
    yearlyEffect: { stat: 'looks', delta: 1 },
  },
  {
    id: 'sailboat', name: 'a Sailboat', category: 'luxury',
    price: 140000, upkeep: 9000, drift: -0.08, ageRange: [25, 90],
    yearlyEffect: { stat: 'happiness', delta: 2 },
  },
];

export function getAssetDef(id: string): AssetDef | undefined {
  return ASSET_CATALOG.find((a) => a.id === id);
}
