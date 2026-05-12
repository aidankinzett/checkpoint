/// <reference types="vite/client" />
import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import appCss from '../styles/app.css?url'
import { Toaster } from '~/components/ui/sonner'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: 'Checkpoint' },
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        {
          rel: 'icon',
          href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏆</text></svg>",
        },
      ],
    }),
    component: RootComponent,
    notFoundComponent: NotFound,
  },
)

function RootComponent() {
  const { queryClient } = Route.useRouteContext()
  return (
    <QueryClientProvider client={queryClient}>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </QueryClientProvider>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-zinc-400 mb-6">Page not found.</p>
      <Link to="/" className="text-blue-400 hover:text-blue-300 underline">
        Back to Home
      </Link>
    </div>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
