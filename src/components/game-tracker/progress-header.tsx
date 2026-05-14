import { hexToRgba } from '~/lib/utils'
import { RefreshCw } from 'lucide-react';

interface ProgressHeaderProps {
  title: string;
  subtitle?: string;
  logoUrl?: string;
  trackingLabel: string;
  accent: string;
  accentSecondary?: string;
  completedCount: number;
  totalCount: number;
  saving: boolean;
  completionMessage?: string;
  showSyncButton?: boolean;
  onSyncClick?: () => void;
  isSyncing?: boolean;
}


function lightenHex(hex: string, amount: number): string {
  const cleaned = hex.replace("#", "");
  const r = Math.min(255, parseInt(cleaned.substring(0, 2), 16) + amount);
  const g = Math.min(255, parseInt(cleaned.substring(2, 4), 16) + amount);
  const b = Math.min(255, parseInt(cleaned.substring(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function ProgressHeader({
  title,
  subtitle,
  logoUrl,
  trackingLabel,
  accent,
  accentSecondary,
  completedCount,
  totalCount,
  saving,
  completionMessage,
  showSyncButton,
  onSyncClick,
  isSyncing,
}: ProgressHeaderProps) {
  const secondary = accentSecondary ?? accent;
  const lighter = lightenHex(accent, 30);
  const pct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <header
      className="relative overflow-hidden bg-[linear-gradient(180deg,#1a0a0a_0%,#0a0a0f_100%)] border-b-[2px] border-solid"
      style={{
        borderBottomColor: accent,
      }}
    >
      <div className="max-w-[900px] mx-auto pt-9 px-5 pb-7 relative">
        {/* Corner glow - left */}
        <div
          className="absolute top-0 left-0 w-[120px] h-[120px]"
          style={{
            background: `radial-gradient(circle at 0% 0%, ${hexToRgba(accent, 0.08)} 0%, transparent 70%)`,
          }}
        />
        {/* Corner glow - right */}
        <div
          className="absolute top-0 right-0 w-[120px] h-[120px]"
          style={{
            background: `radial-gradient(circle at 100% 0%, ${hexToRgba(accent, 0.08)} 0%, transparent 70%)`,
          }}
        />

        {/* Sync Button */}
        {showSyncButton && (
          <button
            onClick={onSyncClick}
            disabled={isSyncing || !onSyncClick}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#1a1a24] border border-[#2a2a3a] text-[#888] hover:text-[#E8E8E8] hover:border-[#444] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed z-10"
            title="Sync with Steam"
            aria-label="Sync with Steam"
          >
            <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
          </button>
        )}

        {/* Title block */}
        <div className="text-center mb-6">
          {subtitle && (
            <div className="font-['Bebas_Neue',sans-serif] text-[15px] tracking-[8px] text-[#888] -mb-0.5">
              {subtitle}
            </div>
          )}
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={title}
              className="block mx-auto mb-1 max-h-[100px] max-w-full object-contain"
              style={{
                filter: `drop-shadow(0 0 24px ${hexToRgba(accent, 0.4)})`,
              }}
            />
          ) : (
            <h1
              className="font-['Bebas_Neue',sans-serif] text-[clamp(48px,10vw,72px)] m-0 tracking-[6px] leading-none"
              style={{
                color: accent,
                textShadow: `0 0 40px ${hexToRgba(accent, 0.3)}, 0 2px 0 ${secondary}`,
              }}
            >
              {title}
            </h1>
          )}
          <div className="font-['Bebas_Neue',sans-serif] text-[14px] tracking-[5px] text-[#666] mt-1">
            {trackingLabel}
          </div>
        </div>

        {/* Progress section */}
        <div className="max-w-[500px] mx-auto">
          {/* Counts */}
          <div className="flex items-baseline justify-center gap-1 mb-2.5">
            <span className="font-['Bebas_Neue',sans-serif] text-[42px] leading-none" style={{ color: accent }}>
              {completedCount}
            </span>
            <span className="font-['Bebas_Neue',sans-serif] text-[28px] text-[#444]">
              /
            </span>
            <span className="font-['Bebas_Neue',sans-serif] text-[28px] text-[#666] leading-none">
              {totalCount}
            </span>
            <span className="font-['Bebas_Neue',sans-serif] text-[18px] ml-3 opacity-80" style={{ color: accent }}>
              {pct}%
            </span>
            {saving && (
              <span
                className="text-[10px] py-0.5 px-2 rounded ml-3 font-semibold tracking-[1px]"
                style={{
                  color: accent,
                  background: hexToRgba(accent, 0.1),
                }}
              >
                SAVING...
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#1a1a24] rounded overflow-hidden border border-[#222]">
            <div
              className="h-full rounded transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative overflow-hidden"
              style={{
                background: `linear-gradient(90deg, ${secondary}, ${accent}, ${lighter})`,
                width: `${pct}%`,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,transparent_100%)]" />
            </div>
          </div>

          {/* Completion message */}
          {pct === 100 && completionMessage && (
            <div className="font-['Bebas_Neue',sans-serif] text-[18px] tracking-[3px] text-[#F5C518] text-center mt-3.5 animate-pulse [text-shadow:0_0_20px_rgba(245,197,24,0.4)]">
              {completionMessage}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
