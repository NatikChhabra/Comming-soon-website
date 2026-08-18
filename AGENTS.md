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
| Framework | TanStack Start (Static prerender) |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 (utility classes + CSS custom properties for design tokens) |
| Animation | Framer Motion for entrance transitions; a hand-rolled canvas particle system for the hero mark |
| Database & Waitlist | Supabase (PostgreSQL with RLS) + Netlify Forms fallback |
| Deployment | GitHub Pages via GitHub Actions / Netlify |
| Language | TypeScript, strict mode |

## Directory structure

```
├── .github
│   └── workflows
│       └── deploy.yml      # GitHub Actions CI/CD to GitHub Pages
├── db
│   └── supabase_schema.sql # PostgreSQL schema & RLS policies
├── public
│   ├── favicon.svg         # Geometric 'N' vector favicon matching UI
│   ├── favicon.ico         # Standard 32x32 ICO favicon
│   ├── CNAME               # Custom domain (numen.site)
│   └── __forms.html        # static form skeleton
├── src
│   ├── components
│   │   ├── SignalMark.tsx   # canvas: samples "NUMEN" into a particle field, animates it into formation, reacts to cursor
│   │   ├── StatusLine.tsx   # cycling mono status readout (IDLE/LISTENING/ROUTED/...) + live clock
│   │   └── WaitlistForm.tsx # email input, submits to Supabase PostgreSQL / Netlify Forms
│   ├── lib
│   │   └── supabase.ts      # Supabase client helper
│   ├── config.ts            # Application config
│   ├── routes
│   │   ├── __root.tsx       # document shell, meta tags, favicon links
│   │   └── index.tsx        # the entire page — header, hero, waitlist, footer
│   ├── router.tsx
│   └── styles.css           # design tokens (colors, dark base) + Tailwind import
├── netlify.toml
└── vite.config.ts
```

## Design system

Monochrome with exactly one accent color (`--accent`, a lime/chartreuse), used sparingly —
the live status dot, the scan sweep in the hero canvas, and the primary button. Dark-only
background (`--base`/`--surface`/`--raised` layers). Mono typeface for anything instrument-like
(labels, status text, timestamps); default sans for prose.
