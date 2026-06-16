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
  | 'meaning';

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
  | { type: 'income'; value: IncomeLevel };

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
  requires?: {
    flags?: string[];
    notFlags?: string[];
    familyClass?: FamilyClass[];
    familyStability?: FamilyStability[];
    minWound?: Partial<Record<WoundType, number>>;
  };
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
}

export interface GameState {
  phase: GamePhase;
  character: Character;
  age: number;
  lifeEvents: LifeEvent[];
  pendingEvent: GameEvent | null;
  firedEventIds: Set<string>;
  tapSpeed: 1 | 2 | 4; // years per tap
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
