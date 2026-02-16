import { useEffect } from 'react'

function emojiToFavicon(emoji) {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  ctx.font = '56px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, 32, 36)
  return canvas.toDataURL()
}

function setFavicon(href) {
  let link = document.querySelector("link[rel='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = href
}

export default function ToolPage({ title, icon, children }) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title ? `${title} — Tools` : 'Tools'

    if (icon) {
      const href = icon.startsWith('data:') ? icon : emojiToFavicon(icon)
      setFavicon(href)
    }

    return () => {
      document.title = prevTitle
      setFavicon("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛠️</text></svg>")
    }
  }, [title, icon])

  return children
}
