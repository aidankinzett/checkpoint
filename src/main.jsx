import React, { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import Home from './Home.jsx'
import ToolPage from './ToolPage.jsx'

const queryClient = new QueryClient()

// Lazy-load tool components
const toolModules = import.meta.glob('./tools/*.jsx')

// Resolve meta from each tool then render
async function loadMetaAndRender() {
  const tools = await Promise.all(
    Object.entries(toolModules).map(async ([path, importFn]) => {
      const filename = path.replace('./tools/', '').replace('.jsx', '')
      const slug = filename.toLowerCase().replace(/\s+/g, '-')
      // Import the module to read meta — the result is cached,
      // so React.lazy(importFn) reuses the same loaded module
      const mod = await importFn()
      const meta = mod.meta || {}
      const Component = lazy(importFn)
      return {
        slug,
        name: meta.title || filename,
        description: meta.description || '',
        icon: meta.icon || null,
        Component,
      }
    })
  )

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home tools={tools} />} />
            {tools.map(({ slug, name, icon, Component }) => (
              <Route
                key={slug}
                path={`/${slug}`}
                element={
                  <Suspense fallback={<div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 text-center">Loading...</div>}>
                    <ToolPage title={name} icon={icon}>
                      <Component />
                    </ToolPage>
                  </Suspense>
                }
              />
            ))}
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>,
  )
}

loadMetaAndRender()
