'use client';

import { useGameStore } from '../store/gameStore';
import { canFindLove, canPropose, canHaveChild } from '../engine/relationships/logic';
import type { Relationship } from '../engine/types';

const TYPE_EMOJI: Record<Relationship['type'], string> = {
  mother: '👩', father: '👨', sibling: '🧑', child: '🧒',
  friend: '🙂', romantic: '❤️', rival: '😤', mentor: '🧓', colleague: '💼',
};

// Closeness is -5..5; show it as a simple heart meter.
function closenessBar(closeness: number): string {
  const filled = Math.max(0, Math.round((closeness + 5) / 2)); // 0..5
  return '♥'.repeat(filled) + '·'.repeat(5 - filled);
}

export default function RelationshipsModal({ onClose }: { onClose: () => void }) {
  const character = useGameStore((s) => s.character);
  const age = useGameStore((s) => s.age);
  const findLove = useGameStore((s) => s.findLove);
  const propose = useGameStore((s) => s.propose);
  const haveChild = useGameStore((s) => s.haveChild);

  const people = Object.values(character.relationships).filter((r) => r.alive);

  const loveAvail = canFindLove(character, age);
  const proposeAvail = canPropose(character, age);
  const childAvail = canHaveChild(character, age);
  const triedChildThisYear = character.flags['tried_child_year'] === age;

  function act(fn: () => void) { fn(); onClose(); }

  const actions: { label: string; avail: { ok: boolean; reason?: string }; onClick: () => void; tone: string }[] = [
    { label: '💘 Find love', avail: loveAvail, onClick: () => act(findLove), tone: 'bg-[#fde8ef] text-[#a3286a]' },
    { label: '💍 Propose', avail: proposeAvail, onClick: () => act(propose), tone: 'bg-[#eef0ff] text-[#3a3aa3]' },
    {
      label: '👶 Have a child',
      avail: triedChildThisYear ? { ok: false, reason: 'Already this year' } : childAvail,
      onClick: () => act(haveChild),
      tone: 'bg-[#e6f6e6] text-[#2e6b2e]',
    },
  ];

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md bg-[#ededed] rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="brick-bg flex items-center justify-between px-4 py-3 rounded-t-2xl border-b-2 border-[#c4c4c4]">
          <span className="font-black text-lg text-[#1a1a1a]">Relationships</span>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white text-[#e8392f] flex items-center justify-center shadow-sm active:scale-95 font-black" aria-label="Close">✕</button>
        </div>

        <div className="overflow-y-auto px-3 py-3 flex flex-col gap-3">

          {/* Family-forming actions */}
          <div className="grid grid-cols-1 gap-1.5">
            {actions.map((a) => (
              <button
                key={a.label}
                disabled={!a.avail.ok}
                onClick={a.onClick}
                className={`btn-3d w-full text-left px-4 py-3 rounded-xl border-[#cfcfcf] shadow-sm flex items-center justify-between ${
                  a.avail.ok ? a.tone : 'bg-[#e0e0e0] text-[#9a9a9a] cursor-not-allowed'
                }`}
              >
                <span className="font-extrabold text-sm">{a.label}</span>
                {!a.avail.ok && <span className="text-[11px] font-bold">{a.avail.reason}</span>}
              </button>
            ))}
          </div>

          {/* Roster */}
          <div className="text-[#7a7a7a] text-xs font-extrabold uppercase tracking-widest px-1">
            People in your life
          </div>
          <div className="flex flex-col gap-1.5">
            {people.map((r) => (
              <div key={r.id} className="flex items-center justify-between bg-white rounded-xl border border-[#cfcfcf] shadow-sm px-3 py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl">{TYPE_EMOJI[r.type]}</span>
                  <div className="min-w-0">
                    <div className="font-extrabold text-sm truncate">{r.name}</div>
                    <div className="text-[11px] text-[#888] font-semibold capitalize">
                      {r.type}{character.flags['married'] && r.type === 'romantic' ? ' · spouse' : ''}
                    </div>
                  </div>
                </div>
                <span className="text-[#e8688f] text-sm font-bold tracking-tighter shrink-0">
                  {closenessBar(r.closeness)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
