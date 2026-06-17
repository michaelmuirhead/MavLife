'use client';

import { useGameStore } from '../store/gameStore';

export default function TitleScreen() {
  const { goToNewGame } = useGameStore();

  return (
    <div className="brick-bg min-h-screen flex flex-col max-w-md mx-auto shadow-2xl">

      {/* Red banner */}
      <div className="bg-[#e8392f] pt-16 pb-12 px-6 shadow-md flex flex-col items-center">
        <div className="text-6xl mb-2">🌱</div>
        <h1 className="text-white font-black text-5xl italic tracking-tight">Lifespan</h1>
        <p className="text-white/85 text-sm font-bold tracking-widest uppercase mt-1">
          A Life Simulator
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-10">
        <p className="text-[#444] text-center text-lg font-bold leading-relaxed">
          One tap. One year.<br />Every choice matters.
        </p>

        <div className="flex flex-col w-full gap-4 max-w-xs">
          <button
            onClick={goToNewGame}
            className="btn-3d w-full py-4 bg-[#46b93a] border-[#34972b] text-white text-base font-extrabold tracking-wide uppercase rounded-2xl shadow-lg hover:bg-[#4ec441]"
          >
            New Life
          </button>
          <button
            onClick={goToNewGame}
            className="btn-3d w-full py-4 bg-white border-[#cfcfcf] text-[#1f86d8] text-base font-extrabold tracking-wide uppercase rounded-2xl shadow hover:bg-[#f5faff]"
          >
            Random Life
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-[#8a8a8a] text-xs font-bold text-center pb-8 px-6">
        Every life is different. Most are surprising.
      </p>
    </div>
  );
}
