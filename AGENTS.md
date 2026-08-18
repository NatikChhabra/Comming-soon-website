# AGENTS.md

Overview for AI agents and developers working on this codebase.

## What this project is

A single-page "coming soon" site for Numen, a local-first personal AI product. The entire
purpose is: make a strong first impression, name the product, and capture waitlist emails.
It deliberately does not explain the product in depth — no feature list, no countdown timer,
no pricing.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 (utility classes + CSS custom properties for design tokens) |
| Animation | Framer Motion for entrance transitions; a hand-rolled canvas particle system for the hero mark |
| Forms | Netlify Forms (static skeleton + AJAX submit — no backend/database) |
| Language | TypeScript, strict mode |

## Directory structure

```
├── public
│   ├── favicon.ico
│   └── __forms.html        # static form skeleton so Netlify's build scanner registers "waitlist"
├── src
│   ├── components
│   │   ├── SignalMark.tsx   # canvas: samples "NUMEN" into a particle field, animates it into formation, reacts to cursor
│   │   ├── StatusLine.tsx   # cycling mono status readout (IDLE/LISTENING/ROUTED/...) + live clock
│   │   └── WaitlistForm.tsx # email input, submits to Netlify Forms via fetch
│   ├── routes
│   │   ├── __root.tsx       # document shell, meta tags
│   │   └── index.tsx        # the entire page — header, hero, waitlist, footer
│   ├── router.tsx
│   └── styles.css           # design tokens (colors, dark base) + Tailwind import
├── netlify.toml
└── vite.config.ts
```

There is only one route. Do not add a router-driven multi-page structure unless the product
scope actually changes — this site is intentionally a single screen.

## Design system

Monochrome with exactly one accent color (`--accent`, a lime/chartreuse), used sparingly —
the live status dot, the scan sweep in the hero canvas, and the primary button. Dark-only
background (`--base`/`--surface`/`--raised` layers). Mono typeface for anything instrument-like
(labels, status text, timestamps); default sans for prose. This mirrors the visual language
described in the product's own design brief (aircraft-instrument, Braun/Teenage Engineering
influenced, restraint everywhere except one deliberate hero moment) — keep new UI consistent
with it rather than introducing new colors or a generic SaaS look.

## Forms

`public/__forms.html` is a hidden static form that exists only so Netlify's build-time HTML
scanner registers the `waitlist` form (TanStack Start renders the real form client-side, which
Netlify can't see). If you add fields to `WaitlistForm.tsx`, mirror them in `__forms.html` or
submissions will be rejected. Netlify Forms submissions only work on a real deploy, not `pnpm dev`.

## Conventions

- Components: PascalCase, one per file, in `src/components/`
- Import paths use the `@/` alias for `src/*`
- No global state library — this page has no state worth lifting beyond component-local `useState`
