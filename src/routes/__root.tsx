import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import '../styles.css'

// Canonical host. The site serves from www, so point everything at one origin
// rather than splitting share URLs and link equity across two.
const SITE_URL = 'https://www.numen.site'

// Lead with the claim, not the status. "Coming soon" is already in the header
// badge; spending the share-card headline on it wastes the most-seen line.
const SITE_TITLE = 'Numen — a home AI that runs on hardware you own'
const SITE_DESCRIPTION =
  'It knows who is asking, from which device, and what that device is allowed to do — before it ever acts. No cloud round-trip decides what happens in your own house.'
const OG_ALT =
  "Everything in your house is talking to someone else. Numen doesn't."

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: SITE_TITLE },
      { name: 'description', content: SITE_DESCRIPTION },
      { name: 'color-scheme', content: 'dark' },
      { name: 'theme-color', content: '#08090a' },
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },

      { property: 'og:site_name', content: 'Numen' },
      { property: 'og:title', content: SITE_TITLE },
      { property: 'og:description', content: SITE_DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:image', content: `${SITE_URL}/og.png` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: OG_ALT },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: SITE_TITLE },
      { name: 'twitter:description', content: SITE_DESCRIPTION },
      { name: 'twitter:image', content: `${SITE_URL}/og.png` },
      { name: 'twitter:image:alt', content: OG_ALT },
    ],
    links: [
      { rel: 'canonical', href: SITE_URL },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/favicon.svg' },
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
