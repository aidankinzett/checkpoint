import React, { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import Home from './Home.jsx'

// Auto-import all tools from src/tools/
const toolModules = import.meta.glob('./tools/*.jsx')

const tools = Object.entries(toolModules).map(([path, importFn]) => {
  const filename = path.replace('./tools/', '').replace('.jsx', '')
  const slug = filename.toLowerCase().replace(/\s+/g, '-')
  const Component = lazy(importFn)
  return { slug, name: filename, Component }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home tools={tools} />} />
        {tools.map(({ slug, Component }) => (
          <Route
            key={slug}
            path={`/${slug}`}
            element={
              <Suspense fallback={<div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 text-center">Loading...</div>}>
                <Component />
              </Suspense>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
