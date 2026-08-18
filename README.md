# Numen — coming soon

A single-page "coming soon" site for Numen, a local-first personal AI. Built to make one
strong first impression and collect waitlist emails — no product details, no countdown.

## Stack

- [TanStack Start](https://tanstack.com/start) (React) + Vite
- Tailwind CSS v4
- Framer Motion for entrance animation
- A hand-built canvas particle system for the animated wordmark (no animation library needed for that piece)
- Netlify Forms for waitlist capture (no database — see `src/components/WaitlistForm.tsx`)

## Run locally

```bash
pnpm install
pnpm dev
```

Opens on `http://localhost:3000`. Note: Netlify Forms submissions only work on a real Netlify
deploy, not in local dev.

## Structure

- `src/routes/index.tsx` — the entire page
- `src/components/SignalMark.tsx` — canvas animation that assembles the wordmark from a particle field and reacts to the cursor
- `src/components/StatusLine.tsx` — the cycling mono status readout
- `src/components/WaitlistForm.tsx` — email capture, posts to Netlify Forms
- `public/__forms.html` — static skeleton so Netlify's build-time scanner registers the form
