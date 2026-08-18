import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Numen — coming soon' },
      {
        name: 'description',
        content:
          'Numen is a local-first personal AI presence for your home. Join the waitlist.',
      },
      { name: 'color-scheme', content: 'dark' },
      { name: 'theme-color', content: '#08090a' },
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      { property: 'og:title', content: 'Numen — coming soon' },
      {
        property: 'og:description',
        content:
          'Numen is a local-first personal AI presence for your home. Join the waitlist.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://numen.site' },
    ],
    links: [
      { rel: 'canonical', href: 'https://numen.site' },
      { rel: 'icon', type: 'image/svg+xml', href: '/Comming-soon-website/favicon.svg' },
      { rel: 'icon', type: 'image/x-icon', href: '/Comming-soon-website/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/Comming-soon-website/favicon.svg' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
