import { useEffect, useMemo, useState } from 'react'
import WaitlistForm from './components/WaitlistForm'
import FAQ from './components/FAQ'

type Success = { email: string; referralCode: string; referralUrl: string; referralCount: number }

const NAV = [
  { href: '#problem', label: 'Why Noatun' },
  { href: '#product', label: 'Product' },
  { href: '#audience', label: 'Who it’s for' },
  { href: '#docs', label: 'Docs' },
]

export default function App() {
  const [success, setSuccess] = useState<Success | null>(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [copied, setCopied] = useState(false)

  // Restore referral success from hash if present
  useEffect(() => {
    const h = window.location.hash
    if (h.startsWith('#joined=')) {
      try {
        const raw = decodeURIComponent(h.slice('#joined='.length))
        const s = JSON.parse(atob(raw)) as Success
        setSuccess(s)
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      } catch {}
    }
  }, [])

  const referralLink = useMemo(() => success?.referralUrl ?? '', [success])

  async function copyReferral() {
    if (!referralLink) return
    await navigator.clipboard.writeText(referralLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="min-h-screen bg-canvas text-ink selection:bg-amber-500/20">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-zinc-950/70 border-b border-white/[0.06]">
        <div className="mx-auto max-w-[1120px] px-4 sm:px-6 h-[56px] flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5">
            <span className="h-[28px] w-[28px] grid place-items-center rounded-[9px] bg-amber-500 text-zinc-950">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><path d="M3 5.5L7 2L11 5.5V10.5C11 11.6 10.1 12.5 9 12.5H5C3.9 12.5 3 11.6 3 10.5V5.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M5 12.5V8H9V12.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
            </span>
            <span className="text-[13px] font-semibold tracking-tight">Noatun</span>
            <span className="hidden sm:inline text-[11px] font-medium tracking-wide text-white/35">PERSONAL CLOUD</span>
            <span className="hidden sm:inline ml-1 rounded-full bg-amber-500/10 ring-1 ring-amber-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-amber-300">PRIVATE PRE-LAUNCH</span>
          </a>

          <nav className="hidden md:flex items-center gap-1 ml-6">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="px-3 py-1.5 rounded-full text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition">{n.label}</a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <a href="#waitlist" className="hidden sm:inline-flex h-[34px] items-center rounded-full bg-white text-zinc-900 px-4 text-[13px] font-semibold hover:bg-zinc-100 transition">
              Join waitlist
            </a>
            <a href="https://github.com/fifthsegment/noatun" target="_blank" rel="noreferrer" className="hidden sm:inline-flex h-[34px] items-center rounded-full bg-white/5 ring-1 ring-white/10 px-4 text-[13px] font-medium text-white/80 hover:bg-white/10 transition">
              GitHub
            </a>
            <button
              aria-label="Open menu"
              aria-expanded={mobileNav}
              onClick={() => setMobileNav((v) => !v)}
              className="md:hidden h-9 w-9 grid place-items-center rounded-full bg-white/5 ring-1 ring-white/10"
            >
              <span className="text-white/80 text-[16px] leading-none">{mobileNav ? '×' : '≡'}</span>
            </button>
          </div>
        </div>
        {mobileNav && (
          <div className="md:hidden border-t border-white/6 bg-zinc-950/90 backdrop-blur">
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV.map((n) => (
                <a key={n.href} onClick={() => setMobileNav(false)} href={n.href} className="px-3 py-2.5 rounded-xl text-[14px] font-medium text-white/80 hover:bg-white/5">{n.label}</a>
              ))}
              <a href="#waitlist" onClick={() => setMobileNav(false)} className="mt-1 inline-flex h-11 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 font-semibold">Join waitlist</a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* HERO */}
        <section className="harbor relative">
          <div className="harbor-grid" aria-hidden />
          <div className="mx-auto max-w-[1120px] px-4 sm:px-6 pt-8 sm:pt-10 pb-6">
            {/* Eyebrow + badges */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1.5 text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
                Noatun personal cloud — Nóatún: harbour / ship-enclosure
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 ring-1 ring-amber-500/20 px-3 py-1.5 text-amber-200/90">
                <span>◆</span> Invite 3 → early Managed Noatun rate
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-10 items-start">
              {/* Copy + form */}
              <div>
                <h1 className="text-[34px] sm:text-[44px] lg:text-[50px] font-extrabold tracking-[-0.03em] leading-[0.95]">
                  <span className="block text-white">Private Google</span>
                  <span className="block text-white">that fits a</span>
                  <span className="block text-amber-400">$5 VPS</span>
                </h1>
                <p className="mt-3 max-w-[560px] text-[14px] sm:text-[15px] leading-relaxed text-white/60">
                  One lightweight personal cloud — files, photo stream, docs, notes — you <span className="text-white/85">self-host</span> or <span className="text-white/85">we host for you</span>. Fits a small VPS · Docker Compose · Open-source core (coming).
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 ring-1 ring-white/10 px-2.5 py-1.5 text-white/60">~0.4 GiB idle · &lt;0.8 GiB light library</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 ring-1 ring-white/10 px-2.5 py-1.5 text-white/60">1 compose file</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 ring-1 ring-white/10 px-2.5 py-1.5 text-white/60">PWA + share-target</span>
                </div>

                <div id="waitlist" className="mt-6 max-w-[560px] scroll-mt-24">
                  {!success ? (
                    <WaitlistForm onSuccess={setSuccess} />
                  ) : (
                    <div className="rounded-[18px] bg-emerald-500/10 ring-1 ring-emerald-500/20 p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 h-7 w-7 grid place-items-center rounded-full bg-emerald-500 text-white text-[13px]">✓</span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-[15px] font-semibold tracking-tight text-white">You’re in — {success.email}</h3>
                          <p className="mt-1 text-[13px] leading-relaxed text-white/60">Want earlier access? Invite 2–3 people who also want private Drive + Photos.</p>
                          <div className="mt-3 flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 min-w-0 rounded-[12px] bg-white text-zinc-900 px-3 py-2.5 font-mono text-[12px] truncate">{referralLink}</div>
                            <button onClick={copyReferral} className="h-[42px] shrink-0 rounded-[12px] bg-white ring-1 ring-black/5 px-4 text-[13px] font-semibold text-zinc-900 hover:bg-zinc-50">
                              {copied ? 'Copied' : 'Copy link'}
                            </button>
                          </div>
                          <p className="mt-2 text-[11px] text-white/40">{success.referralCount} signed up via you → early managed rate unlocked</p>
                          <button onClick={() => setSuccess(null)} className="mt-3 text-[12px] font-medium text-white/60 hover:text-white underline underline-offset-4">Join with another email</button>
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="mt-2 text-center text-[11px] text-white/35">By joining you agree to launch + early pricing updates. No spam. Unsubscribe anytime.</p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-white/40">
                  <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-white/30" /> AGPL-3.0 core</span>
                  <span>·</span>
                  <span>Docs: RAM benchmark · sync path · migration sketch</span>
                </div>
              </div>

              {/* Device mock */}
              <div className="relative">
                <div className="rounded-[22px] bg-white/[0.04] ring-1 ring-white/10 p-2 sm:p-3 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
                  <div className="rounded-[16px] bg-[#0b0b0d] ring-1 ring-white/10 overflow-hidden">
                    <div className="h-9 flex items-center gap-1.5 px-3 border-b border-white/10 bg-zinc-900/60">
                      <span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                      <span className="ml-3 text-[11px] font-mono text-white/30">noatun.app — Drive / Photos</span>
                      <span className="ml-auto hidden sm:inline text-[10px] tracking-widest text-white/25">DARK · LIST</span>
                    </div>
                    {/* Fake Drive UI */}
                    <div className="grid grid-cols-[180px_1fr] min-h-[420px]">
                      <div className="hidden sm:block border-r border-white/6 bg-white/[0.02] p-3">
                        <div className="space-y-1.5">
                          <div className="h-7 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20 text-amber-200 text-[12px] grid place-items-center font-medium">Noatun</div>
                          {['Files','Photos','Recent','Starred','Email','Notes','Contacts'].map((n,i) => (
                            <div key={n} className={`h-7 rounded-lg px-2.5 flex items-center text-[11px] ${i===0?'bg-white/5 text-white/80':'text-white/40'}`}>
                              <span className="h-2 w-2 rounded-full bg-white/10 mr-2" /> {n}
                            </div>
                          ))}
                          <div className="pt-3">
                            <div className="h-1.5 rounded-full bg-white/8 overflow-hidden"><div className="h-full w-[42%] bg-amber-500/70" /></div>
                            <div className="mt-1 text-[10px] text-white/25">2.1 GB / 5 GB</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-zinc-950 p-3 sm:p-4">
                        <div className="flex items-center gap-2">
                          <div className="h-7 flex-1 rounded-full bg-white/5 ring-1 ring-white/10" />
                          <div className="h-7 w-20 rounded-full bg-white text-zinc-900 grid place-items-center text-[11px] font-semibold">Upload</div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-2">
                          {/* File rows */}
                          {[
                            { name: 'Q2_Board_Deck.pdf', meta: '2.4 MB · yesterday' },
                            { name: 'Beach_2024-08-12.heic', meta: 'AI: beach, ocean · 4.1 MB' },
                            { name: 'Client_Contract.docx', meta: 'Edited 2h ago · doc' },
                            { name: 'Mix_Tape_08.m4a', meta: '3:42 · audio' },
                          ].map((f) => (
                            <div key={f.name} className="flex items-center gap-3 rounded-xl bg-white/[0.04] ring-1 ring-white/5 px-3 py-2.5">
                              <span className="h-8 w-8 rounded-lg bg-amber-500/15 ring-1 ring-amber-500/20 grid place-items-center text-amber-300 text-[10px]">◧</span>
                              <div className="min-w-0 flex-1">
                                <div className="text-[12px] font-medium text-white/85 truncate">{f.name}</div>
                                <div className="text-[11px] text-white/35 truncate">{f.meta}</div>
                              </div>
                              <span className="h-6 w-6 rounded-full bg-white/5 grid place-items-center text-white/40">⋯</span>
                            </div>
                          ))}
                          <div className="rounded-xl border border-dashed border-white/10 bg-amber-500/[0.04] p-3 text-center">
                            <div className="text-[11px] tracking-widest text-amber-300/80">DRAG & DROP · PWA SHARE-TARGET</div>
                            <div className="mt-1 text-[11px] text-white/35">Photos + docs private, one backup story</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute -bottom-3 -right-3 hidden sm:block rounded-full bg-zinc-900 ring-1 ring-white/10 px-3 py-1.5 text-[11px] font-medium text-white/70 shadow-xl">pwa-512x512.png · share to Noatun</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section id="problem" className="mx-auto max-w-[1120px] px-4 sm:px-6 py-10 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
            <div className="rounded-[22px] bg-white/[0.03] ring-1 ring-white/8 p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 px-2.5 py-1 text-[11px] tracking-widest text-white/50">THE PROBLEM — ONE JOB</div>
              <h2 className="mt-4 text-[28px] sm:text-[32px] font-bold tracking-[-0.02em] leading-[0.95] text-white">You wanted your own Drive.<br />You got a second full-time job.</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-white/60">Nextcloud eats the box. Immich owns photos but not files. Stitching five apps means five updates and one bad weekend. Google One is easy — and it indexes the family album.</p>
              <blockquote className="mt-5 rounded-[14px] bg-amber-500/10 ring-1 ring-amber-500/20 px-4 py-3 text-[13px] leading-relaxed text-amber-200/90">
                “I do not want my cloud storage to be a debugging project.”
                <span className="block mt-1 text-[11px] tracking-wide text-amber-200/60">— VOC · Nextcloud forums / funkyton.com teardown</span>
              </blockquote>
              <dl className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { k: 'RAM', v: '2–8 GB', s: 'Nextcloud Hub realistic' },
                  { k: 'APPS', v: '5+ to stitch', s: 'Immich + Filebrowser + …' },
                  { k: 'COST', v: '$600 / 5y', s: 'Google One 2 TB family' },
                ].map((x) => (
                  <div key={x.k} className="rounded-[14px] bg-white/[0.04] ring-1 ring-white/5 p-3">
                    <div className="text-[10px] tracking-widest text-white/35">{x.k}</div>
                    <div className="mt-1 text-[16px] font-semibold tracking-tight text-white">{x.v}</div>
                    <div className="text-[11px] text-white/40">{x.s}</div>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-[22px] bg-white text-zinc-900 p-6 sm:p-7">
              <div className="inline-flex rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold tracking-widest text-amber-700">WHAT NOATUN IS — ONE JOB</div>
              <h3 className="mt-3 text-[24px] font-bold tracking-[-0.02em] leading-tight">A curated personal cloud,<br />not an app store.</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">Drive, photo stream, docs, notes, mail, contacts — one login, one backup story, one compose file. Built for cheap VPS and people who want ownership without Ops theater.</p>
              <ul className="mt-5 grid grid-cols-1 gap-2 text-[13px]">
                {[
                  'Fits a small VPS — ~0.4 GiB idle, <0.8 GiB light library (measured)',
                  'Modern UI · photo stream, editors, PWA — dark-first, content-forward',
                  'Share links for family and clients · quotas, password links',
                  'Managed option when you don’t want to babysit updates',
                ].map((t) => (
                  <li key={t} className="flex gap-2.5 rounded-[12px] bg-zinc-50 ring-1 ring-zinc-200/70 px-3 py-2.5">
                    <span className="mt-0.5 h-5 w-5 grid place-items-center rounded-full bg-amber-500 text-white text-[11px]">✓</span>
                    <span className="leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href="#waitlist" className="inline-flex h-9 items-center rounded-full bg-zinc-900 px-4 text-[13px] font-semibold text-white hover:bg-black">Join waitlist — free</a>
                <a href="https://github.com/fifthsegment/noatun" target="_blank" rel="noreferrer" className="inline-flex h-9 items-center rounded-full bg-white ring-1 ring-zinc-200 px-4 text-[13px] font-medium hover:bg-zinc-50">Star on GitHub</a>
              </div>
            </div>
          </div>
        </section>

        {/* AUDIENCE */}
        <section id="audience" className="mx-auto max-w-[1120px] px-4 sm:px-6 pb-6">
          <div className="rounded-[22px] bg-white/[0.03] ring-1 ring-white/8 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/6">
              {[
                {
                  title: 'Homelabber',
                  sub: 'on a $5–10 VPS',
                  bullets: ['One stack instead of Nextcloud + Immich + Filebrowser', '1 GB min / 2 GB recommended · Sonic, MinIO, Postgres'],
                  badge: 'Self-host',
                },
                {
                  title: 'Family “IT person”',
                  sub: 'photos + docs private',
                  bullets: ['Photo stream + share links for spouse/kids', 'Managed Noatun if you hate upgrades · backups included'],
                  badge: 'Managed',
                },
                {
                  title: 'Freelancer',
                  sub: 'share links + quotas',
                  bullets: ['Password links, quotas, flat storage vs Google One creep', 'Docs/notes/mail in one login — fewer tools to bill'],
                  badge: 'Pro soon',
                },
              ].map((c) => (
                <div key={c.title} className="p-6 sm:p-7">
                  <div className="inline-flex rounded-full bg-white/5 ring-1 ring-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-white/60">{c.badge}</div>
                  <h3 className="mt-3 text-[16px] font-semibold tracking-tight text-white">{c.title}</h3>
                  <p className="text-[12px] text-white/45">{c.sub}</p>
                  <ul className="mt-3 space-y-1.5 list-disc list-inside text-[13px] leading-relaxed text-white/65">
                    {c.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <div className="bg-amber-500/10 ring-1 ring-amber-500/15 px-6 py-3 flex flex-wrap items-center gap-2 text-[11px] text-amber-200/80">
              <span className="font-semibold tracking-widest">NOT FOR</span>
              <span className="text-amber-100/60">·</span>
              <span>Photo-only (use Immich) · Enterprise Workspace / Talk+Calendar on 8 GB · Heavy Hub parity</span>
            </div>
          </div>
        </section>

        {/* PATHS */}
        <section className="mx-auto max-w-[1120px] px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                k: '01',
                t: 'Self-host',
                d: 'Free AGPL-3.0 core. One compose file — no Helm required.',
                code: 'docker compose -f deploy/compose.yaml up -d --build',
                cta: { label: 'Read the bring-up', href: 'https://github.com/fifthsegment/noatun#bring-up-agent-first' },
              },
              {
                k: '02',
                t: 'Managed Noatun',
                d: 'We run it · backups · updates · early waitlist pricing locked.',
                bullets: ['$8–20/mo family band · anchored vs €3–15 managed Nextcloud', 'Invite 3 → queue jump / founding rate'],
                cta: { label: 'Join waitlist', href: '#waitlist' },
                highlight: true,
              },
              {
                k: '03',
                t: 'Pro (later)',
                d: 'White-label / power features for MSPs and teams.',
                bullets: ['Domain-bound license pattern · ethical keys later', 'Not sold before managed unit economics are clear'],
                muted: true,
              },
            ].map((p) => (
              <div key={p.k} className={`rounded-[18px] p-5 ring-1 ${p.highlight ? 'bg-amber-500 text-zinc-900 ring-amber-500/20' : p.muted ? 'bg-white/[0.02] ring-white/8 text-white/70' : 'bg-white text-zinc-900 ring-zinc-200'}`}>
                <div className={`inline-flex h-7 w-7 place-items-center justify-center rounded-full text-[11px] font-bold ring-1 ${p.highlight ? 'bg-zinc-900 text-white ring-zinc-900' : 'bg-zinc-900 text-white ring-zinc-900/10'}`}>{p.k}</div>
                <h3 className={`mt-3 text-[16px] font-semibold tracking-tight ${p.highlight ? 'text-zinc-900' : ''}`}>{p.t}</h3>
                <p className={`mt-1 text-[13px] leading-relaxed ${p.highlight ? 'text-zinc-800' : 'text-zinc-600'}`}>{p.d}</p>
                {p.code ? <pre className="mt-3 rounded-[10px] bg-zinc-950 text-zinc-100 px-3 py-2.5 font-mono text-[11px] overflow-x-auto">{p.code}</pre> : null}
                {p.bullets ? (
                  <ul className={`mt-3 space-y-1 text-[12px] leading-relaxed ${p.highlight ? 'text-zinc-800' : 'text-zinc-600'}`}>{p.bullets.map((b) => <li key={b}>· {b}</li>)}</ul>
                ) : null}
                <a href={p.cta!.href} className={`mt-4 inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold ${p.highlight ? 'bg-zinc-900 text-white hover:bg-black' : 'bg-zinc-900 text-white hover:bg-black'}`}>{p.cta!.label} →</a>
              </div>
            ))}
          </div>
        </section>

        {/* HONEST GAPS + FAQ */}
        <section id="docs" className="mx-auto max-w-[1120px] px-4 sm:px-6 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-6 items-start">
            <div className="rounded-[18px] bg-white text-zinc-900 p-6 sm:p-7">
              <h3 className="text-[18px] font-semibold tracking-tight">Honest gaps</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">We ship the curated suite, not a Hub. We concede these until they’re real:</p>
              <ul className="mt-4 space-y-2 text-[13px]">
                <li className="flex gap-2"><span className="text-zinc-400">—</span><span><b>Sync clients:</b> no native desktop/mobile yet. PWA + share-target today, <b>WebDAV</b> next (rclone/Finder/Explorer).</span></li>
                <li className="flex gap-2"><span className="text-zinc-400">—</span><span><b>Photos:</b> Immich wins pure photo backup — Noatun wins Drive+Photos together.</span></li>
                <li className="flex gap-2"><span className="text-zinc-400">—</span><span><b>Imports:</b> export → upload today; guides in <a href="https://github.com/fifthsegment/noatun/blob/master/docs/migration-sketch.md" className="underline decoration-zinc-300 underline-offset-4">migration-sketch.md</a>.</span></li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
                <a href="https://github.com/fifthsegment/noatun/blob/master/docs/ram-benchmark.md" className="inline-flex rounded-full bg-zinc-900 px-3 py-1.5 font-medium text-white hover:bg-black">RAM benchmark</a>
                <a href="https://github.com/fifthsegment/noatun/blob/master/docs/sync-path-v1.md" className="inline-flex rounded-full bg-white ring-1 ring-zinc-200 px-3 py-1.5 font-medium hover:bg-zinc-50">Sync path v1</a>
                <a href="https://github.com/fifthsegment/noatun/blob/master/docs/vs-nextcloud.md" className="inline-flex rounded-full bg-white ring-1 ring-zinc-200 px-3 py-1.5 font-medium hover:bg-zinc-50">Noatun vs Nextcloud</a>
              </div>
            </div>
            <FAQ />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mx-auto max-w-[1120px] px-4 sm:px-6 pb-8">
          <div className="rounded-[22px] bg-gradient-to-br from-amber-500 to-amber-400 p-[1px]">
            <div className="rounded-[21px] bg-zinc-950 px-6 sm:px-8 py-7 sm:py-8 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              <div>
                <h3 className="text-[18px] font-semibold tracking-tight text-white">Get your private cloud — without the second job.</h3>
                <p className="mt-1 text-[13px] text-white/60">Join the waitlist. Early members lock a founding Managed Noatun rate.</p>
              </div>
              <a href="#waitlist" className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-6 text-[14px] font-semibold text-zinc-900 hover:bg-zinc-100">Join waitlist — free</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/6">
        <div className="mx-auto max-w-[1120px] px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-[11px] leading-relaxed">
          <div className="text-white/35">
            © {new Date().getFullYear()} Noatun · <span className="text-white/55">Nóatún — harbour / ship-enclosure</span> · AGPL-3.0 core · Not the Rust “Noatun” DB crate.
            <span className="hidden sm:inline"> · </span>Built for `noatun.app` on Cloudflare Pages.
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="https://github.com/fifthsegment/noatun" className="rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1.5 text-white/60 hover:text-white hover:bg-white/10">fifthsegment/noatun</a>
            <a href="https://github.com/GetNoatun/noatun-site" className="rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1.5 text-white/60 hover:text-white hover:bg-white/10">GetNoatun/noatun-site</a>
            <a href="mailto:hello@noatun.app" className="rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1.5 text-white/60 hover:text-white hover:bg-white/10">hello@noatun.app</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
