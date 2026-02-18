export function emojiToFavicon(emoji: string): string {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  ctx.font = '56px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, 32, 36)
  return canvas.toDataURL()
}

export function setFavicon(href: string): void {
  let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = href
}
