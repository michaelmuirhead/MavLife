'use client';

import { useGameStore } from '../store/gameStore';

export default function TitleScreen() {
  const { goToNewGame } = useGameStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6">
      <div className="max-w-sm w-full flex flex-col items-center gap-12">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl font-light tracking-[0.3em] text-white uppercase mb-3">
            Lifespan
          </h1>
          <p className="text-zinc-500 text-sm tracking-widest uppercase">
            A life simulator
          </p>
        </div>

        {/* Tagline */}
        <p className="text-zinc-400 text-center text-base leading-relaxed max-w-xs">
          One tap. One year. Every choice matters.
        </p>

        {/* Buttons */}
        <div className="flex flex-col w-full gap-3">
          <button
            onClick={goToNewGame}
            className="w-full py-4 bg-white text-black text-sm font-medium tracking-widest uppercase hover:bg-zinc-200 transition-colors"
          >
            New Life
          </button>
          <button
            onClick={goToNewGame}
            className="w-full py-4 border border-zinc-700 text-zinc-400 text-sm font-medium tracking-widest uppercase hover:border-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Random Life
          </button>
        </div>

        {/* Footer */}
        <p className="text-zinc-700 text-xs tracking-wider">
          Every life is different. Most are surprising.
        </p>
      </div>
    </div>
  );
}
