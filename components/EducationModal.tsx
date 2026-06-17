'use client';

import { useGameStore } from '../store/gameStore';
import { PROGRAMS } from '../content/education';
import { enrollAvailability, enrolledProgram, gradAge } from '../engine/education/logic';

const DEGREE_LABELS: { flag: string; label: string }[] = [
  { flag: 'associate_degree', label: "Associate's" },
  { flag: 'college_degree', label: "Bachelor's" },
  { flag: 'grad_degree', label: 'Graduate' },
  { flag: 'law_degree', label: 'Law (JD)' },
  { flag: 'med_degree', label: 'Medical (MD)' },
];

export default function EducationModal({ onClose }: { onClose: () => void }) {
  const character = useGameStore((s) => s.character);
  const age = useGameStore((s) => s.age);
  const enroll = useGameStore((s) => s.enroll);
  const dropOut = useGameStore((s) => s.dropOut);

  const current = enrolledProgram(character);
  const finishAge = gradAge(character);
  const earned = DEGREE_LABELS.filter((d) => character.flags[d.flag]);

  function act(fn: () => void) { fn(); onClose(); }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md bg-[#ededed] rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="brick-bg flex items-center justify-between px-4 py-3 rounded-t-2xl border-b-2 border-[#c4c4c4]">
          <span className="font-black text-lg text-[#1a1a1a]">Education</span>
          <span className="text-[#2e8b3d] font-extrabold text-base tabular-nums">${character.money.toLocaleString()}</span>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white text-[#e8392f] flex items-center justify-center shadow-sm active:scale-95 font-black" aria-label="Close">✕</button>
        </div>

        <div className="overflow-y-auto px-3 py-3 flex flex-col gap-3">

          {/* Degrees earned */}
          {earned.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {earned.map((d) => (
                <span key={d.flag} className="text-[11px] font-extrabold bg-[#eef6ff] text-[#1f86d8] rounded-full px-2.5 py-1">
                  🎓 {d.label}
                </span>
              ))}
            </div>
          )}

          {/* Currently enrolled */}
          {current && (
            <div className="bg-white rounded-xl shadow-sm border border-[#cfcfcf] p-3 flex items-center justify-between">
              <div>
                <div className="text-[#1f86d8] font-black text-base">{current.name}</div>
                <div className="text-[#888] text-xs font-semibold">
                  {finishAge && finishAge > age ? `Graduates at ${finishAge} (${finishAge - age} yrs left)` : 'Graduating soon'}
                </div>
              </div>
              <button
                onClick={() => act(dropOut)}
                className="btn-3d px-3 py-1.5 rounded-lg text-xs font-extrabold border-[#cfcfcf] bg-[#fde8e6] text-[#a3322a]"
              >
                Drop out
              </button>
            </div>
          )}

          {/* Enrollable programs */}
          <div className="text-[#7a7a7a] text-xs font-extrabold uppercase tracking-widest px-1">
            {current ? 'Other programs' : 'Enroll'}
          </div>
          <div className="flex flex-col gap-1.5">
            {PROGRAMS.map((p) => {
              const avail = enrollAvailability(p, character, age);
              const owned = Boolean(character.flags[p.degreeFlag]);
              return (
                <button
                  key={p.id}
                  disabled={!avail.ok}
                  onClick={() => avail.ok && act(() => enroll(p.id))}
                  className={`btn-3d w-full text-left px-3 py-2.5 rounded-xl border-[#cfcfcf] shadow-sm ${
                    owned ? 'bg-[#eef6ff] text-[#1f86d8]' : avail.ok ? 'bg-white text-[#1a1a1a] hover:bg-[#f5faff]' : 'bg-[#e0e0e0] text-[#9a9a9a] cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-sm">{p.name}</span>
                    <span className="text-[11px] font-bold shrink-0">
                      {owned ? 'Earned' : avail.ok ? `$${p.tuition.toLocaleString()}` : avail.reason}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#888] font-semibold mt-0.5">
                    {p.years} years · +{p.smartsBoost} smarts
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
