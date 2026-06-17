'use client';

import { useGameStore } from '../store/gameStore';
import { getCondition } from '../content/health/conditions';
import { treatAvailability } from '../engine/health/logic';
import { MenuShell } from './Menu';

const CAT_EMOJI: Record<string, string> = {
  illness: '🤒', chronic: '🩺', mental: '🧠', addiction: '🍷',
};

export default function HealthModal({ onClose }: { onClose: () => void }) {
  const character = useGameStore((s) => s.character);
  const treatCondition = useGameStore((s) => s.treatCondition);

  const health = Math.round(character.stats.health);
  const conditions = character.conditions;

  function treat(id: string) { treatCondition(id); onClose(); }

  return (
    <MenuShell title="Health" balance={`❤️ ${health}%`} onClose={onClose}>
        <div className="px-3 py-3 flex flex-col gap-2">
          {conditions.length === 0 && (
            <p className="text-center text-[#888] text-sm py-10 font-bold">
              Nothing wrong that a doctor could find.<br />
              <span className="text-[#aaa] font-semibold text-xs">Keep your health up to stay that way.</span>
            </p>
          )}

          {conditions.map((active) => {
            const def = getCondition(active.id);
            if (!def) return null;
            const avail = treatAvailability(active, character);
            const cure = Math.round((def.cureChance ?? 0.5) * 100);
            return (
              <div key={active.id} className="bg-white rounded-xl border border-[#cfcfcf] shadow-sm px-3 py-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-extrabold text-sm flex items-center gap-1.5">
                    <span>{CAT_EMOJI[def.category] ?? '⚕️'}</span>
                    <span className="capitalize">{def.name.replace(/^(a |an |the )/, '')}</span>
                  </div>
                  <div className="text-[11px] text-[#888] font-semibold capitalize">
                    {def.category} · since {active.since}
                    {def.fatalChance ? ' · serious' : ''}
                  </div>
                </div>
                <button
                  disabled={!avail.ok}
                  onClick={() => avail.ok && treat(active.id)}
                  className={`btn-3d px-3 py-2 rounded-lg text-xs font-extrabold border-[#cfcfcf] shrink-0 text-center ${
                    avail.ok ? 'bg-[#e6f6e6] text-[#2e6b2e]' : 'bg-[#e0e0e0] text-[#9a9a9a]'
                  }`}
                >
                  {avail.ok ? <>Treat ${def.treatCost?.toLocaleString()}<br /><span className="font-bold opacity-70">~{cure}% cure</span></> : avail.reason}
                </button>
              </div>
            );
          })}
        </div>
    </MenuShell>
  );
}
