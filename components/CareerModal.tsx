'use client';

import { useGameStore } from '../store/gameStore';
import { ALL_JOBS } from '../content/career/jobs';
import { jobAvailability, hireChance } from '../engine/career/logic';
import type { Job } from '../engine/career/types';
import { MenuShell } from './Menu';

function fieldGroups(): { field: string; jobs: Job[] }[] {
  const order: string[] = [];
  const map = new Map<string, Job[]>();
  for (const j of ALL_JOBS) {
    if (!map.has(j.field)) { map.set(j.field, []); order.push(j.field); }
    map.get(j.field)!.push(j);
  }
  return order.map((field) => ({ field, jobs: map.get(field)! }));
}

export default function CareerModal({ onClose }: { onClose: () => void }) {
  const character = useGameStore((s) => s.character);
  const age = useGameStore((s) => s.age);
  const applyForJob = useGameStore((s) => s.applyForJob);
  const workHarderAction = useGameStore((s) => s.workHarder);
  const askForRaiseAction = useGameStore((s) => s.askForRaise);
  const quitJobAction = useGameStore((s) => s.quitJob);

  const employed = Boolean(character.occupation);
  const workedThisYear = character.flags['worked_harder_year'] === age;
  const askedThisYear = character.flags['raise_asked_year'] === age;

  function act(fn: () => void) {
    fn();
    onClose();
  }

  return (
    <MenuShell title="Career" balance={`$${character.money.toLocaleString()}`} onClose={onClose}>
        <div className="px-3 py-3 flex flex-col gap-3">

          {/* Current job */}
          {employed && (
            <div className="bg-white rounded-xl shadow-sm border border-[#cfcfcf] p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#1f86d8] font-black text-base">{character.occupation}</div>
                  <div className="text-[#2e8b3d] font-extrabold text-sm">
                    ${character.salary.toLocaleString()}/yr
                  </div>
                </div>
                <span className="text-2xl">💼</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <button
                  disabled={workedThisYear}
                  onClick={() => act(workHarderAction)}
                  className={`btn-3d px-2 py-2 rounded-lg text-xs font-extrabold border-[#cfcfcf] ${
                    workedThisYear ? 'bg-[#e0e0e0] text-[#a5a5a5]' : 'bg-[#fff7e0] text-[#7a5c00]'
                  }`}
                >
                  Work harder
                </button>
                <button
                  disabled={askedThisYear}
                  onClick={() => act(askForRaiseAction)}
                  className={`btn-3d px-2 py-2 rounded-lg text-xs font-extrabold border-[#cfcfcf] ${
                    askedThisYear ? 'bg-[#e0e0e0] text-[#a5a5a5]' : 'bg-[#e6f6e6] text-[#2e6b2e]'
                  }`}
                >
                  Ask for raise
                </button>
                <button
                  onClick={() => act(quitJobAction)}
                  className="btn-3d px-2 py-2 rounded-lg text-xs font-extrabold border-[#cfcfcf] bg-[#fde8e6] text-[#a3322a]"
                >
                  Quit
                </button>
              </div>
            </div>
          )}

          {/* Job listings */}
          <div className="text-[#7a7a7a] text-xs font-extrabold uppercase tracking-widest px-1">
            {employed ? 'Switch jobs' : 'Find a job'}
          </div>

          {fieldGroups().map(({ field, jobs }) => (
            <div key={field}>
              <div className="text-[#9a9a9a] text-[11px] font-extrabold uppercase tracking-wide px-1 mb-1">
                {field}
              </div>
              <div className="flex flex-col gap-1.5">
                {jobs.map((job) => {
                  const avail = jobAvailability(job, character, age);
                  const isCurrent = character.occupation === job.title;
                  const chance = avail.ok ? Math.round(hireChance(job, character) * 100) : 0;
                  return (
                    <button
                      key={job.id}
                      disabled={!avail.ok || isCurrent}
                      onClick={() => avail.ok && !isCurrent && act(() => applyForJob(job.id))}
                      className={`btn-3d w-full text-left px-3 py-2.5 rounded-xl border-[#cfcfcf] shadow-sm ${
                        isCurrent
                          ? 'bg-[#eef6ff] text-[#1f86d8]'
                          : avail.ok
                          ? 'bg-white text-[#1a1a1a] hover:bg-[#f5faff]'
                          : 'bg-[#e0e0e0] text-[#9a9a9a] cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-sm">{job.title}</span>
                        <span className="text-[11px] font-bold shrink-0">
                          {isCurrent ? 'Current' : `$${job.baseSalary.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#888] font-semibold mt-0.5">
                        {isCurrent
                          ? 'Where you are now'
                          : avail.ok
                          ? `~${chance}% chance to get hired`
                          : `Requires ${avail.reason}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
    </MenuShell>
  );
}
