'use client';

import { useGameStore } from '../store/gameStore';
import type { Character } from '../engine/types';

export default function DeathScreen() {
  const { character, age, lifeEvents, goToTitle, goToNewGame } = useGameStore();

  // Count meaningful events
  const choicesMade = lifeEvents.filter((e) => e.isChoice).length;
  const yearsLived = age;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full flex flex-col gap-10">

        {/* Epitaph */}
        <div className="text-center flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-zinc-500 text-xs tracking-widest uppercase">End of Life</p>
            <h2 className="text-2xl font-light text-white">{character.name}</h2>
            <p className="text-zinc-400 text-sm">
              {character.birthYear} – {character.birthYear + yearsLived}
            </p>
            <p className="text-zinc-600 text-sm">{character.location}</p>
          </div>

          <div className="border-t border-zinc-800 pt-6">
            <p className="text-zinc-300 text-sm leading-relaxed italic">
              {getEpitaph(character, yearsLived)}
            </p>
          </div>
        </div>

        {/* Life stats */}
        <div className="flex justify-around border border-zinc-800 py-5">
          <div className="text-center">
            <p className="text-2xl font-light text-white">{yearsLived}</p>
            <p className="text-zinc-600 text-xs tracking-wider uppercase mt-1">Years</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-white">{lifeEvents.length}</p>
            <p className="text-zinc-600 text-xs tracking-wider uppercase mt-1">Events</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-white">{choicesMade}</p>
            <p className="text-zinc-600 text-xs tracking-wider uppercase mt-1">Choices</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={goToNewGame}
            className="w-full py-4 bg-white text-black text-sm font-medium tracking-widest uppercase hover:bg-zinc-200 transition-colors"
          >
            New Life
          </button>
          <button
            onClick={goToTitle}
            className="w-full py-4 border border-zinc-700 text-zinc-400 text-sm font-medium tracking-widest uppercase hover:border-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Title Screen
          </button>
        </div>

      </div>
    </div>
  );
}

function getEpitaph(character: Character, age: number): string {
  const f = character.flags;
  const has = (k: string) => Boolean(f[k]);

  // Died young — the shape of the life never fully arrived
  if (age < 35) {
    if (has('serious_partner') || has('married')) {
      return 'Gone far too soon. Loved someone fully in the time there was. That time was not enough, and it was not nothing.';
    }
    return 'Gone too soon. So much of it left unwritten. The promise of the life outlived the life itself.';
  }
  if (age < 55) {
    if (has('has_children')) {
      return 'Cut short in the middle of the work — raising people, building things. Left a mark in the ones who carry on.';
    }
    return 'Cut short before the third act. There was more to come. There always is.';
  }

  // Lived a full span — judge by what was built
  if (has('at_peace') && has('reviewed_life')) {
    return 'Reached the end and found it good. Made peace with the whole of it — the wins, the losses, the unrepeatable arc. Few manage that. They did.';
  }
  if (has('pursued_legacy') || (character.values.legacy ?? 0) >= 2) {
    return 'Built things meant to outlast the builder. The name will fade; the ripples will not. A life that reached beyond itself.';
  }
  if (has('reconciled')) {
    return 'Mended what could be mended before the end. Chose connection over pride when it counted most. Left fewer wounds open than they found.';
  }
  if (has('lost_partner')) {
    return 'Loved one person across most of a lifetime, and carried the loss of them with grace. A long, faithful, well-weathered life.';
  }
  if (has('divorced')) {
    return 'Lived honestly, even when honesty broke things. Refused to settle for a life that wasn\'t true. That kind of courage costs, and pays.';
  }
  if (has('has_children')) {
    return 'Made people and shaped them and let them go. The truest legacy there is — written into the ones who come after.';
  }
  if (character.familyStability === 'volatile' || character.familyStability === 'struggling') {
    return 'Built something solid from difficult ground. That takes a kind of strength that doesn\'t get named enough.';
  }
  if (age > 82) {
    return 'Outlasted most of the things that were supposed to stop them. A long life, honestly lived.';
  }
  return 'A life that mattered to the people who knew it. Which is most of what you can ask for.';
}
