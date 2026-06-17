'use client';

import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ALL_ACTIVITIES } from '../content/activities';
import { isActivityAvailable } from '../engine/activities/resolve';
import type { Activity, ActivityCategory } from '../engine/activities/types';
import type { Character, Relationship } from '../engine/types';

const CATEGORY_META: Record<ActivityCategory, { label: string; emoji: string }> = {
  mind_body: { label: 'Mind & Body', emoji: '💪' },
  love:      { label: 'Love',        emoji: '❤️' },
  money:     { label: 'Money',       emoji: '💰' },
  social:    { label: 'Social',      emoji: '🫂' },
  education: { label: 'Education',    emoji: '🎓' },
  vice:      { label: 'Vice',        emoji: '🎲' },
};

// Categories that actually have content, in display order.
const CATEGORY_ORDER: ActivityCategory[] = ['mind_body', 'social', 'money', 'love', 'education', 'vice'];

function activeCategories(): ActivityCategory[] {
  return CATEGORY_ORDER.filter((cat) => ALL_ACTIVITIES.some((a) => a.category === cat));
}

// Living relationships eligible to be a target of this activity.
function candidateTargets(activity: Activity, character: Character): Relationship[] {
  if (!activity.requiresTarget) return [];
  return Object.values(character.relationships).filter(
    (r) => r.alive && activity.requiresTarget!.includes(r.type)
  );
}

interface RowState {
  available: boolean;
  reason?: string;
  targets?: { rel: Relationship; available: boolean; reason?: string }[];
}

function evaluate(
  activity: Activity,
  character: Character,
  age: number,
  log: Record<string, number>
): RowState {
  if (!activity.requiresTarget) {
    const avail = isActivityAvailable(activity, character, age, log);
    return avail.ok ? { available: true } : { available: false, reason: avail.reason };
  }

  // Targeted: evaluate per candidate, surface a row-level reason if none qualify.
  const cands = candidateTargets(activity, character);
  if (cands.length === 0) {
    return { available: false, reason: 'No one to do this with' };
  }
  const targets = cands.map((rel) => {
    const avail = isActivityAvailable(activity, character, age, log, rel.id);
    return { rel, available: avail.ok, reason: avail.ok ? undefined : avail.reason };
  });
  const anyOpen = targets.some((t) => t.available);
  return {
    available: anyOpen,
    reason: anyOpen ? undefined : targets[0].reason,
    targets,
  };
}

export default function ActivitiesModal({
  initialCategory,
  onClose,
}: {
  initialCategory?: ActivityCategory;
  onClose: () => void;
}) {
  const character = useGameStore((s) => s.character);
  const age = useGameStore((s) => s.age);
  const activityLog = useGameStore((s) => s.activityLog);
  const performActivity = useGameStore((s) => s.performActivity);

  const cats = activeCategories();
  const [tab, setTab] = useState<ActivityCategory>(
    initialCategory && cats.includes(initialCategory) ? initialCategory : cats[0]
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  // Show activities for this category the player hasn't permanently aged out of.
  const items = ALL_ACTIVITIES.filter((a) => a.category === tab && age <= a.ageRange[1]);

  function run(activityId: string, targetId?: string) {
    performActivity(activityId, targetId);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-md bg-[#ededed] rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="brick-bg flex items-center justify-between px-4 py-3 rounded-t-2xl border-b-2 border-[#c4c4c4]">
          <span className="font-black text-lg text-[#1a1a1a]">Activities</span>
          <span className="text-[#2e8b3d] font-extrabold text-base tabular-nums">
            ${character.money.toLocaleString()}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-[#e8392f] flex items-center justify-center shadow-sm active:scale-95 font-black"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 px-3 py-2 bg-[#e2e2e2] overflow-x-auto">
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => { setTab(cat); setExpanded(null); }}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-colors ${
                tab === cat ? 'bg-[#1f86d8] text-white shadow' : 'bg-white text-[#555]'
              }`}
            >
              {CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}
            </button>
          ))}
        </div>

        {/* Activity list */}
        <div className="overflow-y-auto px-3 py-3 flex flex-col gap-2">
          {items.length === 0 && (
            <p className="text-center text-[#888] text-sm py-8 font-bold">
              Nothing here right now.
            </p>
          )}

          {items.map((activity) => {
            const state = evaluate(activity, character, age, activityLog);
            const isOpen = expanded === activity.id;
            const label = activity.requiresTarget
              ? activity.label.replace(/\{target\}/g, 'someone')
              : activity.label;

            return (
              <div key={activity.id}>
                <button
                  disabled={!state.available}
                  onClick={() => {
                    if (!state.available) return;
                    if (activity.requiresTarget) setExpanded(isOpen ? null : activity.id);
                    else run(activity.id);
                  }}
                  className={`btn-3d w-full text-left px-4 py-3 rounded-xl border-[#cfcfcf] shadow-sm ${
                    state.available
                      ? 'bg-white text-[#1a1a1a] hover:bg-[#f5faff]'
                      : 'bg-[#e0e0e0] text-[#9a9a9a] cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-sm">{label}</span>
                    <span className="text-[11px] font-bold shrink-0">
                      {state.available
                        ? activity.cost
                          ? `$${activity.cost}`
                          : activity.requiresTarget
                          ? '›'
                          : ''
                        : state.reason}
                    </span>
                  </div>
                  {activity.blurb && (
                    <div className="text-[11px] text-[#888] font-semibold mt-0.5">{activity.blurb}</div>
                  )}
                </button>

                {/* Target picker */}
                {isOpen && state.targets && (
                  <div className="flex flex-col gap-1.5 mt-1.5 pl-3">
                    {state.targets.map(({ rel, available, reason }) => (
                      <button
                        key={rel.id}
                        disabled={!available}
                        onClick={() => available && run(activity.id, rel.id)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold border ${
                          available
                            ? 'bg-white border-[#cfcfcf] text-[#1a1a1a] hover:bg-[#f5faff]'
                            : 'bg-[#e6e6e6] border-transparent text-[#a5a5a5] cursor-not-allowed'
                        }`}
                      >
                        <span className="truncate capitalize">{rel.name}</span>
                        <span className="text-[10px] shrink-0 ml-2">
                          {available ? rel.type : reason}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
