import { useEffect, useState } from 'react'

const STATES = [
  { label: 'IDLE', detail: 'awaiting wake' },
  { label: 'LISTENING', detail: 'capturing input' },
  { label: 'ROUTED', detail: 'under 50ms · no model' },
  { label: 'THINKING', detail: 'reasoning locally' },
  { label: 'CONFIRMED', detail: 'action authorised' },
]

/** Live mono status readout — an aircraft-instrument tell for a system that's always awake. */
export function StatusLine() {
  const [i, setI] = useState(0)
  const [clock, setClock] = useState('00:00:00.0')

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % STATES.length), 2200)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date()
      setClock(
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(
          d.getSeconds(),
        ).padStart(2, '0')}.${Math.floor(d.getMilliseconds() / 100)}`,
      )
    }, 100)
    return () => clearInterval(id)
  }, [])

  const s = STATES[i]

  return (
    <div className="mono flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase text-[var(--fg-38)]">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-40" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
      </span>
      <span className="text-[var(--fg-60)]">{s.label}</span>
      <span>·</span>
      <span>{s.detail}</span>
      <span className="hidden sm:inline ml-auto tabular-nums normal-case">{clock}</span>
    </div>
  )
}
