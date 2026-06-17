'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for debugging without breaking the recovery UI
    console.error('Lifespan crashed:', error);
  }, [error]);

  const startOver = () => {
    try {
      localStorage.removeItem('lifespan_save');
    } catch {
      // ignore
    }
    // Hard reload to a clean slate
    window.location.href = '/';
  };

  return (
    <div className="brick-bg min-h-screen flex flex-col max-w-md mx-auto shadow-2xl">
      <div className="bg-[#e8392f] pt-14 pb-10 px-6 shadow-md flex flex-col items-center">
        <div className="text-5xl mb-2">😵</div>
        <h1 className="text-white font-black text-3xl italic tracking-tight">Whoops</h1>
        <p className="text-white/85 text-xs font-extrabold tracking-[0.3em] uppercase mt-1">
          Something Went Wrong
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        <p className="text-[#444] text-center text-base font-bold leading-relaxed">
          This life hit a snag. Your old saved game may be from a previous
          version — starting over will clear it and get you back on your feet.
        </p>

        <div className="flex flex-col w-full gap-3 max-w-xs">
          <button
            onClick={startOver}
            className="btn-3d w-full py-4 bg-[#46b93a] border-[#34972b] text-white text-base font-extrabold tracking-wide uppercase rounded-2xl shadow-lg hover:bg-[#4ec441]"
          >
            Start Over
          </button>
          <button
            onClick={reset}
            className="btn-3d w-full py-4 bg-white border-[#cfcfcf] text-[#1f86d8] text-base font-extrabold tracking-wide uppercase rounded-2xl shadow hover:bg-[#f5faff]"
          >
            Try Again
          </button>
        </div>
      </div>

      <p className="text-[#8a8a8a] text-xs font-bold text-center pb-8 px-6">
        Sorry about that. It won&apos;t happen twice.
      </p>
    </div>
  );
}
