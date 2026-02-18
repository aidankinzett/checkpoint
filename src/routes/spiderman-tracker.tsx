import { createFileRoute } from '@tanstack/react-router'
import SpiderManTracker from '~/tools/spiderman-tracker'

export const Route = createFileRoute('/spiderman-tracker')({
  component: SpiderManTracker,
  ssr: false,
  head: () => ({
    meta: [{ title: 'Spider-Man Tracker — Tools' }],
    links: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&display=swap',
      },
    ],
  }),
})
