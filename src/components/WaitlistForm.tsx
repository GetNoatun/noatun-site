import { useEffect, useRef, useState } from 'react'

type WaitlistSuccess = { email: string; referralCode: string; referralUrl: string; referralCount: number }

const CURRENT_OPTIONS = [
  { value: 'google', label: 'Google Drive / Photos' },
  { value: 'nextcloud', label: 'Nextcloud' },
  { value: 'immich_plus', label: 'Immich + other tools' },
  { value: 'nothing', label: 'Nothing yet / scattered' },
] as const

export default function WaitlistForm({ onSuccess }: { onSuccess: (success: WaitlistSuccess) => void }) {
  const [email, setEmail] = useState('')
  const [current, setCurrent] = useState('')
  const [interest, setInterest] = useState<'self_host' | 'managed' | 'both' | ''>('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!emailValid) {
      setEmailError('Enter a valid email address')
      emailRef.current?.focus()
      return
    }
    setEmailError(null)
    setError(null)
    setPending(true)
    try {
      const response = await fetch('/api/waitlist', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: email.trim().toLowerCase(), current: current || null, interest: interest || null, source: new URLSearchParams(window.location.search).get('ref') || null }) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        if (response.status === 404) {
          const code = btoa(email.trim().toLowerCase()).slice(0, 8).replace(/[^a-zA-Z0-9]/g, 'x')
          onSuccess({ email: email.trim(), referralCode: code, referralUrl: `${window.location.origin}?ref=${encodeURIComponent(code)}`, referralCount: 0 })
          return
        }
        throw new Error(data.error || data.message || `Failed (${response.status})`)
      }
      const code = data.referralCode ?? data.code ?? 'NOATUN'
      onSuccess({ email: data.email ?? email.trim(), referralCode: code, referralUrl: data.referralUrl ?? data.url ?? `${window.location.origin}?ref=${encodeURIComponent(code)}`, referralCount: data.referralCount ?? 0 })
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Something went wrong. Try again.')
    } finally {
      setPending(false)
    }
  }

  useEffect(() => { if (emailError && emailValid) setEmailError(null) }, [email, emailValid, emailError])

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className="grid gap-3 sm:grid-cols-[1.25fr_0.75fr]">
        <label className="block"><span className="block font-mono text-[10px] font-semibold tracking-[0.12em] text-zinc-500">EMAIL ADDRESS</span><input ref={emailRef} value={email} onChange={event => setEmail(event.target.value)} onBlur={() => setEmailError(email.trim() && !emailValid ? 'Enter a valid email address' : null)} placeholder="you@domain.com" inputMode="email" autoComplete="email" aria-invalid={Boolean(emailError)} aria-describedby={emailError ? 'email-error' : undefined} className="mt-1.5 h-11 w-full rounded-[11px] bg-zinc-50 px-3.5 text-[14px] text-zinc-900 outline-none ring-1 ring-zinc-200 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-[var(--color-harbour-ring)]" /></label>
        <label className="block"><span className="block font-mono text-[10px] font-semibold tracking-[0.12em] text-zinc-500">CURRENTLY USING <span className="font-normal tracking-normal text-zinc-400">(OPTIONAL)</span></span><div className="relative mt-1.5"><select value={current} onChange={event => setCurrent(event.target.value)} className="h-11 w-full appearance-none rounded-[11px] bg-zinc-50 px-3 pr-8 text-[13px] text-zinc-700 outline-none ring-1 ring-zinc-200 focus:bg-white focus:ring-2 focus:ring-[var(--color-harbour-ring)]"><option value="">Select one</option>{CURRENT_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">⌄</span></div></label>
      </div>
      {emailError && <p id="email-error" className="mt-2 text-[12px] text-red-600">{emailError}</p>}
      {error && <p className="mt-2 text-[12px] text-red-600" role="alert">{error}</p>}
      <fieldset className="mt-3"><legend className="font-mono text-[10px] font-semibold tracking-[0.12em] text-zinc-500">I’M HERE TO <span className="font-normal tracking-normal text-zinc-400">(OPTIONAL)</span></legend><div className="mt-1.5 grid grid-cols-3 gap-1.5">{(['self_host', 'managed', 'both'] as const).map(value => <button key={value} type="button" aria-pressed={interest === value} onClick={() => setInterest(previous => previous === value ? '' : value)} className={`h-9 rounded-[9px] text-[12px] font-semibold transition ${interest === value ? 'bg-[var(--color-harbour)] text-white ring-1 ring-[var(--color-harbour)]' : 'bg-zinc-50 text-zinc-600 ring-1 ring-zinc-200 hover:bg-white hover:text-zinc-900'}`}>{value === 'self_host' ? 'Self-hosting' : value === 'managed' ? 'Managed' : 'Both'}</button>)}</div></fieldset>
      <button type="submit" disabled={!emailValid || pending} className="mt-4 h-12 w-full rounded-[11px] bg-[var(--color-harbour)] text-[14px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:ring-2 focus-visible:ring-[var(--color-harbour-ring)] focus-visible:ring-offset-2">{pending ? 'Joining…' : 'Get early access →'}</button>
      <p className="mt-2 text-center font-mono text-[10px] text-zinc-400">No spam. Just launch news and early access.</p>
    </form>
  )
}
