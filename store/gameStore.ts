'use client';

import { create } from 'zustand';
import type { GameState, GamePhase, NewGameConfig, GameEvent, Choice, Character, StatType } from '../engine/types';
import { createCharacter } from '../engine/character';
import { applyConsequences } from '../engine/consequences';
import { selectEvent, interpolate } from '../engine/eventSelector';
import { getActivity } from '../content/activities';
import { isActivityAvailable, resolveActivity, cooldownKey } from '../engine/activities/resolve';
import { getJob } from '../content/career/jobs';
import { applyToJob, workHarder, askForRaise, quitJob, jobAvailability } from '../engine/career/logic';
import { getAssetDef } from '../content/assets/catalog';
import { buyAvailability, makeOwnedAsset, resaleValue, settleAssetYear, netWorth } from '../engine/assets/logic';
import {
  findLove, propose, haveChild,
  canFindLove, canPropose, canHaveChild,
  lineageSurname,
} from '../engine/relationships/logic';
import { randomGender } from '../content/names';
import { getProgram } from '../content/education';
import { enrollAvailability, enroll, graduate, dropOut, enrolledProgram, gradAge } from '../engine/education/logic';
import {
  conditionYearlyEffects, rollOnset, rollResolve, rollConditionDeath,
  treatAvailability, treat,
} from '../engine/health/logic';

// ─── Natural Aging ─────────────────────────────────────────────────────────
// Stats decline naturally with age. Players can slow this via events/choices.
// All deltas are per year — multiplied by tapSpeed.

function applyNaturalAging(character: Character, age: number, years: number): Character {
  const stats = { ...character.stats };

  // Health — gradual decline starts at 40, steeper at 65
  if (age > 65) {
    stats.health = Math.max(0, stats.health - 0.6 * years);
  } else if (age > 40) {
    stats.health = Math.max(0, stats.health - 0.25 * years);
  }

  // Looks — begins fading late 20s, accelerates at 45
  if (age > 45) {
    stats.looks = Math.max(0, stats.looks - 0.7 * years);
  } else if (age > 27) {
    stats.looks = Math.max(0, stats.looks - 0.35 * years);
  }

  // Fitness — starts declining in early 30s without maintenance
  if (age > 30) {
    stats.fitness = Math.max(0, stats.fitness - 0.3 * years);
  }

  // Smarts — peak in 30s, very slight decline after 70
  if (age > 70) {
    stats.smarts = Math.max(0, stats.smarts - 0.15 * years);
  }

  // Happiness and Charisma — fully event-driven, no natural decay

  return { ...character, stats };
}

// ─── Mortality ───────────────────────────────────────────────────────────
// Lives can end before 90. Risk rises steeply with age and is amplified by
// poor health. Health hitting zero is always fatal. Returns a cause string
// if the character dies this step, otherwise null.

function rollMortality(character: Character, age: number, years: number): string | null {
  const health = character.stats.health;

  // Total bodily failure
  if (health <= 0) {
    return age < 50 ? 'a sudden illness' : 'a body that finally gave out';
  }

  // Base yearly risk by age band
  let baseRisk: number;
  if (age < 40) baseRisk = 0.0008;
  else if (age < 50) baseRisk = 0.003;
  else if (age < 60) baseRisk = 0.007;
  else if (age < 70) baseRisk = 0.016;
  else if (age < 80) baseRisk = 0.04;
  else baseRisk = 0.1;

  // Poor health multiplies the risk (no effect at health ≥ 60, up to ~3x at 0)
  const healthMod = 1 + Math.max(0, 60 - health) / 30;
  const yearRisk = baseRisk * healthMod;

  // Compound the per-year risk across the tap's span
  const survival = Math.pow(1 - Math.min(0.95, yearRisk), years);
  if (Math.random() < 1 - survival) {
    return deathCause(age, health);
  }

  return null;
}

function deathCause(age: number, health: number): string {
  if (age < 35) {
    const causes = ['an accident', 'a sudden illness', 'something no one saw coming'];
    return causes[Math.floor(Math.random() * causes.length)];
  }
  if (age < 60) {
    const causes = health < 40
      ? ['a heart that had been warning you', 'an illness caught too late', 'years of wear catching up']
      : ['a sudden illness', 'an accident', 'a quiet failure of the body'];
    return causes[Math.floor(Math.random() * causes.length)];
  }
  const causes = ['old age', 'a long decline', 'the slow closing of things', 'a final, quiet morning'];
  return causes[Math.floor(Math.random() * causes.length)];
}

function deathNarrative(name: string, age: number, cause: string): string {
  return `At ${age}, ${name} died — ${cause}. The world went on, as it does, a little quieter for the absence.`;
}

// ─── Initial State ─────────────────────────────────────────────────────────

function emptyState(): Omit<GameState, 'phase'> {
  return {
    character: createCharacter({
      name: 'Unknown',
      gender: 'male',
      birthYear: 1990,
      location: 'Somewhere',
      familyClass: 'working',
      familyStability: 'stable',
    }),
    age: 0,
    lifeEvents: [],
    pendingEvent: null,
    firedEventIds: new Set(),
    tapSpeed: 1,
    activityLog: {},
    generation: 1,
  };
}

// Build a fresh 'playing' state for a new life: create the character, fire the
// birth event, and apply its consequences. Shared by a brand-new game and by
// continuing as an heir (which injects inherited money and a higher generation).
function freshPlayingState(
  config: NewGameConfig,
  opts: { startingMoney?: number; generation?: number } = {}
): GameState {
  let character = createCharacter(config);
  if (opts.startingMoney && opts.startingMoney > 0) {
    character = { ...character, money: opts.startingMoney };
  }

  const firedEventIds = new Set<string>();
  const birthEvent = selectEvent(0, character, firedEventIds);
  const lifeEvents = birthEvent
    ? [{ id: birthEvent.id, age: 0, text: interpolate(birthEvent.narrative, character) }]
    : [];

  if (birthEvent) {
    firedEventIds.add(birthEvent.id);
    if (birthEvent.autoConsequences) {
      character = applyConsequences(character, birthEvent.autoConsequences);
    }
  }

  return {
    phase: 'playing',
    character,
    age: 0,
    lifeEvents,
    pendingEvent: null,
    firedEventIds,
    tapSpeed: 1,
    activityLog: {},
    generation: opts.generation ?? 1,
  };
}

// ─── Store Interface ───────────────────────────────────────────────────────

interface GameStore extends GameState {
  // Phase transitions
  goToNewGame: () => void;
  startGame: (config: NewGameConfig) => void;
  continueAsHeir: () => void;
  goToTitle: () => void;

  // Core game loop
  tap: () => void;
  makeChoice: (choice: Choice) => void;
  performActivity: (activityId: string, targetId?: string) => void;

  // Career
  applyForJob: (jobId: string) => void;
  workHarder: () => void;
  askForRaise: () => void;
  quitJob: () => void;

  // Assets
  buyAsset: (defId: string) => void;
  sellAsset: (instanceId: string) => void;

  // Relationships
  findLove: () => void;
  propose: () => void;
  haveChild: () => void;

  // Education
  enroll: (programId: string) => void;
  dropOut: () => void;

  // Health
  treatCondition: (conditionId: string) => void;

  // Settings
  setTapSpeed: (speed: GameState['tapSpeed']) => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const SAVE_KEY = 'lifespan_save';
// Bump when the save shape changes so old, incompatible saves are discarded
// rather than restored (restoring a stale shape crashes the UI).
const SAVE_VERSION = 7;

const STAT_KEYS: StatType[] = ['health', 'happiness', 'looks', 'smarts', 'fitness', 'charisma'];

function saveToStorage(state: GameState) {
  try {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        ...state,
        version: SAVE_VERSION,
        firedEventIds: Array.from(state.firedEventIds),
      })
    );
  } catch {
    // localStorage unavailable (SSR or private browsing)
  }
}

// Validate that a parsed save matches the current schema. A mismatch (an old
// version, a corrupt blob, or a character missing its stats) must NOT be
// restored — doing so crashes the render. We discard it and start fresh.
function isValidSave(s: unknown): s is GameState {
  if (!s || typeof s !== 'object') return false;
  const o = s as Record<string, unknown>;
  if (o.version !== SAVE_VERSION) return false;
  if (typeof o.phase !== 'string' || typeof o.age !== 'number') return false;
  if (!Array.isArray(o.lifeEvents)) return false;
  if (!o.activityLog || typeof o.activityLog !== 'object') return false;
  if (typeof o.generation !== 'number') return false;

  const c = o.character as Record<string, unknown> | null | undefined;
  if (!c || typeof c !== 'object') return false;
  if (typeof c.name !== 'string') return false;
  if (typeof c.money !== 'number') return false;
  if (typeof c.salary !== 'number') return false;
  if (!Array.isArray(c.assets)) return false;
  if (!Array.isArray(c.conditions)) return false;
  if (!c.relationships || typeof c.relationships !== 'object') return false;
  if (!c.flags || typeof c.flags !== 'object') return false;

  const stats = c.stats as Record<string, unknown> | null | undefined;
  if (!stats || typeof stats !== 'object') return false;
  for (const k of STAT_KEYS) {
    if (typeof stats[k] !== 'number') return false;
  }
  return true;
}

function clearStorage() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}

function loadFromStorage(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidSave(parsed)) {
      clearStorage(); // drop incompatible/corrupt saves
      return null;
    }
    parsed.firedEventIds = new Set(parsed.firedEventIds ?? []);
    return parsed as GameState;
  } catch {
    clearStorage();
    return null;
  }
}

// ─── Store ─────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'title',
  ...emptyState(),

  goToTitle: () => {
    set({ phase: 'title', ...emptyState() });
  },

  goToNewGame: () => {
    set({ phase: 'new_game' });
  },

  startGame: (config: NewGameConfig) => {
    const newState = freshPlayingState(config);
    set(newState);
    saveToStorage(newState);
  },

  continueAsHeir: () => {
    const state = get();
    if (state.phase !== 'dead') return;
    const parent = state.character;
    const children = Object.values(parent.relationships).filter((r) => r.type === 'child');
    if (children.length === 0) return;

    const heir = children[0]; // eldest
    const estate = netWorth(parent);
    const inheritance = Math.round((estate * 0.6) / children.length);
    const cls =
      inheritance >= 800000 ? 'upper' :
      inheritance >= 200000 ? 'middle' :
      inheritance >= 40000 ? 'working' : 'poor';

    const genderFlag = heir.flags.find((f) => f.startsWith('gender:'));
    const gender = (genderFlag ? genderFlag.split(':')[1] : randomGender()) as Character['gender'];
    const bornFlag = heir.flags.find((f) => f.startsWith('born:'));
    const bornAge = bornFlag ? parseInt(bornFlag.split(':')[1], 10) : 25;

    const config: NewGameConfig = {
      name: `${heir.name} ${lineageSurname(parent)}`,
      gender,
      birthYear: parent.birthYear + bornAge,
      location: parent.location,
      familyClass: cls,
      familyStability: parent.familyStability,
    };

    const newState = freshPlayingState(config, {
      startingMoney: inheritance,
      generation: (state.generation ?? 1) + 1,
    });
    set(newState);
    saveToStorage(newState);
  },

  tap: () => {
    const state = get();
    if (state.phase !== 'playing') return;
    if (state.pendingEvent) return; // waiting for a choice

    const newAge = state.age + state.tapSpeed;

    // Apply natural aging to stats each year
    let newCharacter = applyNaturalAging(state.character, newAge, state.tapSpeed);

    // Pay out salary for the year(s) worked
    if (newCharacter.salary > 0) {
      newCharacter = {
        ...newCharacter,
        money: newCharacter.money + newCharacter.salary * state.tapSpeed,
      };
    }

    // Settle assets: upkeep, value drift, and any yearly stat effects
    if (newCharacter.assets.length > 0) {
      const ay = settleAssetYear(newCharacter, state.tapSpeed);
      newCharacter = {
        ...newCharacter,
        assets: ay.assets,
        money: Math.max(0, newCharacter.money - ay.upkeep),
      };
      if (ay.statEffects.length > 0) {
        newCharacter = applyConsequences(
          newCharacter,
          ay.statEffects.map((e) => ({ type: 'stat', key: e.stat as StatType, delta: e.delta }))
        );
      }
    }

    // Automatic life events that fire before the year's random event (e.g.
    // graduating once the program's end is reached).
    const preEvents: GameState['lifeEvents'] = [];
    const program = enrolledProgram(newCharacter);
    const ga = gradAge(newCharacter);
    if (program && ga !== undefined && newAge >= ga) {
      const grad = graduate(program);
      newCharacter = applyConsequences(newCharacter, grad.consequences);
      preEvents.push({
        id: `grad_${program.id}_${newAge}`,
        age: newAge,
        text: interpolate(grad.narrative, newCharacter),
        kind: 'activity',
      });
    }

    // Health: existing conditions drain stats; new ones may onset; mild ones
    // may clear. (Mortality from conditions is rolled below, after aging.)
    if (newCharacter.conditions.length > 0) {
      newCharacter = applyConsequences(newCharacter, conditionYearlyEffects(newCharacter, state.tapSpeed));
    }
    const onset = rollOnset(newCharacter, newAge, state.tapSpeed);
    if (onset) {
      newCharacter = applyConsequences(newCharacter, [{ type: 'condition_add', condition: onset }]);
      preEvents.push({
        id: `onset_${onset.id}_${newAge}`,
        age: newAge,
        text: `A diagnosis: ${onset.name}. The word landed differently than you'd have guessed — heavier, or lighter, but never neutral.`,
        kind: 'event',
      });
    }
    const resolved = rollResolve(newCharacter);
    if (resolved) {
      newCharacter = applyConsequences(newCharacter, [{ type: 'condition_remove', id: resolved.id }]);
      preEvents.push({
        id: `resolve_${resolved.id}_${newAge}`,
        age: newAge,
        text: `${resolved.name} eased and then was gone, the way some hard things quietly are, given time.`,
        kind: 'event',
      });
    }

    // Hard end of life at 90 — no one outlives it here
    if (newAge >= 90) {
      const deathEvent = {
        id: 'death',
        age: 90,
        text: deathNarrative(newCharacter.name, 90, 'the long arc finally complete'),
      };
      const newState = {
        ...state,
        age: 90,
        character: newCharacter,
        phase: 'dead' as GamePhase,
        lifeEvents: [...state.lifeEvents, ...preEvents, deathEvent],
        pendingEvent: null,
      };
      set(newState);
      saveToStorage(newState);
      return;
    }

    // Mortality check — lives can end early from age, poor health, or a
    // serious condition's complications
    const cause = rollMortality(newCharacter, newAge, state.tapSpeed)
      ?? rollConditionDeath(newCharacter, state.tapSpeed);
    if (cause) {
      const deathEvent = {
        id: 'death',
        age: newAge,
        text: deathNarrative(newCharacter.name, newAge, cause),
      };
      const newState = {
        ...state,
        age: newAge,
        character: newCharacter,
        phase: 'dead' as GamePhase,
        lifeEvents: [...state.lifeEvents, ...preEvents, deathEvent],
        pendingEvent: null,
      };
      set(newState);
      saveToStorage(newState);
      return;
    }

    // Select an event for this age
    const event = selectEvent(newAge, newCharacter, state.firedEventIds);

    const newFiredIds = new Set(state.firedEventIds);
    const newEvents = [...state.lifeEvents, ...preEvents];

    if (event) {
      newFiredIds.add(event.id);

      if (event.choices && event.choices.length > 0) {
        // Event has choices — hold it as pending
        newEvents.push({
          id: event.id,
          age: newAge,
          text: interpolate(event.narrative, newCharacter),
        });

        const newState: GameState = {
          ...state,
          age: newAge,
          character: newCharacter,
          lifeEvents: newEvents,
          pendingEvent: event,
          firedEventIds: newFiredIds,
        };
        set(newState);
        saveToStorage(newState);
        return;
      } else if (event.autoConsequences) {
        // Auto event — fire immediately
        newCharacter = applyConsequences(newCharacter, event.autoConsequences);
        newEvents.push({
          id: event.id,
          age: newAge,
          text: interpolate(event.narrative, newCharacter),
        });
      }
    } else {
      // No event this year — quiet year
      const quietTexts = [
        'An ordinary year. Nothing much happened.',
        'A quiet year. Time passed without event.',
        'Nothing unusual. Life simply continued.',
        'A calm stretch. The days went by.',
      ];
      newEvents.push({
        id: `quiet_${newAge}`,
        age: newAge,
        text: quietTexts[Math.floor(Math.random() * quietTexts.length)],
      });
    }

    const newState: GameState = {
      ...state,
      age: newAge,
      character: newCharacter,
      lifeEvents: newEvents,
      pendingEvent: null,
      firedEventIds: newFiredIds,
    };
    set(newState);
    saveToStorage(newState);
  },

  makeChoice: (choice: Choice) => {
    const state = get();
    if (state.phase !== 'playing' || !state.pendingEvent) return;

    const newCharacter = applyConsequences(state.character, choice.outcome.consequences);
    const choiceEvent = {
      id: `choice_${state.pendingEvent.id}`,
      age: state.age,
      text: interpolate(choice.outcome.narrative, state.character),
      isChoice: true,
    };

    const newState: GameState = {
      ...state,
      character: newCharacter,
      lifeEvents: [...state.lifeEvents, choiceEvent],
      pendingEvent: null,
    };
    set(newState);
    saveToStorage(newState);
  },

  performActivity: (activityId: string, targetId?: string) => {
    const state = get();
    if (state.phase !== 'playing' || state.pendingEvent) return;

    const activity = getActivity(activityId);
    if (!activity) return;

    // Re-check availability server-side of the UI — the menu greys out
    // ineligible activities, but never trust that alone.
    const avail = isActivityAvailable(activity, state.character, state.age, state.activityLog, targetId);
    if (!avail.ok) return;

    const { narrative, consequences } = resolveActivity(activity, state.character, targetId);
    const newCharacter = applyConsequences(state.character, consequences);

    const activityEvent = {
      id: `act_${activityId}_${state.age}_${state.lifeEvents.length}`,
      age: state.age,
      text: interpolate(narrative, newCharacter),
      kind: 'activity' as const,
    };

    const newState: GameState = {
      ...state,
      character: newCharacter,
      lifeEvents: [...state.lifeEvents, activityEvent],
      activityLog: {
        ...state.activityLog,
        [cooldownKey(activityId, targetId)]: state.age,
      },
    };
    set(newState);
    saveToStorage(newState);
  },

  applyForJob: (jobId: string) => {
    const state = get();
    if (state.phase !== 'playing' || state.pendingEvent) return;
    const job = getJob(jobId);
    if (!job) return;
    if (!jobAvailability(job, state.character, state.age).ok) return;

    const outcome = applyToJob(job, state.character);
    commitOutcome(set, get, 'career', outcome.narrative, outcome.consequences);
  },

  workHarder: () => {
    const state = get();
    if (state.phase !== 'playing' || state.pendingEvent) return;
    if (!state.character.occupation) return;
    if (state.character.flags['worked_harder_year'] === state.age) return; // once/year

    const outcome = workHarder(state.character);
    commitOutcome(set, get, 'career', outcome.narrative, [
      ...outcome.consequences,
      { type: 'flag', key: 'worked_harder_year', value: state.age },
    ]);
  },

  askForRaise: () => {
    const state = get();
    if (state.phase !== 'playing' || state.pendingEvent) return;
    if (!state.character.occupation) return;
    if (state.character.flags['raise_asked_year'] === state.age) return; // once/year

    const outcome = askForRaise(state.character);
    commitOutcome(set, get, 'career', outcome.narrative, [
      ...outcome.consequences,
      { type: 'flag', key: 'raise_asked_year', value: state.age },
    ]);
  },

  quitJob: () => {
    const state = get();
    if (state.phase !== 'playing' || state.pendingEvent) return;
    if (!state.character.occupation) return;

    const outcome = quitJob(state.character);
    commitOutcome(set, get, 'career', outcome.narrative, outcome.consequences);
  },

  buyAsset: (defId: string) => {
    const state = get();
    if (state.phase !== 'playing' || state.pendingEvent) return;
    const def = getAssetDef(defId);
    if (!def) return;
    if (!buyAvailability(def, state.character, state.age).ok) return;

    const owned = makeOwnedAsset(def, state.age);
    commitOutcome(
      set, get, 'asset',
      `You bought ${def.name}. $${def.price.toLocaleString()} lighter, and something to show for it — for better or worse.`,
      [
        { type: 'money', delta: -def.price },
        { type: 'asset_add', asset: owned },
      ]
    );
  },

  sellAsset: (instanceId: string) => {
    const state = get();
    if (state.phase !== 'playing' || state.pendingEvent) return;
    const asset = state.character.assets.find((a) => a.instanceId === instanceId);
    if (!asset) return;

    const cash = resaleValue(asset);
    commitOutcome(
      set, get, 'asset',
      `You sold ${asset.name} for $${cash.toLocaleString()}. The number was lower than you remembered paying. It usually is.`,
      [
        { type: 'money', delta: cash },
        { type: 'asset_remove', instanceId },
      ]
    );
  },

  findLove: () => {
    const state = get();
    if (state.phase !== 'playing' || state.pendingEvent) return;
    if (!canFindLove(state.character, state.age).ok) return;
    const outcome = findLove(state.character, state.age);
    commitOutcome(set, get, 'love', outcome.narrative, outcome.consequences);
  },

  propose: () => {
    const state = get();
    if (state.phase !== 'playing' || state.pendingEvent) return;
    if (!canPropose(state.character, state.age).ok) return;
    const outcome = propose(state.character);
    commitOutcome(set, get, 'love', outcome.narrative, outcome.consequences);
  },

  haveChild: () => {
    const state = get();
    if (state.phase !== 'playing' || state.pendingEvent) return;
    if (!canHaveChild(state.character, state.age).ok) return;
    if (state.character.flags['tried_child_year'] === state.age) return; // once/year
    const outcome = haveChild(state.character, state.age);
    commitOutcome(set, get, 'family', outcome.narrative, [
      ...outcome.consequences,
      { type: 'flag', key: 'tried_child_year', value: state.age },
    ]);
  },

  enroll: (programId: string) => {
    const state = get();
    if (state.phase !== 'playing' || state.pendingEvent) return;
    const program = getProgram(programId);
    if (!program) return;
    if (!enrollAvailability(program, state.character, state.age).ok) return;
    const outcome = enroll(program, state.age);
    commitOutcome(set, get, 'edu', outcome.narrative, outcome.consequences);
  },

  dropOut: () => {
    const state = get();
    if (state.phase !== 'playing' || state.pendingEvent) return;
    const program = enrolledProgram(state.character);
    if (!program) return;
    const outcome = dropOut(program);
    commitOutcome(set, get, 'edu', outcome.narrative, outcome.consequences);
  },

  treatCondition: (conditionId: string) => {
    const state = get();
    if (state.phase !== 'playing' || state.pendingEvent) return;
    const active = state.character.conditions.find((c) => c.id === conditionId);
    if (!active) return;
    if (!treatAvailability(active, state.character).ok) return;
    const outcome = treat(active, state.character);
    commitOutcome(set, get, 'health', outcome.narrative, outcome.consequences);
  },

  setTapSpeed: (speed) => {
    set({ tapSpeed: speed });
  },
}));

// Apply a player action's consequences and append its narrative to the feed.
// Shared by career, asset, relationship and health actions.
function commitOutcome(
  set: (partial: Partial<GameState>) => void,
  get: () => GameState,
  prefix: string,
  narrative: string,
  consequences: Parameters<typeof applyConsequences>[1]
) {
  const state = get();
  const newCharacter = applyConsequences(state.character, consequences);
  const event = {
    id: `${prefix}_${state.age}_${state.lifeEvents.length}`,
    age: state.age,
    text: interpolate(narrative, newCharacter),
    kind: 'activity' as const,
  };
  const newState: GameState = {
    ...state,
    character: newCharacter,
    lifeEvents: [...state.lifeEvents, event],
  };
  set(newState);
  saveToStorage(newState);
}

// ─── Load saved game on init ───────────────────────────────────────────────

export function loadSavedGame() {
  const saved = loadFromStorage();
  if (saved && saved.phase === 'playing') {
    useGameStore.setState(saved);
  }
}
