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
}

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
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
}: ProgressHeaderProps) {
  const secondary = accentSecondary ?? accent;
  const lighter = lightenHex(accent, 30);
  const pct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <header
      style={{
        background: "linear-gradient(180deg, #1a0a0a 0%, #0a0a0f 100%)",
        borderBottom: `2px solid ${accent}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "36px 20px 28px",
          position: "relative",
        }}
      >
        {/* Corner glow - left */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 120,
            height: 120,
            background: `radial-gradient(circle at 0% 0%, ${hexToRgba(accent, 0.08)} 0%, transparent 70%)`,
          }}
        />
        {/* Corner glow - right */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 120,
            height: 120,
            background: `radial-gradient(circle at 100% 0%, ${hexToRgba(accent, 0.08)} 0%, transparent 70%)`,
          }}
        />

        {/* Title block */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {subtitle && (
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 15,
                letterSpacing: 8,
                color: "#888",
                marginBottom: -2,
              }}
            >
              {subtitle}
            </div>
          )}
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={title}
              style={{
                display: "block",
                margin: "0 auto 4px",
                maxHeight: 100,
                maxWidth: "100%",
                objectFit: "contain",
                filter: `drop-shadow(0 0 24px ${hexToRgba(accent, 0.4)})`,
              }}
            />
          ) : (
            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(48px, 10vw, 72px)",
                color: accent,
                margin: 0,
                letterSpacing: 6,
                lineHeight: 1,
                textShadow: `0 0 40px ${hexToRgba(accent, 0.3)}, 0 2px 0 ${secondary}`,
              }}
            >
              {title}
            </h1>
          )}
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 14,
              letterSpacing: 5,
              color: "#666",
              marginTop: 4,
            }}
          >
            {trackingLabel}
          </div>
        </div>

        {/* Progress section */}
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          {/* Counts */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 4,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 42,
                color: accent,
                lineHeight: 1,
              }}
            >
              {completedCount}
            </span>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 28,
                color: "#444",
              }}
            >
              /
            </span>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 28,
                color: "#666",
                lineHeight: 1,
              }}
            >
              {totalCount}
            </span>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 18,
                color: accent,
                marginLeft: 12,
                opacity: 0.8,
              }}
            >
              {pct}%
            </span>
            {saving && (
              <span
                style={{
                  fontSize: 10,
                  color: accent,
                  background: hexToRgba(accent, 0.1),
                  padding: "2px 8px",
                  borderRadius: 4,
                  marginLeft: 12,
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                SAVING...
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              height: 8,
              background: "#1a1a24",
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid #222",
            }}
          >
            <div
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${secondary}, ${accent}, ${lighter})`,
                borderRadius: 4,
                transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
                position: "relative",
                overflow: "hidden",
                width: `${pct}%`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "50%",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {/* Completion message */}
          {pct === 100 && completionMessage && (
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 18,
                letterSpacing: 3,
                color: "#F5C518",
                textAlign: "center",
                marginTop: 14,
                textShadow: "0 0 20px rgba(245,197,24,0.4)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            >
              {completionMessage}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
