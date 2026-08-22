import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import FAQ from './components/FAQ'
import WaitlistForm from './components/WaitlistForm'

type Success = { email: string; referralCode: string; referralUrl: string; referralCount: number }

type Feature = { number: string; title: string; description: string }

const features: Feature[] = [
  { number: '01', title: 'Your server. Your rules.', description: 'Run Noatun at home or on a VPS. Keep your files in infrastructure you can see, move, and control.' },
  { number: '02', title: 'One place for real life.', description: 'Files, photos, notes, and shared links in one focused workspace — not a pile of disconnected services.' },
  { number: '03', title: 'Light enough to live with.', description: 'A small, deliberate stack for the home labber who cares about RAM, reliability, and a quiet upgrade path.' },
]

const audience = [
  { label: 'SELF-HOSTERS', title: 'The stack is yours.', body: 'Bring your own server, storage, backups, and domain. Noatun gives the setup a product-quality front door.' },
  { label: 'PRIVACY-MINDED', title: 'Keep your life off the ad grid.', body: 'Your personal files should not be someone else’s product. Store them where you choose and share them on your terms.' },
  { label: 'HOME LABBERS', title: 'Less glue. More living.', body: 'Replace the five-app juggling act with one calm place for the things you actually use every day.' },
]

function Mark({ small = false }: { small?: boolean }) {
  return (
    <span className={`${small ? 'h-7 w-7 rounded-[9px]' : 'h-9 w-9 rounded-[12px]'} grid place-items-center bg-[var(--color-harbour)] text-white shadow-[0_5px_18px_rgba(196,90,42,0.25)]`} aria-hidden>
      <svg width={small ? 14 : 18} height={small ? 14 : 18} viewBox="0 0 18 18" fill="none">
        <path d="M3 8.2 9 3l6 5.2v6.1c0 .9-.7 1.7-1.7 1.7H4.7c-.9 0-1.7-.8-1.7-1.7V8.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M6.1 16v-5.1h5.8V16M9 7.1v.05" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function ProductWindow() {
  const nav = ['Overview', 'Files', 'Photos', 'Notes', 'Shared']
  const files = [
    { name: 'Q2_Board_Deck.pdf', meta: '2.4 MB · yesterday', type: 'PDF' },
    { name: 'Beach_2024-08.heic', meta: '4.1 MB · Photos', type: 'IMG' },
    { name: 'House_projects.md', meta: 'Edited 2h ago', type: 'DOC' },
  ]
  return (
    <div className="relative min-w-0 w-full">
      <div className="absolute -inset-5 rounded-[34px] bg-[radial-gradient(ellipse_at_center,rgba(196,90,42,0.18),transparent_68%)] blur-2xl" aria-hidden />
      <div className="product-window relative w-full max-w-full overflow-hidden rounded-[22px] bg-[var(--color-paper)] p-2.5 sm:p-3 shadow-[0_32px_100px_rgba(0,0,0,0.34)] ring-1 ring-white/20">
        <div className="overflow-hidden rounded-[16px] bg-[#f8f8f5] ring-1 ring-black/10">
          <div className="flex h-10 items-center gap-1.5 border-b border-zinc-200 bg-white px-3">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" /><span className="h-2.5 w-2.5 rounded-full bg-zinc-300" /><span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <div className="ml-3 flex min-w-0 items-center gap-2 font-mono text-[10px] tracking-[0.11em] text-zinc-400"><Mark small /><span className="truncate">NOATUN / MY SPACE</span></div>
            <span className="ml-auto hidden rounded-full bg-emerald-50 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide text-emerald-700 sm:inline-flex">ALL SYSTEMS READY</span>
          </div>
          <div className="grid min-w-0 grid-cols-12 gap-3 p-3 sm:gap-4 sm:p-4">
            <aside className="col-span-12 min-w-0 sm:col-span-4">
              <div className="rounded-[13px] bg-[#f1f2ef] p-2.5 ring-1 ring-zinc-200/80 sm:p-3">
                <div className="flex items-center justify-between px-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-zinc-400"><span>MY SPACE</span><span>•••</span></div>
                <nav className="mt-2 space-y-1" aria-label="Product preview navigation">
                  {nav.map((item, index) => <div key={item} className={`flex items-center gap-2 rounded-[9px] px-2.5 py-2 text-[11px] ${index === 0 ? 'bg-zinc-900 font-medium text-white' : 'text-zinc-600'}`}><span className={`h-1.5 w-1.5 rounded-full ${index === 0 ? 'bg-[var(--color-harbour)]' : 'bg-zinc-300'}`} />{item}</div>)}
                </nav>
                <div className="mt-5 border-t border-zinc-200 pt-3">
                  <div className="flex justify-between font-mono text-[10px] text-zinc-500"><span>STORAGE</span><span>42%</span></div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200"><div className="h-full w-[42%] rounded-full bg-[var(--color-harbour)]" /></div>
                  <div className="mt-1 font-mono text-[10px] text-zinc-400">2.1 / 5 GB used</div>
                </div>
              </div>
            </aside>
            <main className="col-span-12 min-w-0 sm:col-span-8">
              <div className="flex items-end justify-between"><div><div className="font-mono text-[10px] tracking-[0.12em] text-zinc-400">TUESDAY, AUGUST 26</div><h3 className="mt-1 font-display text-[23px] tracking-[-0.04em] text-zinc-900">Good morning.</h3></div><button className="hidden h-8 items-center rounded-full bg-zinc-900 px-3 text-[11px] font-semibold text-white sm:inline-flex">Upload</button></div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3"><div className="min-w-0 rounded-[11px] bg-white p-2.5 ring-1 ring-zinc-200"><div className="font-mono text-[9px] text-zinc-400">FILES</div><div className="mt-1 font-display text-[19px] text-zinc-900">128</div></div><div className="min-w-0 rounded-[11px] bg-white p-2.5 ring-1 ring-zinc-200"><div className="font-mono text-[9px] text-zinc-400">PHOTOS</div><div className="mt-1 font-display text-[19px] text-zinc-900">1,204</div></div><div className="min-w-0 rounded-[11px] bg-white p-2.5 ring-1 ring-zinc-200"><div className="font-mono text-[9px] text-zinc-400">SHARED</div><div className="mt-1 font-display text-[19px] text-zinc-900">06</div></div></div>
              <div className="mt-3 rounded-[13px] bg-zinc-900 p-2.5 sm:p-3"><div className="mb-2 flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.12em] text-white/50">RECENTLY UPDATED</span><span className="font-mono text-[10px] text-white/35">VIEW ALL →</span></div><div className="space-y-1.5">{files.map(file => <div key={file.name} className="flex items-center gap-2.5 rounded-[10px] bg-white/[0.07] px-2.5 py-2 ring-1 ring-white/10"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-[8px] bg-[var(--color-harbour-soft)] font-mono text-[8px] font-semibold text-[var(--color-harbour)]">{file.type}</span><div className="min-w-0 flex-1"><div className="truncate text-[11px] font-medium text-white/90">{file.name}</div><div className="truncate font-mono text-[9px] text-white/40">{file.meta}</div></div><span className="text-white/25">•••</span></div>)}</div></div>
            </main>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-2 hidden items-center gap-2 rounded-full bg-white px-3 py-2 font-mono text-[10px] font-semibold text-zinc-700 shadow-xl ring-1 ring-zinc-200 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />RUNNING ON YOUR INFRASTRUCTURE</div>
    </div>
  )
}

export default function App() {
  const [success, setSuccess] = useState<Success | null>(null)
  const [copied, setCopied] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const referralLink = useMemo(() => success?.referralUrl ?? '', [success])

  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#joined=')) {
      try { setSuccess(JSON.parse(atob(decodeURIComponent(hash.slice(8)))) as Success); window.history.replaceState(null, '', window.location.pathname + window.location.search) } catch { /* invalid referral payload */ }
    }
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('in')), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  async function copyReferral() {
    if (!referralLink) return
    await navigator.clipboard.writeText(referralLink).catch(() => undefined)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--color-fjord)] text-[var(--color-mist)]">
      <header className="relative z-40 border-b border-white/[0.08] bg-[var(--color-fjord)]/80 backdrop-blur-xl">
        <div className="relative mx-auto flex h-16 w-full min-w-0 max-w-[1180px] items-center gap-3 px-5 sm:px-7">
          <a href="#top" className="flex items-center gap-2.5" aria-label="Noatun home"><Mark small /><span className="text-[14px] font-semibold tracking-[-0.02em] text-white">Noatun</span></a>
          <div className="ml-8 hidden items-center gap-7 text-[13px] text-white/50 md:flex"><a href="#why" className="transition hover:text-white">Why Noatun</a><a href="#for-you" className="transition hover:text-white">Made for you</a><a href="#faq" className="transition hover:text-white">FAQ</a></div>
          <div className="header-actions ml-auto flex shrink-0 items-center gap-2"><a href="https://github.com/fifthsegment/noatun" target="_blank" rel="noreferrer" className="hidden h-9 items-center rounded-full px-3.5 text-[13px] text-white/65 transition hover:bg-white/[0.07] hover:text-white sm:inline-flex">GitHub <span className="ml-1 text-white/35">↗</span></a><a href="#waitlist" className="inline-flex h-9 items-center rounded-full bg-white px-3.5 text-[13px] font-semibold text-zinc-900 transition hover:bg-zinc-100 sm:px-4"><span className="sm:hidden">Join</span><span className="hidden sm:inline">Get early access</span></a><button className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] text-white/80 sm:hidden" aria-label="Open menu" aria-expanded={mobileNav} onClick={() => setMobileNav(value => !value)}>{mobileNav ? '×' : '≡'}</button></div>
        </div>
        {mobileNav && <nav className="border-t border-white/[0.08] bg-[var(--color-fjord)] px-5 py-3 sm:hidden"><a href="#why" onClick={() => setMobileNav(false)} className="block rounded-lg px-3 py-2.5 text-sm text-white/70">Why Noatun</a><a href="#for-you" onClick={() => setMobileNav(false)} className="block rounded-lg px-3 py-2.5 text-sm text-white/70">Made for you</a><a href="#faq" onClick={() => setMobileNav(false)} className="block rounded-lg px-3 py-2.5 text-sm text-white/70">FAQ</a></nav>}
      </header>

      <main id="top">
        <section className="hero relative overflow-hidden">
          <div className="aurora" aria-hidden /><div className="rune-grid" aria-hidden />
          <div className="relative mx-auto w-full min-w-0 max-w-[1180px] px-5 pb-16 pt-14 sm:px-7 sm:pb-24 sm:pt-20 lg:pt-24">
            <div className="grid grid-cols-12 items-center gap-10 lg:gap-14">
              <div className="reveal col-span-12 lg:col-span-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 font-mono text-[10px] font-medium tracking-[0.12em] text-white/60"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />PRIVATE CLOUD, PROPERLY YOURS</div>
                <h1 className="mt-6 font-display text-[clamp(47px,6.5vw,82px)] leading-[0.88] tracking-[-0.055em] text-white">The cloud<br />should be <span className="font-serif italic font-normal text-[var(--color-harbour)]">yours.</span></h1>
                <p className="mt-6 max-w-[48ch] text-[16px] leading-[1.65] text-white/60 sm:text-[17px]">Noatun is the personal cloud for people who run their own infrastructure. Files, photos, notes, and sharing — on your server, under your control.</p>
                <div className="mt-7 flex flex-wrap items-center gap-3"><a href="#waitlist" className="inline-flex h-12 items-center rounded-full bg-[var(--color-harbour)] px-6 text-[14px] font-semibold text-white shadow-[0_10px_30px_rgba(196,90,42,0.24)] transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[var(--color-harbour-ring)]">Join the waitlist <span className="ml-2">→</span></a><a href="#why" className="inline-flex h-12 items-center rounded-full border border-white/10 px-5 text-[14px] font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"><span className="sm:hidden">See why</span><span className="hidden sm:inline">See why it matters</span></a></div>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] tracking-wide text-white/35"><span>SELF-HOST FIRST</span><span>SMALL FOOTPRINT</span><span>NO VENDOR LOCK-IN</span></div>
              </div>
              <div className="reveal col-span-12 min-w-0 lg:col-span-7" style={{ transitionDelay: '100ms' } as CSSProperties}><ProductWindow /></div>
            </div>
          </div>
        </section>

        <section id="waitlist" className="relative z-10 mx-auto max-w-[1180px] px-5 sm:px-7">
          <div className="reveal mx-auto -mt-1 max-w-[660px] rounded-[22px] bg-[var(--color-paper)] p-5 text-zinc-900 shadow-[0_24px_80px_rgba(0,0,0,0.22)] ring-1 ring-black/10 sm:p-6">
            {!success ? <><div className="flex items-start justify-between gap-5"><div><div className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[var(--color-harbour)]">EARLY ACCESS</div><h2 className="mt-1 font-display text-[28px] leading-none tracking-[-0.04em]">Be first to run it.</h2><p className="mt-2 max-w-[48ch] text-[13px] leading-relaxed text-zinc-600">Join the people building a quieter, more private cloud.</p></div><div className="hidden h-10 w-10 place-items-center rounded-full bg-[var(--color-harbour-soft)] text-[var(--color-harbour)] sm:grid"><span className="text-lg">↗</span></div></div><div className="mt-5"><WaitlistForm onSuccess={setSuccess} /></div></> : <div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">✓</span><div className="min-w-0 flex-1"><h2 className="font-display text-[25px] leading-none tracking-[-0.03em]">You’re on the list.</h2><p className="mt-1 text-[13px] text-zinc-600">Share your link to move up the queue.</p><div className="mt-3 flex flex-col gap-2 sm:flex-row"><div className="min-w-0 flex-1 truncate rounded-[11px] bg-zinc-900 px-3 py-3 font-mono text-[11px] text-white">{referralLink}</div><button onClick={copyReferral} className="h-[44px] rounded-[11px] bg-zinc-900 px-4 text-[13px] font-semibold text-white hover:bg-black">{copied ? 'Copied' : 'Copy link'}</button></div><p className="mt-2 font-mono text-[10px] text-zinc-500">{success.referralCount} referrals · early access priority</p></div></div>}
          </div>
        </section>

        <section id="why" className="mx-auto max-w-[1180px] px-5 py-20 sm:px-7 sm:py-28">
          <div className="grid grid-cols-12 gap-8 lg:gap-14"><div className="reveal col-span-12 lg:col-span-5"><div className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[var(--color-north)]">A BETTER DEFAULT</div><h2 className="mt-4 font-display text-[clamp(36px,4.5vw,56px)] leading-[0.92] tracking-[-0.05em] text-white">Own the stack.<br /><span className="font-serif italic font-normal text-white/45">Keep the experience.</span></h2><p className="mt-5 max-w-[42ch] text-[15px] leading-[1.7] text-white/55">Self-hosting should not mean accepting a rough interface, stitching together five services, or becoming your own full-time sysadmin.</p></div><div className="col-span-12 grid gap-px overflow-hidden rounded-[20px] bg-white/10 ring-1 ring-white/10 lg:col-span-7">{features.map(feature => <article key={feature.number} className="reveal bg-[var(--color-fjord-deep)] p-6 sm:p-7"><div className="flex gap-5"><span className="font-mono text-[11px] text-[var(--color-harbour)]">{feature.number}</span><div><h3 className="font-display text-[25px] tracking-[-0.03em] text-white">{feature.title}</h3><p className="mt-2 max-w-[44ch] text-[14px] leading-relaxed text-white/50">{feature.description}</p></div></div></article>)}</div></div>
        </section>

        <section id="for-you" className="border-y border-white/[0.07] bg-white/[0.025]">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-7 sm:py-24"><div className="reveal text-center"><div className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[var(--color-north)]">MADE FOR PEOPLE LIKE YOU</div><h2 className="mx-auto mt-4 max-w-[700px] font-display text-[clamp(36px,4.5vw,56px)] leading-[0.92] tracking-[-0.05em] text-white">The stuff you run should<br /><span className="font-serif italic font-normal text-white/45">work beautifully too.</span></h2></div><div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">{audience.map((item, index) => <article key={item.label} className="reveal group rounded-[18px] bg-[var(--color-paper)] p-6 text-zinc-900 ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.2)] sm:p-7" style={{ transitionDelay: `${index * 70}ms` } as CSSProperties}><div className="flex items-center justify-between"><span className="font-mono text-[10px] font-semibold tracking-[0.15em] text-[var(--color-harbour)]">{item.label}</span><span className="text-zinc-300 transition group-hover:text-[var(--color-harbour)]">↗</span></div><h3 className="mt-12 font-display text-[27px] leading-none tracking-[-0.04em]">{item.title}</h3><p className="mt-3 text-[14px] leading-relaxed text-zinc-600">{item.body}</p></article>)}</div></div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-7 sm:py-28"><div className="grid grid-cols-12 items-center gap-8 lg:gap-14"><div className="reveal col-span-12 lg:col-span-6"><div className="rounded-[20px] bg-[var(--color-paper)] p-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.25)] ring-1 ring-white/10 sm:p-3"><div className="rounded-[14px] bg-zinc-900 p-6 sm:p-8"><div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-white/40"><span className="h-2 w-2 rounded-full bg-emerald-400" /> YOUR INFRASTRUCTURE</div><div className="mt-8 grid grid-cols-2 gap-2 sm:gap-3"><div className="rounded-[12px] bg-white/[0.07] p-4 ring-1 ring-white/10"><div className="font-mono text-[10px] text-white/35">LOCATION</div><div className="mt-2 font-display text-[22px] text-white">Your server</div><div className="mt-1 text-[12px] text-white/40">Home lab or VPS</div></div><div className="rounded-[12px] bg-[var(--color-harbour-soft)] p-4 ring-1 ring-[var(--color-harbour-ring)]"><div className="font-mono text-[10px] text-[var(--color-harbour)]">CONTROL</div><div className="mt-2 font-display text-[22px] text-white">Your rules</div><div className="mt-1 text-[12px] text-white/50">Move it whenever you want</div></div><div className="col-span-2 rounded-[12px] bg-white/[0.07] p-4 ring-1 ring-white/10"><div className="flex items-center justify-between"><div><div className="font-mono text-[10px] text-white/35">THE EVERYDAY CLOUD</div><div className="mt-2 font-display text-[24px] text-white">Files · photos · notes · sharing</div></div><div className="hidden h-10 w-10 place-items-center rounded-full bg-white text-zinc-900 sm:grid">→</div></div></div></div></div></div></div><div className="reveal col-span-12 lg:col-span-6"><div className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[var(--color-north)]">THE POINT</div><h2 className="mt-4 font-display text-[clamp(36px,4.5vw,56px)] leading-[0.92] tracking-[-0.05em] text-white">Privacy is not<br /><span className="font-serif italic font-normal text-[var(--color-harbour)]">a compromise.</span></h2><p className="mt-5 max-w-[45ch] text-[15px] leading-[1.7] text-white/55">It is the freedom to know where your data lives, who can access it, and what happens when you decide to move it.</p><a href="#waitlist" className="mt-7 inline-flex h-11 items-center rounded-full bg-white px-5 text-[13px] font-semibold text-zinc-900 transition hover:bg-zinc-100">Get early access →</a></div></div></section>

        <section id="faq" className="mx-auto max-w-[760px] px-5 pb-20 sm:px-7 sm:pb-28"><div className="reveal text-center"><div className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[var(--color-north)]">FAQ</div><h2 className="mt-3 font-display text-[36px] leading-none tracking-[-0.04em] text-white">Good questions.</h2></div><div className="mt-7"><FAQ /></div></section>
      </main>

      <footer className="border-t border-white/[0.08]"><div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-7 font-mono text-[10px] leading-relaxed text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-7"><div>© {new Date().getFullYear()} Noatun · Private cloud, your way.</div><div className="flex gap-2"><a href="https://github.com/fifthsegment/noatun" className="rounded-full bg-white/[0.06] px-3 py-1.5 transition hover:bg-white/10 hover:text-white/70">GitHub ↗</a><a href="mailto:hello@noatun.app" className="rounded-full bg-white/[0.06] px-3 py-1.5 transition hover:bg-white/10 hover:text-white/70">hello@noatun.app</a></div></div></footer>
    </div>
  )
}
