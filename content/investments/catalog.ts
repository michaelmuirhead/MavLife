// Investment instruments. Each year every holding's value drifts by a random
// return drawn around its mean with its volatility — safe instruments barely
// move, crypto can double or halve. Settlement happens in the tap loop.

export interface InvestmentDef {
  id: string;
  name: string;
  blurb: string;
  mean: number; // average annual return (fraction)
  vol: number; // volatility (max swing around the mean)
  minAge: number;
  minBuy: number; // smallest sensible position
}

export const INSTRUMENTS: InvestmentDef[] = [
  {
    id: 'savings', name: 'Savings Account', blurb: 'Safe and slow. Barely beats nothing.',
    mean: 0.02, vol: 0.005, minAge: 16, minBuy: 100,
  },
  {
    id: 'bonds', name: 'Government Bonds', blurb: 'Dull, dependable, rarely loses.',
    mean: 0.04, vol: 0.02, minAge: 18, minBuy: 500,
  },
  {
    id: 'index_fund', name: 'Index Fund', blurb: 'The whole market, steady over decades.',
    mean: 0.07, vol: 0.12, minAge: 18, minBuy: 1000,
  },
  {
    id: 'reit', name: 'Real Estate Fund', blurb: 'Property without the plumbing.',
    mean: 0.09, vol: 0.18, minAge: 18, minBuy: 2000,
  },
  {
    id: 'tech_stocks', name: 'Tech Stocks', blurb: 'Big upside, real stomach required.',
    mean: 0.11, vol: 0.30, minAge: 18, minBuy: 1000,
  },
  {
    id: 'crypto', name: 'Crypto', blurb: 'To the moon, or to the floor.',
    mean: 0.18, vol: 0.70, minAge: 18, minBuy: 500,
  },
];

export function getInstrument(id: string): InvestmentDef | undefined {
  return INSTRUMENTS.find((i) => i.id === id);
}
