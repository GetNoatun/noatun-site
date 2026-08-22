import { useEffect, useRef, useState } from 'react'
type WaitlistSuccess = { email: string; referralCode: string; referralUrl: string; referralCount: number }
const CURRENT_OPTIONS = [
  { value: 'google', label: 'Google Drive / Photos' },
  { value: 'nextcloud', label: 'Nextcloud' },
  { value: 'immich_plus', label: 'Immich + other' },
  { value: 'nothing', label: 'Nothing yet / scattered' },
] as const
export default function WaitlistForm({ onSuccess }: { onSuccess: (s: WaitlistSuccess) => void }){
  const [email,setEmail]=useState(''); const [current,setCurrent]=useState(''); const [interest,setInterest]=useState<'self_host'|'managed'|'both'|''>('')
  const [pending,setPending]=useState(false); const [error,setError]=useState<string|null>(null)
  const emailRef=useRef<HTMLInputElement>(null); const [emailError,setEmailError]=useState<string|null>(null)
  const emailValid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()); const canSubmit=emailValid && !pending
  async function submit(e: React.FormEvent){
    e.preventDefault(); if(!emailValid){ setEmailError('Skriv inn en gyldig e-post'); emailRef.current?.focus(); return }
    setEmailError(null); setError(null); setPending(true)
    try{
      const res = await fetch('/api/waitlist', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ email: email.trim().toLowerCase(), current: current||null, interest: interest||null, source: new URLSearchParams(window.location.search).get('ref') || null }) })
      const data = await res.json().catch(()=> ({}))
      if(!res.ok){
        if(res.status===404){ const code=btoa(email.trim().toLowerCase()).slice(0,8).replace(/[^a-zA-Z0-9]/g,'x'); onSuccess({ email: email.trim(), referralCode: code, referralUrl: `${window.location.origin}?ref=${encodeURIComponent(code)}`, referralCount:0 }); return }
        throw new Error(data.error||data.message||`Failed (${res.status})`)
      }
      onSuccess({ email: data.email??email.trim(), referralCode: data.referralCode??data.code??'NOATUN', referralUrl: data.referralUrl??data.url??`${window.location.origin}?ref=${encodeURIComponent(data.referralCode??'NOATUN')}`, referralCount: data.referralCount??0 })
    }catch(err){ setError(err instanceof Error? err.message : 'Noe gikk galt. Prøv igjen.') } finally{ setPending(false) }
  }
  useEffect(()=>{ if(emailError && emailValid) setEmailError(null)},[email, emailValid, emailError])
  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className="rounded-[18px] bg-white ring-1 ring-black/10 p-3 sm:p-4 shadow-[0_16px_48px_rgba(12,20,24,0.18)]">
        <label className="block">
          <span className="block font-mono text-[10px] tracking-[0.14em] text-zinc-500 uppercase">E-post</span>
          <input ref={emailRef} value={email} onChange={e=>setEmail(e.target.value)} onBlur={()=> setEmailError(email.trim() && !emailValid ? 'Skriv inn en gyldig e-post' : null)} placeholder="deg@havn.no" inputMode="email" autoComplete="email" aria-invalid={Boolean(emailError)} aria-describedby={emailError? 'email-error':undefined} className="mt-1.5 w-full h-[46px] rounded-[12px] bg-zinc-50 ring-1 ring-zinc-200 px-4 text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 outline-none focus:bg-white focus:ring-2 focus:ring-[var(--color-harbour-ring)]" />
        </label>
        {emailError ? <p id="email-error" className="mt-2 text-[13px] text-red-600">{emailError}</p> : null}
        {error ? <p className="mt-2 text-[13px] text-red-600" role="alert">{error}</p> : null}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <label className="block">
            <span className="block font-mono text-[10px] tracking-[0.14em] text-zinc-500 uppercase">Nåværende løsning <span className="normal-case tracking-normal font-normal text-zinc-400">— valgfritt</span></span>
            <div className="relative mt-1.5">
              <select value={current} onChange={e=>setCurrent(e.target.value)} className="w-full h-[40px] rounded-[10px] bg-zinc-50 ring-1 ring-zinc-200 px-3 pr-8 text-[13px] text-zinc-700 outline-none focus:bg-white focus:ring-2 focus:ring-[var(--color-harbour-ring)] appearance-none">
                <option value="" className="bg-white">Velg (valgfritt)</option>
                {CURRENT_OPTIONS.map(o=> <option key={o.value} value={o.value} className="bg-white">{o.label}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[11px]">▾</span>
            </div>
          </label>
          <fieldset className="block">
            <legend className="block font-mono text-[10px] tracking-[0.14em] text-zinc-500 uppercase">Veien videre <span className="normal-case tracking-normal font-normal text-zinc-400">— valgfritt</span></legend>
            <div className="mt-1.5 flex gap-1.5">
              {(['self_host','managed','both'] as const).map(v=> (
                <button key={v} type="button" aria-pressed={interest===v} onClick={()=>setInterest(p=> p===v? '' : v)} className={`flex-1 h-[40px] rounded-[10px] text-[12px] font-semibold tracking-wide transition ${interest===v? 'bg-[var(--color-harbour)] text-white ring-1 ring-[var(--color-harbour)]' : 'bg-zinc-50 text-zinc-600 ring-1 ring-zinc-200 hover:bg-white hover:text-zinc-800'}`}>{v==='self_host' ? 'Selv-host' : v==='managed' ? 'Driftet' : 'Begge'}</button>
              ))}
            </div>
          </fieldset>
        </div>
        <button type="submit" disabled={!canSubmit} className="mt-4 w-full h-[48px] rounded-[12px] bg-[var(--color-harbour)] text-white text-[14px] font-semibold tracking-[-0.01em] hover:brightness-[1.06] disabled:opacity-45 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[var(--color-harbour-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white transition"> {pending ? 'Legger til…' : 'Bli med — inviter 3, lås tidlig pris →'} </button>
        <p className="mt-2 text-center font-mono text-[11px] text-zinc-500">Én hensikt, én side. Ingen spam. Avmeld når som helst.</p>
      </div>
    </form>
  )
}
