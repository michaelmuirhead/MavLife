// Social platforms. Join one, post each year to grow followers, and earn from
// monetization once you have an audience. Some carry reputation baggage.

export interface PlatformDef {
  id: string;
  name: string;
  emoji: string;
  minAge: number;
  payPerFollower: number; // annual $ earned per follower
  baseGain: number; // typical followers from a solid post
  viralChance: number; // base chance of a breakout post
  reputationCost?: boolean; // joining/posting carries a social stigma
}

export const PLATFORMS: PlatformDef[] = [
  {
    id: 'instagram', name: 'Instagram', emoji: '📷', minAge: 13,
    payPerFollower: 0.12, baseGain: 400, viralChance: 0.1,
  },
  {
    id: 'tiktok', name: 'TikTok', emoji: '🎵', minAge: 13,
    payPerFollower: 0.08, baseGain: 700, viralChance: 0.2,
  },
  {
    id: 'youtube', name: 'YouTube', emoji: '▶️', minAge: 13,
    payPerFollower: 0.3, baseGain: 250, viralChance: 0.08,
  },
  {
    id: 'twitch', name: 'Twitch', emoji: '🎮', minAge: 16,
    payPerFollower: 0.25, baseGain: 180, viralChance: 0.06,
  },
  {
    id: 'x', name: 'X', emoji: '🐦', minAge: 16,
    payPerFollower: 0.05, baseGain: 350, viralChance: 0.12,
  },
  {
    id: 'onlyfans', name: 'OnlyFans', emoji: '🔞', minAge: 18,
    payPerFollower: 0.6, baseGain: 220, viralChance: 0.07, reputationCost: true,
  },
];

export function getPlatform(id: string): PlatformDef | undefined {
  return PLATFORMS.find((p) => p.id === id);
}
