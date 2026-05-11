import { useState, useMemo, useRef } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Search, X, ChevronRight, Loader, Gamepad2 } from 'lucide-react'
import { getAllGames } from '~/games/registry'
import { fetchUserOwnedGames, type OwnedGame } from '~/server/steam-games'
import { useSession, authClient } from '~/hooks/use-session'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export const Route = createFileRoute('/')({
  component: Home,
  ssr: false,
  head: () => ({
    meta: [{ title: 'Checkpoint' }],
  }),
})

const curatedGames = getAllGames()
const steamAppIdToCurated = new Map(
  curatedGames.filter(g => g.steamAppId).map(g => [g.steamAppId!, g.id])
)

function formatPlaytime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  return `${Math.floor(minutes / 60)}h`
}

function SteamLoginPill({ displayName, avatarUrl }: { displayName?: string | null; avatarUrl?: string | null }) {
  if (displayName) {
    return (
      <div className="inline-flex items-center gap-[10px] py-[6px] pr-[6px] pl-[10px] rounded-full bg-[#66C0F4]/[0.08] border border-[#66C0F4]/[0.3] shrink-0">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-6 h-6 rounded-full" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80]" />
        )}
        <span className="text-[12px] text-[#cfe9f7] tracking-[0.4px] whitespace-nowrap">{displayName}</span>
        <Button
          variant="outline"
          onClick={() => authClient.signOut()}
          className="bg-transparent border-[#2a3a48] text-[#7892a3] py-1 px-[10px] h-auto rounded-full text-[10px] font-bold font-['Barlow',sans-serif] tracking-[1.2px] hover:bg-[#2a3a48]/50 hover:text-white whitespace-nowrap"
        >DISCONNECT</Button>
      </div>
    )
  }
  return (
    <a
      href="/api/auth/sign-in/steam"
      className="inline-flex items-center gap-[10px] py-[10px] px-[18px] rounded-lg bg-gradient-to-b from-[#1b3a5c] to-[#122a44] border border-[#66C0F4]/50 text-[#cfe9f7] font-['Bebas_Neue',sans-serif] text-[15px] tracking-[3px] no-underline shadow-[0_0_24px_rgba(102,192,244,0.15),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-150 whitespace-nowrap shrink-0"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#66C0F4] shrink-0">
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.455 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z" />
      </svg>
      SIGN IN WITH STEAM
    </a>
  )
}

function Home() {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)

  const { data: session, isPending: sessionLoading } = useSession()
  const steamId = session?.user.steamId
  const displayName = session?.user.displayName
  const avatarUrl = session?.user.avatarUrl

  const libraryQuery = useQuery({
    queryKey: ['steam-library', steamId],
    queryFn: () => fetchUserOwnedGames(),
    enabled: !!steamId,
    staleTime: 1000 * 60 * 5,
  })

  const hasQuery = search.trim().length > 0

  const curatedResults = useMemo(() => {
    if (!hasQuery) return []
    const q = search.trim().toLowerCase()
    return curatedGames.filter(g =>
      `${g.headerPrefix ?? ''} ${g.title} ${g.subtitle ?? ''}`.toLowerCase().includes(q)
    )
  }, [search, hasQuery])

  const libraryResults = useMemo((): OwnedGame[] => {
    if (!hasQuery) return []
    const games = libraryQuery.data ?? []
    const nonCurated = games.filter(g => !steamAppIdToCurated.has(g.appid))
    const q = search.trim().toLowerCase()
    return nonCurated.filter(g => g.name?.toLowerCase().includes(q)).slice(0, 20)
  }, [libraryQuery.data, search, hasQuery])

  function cacheGameName(appid: number, name: string) {
    try { localStorage.setItem(`steam-game-name:${appid}`, name) } catch { /* noop */ }
  }

  const totalResults = curatedResults.length + libraryResults.length

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#E8E8E8] font-['Barlow',sans-serif]">
      {/* Top bar */}
      <div className="border-b border-[#18181f]">
        <div className="max-w-[720px] mx-auto py-[14px] px-6 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2 shrink-0 min-w-0">
            <span className="font-['Bebas_Neue',sans-serif] text-[22px] tracking-[4px] text-[#E8E8E8] whitespace-nowrap">CHECKPOINT</span>
            <span className="text-[11px] text-[#4a4a55] tracking-[1.5px] whitespace-nowrap">ACHIEVEMENT TRACKER</span>
          </div>
          {sessionLoading ? (
            <div className="w-8 h-8 rounded-full bg-[#1a1a26] animate-spin border-2 border-[#2a2a3a] border-t-[#66C0F4]" />
          ) : (
            <SteamLoginPill displayName={displayName} avatarUrl={avatarUrl} />
          )}
        </div>
      </div>

      <div className="max-w-[720px] mx-auto pt-[56px] px-6 pb-[80px]">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="font-['Bebas_Neue',sans-serif] text-[clamp(48px,9vw,84px)] tracking-[6px] m-0 leading-none text-[#E8E8E8]">
            FIND YOUR <span className="text-[#66C0F4]">NEXT</span> CHECKPOINT
          </h1>
          <p className="text-[#7a7a85] mt-[14px] text-[15px] tracking-[0.3px]">
            {displayName ? (
              <>Search your library to start tracking. <span className="text-[#a1a1aa]">Signed in as <strong className="text-[#cfe9f7] font-bold">{displayName}</strong>.</span></>
            ) : (
              <>Connect Steam to sync, or jump in and search a game below.</>
            )}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <span className="absolute left-[18px] top-1/2 -translate-y-1/2 inline-flex pointer-events-none text-[#5a5a65]">
            <Search size={18} strokeWidth={2} />
          </span>
          <Input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search a game…  (try 'spider', 'cyber', 'forza')"
            className="w-full box-border py-4 pr-12 pl-[50px] bg-[#0f0f18] border border-[#1f1f2a] rounded-[10px] text-[#E8E8E8] text-[16px] font-['Barlow',sans-serif] outline-none transition-colors duration-150 focus-visible:ring-0 focus-visible:border-[#66C0F4] focus-visible:shadow-[0_0_0_3px_rgba(102,192,244,0.12)] placeholder:text-[#4a4a55] h-auto"
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { setSearch(''); inputRef.current?.focus() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#7a7a85] hover:text-[#E8E8E8] hover:bg-transparent h-8 w-8"
            >
              <X size={16} strokeWidth={2} />
            </Button>
          )}
        </div>

        {/* Results */}
        {hasQuery ? (
          totalResults === 0 ? (
            <div className="text-center py-10 px-5 text-[#5a5a65] border border-dashed border-[#1f1f2a] rounded-[10px]">
              <div className="font-['Bebas_Neue',sans-serif] text-[22px] tracking-[3px] text-[#7a7a85] mb-1.5">NO MATCHES</div>
              <div className="text-[13px]">Nothing in our tracked library matches "{search}".</div>
            </div>
          ) : (
            <div>
              <div className="text-[11px] font-bold tracking-[2px] text-[#5a5a65] mb-2.5">
                {totalResults} {totalResults === 1 ? 'RESULT' : 'RESULTS'}
              </div>
              <div className="grid gap-2.5">
                {curatedResults.map(game => {
                  const hovered = hoverId === game.id
                  const fullTitle = `${game.headerPrefix ? game.headerPrefix + ' ' : ''}${game.title}${game.subtitle ? ' ' + game.subtitle : ''}`
                  return (
                    <Link
                      key={game.id}
                      to="/$gameId"
                      params={{ gameId: game.id }}
                      onMouseEnter={() => setHoverId(game.id)}
                      onMouseLeave={() => setHoverId(null)}
                      className={`flex items-center gap-[14px] py-[14px] px-4 rounded-[10px] no-underline text-[#E8E8E8] cursor-pointer transition-colors duration-150 ${hovered ? 'bg-[#1a1a24]' : 'bg-[#101019]'}`}
                      style={{
                        border: `1px solid ${hovered ? game.theme.accent : '#1a1a24'}`,
                        boxShadow: hovered ? `0 0 0 1px ${hexToRgba(game.theme.accent, 0.25)}` : 'none',
                      }}
                    >
                      <span className="text-[26px] shrink-0">{game.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{fullTitle}</div>
                        <div className="text-[12px] text-[#7a7a85] mt-0.5 tracking-[0.3px]">
                          {game.achievements.length} achievements · curated guide
                        </div>
                      </div>
                      <span
                        className={`inline-flex transition-opacity duration-150 ${hovered ? 'opacity-100' : 'opacity-40 text-[#666]'}`}
                        style={{ color: hovered ? game.theme.accent : undefined }}
                      >
                        <ChevronRight size={16} strokeWidth={2} />
                      </span>
                    </Link>
                  )
                })}

                {libraryResults.map(game => {
                  const hovered = hoverId === `steam-${game.appid}`
                  return (
                    <Link
                      key={game.appid}
                      to="/steam/$appId"
                      params={{ appId: String(game.appid) }}
                      onClick={() => cacheGameName(game.appid, game.name)}
                      onMouseEnter={() => setHoverId(`steam-${game.appid}`)}
                      onMouseLeave={() => setHoverId(null)}
                      className={`flex items-center gap-[14px] py-[14px] px-4 rounded-[10px] no-underline text-[#E8E8E8] cursor-pointer transition-colors duration-150 border ${hovered ? 'bg-[#1a1a24] border-[#66C0F4] shadow-[0_0_0_1px_rgba(102,192,244,0.25)]' : 'bg-[#101019] border-[#1a1a24]'}`}
                    >
                      {game.img_icon_url ? (
                        <img
                          src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                          alt=""
                          className="w-8 h-8 rounded-[4px] shrink-0"
                        />
                      ) : (
                        <span className="text-[26px] shrink-0 text-[#555]">
                          <Gamepad2 size={26} strokeWidth={1.5} />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{game.name}</div>
                        <div className="text-[12px] text-[#7a7a85] mt-0.5 tracking-[0.3px]">
                          {game.playtime_forever > 0 ? `${formatPlaytime(game.playtime_forever)} played` : 'Not played'}
                        </div>
                      </div>
                      <span className={`inline-flex transition-opacity duration-150 ${hovered ? 'opacity-100 text-[#66C0F4]' : 'opacity-40 text-[#666]'}`}>
                        <ChevronRight size={16} strokeWidth={2} />
                      </span>
                    </Link>
                  )
                })}

                {/* Library loading state */}
                {steamId && libraryQuery.isLoading && (
                  <div className="flex items-center gap-2.5 py-[14px] px-4 rounded-[10px] bg-[#101019] border border-[#1a1a24] text-[#5a5a65] text-[13px]">
                    <Loader size={14} strokeWidth={2} className="animate-spin text-[#66C0F4]" />
                    Loading Steam library…
                  </div>
                )}
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center py-8 px-5 text-[#4a4a55]">
            <Search size={28} strokeWidth={1.75} color="#2a2a35" />
            <div className="text-[13px] mt-2.5 tracking-[0.3px]">
              {steamId
                ? 'Start typing to search your library and curated trackers.'
                : 'Start typing to find a game in the tracked library.'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
