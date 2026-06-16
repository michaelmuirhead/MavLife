'use client';

import { useGameStore } from '../store/gameStore';

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
              {getEpitaph(character.familyClass, character.familyStability, yearsLived)}
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

function getEpitaph(
  familyClass: string,
  stability: string,
  age: number
): string {
  if (age < 40) return 'Gone too soon. Left things unfinished. Most people do.';
  if (stability === 'volatile' || stability === 'struggling') {
    return 'Built something from difficult ground. That takes a kind of strength that doesn\'t get named enough.';
  }
  if (familyClass === 'poor' || familyClass === 'working') {
    return 'Worked hard. Loved people. Made do with what was there. A life fully lived.';
  }
  if (age > 80) {
    return 'Outlasted most of the things that were supposed to stop them. A long life, honestly lived.';
  }
  return 'A life that mattered to the people who knew it. Which is most of what you can ask for.';
}
