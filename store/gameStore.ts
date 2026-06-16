'use client';

import { create } from 'zustand';
import type { GameState, GamePhase, NewGameConfig, GameEvent, Choice, Character } from '../engine/types';
import { createCharacter } from '../engine/character';
import { applyConsequences } from '../engine/consequences';
import { selectEvent, interpolate } from '../engine/eventSelector';

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
  };
}

// ─── Store Interface ───────────────────────────────────────────────────────

interface GameStore extends GameState {
  // Phase transitions
  goToNewGame: () => void;
  startGame: (config: NewGameConfig) => void;
  goToTitle: () => void;

  // Core game loop
  tap: () => void;
  makeChoice: (choice: Choice) => void;

  // Settings
  setTapSpeed: (speed: GameState['tapSpeed']) => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const SAVE_KEY = 'lifespan_save';

function saveToStorage(state: GameState) {
  try {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        ...state,
        firedEventIds: Array.from(state.firedEventIds),
      })
    );
  } catch {
    // localStorage unavailable (SSR or private browsing)
  }
}

function loadFromStorage(): Partial<GameState> | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    parsed.firedEventIds = new Set(parsed.firedEventIds ?? []);
    return parsed;
  } catch {
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
    const character = createCharacter(config);
    const firedEventIds = new Set<string>();
    const age = 0;

    // Fire the birth event immediately
    const birthEvent = selectEvent(0, character, firedEventIds);
    const lifeEvents = birthEvent
      ? [{ id: birthEvent.id, age: 0, text: interpolate(birthEvent.narrative, character) }]
      : [];

    const newFiredIds = new Set(firedEventIds);
    let newCharacter = character;

    if (birthEvent) {
      newFiredIds.add(birthEvent.id);
      if (birthEvent.autoConsequences) {
        newCharacter = applyConsequences(character, birthEvent.autoConsequences);
      }
    }

    const newState: GameState = {
      phase: 'playing',
      character: newCharacter,
      age,
      lifeEvents,
      pendingEvent: null,
      firedEventIds: newFiredIds,
      tapSpeed: 1,
    };

    set(newState);
    saveToStorage(newState);
  },

  tap: () => {
    const state = get();
    if (state.phase !== 'playing') return;
    if (state.pendingEvent) return; // waiting for a choice

    const newAge = state.age + state.tapSpeed;

    // End of life at 90
    if (newAge >= 90) {
      const deathEvent = {
        id: 'death',
        age: newAge,
        text: `You died at ${newAge}.`,
      };
      const newState = {
        ...state,
        age: newAge,
        phase: 'dead' as GamePhase,
        lifeEvents: [...state.lifeEvents, deathEvent],
        pendingEvent: null,
      };
      set(newState);
      saveToStorage(newState);
      return;
    }

    // Apply natural aging to stats each year
    let newCharacter = applyNaturalAging(state.character, newAge, state.tapSpeed);

    // Select an event for this age
    const event = selectEvent(newAge, newCharacter, state.firedEventIds);

    const newFiredIds = new Set(state.firedEventIds);
    const newEvents = [...state.lifeEvents];

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
        `Age ${newAge}. An ordinary year.`,
        `Age ${newAge}. Nothing unusual.`,
        `Age ${newAge}. Time passed.`,
        `Age ${newAge}. Life continued.`,
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

  setTapSpeed: (speed) => {
    set({ tapSpeed: speed });
  },
}));

// ─── Load saved game on init ───────────────────────────────────────────────

export function loadSavedGame() {
  const saved = loadFromStorage();
  if (saved && saved.phase === 'playing') {
    useGameStore.setState(saved as GameState);
  }
}
