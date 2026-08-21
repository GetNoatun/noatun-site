import { useEffect, useRef, useState } from 'react'

type WaitlistSuccess = { email: string; referralCode: string; referralUrl: string; referralCount: number }

const CURRENT_OPTIONS = [
  { value: 'google', label: 'Google Drive / Photos' },
  { value: 'nextcloud', label: 'Nextcloud' },
  { value: 'immich_plus', label: 'Immich + other' },
  { value: 'nothing', label: 'Nothing yet / scattered' },
] as const

export default function WaitlistForm({
  onSuccess,
}: {
  onSuccess: (s: WaitlistSuccess) => void
}) {
  const [email, setEmail] = useState('')
  const [current, setCurrent] = useState('')
  const [interest, setInterest] = useState<'self_host' | 'managed' | 'both' | ''>('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const [emailError, setEmailError] = useState<string | null>(null)
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const canSubmit = emailValid && !pending

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!emailValid) {
      setEmailError('Enter a valid email')
      emailRef.current?.focus()
      return
    }
    setEmailError(null)
    setError(null)
    setPending(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          current: current || null,
          interest: interest || null,
          source: new URLSearchParams(window.location.search).get('ref') || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        // Cloudflare Pages fallback: allow demo success when API not wired
        if (res.status === 404) {
          const code = btoa(email.trim().toLowerCase()).slice(0, 8).replace(/[^a-zA-Z0-9]/g, 'x')
          onSuccess({
            email: email.trim(),
            referralCode: code,
            referralUrl: `${window.location.origin}?ref=${encodeURIComponent(code)}`,
            referralCount: 0,
          })
          return
        }
        throw new Error(data.error || data.message || `Failed (${res.status})`)
      }
      onSuccess({
        email: data.email ?? email.trim(),
        referralCode: data.referralCode ?? data.code ?? 'NOATUN',
        referralUrl: data.referralUrl ?? data.url ?? `${window.location.origin}?ref=${encodeURIComponent(data.referralCode ?? 'NOATUN')}`,
        referralCount: data.referralCount ?? 0,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    } finally {
      setPending(false)
    }
  }

  useEffect(() => {
    if (emailError && emailValid) setEmailError(null)
  }, [email, emailValid, emailError])

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className="rounded-[18px] bg-white/[0.04] ring-1 ring-white/[0.08] p-2 sm:p-2.5 backdrop-blur shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col sm:flex-row gap-2">
          <label className="flex-1 min-w-0">
            <span className="sr-only">Email</span>
            <input
              ref={emailRef}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailError(email.trim() && !emailValid ? 'Enter a valid email' : null)}
              placeholder="you@domain.com"
              inputMode="email"
              autoComplete="email"
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? 'email-error' : undefined}
              className="w-full h-[44px] rounded-[12px] bg-white text-zinc-900 placeholder:text-zinc-400 px-4 text-[15px] font-medium outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </label>
          <button
            type="submit"
            disabled={!canSubmit}
            className="h-[44px] shrink-0 rounded-[12px] bg-amber-500 px-6 text-[14px] font-semibold tracking-tight text-zinc-950 hover:bg-amber-400 disabled:opacity-45 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 transition"
          >
            {pending ? 'Joining…' : 'Join waitlist'}
          </button>
        </div>

        {emailError ? (
          <p id="email-error" className="mt-2 text-[13px] text-red-300/90 px-1">{emailError}</p>
        ) : null}
        {error ? (
          <p className="mt-2 text-[13px] text-red-300/90 px-1" role="alert">{error}</p>
        ) : null}

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <label className="relative">
            <span className="sr-only">What are you on today?</span>
            <select
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full h-[40px] rounded-[10px] bg-zinc-900/70 ring-1 ring-white/10 px-3 pr-8 text-[13px] text-zinc-200 outline-none focus:ring-2 focus:ring-amber-500/25 appearance-none"
            >
              <option value="">What are you on today? (optional)</option>
              {CURRENT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[11px]">▾</span>
          </label>

          <div className="flex items-center rounded-[10px] bg-zinc-900/70 ring-1 ring-white/10 p-1">
            {(['self_host','managed','both'] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={interest === v}
                onClick={() => setInterest((p) => (p === v ? '' : v))}
                className={`flex-1 h-[32px] rounded-[8px] text-[12px] font-medium transition ${
                  interest === v ? 'bg-white text-zinc-900' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
                }`}
              >
                {v === 'self_host' ? 'Self-host' : v === 'managed' ? 'Managed' : 'Both'}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-2.5 text-center text-[11px] leading-relaxed text-zinc-500">
          No spam. Launch + early pricing only. <span className="text-zinc-400">Invite 3 → early Managed Noatun rate.</span>
        </p>
      </div>
    </form>
  )
}
