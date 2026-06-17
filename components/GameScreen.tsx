'use client';

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Choice, StatType, Character, LifeEvent } from '../engine/types';
import type { ActivityCategory } from '../engine/activities/types';
import ActivitiesModal from './ActivitiesModal';
import CareerModal from './CareerModal';

// ─── Stat Config ───────────────────────────────────────────────────────────

const STAT_ORDER: StatType[] = ['happiness', 'health', 'smarts', 'looks', 'fitness', 'charisma'];

const STAT_META: Record<StatType, { label: string; emoji: string }> = {
  happiness: { label: 'Happiness', emoji: '😄' },
  health:    { label: 'Health',    emoji: '❤️' },
  smarts:    { label: 'Smarts',    emoji: '🧠' },
  looks:     { label: 'Looks',     emoji: '🔥' },
  fitness:   { label: 'Fitness',   emoji: '💪' },
  charisma:  { label: 'Charisma',  emoji: '✨' },
};

// Bar color shifts from red (low) to green (high), BitLife-style
function barColor(value: number): string {
  if (value >= 60) return '#46b93a';
  if (value >= 35) return '#f0a830';
  return '#e8392f';
}

// ─── Avatar ────────────────────────────────────────────────────────────────

function avatarEmoji(character: Character, age: number): string {
  const g = character.gender;
  if (age < 3) return '👶';
  if (age < 13) return g === 'male' ? '👦' : g === 'female' ? '👧' : '🧒';
  if (age < 65) return g === 'male' ? '👨' : g === 'female' ? '👩' : '🧑';
  return g === 'male' ? '👴' : g === 'female' ? '👵' : '🧓';
}

// ─── Stats Panel ───────────────────────────────────────────────────────────

function StatsPanel() {
  const stats = useGameStore((s) => s.character.stats);

  return (
    <div className="bg-[#ededed] border-t border-[#cfcfcf] px-4 py-2.5 grid grid-cols-1 gap-1.5">
      {STAT_ORDER.map((key) => {
        const value = Math.round(stats[key] ?? 0);
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="text-base w-6 text-center leading-none">{STAT_META[key].emoji}</span>
            <span className="text-[#333] font-extrabold text-[11px] w-[58px] shrink-0">
              {STAT_META[key].label}
            </span>
            <div className="flex-1 h-3.5 bg-[#d2d2d2] rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${value}%`, backgroundColor: barColor(value) }}
              />
            </div>
            <span className="text-[#333] font-extrabold text-[11px] w-9 text-right tabular-nums">
              {value}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Character Card ─────────────────────────────────────────────────────────

function CharacterCard() {
  const { character, age } = useGameStore();

  const lifeStage =
    age < 1 ? 'Newborn' :
    age < 13 ? 'Child' :
    age < 20 ? 'Teenager' :
    age < 65 ? 'Adult' : 'Senior';

  const role = character.occupation
    ? character.occupation.charAt(0).toUpperCase() + character.occupation.slice(1)
    : lifeStage;

  return (
    <div className="brick-bg px-4 py-3 flex items-center justify-between border-b-2 border-[#c4c4c4]">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-2xl shrink-0">
          {avatarEmoji(character, age)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[#1f86d8] font-extrabold text-lg leading-tight truncate">
              {character.name}
            </span>
          </div>
          <div className="text-[#7a7a7a] text-xs font-bold truncate flex items-center gap-2">
            <span>🧬 {role}</span>
            {character.money > 0 && (
              <span className="text-[#2e8b3d]">${character.money.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
      <div className="text-right shrink-0 pl-2">
        <div className="text-[#2e8b3d] font-extrabold text-base leading-tight">
          {character.birthYear + age}
        </div>
        <div className="text-[#9a9a9a] text-[10px] font-bold uppercase tracking-wide">
          Year
        </div>
      </div>
    </div>
  );
}

// ─── Narrative Feed (grouped by age) ────────────────────────────────────────

function NarrativeFeed({ events }: { events: LifeEvent[] }) {
  const groups: { age: number; items: LifeEvent[] }[] = [];
  for (const ev of events) {
    const last = groups[groups.length - 1];
    if (last && last.age === ev.age) last.items.push(ev);
    else groups.push({ age: ev.age, items: [ev] });
  }

  return (
    <div className="px-4 py-3">
      {groups.map((group, gi) => (
        <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
          <h3 className="text-[#1f86d8] font-extrabold text-[15px] mb-1">
            Age: {group.age} {group.age === 1 ? 'year' : 'years'}
          </h3>
          {group.items.map((ev, i) => (
            <p
              key={`${ev.id}_${i}`}
              className={`text-[15px] leading-relaxed ${
                ev.kind === 'activity'
                  ? 'text-[#1a1a1a] pl-3 border-l-[3px] border-[#46b93a] my-1'
                  : ev.isChoice
                  ? 'text-[#555] italic pl-3 border-l-[3px] border-[#d8d8d8] my-1'
                  : 'text-[#1a1a1a]'
              }`}
            >
              {ev.text}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Choice Interface ───────────────────────────────────────────────────────

function ChoiceInterface({ choices, onChoice }: { choices: Choice[]; onChoice: (c: Choice) => void }) {
  return (
    <div className="brick-bg px-4 pt-3 pb-4 border-t-2 border-[#c4c4c4]">
      <p className="text-[#7a7a7a] text-xs font-extrabold uppercase tracking-widest mb-2 text-center">
        Make a choice
      </p>
      <div className="flex flex-col gap-2.5">
        {choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => onChoice(choice)}
            className="btn-3d text-left px-4 py-3 bg-white rounded-xl border-[#cfcfcf] text-[#1a1a1a] font-bold text-sm leading-snug shadow-sm hover:bg-[#f5faff]"
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Action Bar (nav shortcuts + Age button) ───────────────────────────────

function ActionBar({
  onTap,
  onOpenActivities,
  onOpenCareer,
}: {
  onTap: () => void;
  onOpenActivities: (c: ActivityCategory) => void;
  onOpenCareer: () => void;
}) {
  return (
    <div className="brick-bg flex items-center justify-between px-5 py-3.5 border-t-2 border-[#c4c4c4]">
      <div className="flex gap-3">
        <NavButton emoji="💪" label="Body" onClick={() => onOpenActivities('mind_body')} />
        <NavButton emoji="🫂" label="Social" onClick={() => onOpenActivities('social')} />
      </div>

      <button
        onClick={onTap}
        className="btn-3d w-[88px] h-[88px] rounded-full bg-[#46b93a] border-[#34972b] text-white flex flex-col items-center justify-center shadow-lg hover:bg-[#4ec441] active:bg-[#3ea832] shrink-0"
        aria-label="Age up one year"
      >
        <span className="text-4xl font-black leading-none -mt-1">+</span>
        <span className="text-sm font-extrabold tracking-wide -mt-0.5">Age</span>
      </button>

      <div className="flex gap-3">
        <NavButton emoji="💼" label="Career" onClick={onOpenCareer} />
        <NavButton emoji="💰" label="Money" onClick={() => onOpenActivities('money')} />
      </div>
    </div>
  );
}

function NavButton({ emoji, label, onClick }: { emoji: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 active:scale-95 transition-transform"
      aria-label={label}
    >
      <span className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl">
        {emoji}
      </span>
      <span className="text-[10px] font-extrabold text-[#666]">{label}</span>
    </button>
  );
}

// ─── Main Game Screen ───────────────────────────────────────────────────────

export default function GameScreen() {
  const { lifeEvents, pendingEvent, tap, makeChoice, goToTitle } = useGameStore();
  const feedRef = useRef<HTMLDivElement>(null);
  const [activitiesCategory, setActivitiesCategory] = useState<ActivityCategory | null>(null);
  const [careerOpen, setCareerOpen] = useState(false);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [lifeEvents]);

  const hasChoice = Boolean(pendingEvent && pendingEvent.choices);

  return (
    <div className="flex flex-col h-screen bg-[#e2e2e2] max-w-md mx-auto shadow-2xl">

      {/* Red header */}
      <header className="bg-[#e8392f] flex items-center justify-between px-3 py-2.5 shadow-md z-20">
        <button
          onClick={goToTitle}
          className="w-9 h-9 rounded-full bg-white/95 text-[#e8392f] flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          aria-label="Menu"
        >
          <span className="text-lg font-black leading-none">≡</span>
        </button>
        <div className="flex items-center gap-1.5">
          <span className="text-xl">🌱</span>
          <span className="text-white font-black text-2xl italic tracking-tight">Lifespan</span>
        </div>
        <div className="w-9 h-9" />
      </header>

      {/* Character card */}
      <CharacterCard />

      {/* Narrative feed */}
      <div ref={feedRef} className="flex-1 overflow-y-auto bg-white">
        <NarrativeFeed events={lifeEvents} />
      </div>

      {/* Action zone — choices, or nav shortcuts + Age button */}
      {hasChoice ? (
        <ChoiceInterface choices={pendingEvent!.choices!} onChoice={makeChoice} />
      ) : (
        <ActionBar
          onTap={tap}
          onOpenActivities={setActivitiesCategory}
          onOpenCareer={() => setCareerOpen(true)}
        />
      )}

      {/* Stats */}
      <StatsPanel />

      {/* Activities modal */}
      {activitiesCategory && (
        <ActivitiesModal
          initialCategory={activitiesCategory}
          onClose={() => setActivitiesCategory(null)}
        />
      )}

      {/* Career modal */}
      {careerOpen && <CareerModal onClose={() => setCareerOpen(false)} />}

    </div>
  );
}
