import React, { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import Home from './Home.jsx'
import ToolPage from './ToolPage.jsx'

// Lazy-load tool components
const toolModules = import.meta.glob('./tools/*.jsx')

// Build tool list, resolving meta at load time
const tools = Object.entries(toolModules).map(([path, importFn]) => {
  const filename = path.replace('./tools/', '').replace('.jsx', '')
  const slug = filename.toLowerCase().replace(/\s+/g, '-')
  return { slug, filename, path, importFn }
})

// Resolve meta from each tool eagerly then render
async function loadMetaAndRender() {
  const resolved = await Promise.all(
    tools.map(async ({ slug, filename, path, importFn }) => {
      const mod = await import(/* @vite-ignore */ path)
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home tools={resolved} />} />
          {resolved.map(({ slug, name, icon, Component }) => (
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
    </StrictMode>,
  )
}

loadMetaAndRender()
