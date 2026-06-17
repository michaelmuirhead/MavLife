'use client';

import { useGameStore } from '../store/gameStore';
import { INSTRUMENTS } from '../content/investments/catalog';
import { portfolioValue, holdingValue } from '../engine/investments/logic';
import { MenuShell, MenuSection } from './Menu';

function riskLabel(vol: number): { label: string; color: string } {
  if (vol <= 0.03) return { label: 'Safe', color: '#2e8b3d' };
  if (vol <= 0.15) return { label: 'Steady', color: '#1f86d8' };
  if (vol <= 0.35) return { label: 'Risky', color: '#f0a830' };
  return { label: 'Wild', color: '#e8392f' };
}

const BUY_TIERS = [1000, 10000, 100000];

export default function InvestmentsModal({ onClose }: { onClose: () => void }) {
  const character = useGameStore((s) => s.character);
  const age = useGameStore((s) => s.age);
  const buy = useGameStore((s) => s.buyInvestment);
  const sell = useGameStore((s) => s.sellInvestment);

  const portfolio = portfolioValue(character);

  return (
    <MenuShell title="Investments" balance={`$${character.money.toLocaleString()}`} onClose={onClose}>
      <MenuSection label={`Portfolio $${portfolio.toLocaleString()}`} />
      <div className="px-3 py-3 flex flex-col gap-2">
        {INSTRUMENTS.map((def) => {
            const held = holdingValue(character, def.id);
            const risk = riskLabel(def.vol);
            const tooYoung = age < def.minAge;
            return (
              <div key={def.id} className="bg-white rounded-xl border border-[#cfcfcf] shadow-sm px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-extrabold text-sm">{def.name}</div>
                    <div className="text-[11px] text-[#888] font-semibold">{def.blurb}</div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <span className="text-[10px] font-black uppercase" style={{ color: risk.color }}>{risk.label}</span>
                    <div className="text-[10px] text-[#aaa] font-bold">~{Math.round(def.mean * 100)}%/yr</div>
                  </div>
                </div>

                {held > 0 && (
                  <div className="text-[12px] font-extrabold text-[#2e8b3d] mt-1">
                    Holding ${Math.round(held).toLocaleString()}
                  </div>
                )}

                <div className="flex gap-1.5 mt-2">
                  {tooYoung ? (
                    <span className="text-[11px] font-bold text-[#9a9a9a]">Available at {def.minAge}</span>
                  ) : (
                    <>
                      {BUY_TIERS.filter((t) => t >= def.minBuy).map((tier) => (
                        <button
                          key={tier}
                          disabled={character.money < tier}
                          onClick={() => buy(def.id, tier)}
                          className={`btn-3d px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold border-[#cfcfcf] ${
                            character.money >= tier ? 'bg-[#eef6ff] text-[#1f86d8]' : 'bg-[#e6e6e6] text-[#b3b3b3]'
                          }`}
                        >
                          +${tier >= 1000 ? `${tier / 1000}k` : tier}
                        </button>
                      ))}
                      {held > 0 && (
                        <button
                          onClick={() => sell(def.id)}
                          className="btn-3d px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold border-[#cfcfcf] bg-[#e6f6e6] text-[#2e6b2e] ml-auto"
                        >
                          Sell all
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </MenuShell>
  );
}
