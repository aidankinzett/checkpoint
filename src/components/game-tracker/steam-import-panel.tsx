import type { UseMutationResult } from '@tanstack/react-query'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
interface SteamImportPanelProps {
  steamProfile: string
  setSteamProfile: (v: string) => void
  steamImport: UseMutationResult<unknown[], Error, string>
  importCount: number | null
}

export function SteamImportPanel({ steamProfile, setSteamProfile, steamImport, importCount }: SteamImportPanelProps) {
  return (
    <div className="mb-4 py-3.5 px-4 bg-[#111118] border border-[#1a1a26] rounded-lg">
      <div className="flex gap-2 items-center">
        <Input
          type="text"
          value={steamProfile}
          onChange={(e) => setSteamProfile(e.target.value)}
          placeholder="Steam profile URL, vanity name, or ID..."
          aria-label="Steam profile URL, vanity name, or ID"
          onKeyDown={(e) => { if (e.key === "Enter" && steamProfile.trim() && !steamImport.isPending) steamImport.mutate(steamProfile.trim()) }}
          className="flex-1 py-2 px-3 rounded-md bg-[#0a0a0f] border-[#222] text-[#ddd] text-[13px] font-['Barlow',sans-serif] outline-none h-auto transition-colors focus-visible:ring-0 focus-visible:border-[#66C0F4]"
          onFocus={(e) => { e.target.style.borderColor = "#66C0F4" }}
          onBlur={(e) => { e.target.style.borderColor = "#222" }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => steamProfile.trim() && steamImport.mutate(steamProfile.trim())}
          disabled={steamImport.isPending || !steamProfile.trim()}
          className="bg-[#66C0F4]/15 border-[#66C0F4]/30 text-[#66C0F4] py-2 px-4 rounded-md text-[12px] font-bold font-['Barlow',sans-serif] tracking-[0.5px] whitespace-nowrap h-auto disabled:bg-[#222] disabled:border-transparent disabled:text-[#555] disabled:opacity-100 cursor-pointer disabled:cursor-wait hover:bg-[#66C0F4]/25 hover:text-[#66C0F4]"
        >{steamImport.isPending ? "IMPORTING..." : "IMPORT"}</Button>
      </div>
      {steamImport.isError && (
        <div className="mt-2.5 text-[12px] text-[#E23636] bg-[#E23636]/[0.08] py-2 px-3 rounded-md">
          {steamImport.error.message}
        </div>
      )}
      {steamImport.isSuccess && (
        <div className="mt-2.5 text-[12px] text-[#4ade80] bg-[#4ade80]/[0.08] py-2 px-3 rounded-md">
          {importCount !== null && importCount > 0 ? `Imported ${importCount} new achievement${importCount !== 1 ? "s" : ""} from Steam!` : "No new achievements to import \u2014 you're already up to date!"}
        </div>
      )}
      <div className="mt-2 text-[11px] text-[#555]">
        e.g. steamcommunity.com/id/yourname or your 64-bit Steam ID
      </div>
    </div>
  )
}
