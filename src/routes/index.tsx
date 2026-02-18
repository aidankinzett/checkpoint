import { createFileRoute, Link } from '@tanstack/react-router'

interface ToolMeta {
  title: string
  description?: string
  icon?: string
}

interface ToolModule {
  meta?: ToolMeta
}

const toolModules = import.meta.glob<ToolModule>('../tools/*.tsx', {
  eager: true,
})

interface Tool {
  slug: string
  name: string
  description: string
  icon?: string
}

const tools: Tool[] = Object.entries(toolModules).map(([path, mod]) => {
  const filename = path.replace('../tools/', '').replace('.tsx', '')
  const slug = filename.toLowerCase().replace(/\s+/g, '-')
  const meta = mod.meta || ({} as ToolMeta)
  return {
    slug,
    name: meta.title || filename,
    description: meta.description || '',
    icon: meta.icon,
  }
})

export const Route = createFileRoute('/')(  {
  component: Home,
  head: () => ({
    meta: [{ title: 'Tools' }],
  }),
})

function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <h1 className="text-3xl font-bold mb-2">Tools</h1>
      <p className="text-zinc-400 mb-8">A collection of standalone tools.</p>
      {tools.length === 0 ? (
        <p className="text-zinc-500">
          No tools yet. Add a TSX file to{' '}
          <code className="text-zinc-300">src/tools/</code> to get started.
        </p>
      ) : (
        <div className="grid gap-3 max-w-md">
          {tools.map(({ slug, name, description, icon }) => (
            <Link
              key={slug}
              to={`/${slug}`}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors"
            >
              {icon && (
                <span className="text-xl shrink-0">
                  {icon.startsWith('data:') ? (
                    <img src={icon} alt="" className="w-6 h-6" />
                  ) : (
                    icon
                  )}
                </span>
              )}
              <div>
                <div className="font-medium">{name}</div>
                {description && (
                  <div className="text-sm text-zinc-400">{description}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
