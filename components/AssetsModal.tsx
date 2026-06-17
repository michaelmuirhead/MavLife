'use client';

import { useGameStore } from '../store/gameStore';
import { ASSET_CATALOG } from '../content/assets/catalog';
import { buyAvailability, resaleValue, netWorth } from '../engine/assets/logic';
import type { AssetCategory } from '../engine/types';
import { MenuShell, MenuSection } from './Menu';

const CAT_META: Record<AssetCategory, { label: string; emoji: string }> = {
  home:        { label: 'Homes',       emoji: '🏠' },
  vehicle:     { label: 'Vehicles',    emoji: '🚗' },
  pet:         { label: 'Pets',        emoji: '🐾' },
  luxury:      { label: 'Luxury',      emoji: '🛥️' },
  collectible: { label: 'Collectibles', emoji: '💎' },
};
const CAT_ORDER: AssetCategory[] = ['home', 'vehicle', 'pet', 'luxury', 'collectible'];

export default function AssetsModal({ onClose }: { onClose: () => void }) {
  const character = useGameStore((s) => s.character);
  const age = useGameStore((s) => s.age);
  const buyAsset = useGameStore((s) => s.buyAsset);
  const sellAsset = useGameStore((s) => s.sellAsset);

  function buy(id: string) { buyAsset(id); onClose(); }
  function sell(id: string) { sellAsset(id); onClose(); }

  return (
    <MenuShell title="Assets" balance={`$${character.money.toLocaleString()}`} onClose={onClose}>
      <MenuSection label={`Net worth $${netWorth(character).toLocaleString()}`} />
      <div className="px-3 py-3 flex flex-col gap-3">

          {/* Owned */}
          {character.assets.length > 0 && (
            <div>
              <div className="text-[#7a7a7a] text-xs font-extrabold uppercase tracking-widest px-1 mb-1">
                Owned
              </div>
              <div className="flex flex-col gap-1.5">
                {character.assets.map((a) => (
                  <div key={a.instanceId} className="flex items-center justify-between bg-white rounded-xl border border-[#cfcfcf] shadow-sm px-3 py-2.5">
                    <div className="min-w-0">
                      <div className="font-extrabold text-sm capitalize truncate">{a.name.replace(/^an? /, '')}</div>
                      <div className="text-[11px] text-[#888] font-semibold">
                        Worth ${a.value.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => sell(a.instanceId)}
                      className="btn-3d px-3 py-1.5 rounded-lg text-xs font-extrabold border-[#cfcfcf] bg-[#e6f6e6] text-[#2e6b2e] shrink-0"
                    >
                      Sell ${resaleValue(a).toLocaleString()}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Catalog */}
          {CAT_ORDER.map((cat) => {
            const defs = ASSET_CATALOG.filter((d) => d.category === cat && (!d.ageRange || (age >= d.ageRange[0] && age <= d.ageRange[1])));
            if (defs.length === 0) return null;
            return (
              <div key={cat}>
                <div className="text-[#9a9a9a] text-[11px] font-extrabold uppercase tracking-wide px-1 mb-1">
                  {CAT_META[cat].emoji} {CAT_META[cat].label}
                </div>
                <div className="flex flex-col gap-1.5">
                  {defs.map((def) => {
                    const avail = buyAvailability(def, character, age);
                    return (
                      <button
                        key={def.id}
                        disabled={!avail.ok}
                        onClick={() => avail.ok && buy(def.id)}
                        className={`btn-3d w-full text-left px-3 py-2.5 rounded-xl border-[#cfcfcf] shadow-sm ${
                          avail.ok ? 'bg-white text-[#1a1a1a] hover:bg-[#f5faff]' : 'bg-[#e0e0e0] text-[#9a9a9a] cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-sm capitalize">{def.name.replace(/^an? /, '')}</span>
                          <span className="text-[11px] font-bold shrink-0">${def.price.toLocaleString()}</span>
                        </div>
                        <div className="text-[11px] text-[#888] font-semibold mt-0.5">
                          {def.upkeep > 0 ? `$${def.upkeep.toLocaleString()}/yr upkeep` : 'No upkeep'}
                          {def.drift >= 0.03 ? ' · appreciates' : def.drift <= -0.1 ? ' · depreciates fast' : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </MenuShell>
  );
}
