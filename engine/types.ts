// ─── Core Character Types ──────────────────────────────────────────────────

export type StatType =
  | 'health'
  | 'happiness'
  | 'looks'
  | 'smarts'
  | 'fitness'
  | 'charisma';

export type WoundType =
  | 'abandonment'
  | 'powerlessness'
  | 'shame'
  | 'rejection'
  | 'loss'
  | 'suppression';

export type ValueType =
  | 'ambition'
  | 'connection'
  | 'security'
  | 'freedom'
  | 'justice'
  | 'honesty'
  | 'meaning'
  | 'legacy';

export type DesireType =
  | 'love'
  | 'status'
  | 'meaning'
  | 'pleasure'
  | 'legacy'
  | 'survival';

export type FamilyClass = 'poor' | 'working' | 'middle' | 'upper';
export type FamilyStability = 'volatile' | 'struggling' | 'stable' | 'strong';
export type IncomeLevel = 'none' | 'low' | 'medium' | 'high' | 'wealthy';

export type AssetCategory = 'home' | 'vehicle' | 'pet' | 'luxury';

// An owned instance of an asset (the catalog definition lives in content/assets).
export interface OwnedAsset {
  instanceId: string;
  defId: string;
  name: string;
  category: AssetCategory;
  purchasePrice: number;
  value: number; // current resale value; drifts each year
  acquiredAge: number;
}

export interface Relationship {
  id: string;
  name: string;
  type: 'mother' | 'father' | 'sibling' | 'friend' | 'romantic' | 'rival' | 'mentor' | 'colleague';
  closeness: number; // -5 to 5
  alive: boolean;
  flags: string[];
}

export interface Character {
  name: string;
  birthYear: number;
  location: string;
  gender: 'male' | 'female' | 'nonbinary';

  // Visible stats — shown to player as bars (0–100)
  stats: Record<StatType, number>;

  // Internal systems — never shown to player
  wounds: Partial<Record<WoundType, number>>;
  values: Partial<Record<ValueType, number>>;
  desires: DesireType[];
  relationships: Record<string, Relationship>;
  flags: Record<string, boolean | string | number>;
  reputation: Record<string, number>;

  // Background
  familyClass: FamilyClass;
  familyStability: FamilyStability;

  // Current state
  occupation: string | null;
  income: IncomeLevel;
  money: number; // bank balance; clamped at 0, never negative for now
  salary: number; // annual income from current job; 0 if unemployed
  assets: OwnedAsset[];
}

// ─── Event System ─────────────────────────────────────────────────────────

export type ConsequenceType =
  | { type: 'stat'; key: StatType; delta: number }
  | { type: 'wound'; key: WoundType; delta: number }
  | { type: 'value'; key: ValueType; delta: number }
  | { type: 'flag'; key: string; value: boolean | string | number }
  | { type: 'relationship_closeness'; key: string; delta: number }
  | { type: 'relationship_add'; relationship: Relationship }
  | { type: 'occupation'; value: string }
  | { type: 'income'; value: IncomeLevel }
  | { type: 'money'; delta: number }
  | { type: 'job'; title: string | null; salary: number }
  | { type: 'salary'; delta: number }
  | { type: 'asset_add'; asset: OwnedAsset }
  | { type: 'asset_remove'; instanceId: string };

// ─── Shared Eligibility ────────────────────────────────────────────────────
// Used to gate both events and activities (and individual activity outcomes).

export interface EligibilityReq {
  flags?: string[];
  notFlags?: string[];
  familyClass?: FamilyClass[];
  familyStability?: FamilyStability[];
  minWound?: Partial<Record<WoundType, number>>;
  minStat?: Partial<Record<StatType, number>>;
  maxStat?: Partial<Record<StatType, number>>;
  minMoney?: number;
  hasRelationshipType?: Relationship['type'][];
}

export interface Choice {
  text: string;
  outcome: {
    narrative: string;
    consequences: ConsequenceType[];
  };
}

export interface GameEvent {
  id: string;
  ageRange: [number, number];
  weight: 'consequence' | 'chaos';
  requires?: EligibilityReq;
  narrative: string;
  choices?: Choice[];
  autoConsequences?: ConsequenceType[];
}

// ─── Game State ────────────────────────────────────────────────────────────

export type GamePhase = 'title' | 'new_game' | 'playing' | 'dead';

export interface LifeEvent {
  id: string;
  age: number;
  text: string;
  isChoice?: boolean;
  kind?: 'event' | 'choice' | 'activity';
}

export interface GameState {
  phase: GamePhase;
  character: Character;
  age: number;
  lifeEvents: LifeEvent[];
  pendingEvent: GameEvent | null;
  firedEventIds: Set<string>;
  tapSpeed: 1 | 2 | 4; // years per tap
  // activityId (or `activityId:targetId`) -> age last performed, for cooldowns
  activityLog: Record<string, number>;
}

// ─── New Game Config ───────────────────────────────────────────────────────

export interface NewGameConfig {
  name: string;
  gender: Character['gender'];
  birthYear: number;
  location: string;
  familyClass: FamilyClass;
  familyStability: FamilyStability;
}
