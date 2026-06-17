'use client';

import type { ReactNode } from 'react';

// Shared BitLife-style menu kit: a blue title bar, grey section dividers, and
// consistent white rows. Used by every game modal for a unified look.

export function MenuShell({
  title,
  balance,
  subheader,
  onClose,
  children,
}: {
  title: string;
  balance?: ReactNode;
  subheader?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-md bg-[#eceff1] rounded-t-2xl shadow-2xl max-h-[82vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Blue title bar */}
        <div className="relative bg-[#1f86d8] flex items-center justify-center px-4 py-3 shrink-0">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute left-3 w-8 h-8 rounded-full bg-white/90 text-[#1f86d8] flex items-center justify-center shadow-sm active:scale-95 font-black"
          >
            ✕
          </button>
          <h2 className="text-white font-black text-lg tracking-wide uppercase italic">{title}</h2>
          {balance != null && (
            <span className="absolute right-3 text-white font-extrabold text-sm tabular-nums">{balance}</span>
          )}
        </div>

        {subheader != null && <div className="shrink-0">{subheader}</div>}

        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

export function MenuSection({ label }: { label: string }) {
  return (
    <div className="bg-[#c9ccd1] text-[#565b61] text-[11px] font-extrabold uppercase tracking-wider text-center py-1">
      {label}
    </div>
  );
}

// A standard tappable row: icon · title · subtitle · right accessory.
export function MenuRow({
  emoji,
  title,
  subtitle,
  right,
  chevron,
  disabled,
  onClick,
}: {
  emoji?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  chevron?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 bg-white border-b border-[#e8e8e8] text-left ${
        disabled ? 'cursor-not-allowed' : 'active:bg-[#f5faff]'
      }`}
    >
      {emoji != null && <span className="text-2xl w-7 text-center shrink-0 leading-none">{emoji}</span>}
      <div className="min-w-0 flex-1">
        <div className={`font-extrabold text-[15px] leading-tight ${disabled ? 'text-[#a6a6a6]' : 'text-[#1f86d8]'}`}>
          {title}
        </div>
        {subtitle != null && <div className="text-[12px] text-[#8a8a8a] font-semibold leading-snug mt-0.5">{subtitle}</div>}
      </div>
      {right != null && <span className="text-[12px] font-bold text-[#777] shrink-0 text-right">{right}</span>}
      {chevron && <span className="text-[#c2c2c2] text-xl font-bold shrink-0 leading-none">›</span>}
    </button>
  );
}
