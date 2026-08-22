import { useEffect, useMemo, useRef, useState } from 'react'
import WaitlistForm from './components/WaitlistForm'
import FAQ from './components/FAQ'

type Success = { email: string; referralCode: string; referralUrl: string; referralCount: number }

export default function App(){
  const [success, setSuccess] = useState<Success|null>(null)
  const [copied, setCopied] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  // Restore referral success from hash / ?ref
  useEffect(()=>{ const h=window.location.hash; if(h.startsWith('#joined=')){ try{ const raw=decodeURIComponent(h.slice('#joined='.length)); const s=JSON.parse(atob(raw)) as Success; setSuccess(s); window.history.replaceState(null,'', window.location.pathname + window.location.search)}catch{} } }, [])
  const referralLink = useMemo(()=> success?.referralUrl ?? '', [success])
  async function copyReferral(){ if(!referralLink) return; await navigator.clipboard.writeText(referralLink).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false), 1800) }

  // Scroll reveal (IntersectionObserver, 400ms, respects reduced-motion via CSS)
  useEffect(()=>{
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver((entries)=>{ for(const e of entries) if(e.isIntersecting) e.target.classList.add('in') },{ rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    els.forEach(el=> io.observe(el))
    return ()=> io.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-abyss text-ink noise">
      {/* Sticky minimal header — landing-pages: NO full nav, only logo + single CTA per viewport */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-abyss/70 border-b border-white/[0.06]">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 h-[56px] flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 shrink-0" aria-label="Noatun home">
            <span className="h-7 w-7 grid place-items-center rounded-[10px] bg-[var(--color-lantern)] text-zinc-950">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><path d="M3 5.2L7 1.8L11 5.2V10.6C11 11.7 10.1 12.6 9 12.6H5C3.9 12.6 3 11.7 3 10.6V5.2Z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round"/><path d="M5.2 12.6V8.2H8.8V12.6" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
            </span>
            <span className="text-[13px] font-semibold tracking-tight">Noatun</span>
            <span className="hidden sm:inline text-[11px] font-medium tracking-[0.14em] text-white/35">PERSONAL CLOUD</span>
          </a>
          <div className="ml-auto flex items-center gap-2">
            <a href="#waitlist" className="hidden sm:inline-flex h-9 items-center rounded-full bg-[var(--color-lantern)] px-4 text-[13px] font-semibold text-zinc-950 hover:brightness-[1.04] focus-visible:ring-2 focus-visible:ring-[var(--color-lantern-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-abyss)]">Join waitlist — free</a>
            <a href="https://github.com/fifthsegment/noatun" target="_blank" rel="noreferrer" className="inline-flex h-9 items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 px-3.5 text-[13px] font-medium text-white/80 hover:bg-white/[0.10] focus-visible:ring-2 focus-visible:ring-white/20">GitHub ↗</a>
            <button aria-label="Menu" aria-expanded={mobileNav} onClick={()=>setMobileNav(v=>!v)} className="sm:hidden h-9 w-9 grid place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 text-white/80">{mobileNav? '×':'≡'}</button>
          </div>
        </div>
        {mobileNav && (
          <div className="sm:hidden border-t border-white/[0.06] bg-abyss/95 backdrop-blur px-4 py-3 flex flex-col gap-2">
            <a href="#why" onClick={()=>setMobileNav(false)} className="px-3 py-2.5 rounded-xl text-[14px] text-white/80 hover:bg-white/[0.06]">Why Noatun</a>
            <a href="#docs" onClick={()=>setMobileNav(false)} className="px-3 py-2.5 rounded-xl text-[14px] text-white/80 hover:bg-white/[0.06]">Docs & trust</a>
            <a href="#waitlist" onClick={()=>setMobileNav(false)} className="h-11 grid place-items-center rounded-xl bg-[var(--color-lantern)] text-zinc-950 font-semibold">Join waitlist — free</a>
          </div>
        )}
      </header>

      {/* — HERO: Typographic display (Fraunces 72-84) + Split Hero (asymmetric 7/5, 12-col) — */}
      <section ref={heroRef} className="harbor relative overflow-clip">
        <div className="lantern-glow" style={{ left: '-80px', top: '-120px' }} aria-hidden />
        <div className="lantern-glow" style={{ right: '-120px', top: '18%', width: '480px', height: '480px', opacity: 0.55 }} aria-hidden />
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 pt-10 sm:pt-14 pb-10 sm:pb-12">
          {/* Eyebrow */}
          <div className="reveal flex flex-wrap items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] ring-1 ring-white/10 px-3 py-1.5 text-white/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
              Nóatún — harbour / ship-enclosure · private pre-launch
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[var(--color-lantern-soft)] ring-1 ring-[var(--color-lantern-ring)] px-3 py-1.5 font-medium text-amber-200/90">◆ Invite 3 → early Managed rate</span>
          </div>

          {/* Asymmetric hero: text 7 cols, visual 5 */}
          <div className="mt-8 grid grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="col-span-12 lg:col-span-7 reveal" style={{ transitionDelay: '80ms' }}>
              {/* Display type: Fraunces, fluid clamp 42→84, balance */}
              <h1 className="font-display font-[700] tracking-[-0.035em] leading-[0.90] text-balance" style={{ fontSize: 'clamp(42px, 6vw, 84px)' }}>
                <span className="block text-white">Private</span>
                <span className="block text-white">Google</span>
                <span className="block bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">that fits a $5 VPS</span>
              </h1>
              <p className="mt-4 max-w-[58ch] text-[16px] sm:text-[17px] leading-[1.65] text-white/60 text-pretty">
                One lightweight personal cloud — files, photo stream, docs, notes — you <span className="text-white/90 font-medium">self-host</span> or <span className="text-white/90 font-medium">we host for you</span>. Fits a small VPS · one compose file · open-source core coming.
              </p>
              {/* Trust strip above fold (3 locations rule: here + after problem + footer) */}
              <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.055] ring-1 ring-white/[0.08] px-3 py-1.5 text-white/65"><span className="h-1.5 w-1.5 rounded-full bg-white/40" /> ~0.4 GiB idle · &lt;0.8 GiB light</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.055] ring-1 ring-white/[0.08] px-3 py-1.5 text-white/65">1 compose file</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.055] ring-1 ring-white/[0.08] px-3 py-1.5 text-white/65">AGPL-3.0 core</span>
              </div>

              {/* CTA island — repeated per section per landing-pages rule */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#waitlist" className="inline-flex h-[46px] items-center rounded-full bg-[var(--color-lantern)] px-6 text-[14px] font-semibold tracking-[-0.01em] text-zinc-950 hover:brightness-[1.06] focus-visible:ring-2 focus-visible:ring-[var(--color-lantern-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-abyss transition">Join waitlist — invite 3, unlock early rate →</a>
                <span className="text-[12px] text-white/35">No spam. Early pricing only.</span>
              </div>
              {/* Small trust row */}
              <p className="mt-3 text-[11px] tracking-wide text-white/35">PWA + share-target today · WebDAV next · Docs: RAM benchmark · sync path · migration sketch</p>
            </div>

            {/* Right: magical vault visual — not a screenshot dump, but a composed scene */}
            <div className="col-span-12 lg:col-span-5 reveal" style={{ transitionDelay: '160ms' }}>
              <div className="relative rounded-[22px] bg-white/[0.03] ring-1 ring-white/[0.07] p-2 sm:p-3 backdrop-blur">
                {/* Top bar like boathouse header */}
                <div className="rounded-[16px] bg-[#0E1012] ring-1 ring-white/[0.07] overflow-hidden">
                  <div className="h-9 flex items-center gap-1.5 px-3 border-b border-white/[0.07] bg-white/[0.03]">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="ml-3 font-mono text-[10px] tracking-[0.14em] text-white/35">NOATUN.APP — DRIVE / PHOTOS</span>
                    <span className="ml-auto hidden sm:inline rounded-full bg-[var(--color-lantern-soft)] ring-1 ring-[var(--color-lantern-ring)] px-2 py-0.5 text-[10px] tracking-[0.12em] font-semibold text-amber-200">LANTERN LIT</span>
                  </div>
                  {/* Bento inside vault */}
                  <div className="p-3 sm:p-4 grid grid-cols-12 gap-3">
                    <div className="col-span-12 sm:col-span-5 rounded-[14px] bg-white text-zinc-900 p-3">
                      <div className="text-[10px] tracking-[0.14em] font-semibold text-zinc-500">BOATHOUSE — NAV</div>
                      <div className="mt-2 space-y-1.5 text-[11px]">
                        {['Files','Photos','Recent','Notes','Contacts'].map((n,i)=> (
                          <div key={n} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${i===0? 'bg-zinc-900 text-white':'bg-zinc-50 ring-1 ring-zinc-200 text-zinc-600'}`}>{n}{i===0 && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500"/>}</div>
                        ))}
                      </div>
                      <div className="mt-3 h-1.5 rounded-full bg-zinc-100 overflow-hidden"><div className="h-full w-[42%] bg-[var(--color-lantern)]" /></div>
                      <div className="mt-1 text-[10px] font-mono text-zinc-500">2.1 / 5 GB · 42%</div>
                    </div>
                    <div className="col-span-12 sm:col-span-7 rounded-[14px] bg-[#0A0C0E] ring-1 ring-white/[0.06] p-3">
                      <div className="flex items-center gap-2"><span className="flex-1 h-7 rounded-full bg-white/[0.07] ring-1 ring-white/10" /><span className="h-7 rounded-full bg-white px-3 grid place-items-center text-[11px] font-semibold text-zinc-900">Upload</span></div>
                      <div className="mt-3 grid gap-2">
                        {[
                          { n: 'Q2_Board_Deck.pdf', m: '2.4 MB · yesterday · pdf' },
                          { n: 'Beach_2024-08.heic', m: 'AI: beach, ocean · 4.1 MB' },
                          { n: 'Contract.docx', m: 'Edited 2h ago · doc' },
                        ].map(f=> (
                          <div key={f.n} className="flex items-center gap-2.5 rounded-xl bg-white/[0.05] ring-1 ring-white/[0.06] px-3 py-2">
                            <span className="h-7 w-7 grid place-items-center rounded-lg bg-[var(--color-lantern-soft)] ring-1 ring-[var(--color-lantern-ring)] text-[10px] text-amber-300">◧</span>
                            <div className="min-w-0"><div className="text-[12px] font-medium text-white/90 truncate">{f.n}</div><div className="font-mono text-[11px] text-white/35 truncate">{f.m}</div></div>
                            <span className="ml-auto text-white/25">⋯</span>
                          </div>
                        ))}
                        <div className="rounded-xl border border-dashed border-white/10 bg-[var(--color-lantern-soft)] p-2.5 text-center">
                          <div className="font-mono text-[10px] tracking-[0.16em] text-amber-200/80">DRAG · PWA SHARE-TARGET</div>
                          <div className="text-[11px] text-white/40">Photos + docs, one backup story</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 pb-3 flex gap-2 text-[11px]">
                    <span className="rounded-full bg-white text-zinc-900 px-2.5 py-1 font-medium">Noatun personal cloud</span>
                    <span className="rounded-full bg-white/[0.06] ring-1 ring-white/10 px-2.5 py-1 text-white/60">open: noatun.app</span>
                  </div>
                </div>
                <div className="pointer-events-none absolute -bottom-3 -right-3 hidden sm:inline-flex items-center gap-1.5 rounded-full bg-zinc-900 ring-1 ring-white/10 px-3 py-1.5 text-[11px] font-medium text-white/70 shadow-xl"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> pwa-512 · share to Noatun</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAITLIST — immediately after hero, above fold on mobile */}
      <section id="waitlist" className="mx-auto max-w-[1240px] px-4 sm:px-6 -mt-2 sm:mt-0">
        <div className="reveal mx-auto max-w-[640px] rounded-[22px] bg-white text-zinc-900 p-5 sm:p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
          {!success ? (
            <>
              <h2 className="font-display text-[22px] font-bold tracking-[-0.02em]">Join the harbor.</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">Get launch + early Managed pricing. Invite 3 friends → jump the queue and lock a founding rate.</p>
              <div className="mt-4"><WaitlistForm onSuccess={setSuccess} /></div>
              <p className="mt-2 text-center text-[11px] text-zinc-500">No spam. Unsubscribe anytime. AGPL-3.0 when we open.</p>
            </>
          ) : (
            <div className="flex gap-3">
              <span className="mt-0.5 h-8 w-8 grid place-items-center rounded-full bg-emerald-500 text-white">✓</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[18px] font-bold tracking-tight">You’re in — {success.email}</h3>
                <p className="mt-1 text-[13px] text-zinc-600">Want earlier access? Share your link — the harbor is warmer with 2–3.</p>
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 min-w-0 rounded-[12px] bg-zinc-900 text-white px-3 py-2.5 font-mono text-[12px] truncate">{referralLink}</div>
                  <button onClick={copyReferral} className="h-[42px] shrink-0 rounded-[12px] bg-zinc-900 px-4 text-[13px] font-semibold text-white hover:bg-black focus-visible:ring-2 focus-visible:ring-zinc-900">{copied ? 'Copied' : 'Copy link'}</button>
                </div>
                <p className="mt-2 text-[11px] text-zinc-500">{success.referralCount} signed up via you → early managed rate unlocked</p>
                <button onClick={()=>setSuccess(null)} className="mt-3 text-[12px] font-medium text-zinc-600 hover:text-zinc-900 underline underline-offset-4">Join with another email</button>
              </div>
            </div>
          )}
        </div>
        {/* CTA repeat per landing-pages rule */}
        <div className="mx-auto max-w-[640px] mt-3 flex justify-center">
          <a href="#why" className="text-[12px] font-medium text-white/50 hover:text-white/80 underline underline-offset-4">How it compares →</a>
        </div>
      </section>

      {/* WHY — problem, with asymmetric bento */}
      <section id="why" className="mx-auto max-w-[1240px] px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="col-span-12 lg:col-span-7 reveal">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] ring-1 ring-white/10 px-3 py-1 text-[11px] tracking-[0.14em] font-semibold text-white/60">THE PROBLEM — ONE JOB</div>
            <h2 className="mt-4 font-display text-[32px] sm:text-[40px] font-bold tracking-[-0.03em] leading-[0.9] text-white text-balance">You wanted your<br />own Drive. You got<br /><span className="text-white/50">a second full-time job.</span></h2>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-white/60">Nextcloud eats the box. Immich owns photos but not files. Stitching five apps means five updates and one bad weekend. Google One is easy — and it indexes the family album.</p>
            <blockquote className="mt-6 rounded-[14px] bg-[var(--color-lantern-soft)] ring-1 ring-[var(--color-lantern-ring)] px-4 py-3 text-[13px] leading-relaxed text-amber-100">
              “I do not want my cloud storage to be a debugging project.”
              <span className="block mt-1 font-mono text-[11px] tracking-wide text-amber-200/60">— VOC · Nextcloud forums / funkyton.com teardown</span>
            </blockquote>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { k:'RAM', v:'2–8 GB', s:'Nextcloud Hub realistic' },
                { k:'APPS', v:'5+ to stitch', s:'Immich + Filebrowser + …' },
                { k:'COST', v:'$600 / 5y', s:'Google One 2 TB family' },
              ].map(x=> (
                <div key={x.k} className="bento-card rounded-[14px] bg-white/[0.04] ring-1 ring-white/[0.07] p-3">
                  <div className="font-mono text-[10px] tracking-[0.14em] text-white/35">{x.k}</div>
                  <div className="mt-1 font-display text-[18px] font-bold tracking-tight text-white">{x.v}</div>
                  <div className="font-mono text-[11px] text-white/40">{x.s}</div>
                </div>
              ))}
            </div>
            <a href="#waitlist" className="mt-6 inline-flex h-10 items-center rounded-full bg-white px-5 text-[13px] font-semibold text-zinc-900 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-white">Join waitlist →</a>
          </div>

          <div className="col-span-12 lg:col-span-5 reveal" style={{ transitionDelay: '100ms' } as any}>
            <div className="rounded-[18px] bg-white text-zinc-900 p-6 sm:p-7">
              <div className="inline-flex rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-amber-700">WHAT NOATUN IS — ONE JOB</div>
              <h3 className="mt-3 font-display text-[24px] font-bold tracking-[-0.02em] leading-tight">A curated personal cloud,<br />not an app store.</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">Drive, photo stream, docs, notes, mail, contacts — one login, one backup story, one compose file. Built for cheap VPS and people who want ownership without Ops theater.</p>
              <ul className="mt-5 grid gap-2 text-[13px]">
                {[
                  'Fits a small VPS — ~0.4 GiB idle, <0.8 GiB light library (measured)',
                  'Modern UI · photo stream, editors, PWA — warm foam, not chrome',
                  'Share links for family and clients · quotas, password links',
                  'Managed option when you don’t want to babysit updates',
                ].map(t=> (
                  <li key={t} className="flex gap-2.5 rounded-[12px] bg-zinc-50 ring-1 ring-zinc-200/70 px-3 py-2.5"><span className="mt-0.5 h-5 w-5 grid place-items-center rounded-full bg-[var(--color-lantern)] text-white text-[11px]">✓</span><span className="leading-snug">{t}</span></li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href="#waitlist" className="inline-flex h-9 items-center rounded-full bg-zinc-900 px-4 text-[13px] font-semibold text-white hover:bg-black">Join waitlist — free</a>
                <a href="https://github.com/fifthsegment/noatun" target="_blank" rel="noreferrer" className="inline-flex h-9 items-center rounded-full bg-white ring-1 ring-zinc-200 px-4 text-[13px] font-medium hover:bg-zinc-50">Star on GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR — who it's for (12-col bento) */}
      <section id="for" className="mx-auto max-w-[1240px] px-4 sm:px-6 pb-4">
        <div className="reveal rounded-[22px] bg-white/[0.035] ring-1 ring-white/[0.07] overflow-hidden">
          <div className="grid grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">
            {[
              { badge:'Self-host', title:'Homelabber', sub:'on a $5–10 VPS', bullets:['One stack instead of Nextcloud + Immich + Filebrowser','1 GB min / 2 GB recommended · Sonic, MinIO, Postgres'] },
              { badge:'Managed', title:'Family “IT person”', sub:'photos + docs private', bullets:['Photo stream + share links for spouse/kids','Managed Noatun if you hate upgrades · backups included'] },
              { badge:'Pro soon', title:'Freelancer', sub:'share links + quotas', bullets:['Password links, quotas, flat storage vs Google One creep','Docs/notes/mail in one login — fewer tools to bill'] },
            ].map(c=> (
              <div key={c.title} className="col-span-12 lg:col-span-4 p-6 sm:p-7">
                <div className="inline-flex rounded-full bg-white/[0.06] ring-1 ring-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-white/60">{c.badge}</div>
                <h3 className="mt-3 font-display text-[18px] font-semibold tracking-tight text-white">{c.title}</h3>
                <p className="font-mono text-[11px] tracking-wide text-white/40">{c.sub}</p>
                <ul className="mt-3 space-y-1.5 list-disc list-inside text-[13px] leading-relaxed text-white/65">
                  {c.bullets.map(b=> <li key={b}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="bg-[var(--color-lantern-soft)] ring-1 ring-[var(--color-lantern-ring)] px-6 py-3 flex flex-wrap items-center gap-2 text-[11px] text-amber-200/85">
            <span className="font-semibold tracking-[0.14em]">NOT FOR</span><span className="text-amber-100/60">·</span><span>Photo-only (use Immich) · Enterprise Workspace / Talk+Calendar on 8 GB · Heavy Hub parity</span>
          </div>
        </div>
      </section>

      {/* PATHS — three cards, one highlighted (landing-pages: social proof before CTA) */}
      <section className="mx-auto max-w-[1240px] px-4 sm:px-6 py-8">
        <div className="grid grid-cols-12 gap-4">
          {[
            { k:'01', t:'Self-host', d:'Free AGPL-3.0 core. One compose file — no Helm required.', code:'docker compose -f deploy/compose.yaml up -d --build', cta:{label:'Read the bring-up', href:'https://github.com/fifthsegment/noatun#bring-up-agent-first'} },
            { k:'02', t:'Managed Noatun', d:'We run it · backups · updates · early waitlist pricing locked.', bullets:['$8–20/mo family band · anchored vs €3–15 managed Nextcloud','Invite 3 → queue jump / founding rate'], cta:{label:'Join waitlist', href:'#waitlist'}, highlight:true },
            { k:'03', t:'Pro (later)', d:'White-label / power features for MSPs and teams.', bullets:['Domain-bound license pattern · ethical keys later','Not sold before managed unit economics are clear'], cta:{label:'Pro outline', href:'https://github.com/fifthsegment/noatun#pro-later'}, muted:true },
          ].map(p=> (
            <div key={p.k} className={`col-span-12 md:col-span-4 bento-card rounded-[18px] p-5 ring-1 ${p.highlight? 'bg-[var(--color-lantern)] text-zinc-900 ring-[var(--color-lantern)]' : (p as any).muted? 'bg-white/[0.03] ring-white/[0.07] text-white/70' : 'bg-white text-zinc-900 ring-zinc-200'}`}>
              <div className={`inline-flex h-7 w-7 place-items-center justify-center rounded-full text-[11px] font-bold ring-1 ${p.highlight? 'bg-zinc-900 text-white ring-zinc-900' : 'bg-zinc-900 text-white ring-zinc-900/10'}`}>{p.k}</div>
              <h3 className={`mt-3 font-display text-[18px] font-semibold tracking-tight ${p.highlight? 'text-zinc-900':''}`}>{p.t}</h3>
              <p className={`mt-1 text-[13px] leading-relaxed ${p.highlight? 'text-zinc-800':'text-zinc-600'}`}>{p.d}</p>
              {(p as any).code ? <pre className="mt-3 rounded-[10px] bg-zinc-950 text-zinc-100 px-3 py-2.5 font-mono text-[11px] overflow-x-auto">{(p as any).code}</pre> : null}
              {(p as any).bullets ? <ul className={`mt-3 space-y-1 font-mono text-[11px] leading-relaxed ${p.highlight? 'text-zinc-800':'text-zinc-600'}`}>{(p as any).bullets.map((b:string)=> <li key={b}>· {b}</li>)}</ul> : null}
              {p.cta && <a href={p.cta.href} className={`mt-4 inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold ${p.highlight? 'bg-zinc-900 text-white hover:bg-black':'bg-zinc-900 text-white hover:bg-black'}`}>{p.cta.label} →</a>}
            </div>
          ))}
        </div>
      </section>

      {/* GAPS + FAQ — bento split 5/7 */}
      <section id="docs" className="mx-auto max-w-[1240px] px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 lg:col-span-5 reveal rounded-[18px] bg-white text-zinc-900 p-6 sm:p-7">
            <h3 className="font-display text-[20px] font-semibold tracking-tight">Honest gaps</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">We ship the curated suite, not a Hub. We concede these until they’re real:</p>
            <ul className="mt-4 space-y-2 text-[13px]">
              <li className="flex gap-2"><span className="text-zinc-400">—</span><span><b>Sync clients:</b> no native desktop/mobile yet. PWA + share-target today, <b>WebDAV</b> next.</span></li>
              <li className="flex gap-2"><span className="text-zinc-400">—</span><span><b>Photos:</b> Immich wins pure photo backup — Noatun wins Drive+Photos together.</span></li>
              <li className="flex gap-2"><span className="text-zinc-400">—</span><span><b>Imports:</b> export → upload today; guides in <a href="https://github.com/fifthsegment/noatun/blob/master/docs/migration-sketch.md" className="underline decoration-zinc-300 underline-offset-4">migration-sketch.md</a>.</span></li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
              <a href="https://github.com/fifthsegment/noatun/blob/master/docs/ram-benchmark.md" className="inline-flex rounded-full bg-zinc-900 px-3 py-1.5 font-medium text-white hover:bg-black">RAM benchmark</a>
              <a href="https://github.com/fifthsegment/noatun/blob/master/docs/sync-path-v1.md" className="inline-flex rounded-full bg-white ring-1 ring-zinc-200 px-3 py-1.5 font-medium hover:bg-zinc-50">Sync path v1</a>
              <a href="https://github.com/fifthsegment/noatun/blob/master/docs/vs-nextcloud.md" className="inline-flex rounded-full bg-white ring-1 ring-zinc-200 px-3 py-1.5 font-medium hover:bg-zinc-50">Noatun vs Nextcloud</a>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 reveal" style={{ transitionDelay: '80ms' } as any}><FAQ /></div>
        </div>
      </section>

      {/* Final CTA — repeated per viewport */}
      <section className="mx-auto max-w-[1240px] px-4 sm:px-6 pb-8">
        <div className="reveal rounded-[22px] bg-gradient-to-br from-amber-400 via-amber-500 to-amber-400 p-[1px]">
          <div className="rounded-[21px] bg-abyss px-6 sm:px-8 py-7 sm:py-8 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div>
              <h3 className="font-display text-[20px] font-semibold tracking-tight text-white">Get your private cloud — without the second job.</h3>
              <p className="mt-1 text-[13px] text-white/60">Join the waitlist. Early members lock a founding Managed Noatun rate.</p>
            </div>
            <a href="#waitlist" className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-6 text-[14px] font-semibold text-zinc-900 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-white">Join waitlist — free</a>
          </div>
        </div>
      </section>

      {/* Footer — minimal per landing-pages, only legal + logo */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-[11px] leading-relaxed">
          <div className="text-white/35">© {new Date().getFullYear()} Noatun · <span className="text-white/55">Nóatún — harbour / ship-enclosure</span> · AGPL-3.0 · Not the Rust crate.</div>
          <div className="flex flex-wrap gap-2">
            <a href="https://github.com/fifthsegment/noatun" className="rounded-full bg-white/[0.06] ring-1 ring-white/10 px-3 py-1.5 text-white/60 hover:text-white hover:bg-white/10">fifthsegment/noatun</a>
            <a href="mailto:hello@noatun.app" className="rounded-full bg-white/[0.06] ring-1 ring-white/10 px-3 py-1.5 text-white/60 hover:text-white hover:bg-white/10">hello@noatun.app</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
