'use client';

import { useGameStore } from '../store/gameStore';
import type { Character } from '../engine/types';
import { netWorth } from '../engine/assets/logic';
import { totalFollowers, fameScore, fameTitle, formatFollowers } from '../engine/social/logic';

const DEGREE_RIBBONS: { flag: string; label: string }[] = [
  { flag: 'med_degree', label: 'MD' },
  { flag: 'law_degree', label: 'JD' },
  { flag: 'grad_degree', label: 'Grad' },
  { flag: 'college_degree', label: 'BA' },
  { flag: 'associate_degree', label: 'AA' },
];

function ribbons(character: Character): string[] {
  const out: string[] = [];
  const worth = netWorth(character);
  if (character.occupation) out.push(`💼 ${character.occupation}`);
  const degree = DEGREE_RIBBONS.find((d) => character.flags[d.flag]);
  if (degree) out.push(`🎓 ${degree.label}`);
  if (worth >= 1000) out.push(`💰 $${worth.toLocaleString()} net worth`);
  const kids = Object.values(character.relationships).filter((r) => r.type === 'child').length;
  if (kids > 0) out.push(`🧒 ${kids} ${kids === 1 ? 'child' : 'children'}`);
  if (character.flags['married']) out.push('💍 Married');
  const fans = totalFollowers(character);
  if (fans >= 1000) out.push(`📱 ${fameTitle(fameScore(character))} (${formatFollowers(fans)})`);
  if (character.assets.length > 0) out.push(`🏠 ${character.assets.length} ${character.assets.length === 1 ? 'asset' : 'assets'}`);
  if (character.flags['criminal_record']) out.push('🕶️ Criminal record');
  return out;
}

export default function DeathScreen() {
  const { character, age, lifeEvents, generation, goToTitle, goToNewGame, continueAsHeir } = useGameStore();

  // Count meaningful events
  const choicesMade = lifeEvents.filter((e) => e.isChoice).length;
  const yearsLived = age;

  const heirs = Object.values(character.relationships).filter((r) => r.type === 'child');
  const hasHeir = heirs.length > 0;

  return (
    <div className="brick-bg min-h-screen flex flex-col max-w-md mx-auto shadow-2xl">

      {/* Red banner */}
      <div className="bg-[#e8392f] pt-12 pb-8 px-6 shadow-md flex flex-col items-center">
        <div className="text-5xl mb-2">🪦</div>
        <p className="text-white/85 text-xs font-extrabold tracking-[0.3em] uppercase">
          {generation > 1 ? `Generation ${generation}` : 'Game Over'}
        </p>
        <h2 className="text-white font-black text-3xl mt-1">{character.name}</h2>
        <p className="text-white/85 text-sm font-bold mt-0.5">
          {character.birthYear} – {character.birthYear + yearsLived}
        </p>
        <p className="text-white/70 text-xs font-bold">{character.location}</p>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 gap-6 py-8">

        {/* Epitaph */}
        <div className="bg-white rounded-2xl shadow-md px-5 py-5 border border-[#e0e0e0]">
          <p className="text-[#444] text-[15px] leading-relaxed italic text-center">
            {getEpitaph(character, yearsLived)}
          </p>
        </div>

        {/* Ribbons — what the life amounted to */}
        {ribbons(character).length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {ribbons(character).map((r) => (
              <span key={r} className="text-[11px] font-extrabold bg-white text-[#555] rounded-full px-2.5 py-1 shadow-sm border border-[#e0e0e0]">
                {r}
              </span>
            ))}
          </div>
        )}

        {/* Life stats */}
        <div className="flex justify-around bg-white rounded-2xl shadow-md py-5 border border-[#e0e0e0]">
          <div className="text-center">
            <p className="text-3xl font-black text-[#1f86d8]">{yearsLived}</p>
            <p className="text-[#9a9a9a] text-[10px] font-extrabold tracking-wider uppercase mt-1">Years</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-[#46b93a]">{lifeEvents.length}</p>
            <p className="text-[#9a9a9a] text-[10px] font-extrabold tracking-wider uppercase mt-1">Events</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-[#e8392f]">{choicesMade}</p>
            <p className="text-[#9a9a9a] text-[10px] font-extrabold tracking-wider uppercase mt-1">Choices</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          {hasHeir && (
            <button
              onClick={continueAsHeir}
              className="btn-3d w-full py-4 bg-[#1f86d8] border-[#176bb0] text-white text-base font-extrabold tracking-wide uppercase rounded-2xl shadow-lg hover:bg-[#2a93e5]"
            >
              Continue as {heirs[0].name}
            </button>
          )}
          <button
            onClick={goToNewGame}
            className="btn-3d w-full py-4 bg-[#46b93a] border-[#34972b] text-white text-base font-extrabold tracking-wide uppercase rounded-2xl shadow-lg hover:bg-[#4ec441]"
          >
            New Life
          </button>
          <button
            onClick={goToTitle}
            className="btn-3d w-full py-4 bg-white border-[#cfcfcf] text-[#1f86d8] text-base font-extrabold tracking-wide uppercase rounded-2xl shadow hover:bg-[#f5faff]"
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
