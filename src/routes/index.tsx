import { useState, useMemo, useRef } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Search, X, ChevronRight, Loader, Gamepad2 } from 'lucide-react'
import { getAllGames } from '~/games/registry'
import { fetchUserOwnedGames, type OwnedGame } from '~/server/steam-games'
import { useSession, authClient } from '~/hooks/use-session'

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
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '6px 6px 6px 10px', borderRadius: 999,
        background: 'rgba(102,192,244,0.08)', border: '1px solid rgba(102,192,244,0.3)',
        flexShrink: 0,
      }}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} style={{ width: 24, height: 24, borderRadius: '50%' }} />
        ) : (
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
        )}
        <span style={{ fontSize: 12, color: '#cfe9f7', letterSpacing: 0.4, whiteSpace: 'nowrap' }}>{displayName}</span>
        <button
          onClick={() => authClient.signOut()}
          style={{
            background: 'transparent', border: '1px solid #2a3a48', color: '#7892a3',
            padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700,
            fontFamily: "'Barlow', sans-serif", letterSpacing: 1.2, cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >DISCONNECT</button>
      </div>
    )
  }
  return (
    <a
      href="/api/auth/sign-in/steam"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '10px 18px', borderRadius: 8,
        background: 'linear-gradient(180deg, #1b3a5c 0%, #122a44 100%)',
        border: '1px solid rgba(102,192,244,0.5)',
        color: '#cfe9f7',
        fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 3,
        textDecoration: 'none',
        boxShadow: '0 0 24px rgba(102,192,244,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}
    >
      <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: '#66C0F4', flexShrink: 0 }}>
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
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#E8E8E8', fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @keyframes cp-spin { to { transform: rotate(360deg); } }
        .cp-tile { transition: background 0.15s, border-color 0.15s; }
        .cp-search-input::placeholder { color: #4a4a55; }
        .cp-search-input:focus { border-color: #66C0F4 !important; box-shadow: 0 0 0 3px rgba(102,192,244,0.12); }
      `}</style>

      {/* Top bar */}
      <div style={{ borderBottom: '1px solid #18181f' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexShrink: 0, minWidth: 0 }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 4, color: '#E8E8E8', whiteSpace: 'nowrap' }}>CHECKPOINT</span>
            <span style={{ fontSize: 11, color: '#4a4a55', letterSpacing: 1.5, whiteSpace: 'nowrap' }}>ACHIEVEMENT TRACKER</span>
          </div>
          {sessionLoading ? (
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a1a26', animation: 'cp-spin 1s linear infinite', border: '2px solid #2a2a3a', borderTopColor: '#66C0F4' }} />
          ) : (
            <SteamLoginPill displayName={displayName} avatarUrl={avatarUrl} />
          )}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 80px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 9vw, 84px)', letterSpacing: 6, margin: 0, lineHeight: 1, color: '#E8E8E8' }}>
            FIND YOUR <span style={{ color: '#66C0F4' }}>NEXT</span> CHECKPOINT
          </h1>
          <p style={{ color: '#7a7a85', marginTop: 14, fontSize: 15, letterSpacing: 0.3, margin: '14px 0 0' }}>
            {displayName ? (
              <>Search your library to start tracking. <span style={{ color: '#a1a1aa' }}>Signed in as <strong style={{ color: '#cfe9f7' }}>{displayName}</strong>.</span></>
            ) : (
              <>Connect Steam to sync, or jump in and search a game below.</>
            )}
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', display: 'inline-flex', pointerEvents: 'none', color: '#5a5a65' }}>
            <Search size={18} strokeWidth={2} />
          </span>
          <input
            ref={inputRef}
            className="cp-search-input"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search a game…  (try 'spider', 'cyber', 'forza')"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '16px 48px 16px 50px',
              background: '#0f0f18', border: '1px solid #1f1f2a', borderRadius: 10,
              color: '#E8E8E8', fontSize: 16, fontFamily: "'Barlow', sans-serif",
              outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
          />
          {search && (
            <button
              onClick={() => { setSearch(''); inputRef.current?.focus() }}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: 'none', cursor: 'pointer', padding: 6,
                display: 'inline-flex', color: '#7a7a85',
              }}
            >
              <X size={16} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Results */}
        {hasQuery ? (
          totalResults === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#5a5a65', border: '1px dashed #1f1f2a', borderRadius: 10 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 3, color: '#7a7a85', marginBottom: 6 }}>NO MATCHES</div>
              <div style={{ fontSize: 13 }}>Nothing in our tracked library matches "{search}".</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#5a5a65', marginBottom: 10 }}>
                {totalResults} {totalResults === 1 ? 'RESULT' : 'RESULTS'}
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {curatedResults.map(game => {
                  const hovered = hoverId === game.id
                  const fullTitle = `${game.headerPrefix ? game.headerPrefix + ' ' : ''}${game.title}${game.subtitle ? ' ' + game.subtitle : ''}`
                  return (
                    <Link
                      key={game.id}
                      to="/$gameId"
                      params={{ gameId: game.id }}
                      className="cp-tile"
                      onMouseEnter={() => setHoverId(game.id)}
                      onMouseLeave={() => setHoverId(null)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 16px', borderRadius: 10,
                        background: hovered ? '#1a1a24' : '#101019',
                        border: `1px solid ${hovered ? game.theme.accent : '#1a1a24'}`,
                        textDecoration: 'none', color: '#E8E8E8', cursor: 'pointer',
                        boxShadow: hovered ? `0 0 0 1px ${hexToRgba(game.theme.accent, 0.25)}` : 'none',
                      }}
                    >
                      <span style={{ fontSize: 26, flexShrink: 0 }}>{game.icon}</span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullTitle}</div>
                        <div style={{ fontSize: 12, color: '#7a7a85', marginTop: 2, letterSpacing: 0.3 }}>
                          {game.achievements.length} achievements · curated guide
                        </div>
                      </div>
                      <span style={{ display: 'inline-flex', opacity: hovered ? 1 : 0.4, transition: 'opacity 0.15s', color: hovered ? game.theme.accent : '#666' }}>
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
                      className="cp-tile"
                      onMouseEnter={() => setHoverId(`steam-${game.appid}`)}
                      onMouseLeave={() => setHoverId(null)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 16px', borderRadius: 10,
                        background: hovered ? '#1a1a24' : '#101019',
                        border: `1px solid ${hovered ? '#66C0F4' : '#1a1a24'}`,
                        textDecoration: 'none', color: '#E8E8E8', cursor: 'pointer',
                        boxShadow: hovered ? '0 0 0 1px rgba(102,192,244,0.25)' : 'none',
                      }}
                    >
                      {game.img_icon_url ? (
                        <img
                          src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                          alt=""
                          style={{ width: 32, height: 32, borderRadius: 4, flexShrink: 0 }}
                        />
                      ) : (
                        <span style={{ fontSize: 26, flexShrink: 0, color: '#555' }}>
                          <Gamepad2 size={26} strokeWidth={1.5} />
                        </span>
                      )}
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.name}</div>
                        <div style={{ fontSize: 12, color: '#7a7a85', marginTop: 2, letterSpacing: 0.3 }}>
                          {game.playtime_forever > 0 ? `${formatPlaytime(game.playtime_forever)} played` : 'Not played'}
                        </div>
                      </div>
                      <span style={{ display: 'inline-flex', opacity: hovered ? 1 : 0.4, transition: 'opacity 0.15s', color: hovered ? '#66C0F4' : '#666' }}>
                        <ChevronRight size={16} strokeWidth={2} />
                      </span>
                    </Link>
                  )
                })}

                {/* Library loading state */}
                {steamId && libraryQuery.isLoading && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderRadius: 10, background: '#101019', border: '1px solid #1a1a24', color: '#5a5a65', fontSize: 13 }}>
                    <Loader size={14} strokeWidth={2} style={{ animation: 'cp-spin 0.9s linear infinite', color: '#66C0F4' }} />
                    Loading Steam library…
                  </div>
                )}
              </div>
            </div>
          )
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px', color: '#4a4a55' }}>
            <Search size={28} strokeWidth={1.75} color="#2a2a35" />
            <div style={{ fontSize: 13, marginTop: 10, letterSpacing: 0.3 }}>
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
