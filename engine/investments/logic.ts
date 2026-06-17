import type { Character, Investment } from '../types';
import { getInstrument } from '../../content/investments/catalog';

// Drift every holding by one year's (or several years') return. A holding can
// fall but never below zero.
export function settleInvestmentYear(character: Character, years: number): Investment[] {
  return character.investments.map((h) => {
    const def = getInstrument(h.defId);
    if (!def) return h;
    let value = h.value;
    for (let y = 0; y < years; y++) {
      const ret = def.mean + (Math.random() * 2 - 1) * def.vol;
      value = Math.max(0, value * (1 + ret));
    }
    return { ...h, value: Math.round(value) };
  });
}

export function portfolioValue(character: Character): number {
  return character.investments.reduce((sum, h) => sum + h.value, 0);
}

export function holdingValue(character: Character, defId: string): number {
  return character.investments.find((h) => h.defId === defId)?.value ?? 0;
}
