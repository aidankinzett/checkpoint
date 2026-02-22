import type { UseMutationResult } from '@tanstack/react-query'

interface SteamImportPanelProps {
  steamProfile: string
  setSteamProfile: (v: string) => void
  steamImport: UseMutationResult<unknown[], Error, string>
  importCount: number | null
}

export function SteamImportPanel({ steamProfile, setSteamProfile, steamImport, importCount }: SteamImportPanelProps) {
  return (
    <div style={{ marginBottom: 16, padding: "14px 16px", background: "#111118", border: "1px solid #1a1a26", borderRadius: 8 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="text"
          value={steamProfile}
          onChange={(e) => setSteamProfile(e.target.value)}
          placeholder="Steam profile URL, vanity name, or ID..."
          aria-label="Steam profile URL, vanity name, or ID"
          onKeyDown={(e) => { if (e.key === "Enter" && steamProfile.trim() && !steamImport.isPending) steamImport.mutate(steamProfile.trim()) }}
          style={{
            flex: 1, padding: "8px 12px", borderRadius: 6,
            background: "#0a0a0f", border: "1px solid #222", color: "#ddd",
            fontSize: 13, fontFamily: "'Barlow', sans-serif", outline: "none",
          }}
          onFocus={(e) => { e.target.style.borderColor = "#66C0F4" }}
          onBlur={(e) => { e.target.style.borderColor = "#222" }}
        />
        <button
          onClick={() => steamProfile.trim() && steamImport.mutate(steamProfile.trim())}
          disabled={steamImport.isPending || !steamProfile.trim()}
          style={{
            background: steamImport.isPending ? "#222" : "rgba(102,192,244,0.15)",
            border: "1px solid rgba(102,192,244,0.3)",
            color: steamImport.isPending ? "#555" : "#66C0F4",
            padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 700,
            fontFamily: "'Barlow', sans-serif", letterSpacing: 0.5, cursor: steamImport.isPending ? "wait" : "pointer",
            whiteSpace: "nowrap",
          }}
        >{steamImport.isPending ? "IMPORTING..." : "IMPORT"}</button>
      </div>
      {steamImport.isError && (
        <div style={{ marginTop: 10, fontSize: 12, color: "#E23636", background: "rgba(226,54,54,0.08)", padding: "8px 12px", borderRadius: 6 }}>
          {steamImport.error.message}
        </div>
      )}
      {steamImport.isSuccess && (
        <div style={{ marginTop: 10, fontSize: 12, color: "#4ade80", background: "rgba(74,222,128,0.08)", padding: "8px 12px", borderRadius: 6 }}>
          {importCount !== null && importCount > 0 ? `Imported ${importCount} new achievement${importCount !== 1 ? "s" : ""} from Steam!` : "No new achievements to import \u2014 you're already up to date!"}
        </div>
      )}
      <div style={{ marginTop: 8, fontSize: 11, color: "#555" }}>
        e.g. steamcommunity.com/id/yourname or your 64-bit Steam ID
      </div>
    </div>
  )
}
