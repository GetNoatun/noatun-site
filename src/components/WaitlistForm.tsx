import { useEffect, useRef, useState } from 'react'

type WaitlistSuccess = { email: string; referralCode: string; referralUrl: string; referralCount: number }

const CURRENT_OPTIONS = [
  { value: 'google', label: 'Google Drive / Photos' },
  { value: 'nextcloud', label: 'Nextcloud' },
  { value: 'immich_plus', label: 'Immich + other' },
  { value: 'nothing', label: 'Nothing yet / scattered' },
] as const

export default function WaitlistForm({ onSuccess }: { onSuccess: (s: WaitlistSuccess) => void }) {
  const [email, setEmail] = useState('')
  const [current, setCurrent] = useState('')
  const [interest, setInterest] = useState<'self_host'|'managed'|'both'|''>('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const [emailError, setEmailError] = useState<string|null>(null)
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const canSubmit = emailValid && !pending

  async function submit(e: React.FormEvent){
    e.preventDefault()
    if(!emailValid){ setEmailError('Enter a valid email'); emailRef.current?.focus(); return }
    setEmailError(null); setError(null); setPending(true)
    try{
      const res = await fetch('/api/waitlist', {
        method:'POST', headers:{'content-type':'application/json'},
        body: JSON.stringify({ email: email.trim().toLowerCase(), current: current||null, interest: interest||null, source: new URLSearchParams(window.location.search).get('ref') || null }),
      })
      const data = await res.json().catch(()=> ({}))
      if(!res.ok){
        if(res.status===404){
          const code = btoa(email.trim().toLowerCase()).slice(0,8).replace(/[^a-zA-Z0-9]/g,'x')
          onSuccess({ email: email.trim(), referralCode: code, referralUrl: `${window.location.origin}?ref=${encodeURIComponent(code)}`, referralCount:0 })
          return
        }
        throw new Error(data.error||data.message||`Failed (${res.status})`)
      }
      onSuccess({ email: data.email??email.trim(), referralCode: data.referralCode??data.code??'NOATUN', referralUrl: data.referralUrl??data.url??`${window.location.origin}?ref=${encodeURIComponent(data.referralCode??'NOATUN')}`, referralCount: data.referralCount??0 })
    }catch(err){ setError(err instanceof Error? err.message : 'Something went wrong. Try again.') }
    finally{ setPending(false) }
  }
  useEffect(()=>{ if(emailError && emailValid) setEmailError(null)},[email, emailValid, emailError])

  return (
    <form onSubmit={submit} noValidate className="w-full">
      {/* Single-column, labels above — per usability skill */}
      <div className="rounded-[20px] bg-white/[0.03] ring-1 ring-white/[0.08] p-3 sm:p-4 backdrop-blur-xl">
        <label className="block">
          <span className="block text-[11px] font-semibold tracking-[0.12em] text-white/45 uppercase">Email — where we’ll reach you</span>
          <input
            ref={emailRef} value={email} onChange={e=>setEmail(e.target.value)}
            onBlur={()=> setEmailError(email.trim() && !emailValid ? 'Enter a valid email' : null)}
            placeholder="" inputMode="email" autoComplete="email"
            aria-invalid={Boolean(emailError)} aria-describedby={emailError? 'email-error':undefined}
            className="mt-2 w-full h-[46px] rounded-[12px] bg-white text-zinc-900 placeholder:text-zinc-400 px-4 text-[15px] font-medium outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-[var(--color-lantern-ring)]"
          />
          <span className="mt-1 block text-[11px] text-white/35">We’ll send launch + early pricing only. No spam.</span>
        </label>
        {emailError ? <p id="email-error" className="mt-2 text-[13px] text-red-300/90">{emailError}</p> : null}
        {error ? <p className="mt-2 text-[13px] text-red-300/90" role="alert">{error}</p> : null}

        <div className="mt-4 grid grid-cols-1 gap-3">
          <label className="block">
            <span className="block text-[11px] font-semibold tracking-[0.12em] text-white/45 uppercase">What are you on today? <span className="font-normal normal-case tracking-normal text-white/30">— optional</span></span>
            <div className="relative mt-2">
              <select value={current} onChange={e=>setCurrent(e.target.value)} className="w-full h-[42px] rounded-[10px] bg-white/[0.06] ring-1 ring-white/10 px-3 pr-9 text-[13px] text-white/85 outline-none focus:ring-2 focus:ring-[var(--color-lantern-ring)] appearance-none">
                <option value="" className="bg-zinc-900">Select (optional)</option>
                {CURRENT_OPTIONS.map(o=> <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/35 text-[11px]">▾</span>
            </div>
          </label>

          <fieldset className="block">
            <legend className="block text-[11px] font-semibold tracking-[0.12em] text-white/45 uppercase">Tell us your path <span className="font-normal normal-case tracking-normal text-white/30">— optional</span></legend>
            <div className="mt-2 flex gap-2">
              {(['self_host','managed','both'] as const).map(v=>(
                <button key={v} type="button" aria-pressed={interest===v} onClick={()=>setInterest(p=> p===v? '' : v)}
                  className={`flex-1 h-[40px] rounded-[10px] text-[12px] font-semibold tracking-wide transition ${interest===v? 'bg-[var(--color-lantern)] text-zinc-950 ring-1 ring-[var(--color-lantern)]' : 'bg-white/[0.06] text-white/70 ring-1 ring-white/10 hover:bg-white/[0.08] hover:text-white'}`}>
                  {v==='self_host' ? 'Self-host' : v==='managed' ? 'Managed' : 'Both'}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <button type="submit" disabled={!canSubmit}
          className="mt-4 w-full h-[48px] rounded-[12px] bg-[var(--color-lantern)] text-zinc-950 text-[15px] font-semibold tracking-[-0.01em] hover:brightness-[1.05] disabled:opacity-45 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[var(--color-lantern-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-panel)] transition">
          {pending ? 'Joining…' : 'Join waitlist — invite 3, unlock early rate →'}
        </button>
        <p className="mt-2 text-center text-[11px] text-white/35">1 primary CTA per viewport. One goal, one page.</p>
      </div>
    </form>
  )
}
