'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Choice } from '../engine/types';

// ─── Age Display ───────────────────────────────────────────────────────────

function AgeBar() {
  const { age, character } = useGameStore();
  const decade = Math.floor(age / 10) * 10;

  const lifeStage =
    age < 13 ? 'Childhood' :
    age < 20 ? 'Adolescence' :
    age < 30 ? 'Early Adulthood' :
    age < 40 ? 'Adulthood' :
    age < 55 ? 'Middle Age' :
    age < 70 ? 'Later Life' : 'Elder Years';

  return (
    <div className="sticky top-0 z-10 bg-black border-b border-zinc-800 px-5 py-4">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-light text-white tabular-nums">{age}</span>
          <span className="text-zinc-500 text-sm">{lifeStage}</span>
        </div>
        <span className="text-zinc-600 text-xs tracking-wider">
          {character.location} · {character.birthYear + age}
        </span>
      </div>
    </div>
  );
}

// ─── Life Event Entry ──────────────────────────────────────────────────────

function EventEntry({ text, age: eventAge, isChoice }: { text: string; age: number; isChoice?: boolean }) {
  return (
    <div className={`px-5 py-3 ${isChoice ? 'border-l-2 border-zinc-600 ml-5' : ''}`}>
      {!isChoice && (
        <span className="text-zinc-600 text-xs tabular-nums mr-3">{eventAge}</span>
      )}
      <span className={`text-sm leading-relaxed ${isChoice ? 'text-zinc-300 italic' : 'text-zinc-200'}`}>
        {text}
      </span>
    </div>
  );
}

// ─── Choice Interface ──────────────────────────────────────────────────────

function ChoiceInterface({ choices, onChoice }: { choices: Choice[]; onChoice: (c: Choice) => void }) {
  return (
    <div className="px-5 py-4 flex flex-col gap-2 border-t border-zinc-800 bg-black">
      <p className="text-zinc-500 text-xs tracking-widest uppercase mb-1">Choose</p>
      {choices.map((choice, i) => (
        <button
          key={i}
          onClick={() => onChoice(choice)}
          className="text-left px-4 py-3 border border-zinc-700 text-zinc-200 text-sm leading-relaxed hover:border-zinc-400 hover:text-white active:bg-zinc-900 transition-colors"
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
}

// ─── Tap Button ────────────────────────────────────────────────────────────

function TapButton({ onTap, tapSpeed }: { onTap: () => void; tapSpeed: number }) {
  return (
    <button
      onClick={onTap}
      className="w-full py-5 bg-zinc-900 text-zinc-400 text-xs tracking-[0.3em] uppercase hover:bg-zinc-800 hover:text-zinc-200 active:bg-zinc-700 transition-colors border-t border-zinc-800"
    >
      Tap to continue · {tapSpeed === 1 ? '1 year' : tapSpeed === 2 ? '6 months' : '3 months'} per tap
    </button>
  );
}

// ─── Main Game Screen ──────────────────────────────────────────────────────

export default function GameScreen() {
  const { lifeEvents, pendingEvent, tap, makeChoice, tapSpeed, goToTitle } = useGameStore();
  const feedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new events
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [lifeEvents]);

  return (
    <div className="flex flex-col h-screen bg-black max-w-lg mx-auto">

      {/* Top bar */}
      <AgeBar />

      {/* Menu bar */}
      <div className="flex justify-end px-5 py-2 border-b border-zinc-900">
        <button
          onClick={goToTitle}
          className="text-zinc-700 text-xs hover:text-zinc-500 transition-colors tracking-wider"
        >
          Quit
        </button>
      </div>

      {/* Narrative feed */}
      <div ref={feedRef} className="flex-1 overflow-y-auto py-2 scroll-smooth">
        {lifeEvents.map((event, i) => (
          <EventEntry
            key={`${event.id}_${i}`}
            text={event.text}
            age={event.age}
            isChoice={event.isChoice}
          />
        ))}

        {/* Pending event choices */}
        {pendingEvent && pendingEvent.choices && (
          <div className="mt-2" />
        )}
      </div>

      {/* Bottom — choices or tap button */}
      {pendingEvent && pendingEvent.choices ? (
        <ChoiceInterface choices={pendingEvent.choices} onChoice={makeChoice} />
      ) : (
        <TapButton onTap={tap} tapSpeed={tapSpeed} />
      )}

    </div>
  );
}
