import { useEffect, useMemo, useState } from 'react'
import WaitlistForm from './components/WaitlistForm'
import FAQ from './components/FAQ'

type Success = { email: string; referralCode: string; referralUrl: string; referralCount: number }

export default function App(){
  const [success, setSuccess] = useState<Success|null>(null)
  const [copied, setCopied] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)

  useEffect(()=>{ const h=window.location.hash; if(h.startsWith('#joined=')){ try{ const raw=decodeURIComponent(h.slice('#joined='.length)); const s=JSON.parse(atob(raw)) as Success; setSuccess(s); window.history.replaceState(null,'', window.location.pathname + window.location.search)}catch{} } }, [])
  const referralLink = useMemo(()=> success?.referralUrl ?? '', [success])
  async function copyReferral(){ if(!referralLink) return; await navigator.clipboard.writeText(referralLink).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false), 1800) }
  useEffect(()=>{
    const els=document.querySelectorAll('.reveal')
    const io=new IntersectionObserver((entries)=>{ for(const e of entries) if(e.isIntersecting) e.target.classList.add('in') },{ rootMargin:'0px 0px -8% 0px', threshold:0.12 })
    els.forEach(el=> io.observe(el)); return ()=> io.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[var(--color-fjord)] text-[var(--color-mist)]">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[var(--color-fjord)]/75 border-b border-white/[0.06]">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 h-[56px] flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 shrink-0" aria-label="Noatun — home">
            <span className="h-7 w-7 grid place-items-center rounded-[10px] bg-[var(--color-harbour)] text-white">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><path d="M2.2 6L7 2.2L11.8 6V11.2C11.8 11.9 11.2 12.5 10.5 12.5H3.5C2.8 12.5 2.2 11.9 2.2 11.2V6Z" stroke="white" strokeWidth="1.35" strokeLinejoin="round"/><path d="M4.6 12.5V8.4H9.4V12.5" stroke="white" strokeWidth="1.15" strokeLinejoin="round"/><path d="M7 5.2V5.22" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </span>
            <span className="text-[13px] font-semibold tracking-tight text-white">Noatun</span>
            <span className="hidden sm:inline font-mono text-[10px] tracking-[0.14em] text-white/40">NÓATÚN — HARBOUR</span>
          </a>
          <span className="hidden md:inline-flex ml-4 rounded-full bg-white/[0.06] ring-1 ring-white/10 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-white/55">PRIVATE · NORDIC · HONEST</span>
          <div className="ml-auto flex items-center gap-2">
            <a href="#waitlist" className="hidden sm:inline-flex h-9 items-center rounded-full bg-white px-4 font-mono text-[12px] font-semibold tracking-wide text-zinc-900 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-white">Join waitlist</a>
            <a href="https://github.com/fifthsegment/noatun" target="_blank" rel="noreferrer" className="inline-flex h-9 items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 px-3.5 text-[13px] font-medium text-white/75 hover:bg-white/[0.10] focus-visible:ring-2 focus-visible:ring-white/20">GitHub ↗</a>
            <button aria-label="Menu" aria-expanded={mobileNav} onClick={()=>setMobileNav(v=>!v)} className="sm:hidden h-9 w-9 grid place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 text-white/80">{mobileNav? '×':'≡'}</button>
          </div>
        </div>
        {mobileNav && (
          <div className="sm:hidden border-t border-white/[0.06] bg-[var(--color-fjord)]/95 backdrop-blur px-4 py-3 flex flex-col gap-1">
            <a href="#why" onClick={()=>setMobileNav(false)} className="px-3 py-2.5 rounded-xl text-[14px] text-white/80 hover:bg-white/[0.06]">Why Noatun</a>
            <a href="#docs" onClick={()=>setMobileNav(false)} className="px-3 py-2.5 rounded-xl text-[14px] text-white/80 hover:bg-white/[0.06]">Docs & trust</a>
            <a href="#waitlist" onClick={()=>setMobileNav(false)} className="h-11 grid place-items-center rounded-xl bg-white text-zinc-900 font-semibold">Join waitlist</a>
          </div>
        )}
      </header>

      <section className="fjord relative overflow-clip">
        <div className="aurora" aria-hidden />
        <div className="rune-grid" aria-hidden />
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 pt-10 sm:pt-14 pb-10 sm:pb-12">
          <div className="reveal inline-flex items-center gap-2 rounded-full bg-white/[0.06] ring-1 ring-white/10 px-3 py-1.5 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
            <span className="font-mono text-[11px] tracking-[0.12em] text-white/70">NÓATÚN — HARBOUR OF NJORD · PRIVATE CLOUD</span>
            <span className="hidden sm:inline-flex ml-1 rounded-full bg-[var(--color-harbour-soft)] ring-1 ring-[var(--color-harbour-ring)] px-2 py-0.5 font-mono text-[10px] tracking-wide text-amber-100">Invite 3 → unlock early rate</span>
          </div>

          <div className="mt-6 grid grid-cols-12 gap-8 lg:gap-10 items-start">
            <div className="col-span-12 lg:col-span-7 reveal" style={{ transitionDelay: '60ms' } as any}>
              <h1 className="display leading-[0.90]" style={{ fontSize: 'clamp(38px, 6vw, 78px)' }}>
                <span className="block text-[var(--color-mist)]">Your private</span>
                <span className="block text-[var(--color-mist)]">harbour<span className="font-serif italic font-normal tracking-[-0.02em] text-white/85">.</span></span>
                <span className="mt-1 block font-serif italic font-normal tracking-[-0.02em] text-[var(--color-harbour)]" style={{ fontSize: 'clamp(18px, 2.2vw, 24px)', lineHeight: 1.2 }}>— that fits a $5 VPS</span>
              </h1>
              <p className="mt-4 max-w-[56ch] text-[15px] sm:text-[16px] leading-[1.65] text-white/60 text-pretty">
                One lightweight personal cloud — files, photo stream, docs, notes — you <span className="text-white/90 font-medium">self-host</span> or <span className="text-white/90 font-medium">we host for you</span>. One compose file · open core coming · built for the fjord, not the office.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] ring-1 ring-white/[0.08] px-3 py-1.5 text-white/65">~0.4 GiB idle · &lt;0.8 GiB light library</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] ring-1 ring-white/[0.08] px-3 py-1.5 text-white/65">One compose file</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] ring-1 ring-white/[0.08] px-3 py-1.5 text-white/65">AGPL-3.0</span>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a href="#waitlist" className="inline-flex h-[46px] items-center rounded-full bg-[var(--color-harbour)] px-6 text-[14px] font-semibold tracking-[-0.01em] text-white hover:brightness-[1.06] focus-visible:ring-2 focus-visible:ring-[var(--color-harbour-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-fjord)]">Join waitlist →</a>
                <span className="font-mono text-[11px] tracking-wide text-white/35">1 GB min / 2 GB recommended</span>
              </div>
              <p className="mt-3 font-mono text-[11px] tracking-wide text-white/35">PWA + share-target today · WebDAV next · <a href="https://github.com/fifthsegment/noatun/blob/master/docs/ram-benchmark.md" className="underline decoration-white/20 underline-offset-4 hover:text-white/60">RAM benchmark</a> · <a href="https://github.com/fifthsegment/noatun/blob/master/docs/sync-path-v1.md" className="underline decoration-white/20 underline-offset-4 hover:text-white/60">sync path</a></p>
            </div>

            <div className="col-span-12 lg:col-span-5 reveal" style={{ transitionDelay: '140ms' } as any}>
              <div className="relative rounded-[22px] bg-[var(--color-paper)] ring-1 ring-black/10 p-3 sm:p-4 shadow-[0_24px_80px_rgba(12,20,24,0.35)]">
                <div className="rounded-[16px] bg-white ring-1 ring-zinc-200 overflow-hidden">
                  <div className="h-9 flex items-center gap-1.5 px-3 border-b border-zinc-200 bg-zinc-50">
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" /><span className="h-2.5 w-2.5 rounded-full bg-zinc-300" /><span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                    <span className="ml-3 font-mono text-[10px] tracking-[0.12em] text-zinc-500">NOATUN.APP — DRIVE / PHOTOS</span>
                    <span className="ml-auto hidden sm:inline rounded-full bg-[var(--color-harbour-soft)] ring-1 ring-[var(--color-harbour-ring)] px-2 py-0.5 font-mono text-[10px] tracking-wide font-semibold text-[var(--color-harbour)]">HARBOUR LIGHT ON</span>
                  </div>
                  <div className="p-3 sm:p-4 grid grid-cols-12 gap-3">
                    <div className="col-span-12 sm:col-span-5">
                      <div className="rounded-[12px] bg-zinc-50 ring-1 ring-zinc-200 p-3">
                        <div className="font-mono text-[10px] tracking-[0.12em] font-semibold text-zinc-500">BOATHOUSE — NAV</div>
                        <div className="mt-2 space-y-1 text-[11px]">
                          {['Files','Photos','Recent','Notes','Contacts'].map((n,i)=> (
                            // @ts-ignore
                            <div key={n} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${i===0? 'bg-zinc-900 text-white' : 'bg-white ring-1 ring-zinc-200 text-zinc-600'}`}>{n}{i===0 && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-harbour)]" />}</div>
                          ))}
                        </div>
                        <div className="mt-3 h-1.5 rounded-full bg-zinc-200 overflow-hidden"><div className="h-full w-[42%] bg-[var(--color-harbour)]" /></div>
                        <div className="mt-1 font-mono text-[10px] text-zinc-500">2.1 / 5 GB · 42% — one backup story</div>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-7">
                      <div className="rounded-[12px] bg-zinc-900 p-3 text-white">
                        <div className="flex items-center gap-2"><span className="flex-1 h-7 rounded-full bg-white/10 ring-1 ring-white/10" /><span className="h-7 rounded-full bg-white px-3 grid place-items-center text-[11px] font-semibold text-zinc-900">Upload</span></div>
                        <div className="mt-3 grid gap-2">
                          {[
                            { n: 'Q2_Board_Deck.pdf', m: '2.4 MB · yesterday' },
                            { n: 'Beach_2024-08.heic', m: 'AI: beach, ocean · 4.1 MB' },
                            { n: 'Contract.docx', m: 'Edited 2h ago' },
                          ].map(f=> (
                            <div key={f.n} className="flex items-center gap-2.5 rounded-xl bg-white/[0.06] ring-1 ring-white/10 px-3 py-2">
                              <span className="h-7 w-7 grid place-items-center rounded-lg bg-[var(--color-harbour-soft)] ring-1 ring-[var(--color-harbour-ring)] text-[10px] text-amber-100">◧</span>
                              <div className="min-w-0"><div className="text-[12px] font-medium text-white/90 truncate">{f.n}</div><div className="font-mono text-[11px] text-white/40 truncate">{f.m}</div></div>
                              <span className="ml-auto text-white/25">⋯</span>
                            </div>
                          ))}
                          <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.04] p-2.5 text-center">
                            <div className="font-mono text-[10px] tracking-[0.14em] text-white/60">DRAG · PWA SHARE-TARGET</div>
                            <div className="text-[11px] text-white/40">Photos + docs, one harbour</div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2 font-mono text-[10px]">
                        <span className="rounded-full bg-white ring-1 ring-zinc-200 px-2.5 py-1 text-zinc-700">noatun.app</span>
                        <span className="rounded-full bg-zinc-900 text-white px-2.5 py-1">open: the fjord</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute -bottom-3 -right-3 hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white ring-1 ring-zinc-200 px-3 py-1.5 font-mono text-[11px] font-medium text-zinc-700 shadow-xl"><span className="h-1.5 w-1.5 rounded-full bg-[var(--color-harbour)]" /> pwa-512 · share to Noatun</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="waitlist" className="mx-auto max-w-[1240px] px-4 sm:px-6 -mt-2 sm:mt-0">
        <div className="reveal mx-auto max-w-[640px] rounded-[22px] bg-[var(--color-paper)] text-zinc-900 p-5 sm:p-6 shadow-[0_20px_80px_rgba(12,20,24,0.22)] ring-1 ring-black/5">
          {!success ? (
            <>
              <h2 className="display text-[22px] leading-none tracking-[-0.02em]">Join the harbour.</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">Get launch + early Managed pricing. Invite 3 friends → jump the queue and lock a founding price.</p>
              <div className="mt-4"><WaitlistForm onSuccess={setSuccess} /></div>
              <p className="mt-2 text-center font-mono text-[11px] text-zinc-500">No spam. Unsubscribe anytime. AGPL-3.0 when we open.</p>
            </>
          ) : (
            <div className="flex gap-3">
              <span className="mt-0.5 h-8 w-8 grid place-items-center rounded-full bg-emerald-600 text-white">✓</span>
              <div className="min-w-0 flex-1">
                <h3 className="display text-[18px] font-semibold tracking-tight">You’re in — {success.email}</h3>
                <p className="mt-1 text-[13px] text-zinc-600">Want earlier access? Share your link — the harbour is warmer with 2–3.</p>
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 min-w-0 rounded-[12px] bg-zinc-900 text-white px-3 py-2.5 font-mono text-[12px] truncate">{referralLink}</div>
                  <button onClick={copyReferral} className="h-[42px] shrink-0 rounded-[12px] bg-zinc-900 px-4 text-[13px] font-semibold text-white hover:bg-black focus-visible:ring-2 focus-visible:ring-zinc-900">{copied ? 'Copied' : 'Copy link'}</button>
                </div>
                <p className="mt-2 font-mono text-[11px] text-zinc-500">{success.referralCount} signed up via you → early price locked</p>
                <button onClick={()=>setSuccess(null)} className="mt-3 text-[12px] font-medium text-zinc-600 hover:text-zinc-900 underline underline-offset-4">Join with another email</button>
              </div>
            </div>
          )}
        </div>
        <div className="mx-auto max-w-[640px] mt-3 flex justify-center">
          <a href="#why" className="font-mono text-[12px] font-medium text-white/45 hover:text-white/75 underline underline-offset-4">How does it compare? →</a>
        </div>
      </section>

      <section id="why" className="mx-auto max-w-[1240px] px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="col-span-12 lg:col-span-7 reveal">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] ring-1 ring-white/10 px-3 py-1 font-mono text-[11px] tracking-[0.12em] font-semibold text-white/60">THE PROBLEM — ONE JOB</div>
            <h2 className="mt-4 display text-[30px] sm:text-[38px] font-bold tracking-[-0.03em] leading-[0.9] text-white text-balance">You wanted your<br />own Drive. You got<br /><span className="text-white/45 font-serif italic font-normal">a second full-time job.</span></h2>
            <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-white/60">Nextcloud eats the box. Immich owns photos but not files. Stitching five apps means five updates and one bad weekend. Google One is easy — and it indexes the family album.</p>
            <blockquote className="mt-6 rounded-[14px] bg-[var(--color-harbour-soft)] ring-1 ring-[var(--color-harbour-ring)] px-4 py-3 text-[13px] leading-relaxed text-amber-50">
              “I do not want my cloud storage to be a debugging project.”
              <span className="block mt-1 font-mono text-[11px] tracking-wide text-amber-200/60">— VOC · Nextcloud forums / funkyton.com</span>
            </blockquote>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { k:'RAM', v:'2–8 GB', s:'Nextcloud Hub realistic' },
                { k:'APPS', v:'5+ to stitch', s:'Immich + Filebrowser + …' },
                { k:'COST', v:'$600 / 5y', s:'Google One 2 TB family' },
              ].map(x=> (
                <div key={x.k} className="bento rounded-[14px] bg-white/[0.04] ring-1 ring-white/[0.07] p-3">
                  <div className="font-mono text-[10px] tracking-[0.12em] text-white/35">{x.k}</div>
                  <div className="mt-1 display text-[18px] font-bold tracking-tight text-white">{x.v}</div>
                  <div className="font-mono text-[11px] text-white/40">{x.s}</div>
                </div>
              ))}
            </div>
            <a href="#waitlist" className="mt-6 inline-flex h-10 items-center rounded-full bg-white px-5 text-[13px] font-semibold text-zinc-900 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-white">Join waitlist →</a>
          </div>
          <div className="col-span-12 lg:col-span-5 reveal" style={{ transitionDelay: '100ms' } as any}>
            <div className="rounded-[18px] bg-[var(--color-paper)] text-zinc-900 p-6 sm:p-7 ring-1 ring-black/5">
              <div className="inline-flex rounded-full bg-[var(--color-harbour)]/15 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-[0.12em] text-[var(--color-harbour)]">WHAT NOATUN IS — ONE JOB</div>
              <h3 className="mt-3 display text-[22px] font-bold tracking-[-0.02em] leading-tight">A curated personal cloud,<br /><span className="font-serif italic font-normal text-zinc-500">not an app store.</span></h3>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">Drive, photo stream, docs, notes, mail, contacts — one login, one backup story, one compose file. Built for cheap VPS and people who want ownership without Ops theater.</p>
              <ul className="mt-5 grid gap-2 text-[13px]">
                {[
                  'Fits a small VPS — ~0.4 GiB idle, <0.8 GiB light library (measured)',
                  'Warm paper UI · photo stream, editors, PWA — Nordic, light, tactile',
                  'Share links for family and clients · quotas, password links',
                  'Managed option when you don’t want to babysit updates',
                ].map(t=> (
                  <li key={t} className="flex gap-2.5 rounded-[12px] bg-white ring-1 ring-zinc-200/70 px-3 py-2.5"><span className="mt-0.5 h-5 w-5 grid place-items-center rounded-full bg-[var(--color-harbour)] text-white text-[11px]">✓</span><span className="leading-snug">{t}</span></li>
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

      <section className="mx-auto max-w-[1240px] px-4 sm:px-6 pb-4">
        <div className="reveal rounded-[22px] bg-white/[0.035] ring-1 ring-white/[0.07] overflow-hidden">
          <div className="grid grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">
            {[
              { badge:'Self-host', title:'Homelabber', sub:'on a $5–10 VPS', bullets:['One stack instead of Nextcloud + Immich + Filebrowser','1 GB min / 2 GB recommended · Sonic, MinIO, Postgres'] },
              { badge:'Managed', title:'Family “IT person”', sub:'photos + docs private', bullets:['Photo stream + share links for partner/kids','Managed Noatun if you hate upgrades · backup included'] },
              { badge:'Pro soon', title:'Freelancer', sub:'share links + quotas', bullets:['Password links, quotas, flat storage vs Google One creep','Docs/notes/mail in one login — fewer tools to bill'] },
            ].map(c=> (
              <div key={c.title} className="col-span-12 lg:col-span-4 p-6 sm:p-7">
                <div className="inline-flex rounded-full bg-white/[0.06] ring-1 ring-white/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-white/60">{c.badge}</div>
                <h3 className="mt-3 display text-[18px] font-semibold tracking-tight text-white">{c.title}</h3>
                <p className="font-mono text-[11px] tracking-wide text-white/40">{c.sub}</p>
                <ul className="mt-3 space-y-1.5 list-disc list-inside text-[13px] leading-relaxed text-white/65">
                  {c.bullets.map(b=> <li key={b}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="bg-[var(--color-harbour-soft)] ring-1 ring-[var(--color-harbour-ring)] px-6 py-3 flex flex-wrap items-center gap-2 font-mono text-[11px] text-amber-100/85">
            <span className="font-semibold tracking-[0.12em]">NOT FOR</span><span className="text-amber-100/60">·</span><span>Photo-only (use Immich) · Enterprise Workspace / Talk+Calendar on 8 GB · Full Hub parity</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 sm:px-6 py-8">
        <div className="grid grid-cols-12 gap-4">
          {[
            { k:'01', t:'Self-host', d:'Free AGPL-3.0 core. One compose file — no Helm required.', code:'docker compose -f deploy/compose.yaml up -d --build', cta:{label:'Read the bring-up', href:'https://github.com/fifthsegment/noatun#bring-up-agent-first'} },
            { k:'02', t:'Managed Noatun', d:'We run it · backups · updates · early price locked.', bullets:['$8–20/mo family · anchored vs €3–15 managed Nextcloud','Invite 3 → queue jump / founding price'], cta:{label:'Join waitlist', href:'#waitlist'}, highlight:true },
            { k:'03', t:'Pro (later)', d:'White-label / power for MSPs and teams.', bullets:['Domain-bound license · ethical keys later','Not sold before managed economics are clear'], cta:{label:'Pro outline', href:'https://github.com/fifthsegment/noatun#pro-later'}, muted:true },
          ].map(p=> (
            <div key={p.k} className={`col-span-12 md:col-span-4 bento rounded-[18px] p-5 ring-1 ${p.highlight? 'bg-[var(--color-paper)] text-zinc-900 ring-black/5 shadow-[0_12px_40px_rgba(12,20,24,0.12)]' : (p as any).muted? 'bg-white/[0.03] ring-white/[0.07] text-white/70' : 'bg-white text-zinc-900 ring-zinc-200'}`}>
              <div className={`inline-flex h-7 w-7 place-items-center justify-center rounded-full font-mono text-[11px] font-bold ring-1 ${p.highlight? 'bg-zinc-900 text-white ring-zinc-900' : 'bg-zinc-900 text-white ring-zinc-900/10'}`}>{p.k}</div>
              <h3 className={`mt-3 display text-[18px] font-semibold tracking-tight ${p.highlight? 'text-zinc-900':''}`}>{p.t}</h3>
              <p className={`mt-1 text-[13px] leading-relaxed ${p.highlight? 'text-zinc-600':'text-zinc-600'}`}>{p.d}</p>
              {(p as any).code ? <pre className="mt-3 rounded-[10px] bg-zinc-900 text-zinc-100 px-3 py-2.5 font-mono text-[11px] overflow-x-auto">{(p as any).code}</pre> : null}
              {(p as any).bullets ? <ul className={`mt-3 space-y-1 font-mono text-[11px] leading-relaxed ${p.highlight? 'text-zinc-600':'text-zinc-600'}`}>{(p as any).bullets.map((b:string)=> <li key={b}>· {b}</li>)}</ul> : null}
              {p.cta && <a href={p.cta.href} className={`mt-4 inline-flex h-9 items-center rounded-full px-4 text-[13px] font-semibold ${p.highlight? 'bg-zinc-900 text-white hover:bg-black':'bg-zinc-900 text-white hover:bg-black'}`}>{p.cta.label} →</a>}
            </div>
          ))}
        </div>
      </section>

      <section id="docs" className="mx-auto max-w-[1240px] px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 lg:col-span-5 reveal rounded-[18px] bg-[var(--color-paper)] text-zinc-900 p-6 sm:p-7 ring-1 ring-black/5">
            <h3 className="display text-[20px] font-semibold tracking-tight">Honest gaps</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">We ship the curated suite, not a Hub. We concede these until they are real:</p>
            <ul className="mt-4 space-y-2 text-[13px]">
              <li className="flex gap-2"><span className="text-zinc-400">—</span><span><b>Sync clients:</b> no native desktop/mobile yet. PWA + share-target today, <b>WebDAV</b> next.</span></li>
              <li className="flex gap-2"><span className="text-zinc-400">—</span><span><b>Photos:</b> Immich wins pure backup — Noatun wins Drive+Photos together.</span></li>
              <li className="flex gap-2"><span className="text-zinc-400">—</span><span><b>Imports:</b> export → upload today; guides in <a href="https://github.com/fifthsegment/noatun/blob/master/docs/migration-sketch.md" className="underline decoration-zinc-300 underline-offset-4">migration-sketch.md</a>.</span></li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2 font-mono text-[11px]">
              <a href="https://github.com/fifthsegment/noatun/blob/master/docs/ram-benchmark.md" className="inline-flex rounded-full bg-zinc-900 px-3 py-1.5 font-medium text-white hover:bg-black">RAM benchmark</a>
              <a href="https://github.com/fifthsegment/noatun/blob/master/docs/sync-path-v1.md" className="inline-flex rounded-full bg-white ring-1 ring-zinc-200 px-3 py-1.5 font-medium hover:bg-zinc-50">Sync path v1</a>
              <a href="https://github.com/fifthsegment/noatun/blob/master/docs/vs-nextcloud.md" className="inline-flex rounded-full bg-white ring-1 ring-zinc-200 px-3 py-1.5 font-medium hover:bg-zinc-50">vs Nextcloud</a>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 reveal" style={{ transitionDelay: '80ms' } as any}><FAQ /></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 sm:px-6 pb-8">
        <div className="reveal rounded-[22px] bg-gradient-to-br from-[var(--color-harbour)] via-[#B84E22] to-[var(--color-harbour)] p-[1px]">
          <div className="rounded-[21px] bg-[var(--color-fjord)] px-6 sm:px-8 py-7 sm:py-8 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div>
              <h3 className="display text-[20px] font-semibold tracking-tight text-white">Get your private cloud — without the second job.</h3>
              <p className="mt-1 text-[13px] text-white/60">Join the waitlist. Early members lock a founding Managed Noatun rate.</p>
            </div>
            <a href="#waitlist" className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-6 text-[14px] font-semibold text-zinc-900 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-white">Join waitlist — free</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 py-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between font-mono text-[11px] leading-relaxed">
          <div className="text-white/35">© {new Date().getFullYear()} Noatun · <span className="text-white/55">Nóatún — harbour · Njörðr's harbour</span> · AGPL-3.0 · Not the Rust crate.</div>
          <div className="flex flex-wrap gap-2">
            <a href="https://github.com/fifthsegment/noatun" className="rounded-full bg-white/[0.06] ring-1 ring-white/10 px-3 py-1.5 text-white/60 hover:text-white hover:bg-white/10">fifthsegment/noatun</a>
            <a href="mailto:hello@noatun.app" className="rounded-full bg-white/[0.06] ring-1 ring-white/10 px-3 py-1.5 text-white/60 hover:text-white hover:bg-white/10">hello@noatun.app</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
