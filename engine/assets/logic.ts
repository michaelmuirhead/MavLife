import type { Character, OwnedAsset } from '../types';
import { meetsRequirements } from '../eventSelector';
import { getAssetDef, ASSET_CATALOG } from '../../content/assets/catalog';
import type { AssetDef } from './types';

export type AssetAvailability = { ok: true } | { ok: false; reason: string };

export function buyAvailability(def: AssetDef, character: Character, age: number): AssetAvailability {
  if (def.ageRange && (age < def.ageRange[0] || age > def.ageRange[1])) {
    return { ok: false, reason: 'Not available' };
  }
  if (!meetsRequirements(def.requires, character)) return { ok: false, reason: 'Not available' };
  if (character.money < def.price) return { ok: false, reason: `$${def.price.toLocaleString()}` };
  return { ok: true };
}

export function listForSale(character: Character, age: number): AssetDef[] {
  return ASSET_CATALOG.filter(
    (d) => !d.ageRange || (age >= d.ageRange[0] && age <= d.ageRange[1])
  );
}

let assetCounter = 0;
export function makeOwnedAsset(def: AssetDef, age: number): OwnedAsset {
  assetCounter += 1;
  return {
    instanceId: `${def.id}_${age}_${assetCounter}`,
    defId: def.id,
    name: def.name,
    category: def.category,
    purchasePrice: def.price,
    value: def.price,
    acquiredAge: age,
  };
}

// Resale returns the current value (less a small transaction haircut).
export function resaleValue(asset: OwnedAsset): number {
  return Math.round(asset.value * 0.9);
}

// ─── Yearly settlement (called from the tap loop) ─────────────────────────────
// Returns the net upkeep to deduct, the value-drifted asset list, and any
// per-year stat effects to apply.

export interface AssetYear {
  upkeep: number;
  assets: OwnedAsset[];
  statEffects: { stat: string; delta: number }[];
}

export function settleAssetYear(character: Character, years: number): AssetYear {
  let upkeep = 0;
  const statEffects: { stat: string; delta: number }[] = [];

  const assets = character.assets.map((a) => {
    const def = getAssetDef(a.defId);
    if (!def) return a;
    upkeep += def.upkeep * years;
    if (def.yearlyEffect) {
      statEffects.push({ stat: def.yearlyEffect.stat, delta: def.yearlyEffect.delta * years });
    }
    // Drift value, compounded per year, with a small floor.
    const drifted = a.value * Math.pow(1 + def.drift, years);
    return { ...a, value: Math.max(Math.round(def.price * 0.05), Math.round(drifted)) };
  });

  return { upkeep, assets, statEffects };
}

export function netWorth(character: Character): number {
  return character.money + character.assets.reduce((sum, a) => sum + a.value, 0);
}
