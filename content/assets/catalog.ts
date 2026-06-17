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

  // ─── Collectibles (appreciate; some passed to heirs) ──────────────────────
  {
    id: 'lucky_charm', name: 'a Lucky Charm', category: 'collectible',
    price: 500, upkeep: 0, drift: 0.0, ageRange: [6, 90],
    yearlyEffect: { stat: 'happiness', delta: 1 },
  },
  {
    id: 'designer_wardrobe', name: 'a Designer Wardrobe', category: 'collectible',
    price: 9000, upkeep: 0, drift: -0.04, ageRange: [16, 90],
    yearlyEffect: { stat: 'looks', delta: 2 },
  },
  {
    id: 'first_edition_book', name: 'a First-Edition Book', category: 'collectible',
    price: 4000, upkeep: 0, drift: 0.045, ageRange: [12, 90],
  },
  {
    id: 'antique_clock', name: 'an Antique Clock', category: 'collectible',
    price: 12000, upkeep: 0, drift: 0.035, ageRange: [18, 90],
  },
  {
    id: 'fine_art', name: 'a Fine Art Painting', category: 'collectible',
    price: 35000, upkeep: 0, drift: 0.06, ageRange: [21, 90],
  },
  {
    id: 'diamond_necklace', name: 'a Diamond Necklace', category: 'collectible',
    price: 28000, upkeep: 0, drift: 0.02, ageRange: [18, 90],
    yearlyEffect: { stat: 'looks', delta: 1 },
  },
  {
    id: 'rare_gemstone', name: 'a Rare Gemstone', category: 'collectible',
    price: 60000, upkeep: 0, drift: 0.05, ageRange: [21, 90],
  },
  {
    id: 'family_heirloom', name: 'a Family Heirloom', category: 'collectible',
    price: 20000, upkeep: 0, drift: 0.03, ageRange: [18, 90],
  },
];

export function getAssetDef(id: string): AssetDef | undefined {
  return ASSET_CATALOG.find((a) => a.id === id);
}
