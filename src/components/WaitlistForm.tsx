import { useEffect, useState } from 'react'

function encode(data: Record<string, string>) {
  return Object.entries(data)
    .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
    .join('&')
}

type Status = 'idle' | 'pending' | 'confirmed' | 'error'

const countFormatter = new Intl.NumberFormat('en-US')

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/waitlist')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.count === 'number') setCount(data.count)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (honeypot) return
    if (!email || status === 'pending') return
    setStatus('pending')
    setErrorMessage('')

    // Best-effort mirror into Netlify Forms for dashboard visibility — the
    // database call below is the source of truth for success/failure and the count.
    fetch('/__forms.html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'waitlist', email, 'bot-field': '' }),
    }).catch(() => {})

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: honeypot }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setErrorMessage(data?.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }
      if (typeof data?.count === 'number') setCount(data.count)
      setStatus('confirmed')
    } catch {
      setErrorMessage('Network error — check your connection and try again.')
      setStatus('error')
    }
  }

  if (status === 'confirmed') {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="mono flex items-center gap-2 text-[13px] tracking-wide text-[var(--fg-60)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          REQUEST RECEIVED — you&rsquo;re on the list.
        </div>
        {count !== null && (
          <p className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-38)]">
            {countFormatter.format(count)} people now waiting
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        <input type="hidden" name="form-name" value="waitlist" />
        <input
          type="text"
          name="bot-field"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <label htmlFor="waitlist-email" className="sr-only">
          Email address
        </label>
        <input
          id="waitlist-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={status === 'error'}
          className="mono flex-1 rounded-none border border-[var(--hair)] bg-[var(--surface)] px-4 py-3.5 text-[16px] text-[var(--fg-100)] placeholder:text-[var(--fg-38)] outline-none transition-colors focus:border-[var(--accent)] sm:py-3 sm:text-[14px]"
        />
        <button
          type="submit"
          disabled={status === 'pending'}
          className="mono shrink-0 border border-[var(--accent)] bg-[var(--accent)] px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#08090a] transition-opacity hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none sm:py-3"
        >
          {status === 'pending' ? 'Sending…' : 'Request access'}
        </button>
      </form>

      <div className="mono flex min-h-[14px] items-center gap-3 text-[10px] uppercase tracking-[0.18em]">
        {status === 'error' ? (
          <span className="text-[var(--fg-100)]">{errorMessage}</span>
        ) : (
          count !== null && (
            <span className="text-[var(--fg-38)]">
              {countFormatter.format(count)} already waiting
            </span>
          )
        )}
      </div>
    </div>
  )
}
