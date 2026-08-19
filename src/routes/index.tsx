import { createFileRoute } from '@tanstack/react-router'
import { SignalMark } from '@/components/SignalMark'
import { StatusLine } from '@/components/StatusLine'
import { WaitlistForm } from '@/components/WaitlistForm'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[var(--base)]">
      {/* hairline instrument grid, masked to fade toward the edges rather than cut off hard */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(var(--fg-100) 1px, transparent 1px), linear-gradient(90deg, var(--fg-100) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)',
        }}
      />
      {/* two slow-drifting glows give the field depth without adding a second colour */}
      <div className="pointer-events-none absolute -left-1/4 -top-1/3 h-[70vh] w-[70vh] will-change-transform bg-glow-a" />
      <div className="pointer-events-none absolute -right-1/4 bottom-0 h-[60vh] w-[60vh] will-change-transform bg-glow-b" />
      {/* fixed vignette to pull focus back to centre on wide viewports */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_45%,rgba(2,3,3,0.55)_100%)]" />
      {/* film grain — the one texture cue that reads as considered rather than flat */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-grain" />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-6 pb-[env(safe-area-inset-bottom)] sm:px-10">
        <header className="flex items-center justify-between py-8">
          <span className="mono text-[11px] uppercase tracking-[0.3em] text-[var(--fg-38)]">
            NUMEN
          </span>
          <span className="mono rounded-full border border-[var(--hair)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--fg-38)]">
            Coming soon
          </span>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-10 py-10 text-center">
          <div className="rise rise-1 w-full">
            <SignalMark />
          </div>

          <div className="rise rise-2">
            <StatusLine />
          </div>

          {/* The line the whole campaign is built on. It was missing from the
              page entirely, so traffic landed on a different sentence than the
              one it clicked — and the document had no h1 at all. */}
          <h1 className="rise rise-3 max-w-2xl text-balance text-[28px] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--fg-100)] sm:text-[40px]">
            Everything in your house is talking to someone else.{' '}
            <span className="text-[var(--accent)]">Numen doesn't.</span>
          </h1>

          <p className="rise rise-3 max-w-xl text-balance text-[15px] leading-relaxed text-[var(--fg-60)] sm:text-[16px]">
            A presence for your home, running entirely on hardware you own. It knows who is
            asking, which device they're asking from, and what that device is allowed to do —
            before it ever acts. No cloud round-trip decides what happens in your own house.
          </p>

          <dl className="rise rise-4 grid w-full max-w-2xl grid-cols-1 divide-y divide-[var(--hair)] border-y border-[var(--hair)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              {
                term: 'Local',
                detail: 'Reasoning happens on-device. Nothing about your home is the product.',
              },
              {
                term: 'Aware',
                detail: 'Knows who is asking, from where, and what that device is allowed to do.',
              },
              {
                term: 'Consensual',
                detail: 'New abilities stay off until you switch them on, one at a time.',
              },
            ].map((item) => (
              <div key={item.term} className="flex flex-col gap-1.5 px-2 py-4 text-center sm:px-5">
                <dt className="mono text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">
                  {item.term}
                </dt>
                <dd className="text-[13px] leading-snug text-[var(--fg-38)]">{item.detail}</dd>
              </div>
            ))}
          </dl>

          <div className="rise rise-5 flex w-full flex-col items-center gap-4">
            <WaitlistForm />
            <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-38)]">
              No spam. One email, when it's ready.
            </p>
          </div>
        </main>

        <footer className="mono flex flex-col items-center gap-2 py-8 text-[10px] uppercase tracking-[0.2em] text-[var(--fg-38)] sm:flex-row sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Numen</span>
          <a
            href="mailto:natik.chhabra@numen.site"
            className="transition-colors hover:text-[var(--fg-60)]"
          >
            natik.chhabra@numen.site
          </a>
        </footer>
      </div>
    </div>
  )
}
