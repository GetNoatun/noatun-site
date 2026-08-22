import { useRef, useState } from 'react'
import type { SyntheticEvent } from 'react'

type WaitlistSuccess = { email: string; referralCode: string; referralUrl: string; referralCount: number }

const WORKSPACE_OPTIONS = [
  { value: 'microsoft_365', label: 'Microsoft 365 / SharePoint' },
  { value: 'google_workspace', label: 'Google Workspace' },
  { value: 'dropbox_business', label: 'Dropbox Business' },
  { value: 'nextcloud', label: 'Nextcloud' },
  { value: 'nas_file_server', label: 'NAS / file server' },
  { value: 'mixed_tools', label: 'Mixed internal tools' },
] as const

const TEAM_SIZES = ['2–10', '11–25', '26–50', '51–100', '100+'] as const

function referralUrl(code: string) {
  return `${window.location.origin}${window.location.pathname}?ref=${encodeURIComponent(code)}`
}

export default function TeamWaitlistForm({ onSuccess }: { onSuccess: (success: WaitlistSuccess) => void }) {
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [current, setCurrent] = useState('')
  const [deployment, setDeployment] = useState<'self_host' | 'managed_interest' | 'either' | ''>('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const ready = emailValid && organization.trim().length > 1

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!emailValid) {
      setError('Enter a valid work email address.')
      emailRef.current?.focus()
      return
    }
    if (organization.trim().length < 2) {
      setError('Enter your company or team name.')
      return
    }

    setError(null)
    setNotice(null)
    setPending(true)
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          organization: organization.trim(),
          teamSize: teamSize || null,
          current: current || null,
          interest: deployment || null,
          message: message.trim() || null,
          audience: 'team',
          source: new URLSearchParams(window.location.search).get('ref') || null,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        if (response.status === 404) {
          const subject = encodeURIComponent('Noatun team early access')
          const body = encodeURIComponent(`Work email: ${email.trim()}\nCompany or team: ${organization.trim()}\nTeam size: ${teamSize || 'Not provided'}\nCurrent workspace: ${current || 'Not provided'}\nDeployment interest: ${deployment || 'Not provided'}\n\n${message.trim()}`)
          setNotice('Your email app is opening. Send the prepared message to complete your request.')
          window.location.href = `mailto:hello@noatun.app?subject=${subject}&body=${body}`
          return
        }
        throw new Error(data.error || data.message || `Failed (${response.status})`)
      }
      const code = data.referralCode ?? data.code ?? 'NOATUN'
      onSuccess({ email: data.email ?? email.trim(), referralCode: code, referralUrl: data.referralUrl ?? data.url ?? referralUrl(code), referralCount: data.referralCount ?? 0 })
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Something went wrong. Try again.')
    } finally {
      setPending(false)
    }
  }

  return <form onSubmit={submit} noValidate className="team-waitlist-form w-full">
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block"><span className="block font-mono text-[10px] font-semibold tracking-[0.12em] text-zinc-500">WORK EMAIL</span><input ref={emailRef} value={email} onChange={event => setEmail(event.target.value)} placeholder="you@company.com" inputMode="email" autoComplete="email" className="mt-1.5 h-11 w-full rounded-[11px] bg-zinc-50 px-3.5 text-[14px] text-zinc-900 outline-none ring-1 ring-zinc-200 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-[var(--color-harbour-ring)]" /></label>
      <label className="block"><span className="block font-mono text-[10px] font-semibold tracking-[0.12em] text-zinc-500">COMPANY OR TEAM</span><input value={organization} onChange={event => setOrganization(event.target.value)} placeholder="Your organization" autoComplete="organization" className="mt-1.5 h-11 w-full rounded-[11px] bg-zinc-50 px-3.5 text-[14px] text-zinc-900 outline-none ring-1 ring-zinc-200 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-[var(--color-harbour-ring)]" /></label>
      <label className="block"><span className="block font-mono text-[10px] font-semibold tracking-[0.12em] text-zinc-500">TEAM SIZE <span className="font-normal tracking-normal text-zinc-400">(OPTIONAL)</span></span><select value={teamSize} onChange={event => setTeamSize(event.target.value)} className="mt-1.5 h-11 w-full rounded-[11px] bg-zinc-50 px-3 text-[13px] text-zinc-700 outline-none ring-1 ring-zinc-200 focus:bg-white focus:ring-2 focus:ring-[var(--color-harbour-ring)]"><option value="">Select size</option>{TEAM_SIZES.map(size => <option key={size} value={size}>{size} people</option>)}</select></label>
      <label className="block"><span className="block font-mono text-[10px] font-semibold tracking-[0.12em] text-zinc-500">CURRENT WORKSPACE <span className="font-normal tracking-normal text-zinc-400">(OPTIONAL)</span></span><select value={current} onChange={event => setCurrent(event.target.value)} className="mt-1.5 h-11 w-full rounded-[11px] bg-zinc-50 px-3 text-[13px] text-zinc-700 outline-none ring-1 ring-zinc-200 focus:bg-white focus:ring-2 focus:ring-[var(--color-harbour-ring)]"><option value="">Select one</option>{WORKSPACE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
    </div>
    <fieldset className="mt-3"><legend className="font-mono text-[10px] font-semibold tracking-[0.12em] text-zinc-500">DEPLOYMENT INTEREST <span className="font-normal tracking-normal text-zinc-400">(OPTIONAL)</span></legend><div className="mt-1.5 grid grid-cols-3 gap-1.5">{(['self_host', 'managed_interest', 'either'] as const).map(value => <button key={value} type="button" aria-pressed={deployment === value} onClick={() => setDeployment(previous => previous === value ? '' : value)} className={`min-h-9 min-w-0 rounded-[9px] px-1 text-[11px] font-semibold transition ${deployment === value ? 'bg-[var(--color-harbour)] text-white ring-1 ring-[var(--color-harbour)]' : 'bg-zinc-50 text-zinc-600 ring-1 ring-zinc-200 hover:bg-white hover:text-zinc-900'}`}>{value === 'self_host' ? 'Self-hosted' : value === 'managed_interest' ? 'Future managed' : 'Either'}</button>)}</div></fieldset>
    <label className="mt-3 block"><span className="block font-mono text-[10px] font-semibold tracking-[0.12em] text-zinc-500">WHAT SHOULD WE KNOW? <span className="font-normal tracking-normal text-zinc-400">(OPTIONAL)</span></span><textarea value={message} onChange={event => setMessage(event.target.value)} maxLength={500} rows={3} placeholder="Deployment, security, sharing, or workflow requirements" className="mt-1.5 w-full resize-y rounded-[11px] bg-zinc-50 px-3.5 py-3 text-[13px] text-zinc-900 outline-none ring-1 ring-zinc-200 placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-[var(--color-harbour-ring)]" /></label>
    {error && <p className="mt-2 text-[12px] text-red-600" role="alert">{error}</p>}
    {notice && <p className="mt-2 text-[12px] text-emerald-700" role="status">{notice}</p>}
    <button type="submit" disabled={!ready || pending} className="mt-4 h-12 w-full rounded-[11px] bg-[var(--color-harbour)] text-[14px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:ring-2 focus-visible:ring-[var(--color-harbour-ring)] focus-visible:ring-offset-2">{pending ? 'Sending…' : 'Request team early access →'}</button>
    <p className="mt-2 text-center font-mono text-[10px] text-zinc-400">We will only use this to discuss Noatun and early access.</p>
  </form>
}
