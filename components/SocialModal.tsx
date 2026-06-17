'use client';

import { useGameStore } from '../store/gameStore';
import { PLATFORMS } from '../content/social/platforms';
import {
  joinAvailability, joined, followers, totalFollowers,
  fameScore, fameTitle, formatFollowers,
} from '../engine/social/logic';
import { MenuShell, MenuSection } from './Menu';

export default function SocialModal({ onClose }: { onClose: () => void }) {
  const character = useGameStore((s) => s.character);
  const age = useGameStore((s) => s.age);
  const join = useGameStore((s) => s.joinPlatform);
  const post = useGameStore((s) => s.postContent);

  const fame = fameScore(character);
  const total = totalFollowers(character);

  const mine = PLATFORMS.filter((p) => joined(character, p.id));
  const available = PLATFORMS.filter((p) => !joined(character, p.id));

  function act(fn: () => void) { fn(); onClose(); }

  return (
    <MenuShell title="Social Media" balance={`${formatFollowers(total)} followers`} onClose={onClose}>
      <MenuSection label={`${fameTitle(fame)} · Fame ${fame}/100`} />

      <div className="px-3 py-3 flex flex-col gap-3">
        {/* Your channels */}
        {mine.length > 0 && (
          <div>
            <div className="text-[#7a7a7a] text-xs font-extrabold uppercase tracking-widest px-1 mb-1">Your channels</div>
            <div className="flex flex-col gap-1.5">
              {mine.map((p) => {
                const f = followers(character, p.id);
                const postedThisYear = character.flags[`posted_${p.id}_year`] === age;
                return (
                  <div key={p.id} className="bg-white rounded-xl border border-[#cfcfcf] shadow-sm px-3 py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl">{p.emoji}</span>
                      <div className="min-w-0">
                        <div className="font-extrabold text-sm">{p.name}</div>
                        <div className="text-[11px] text-[#888] font-semibold">{formatFollowers(f)} followers</div>
                      </div>
                    </div>
                    <button
                      disabled={postedThisYear}
                      onClick={() => act(() => post(p.id))}
                      className={`btn-3d px-3 py-2 rounded-lg text-xs font-extrabold border-[#cfcfcf] shrink-0 ${
                        postedThisYear ? 'bg-[#e0e0e0] text-[#9a9a9a]' : 'bg-[#eef6ff] text-[#1f86d8]'
                      }`}
                    >
                      {postedThisYear ? 'Posted' : 'Post'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sign up */}
        {available.length > 0 && (
          <div>
            <div className="text-[#7a7a7a] text-xs font-extrabold uppercase tracking-widest px-1 mb-1">Sign up</div>
            <div className="flex flex-col gap-1.5">
              {available.map((p) => {
                const avail = joinAvailability(p, character, age);
                return (
                  <button
                    key={p.id}
                    disabled={!avail.ok}
                    onClick={() => avail.ok && act(() => join(p.id))}
                    className={`btn-3d w-full text-left px-3 py-2.5 rounded-xl border-[#cfcfcf] shadow-sm flex items-center gap-2.5 ${
                      avail.ok ? 'bg-white hover:bg-[#f5faff]' : 'bg-[#e0e0e0] cursor-not-allowed'
                    }`}
                  >
                    <span className="text-2xl">{p.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-extrabold text-sm ${avail.ok ? 'text-[#1a1a1a]' : 'text-[#9a9a9a]'}`}>{p.name}</div>
                      <div className="text-[11px] text-[#888] font-semibold">Sign up for {p.name}</div>
                    </div>
                    {!avail.ok && <span className="text-[11px] font-bold text-[#9a9a9a]">{avail.reason}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </MenuShell>
  );
}
