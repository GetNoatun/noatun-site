import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import FAQ from './components/FAQ'
import WaitlistForm from './components/WaitlistForm'

type Success = { email: string; referralCode: string; referralUrl: string; referralCount: number }
type Theme = 'dark' | 'light'

const screenshots = [
  { src: '02-drive.png', label: 'Files', title: 'A private home for daily files.', body: 'Folders, uploads, previews, restore, and search in one place.' },
  { src: '04-photos.png', label: 'Photos', title: 'Keep the library close.', body: 'Photos, video, albums, and sharing without handing over the whole archive.' },
  { src: '10-document-editor.png', label: 'Documents', title: 'Work where the file lives.', body: 'Edit documents, spreadsheets, and Markdown without moving them elsewhere.' },
  { src: '13-admin.png', label: 'Administration', title: 'Small-team operations, in view.', body: 'User access, quotas, backups, monitoring, and logs without a black box.' },
]

const principles = [
  { number: '01', title: 'Replace the pile of apps.', body: 'Files, photos, documents, notes, and sharing in one focused private cloud.' },
  { number: '02', title: 'Find what you forgot.', body: 'Search names, OCR text, visual tags, and email instead of remembering the folder.' },
  { number: '03', title: 'Run it on your terms.', body: 'Home lab or VPS. Self-hosted by default, with a clear operating surface.' },
]

function asset(name: string) {
  return `/noatun-site/screenshots/${name}`
}

function BrandMark() {
  return <span className="brand-mark" aria-hidden><img src="/noatun-site/noatun-icon.png" alt="" /></span>
}

function ScreenshotCard({ item, index }: { item: typeof screenshots[number]; index: number }) {
  return <article className={`screenshot-card reveal ${index === 0 ? 'screenshot-card-wide' : ''}`} style={{ transitionDelay: `${index * 70}ms` } as CSSProperties}>
    <div className="screenshot-frame"><img src={asset(item.src)} alt={`Noatun ${item.label} interface`} loading={index === 0 ? 'eager' : 'lazy'} /></div>
    <div className="screenshot-copy"><div className="eyebrow">{item.label}</div><h3>{item.title}</h3><p>{item.body}</p></div>
  </article>
}

export default function App() {
  const [success, setSuccess] = useState<Success | null>(null)
  const [copied, setCopied] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => { const requested = new URLSearchParams(window.location.search).get('theme'); return requested === 'light' || requested === 'dark' ? requested : ((localStorage.getItem('noatun-theme') as Theme) || 'dark') })
  const referralLink = useMemo(() => success?.referralUrl ?? '', [success])

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('noatun-theme', theme) }, [theme])
  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#joined=')) {
      try { setSuccess(JSON.parse(atob(decodeURIComponent(hash.slice(8)))) as Success); window.history.replaceState(null, '', window.location.pathname + window.location.search) } catch { /* invalid referral payload */ }
    }
  }, [])
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('in')), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  async function copyReferral() {
    if (!referralLink) return
    await navigator.clipboard.writeText(referralLink).catch(() => undefined)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return <div className="site-shell">
    <header className="site-header">
      <div className="site-container header-inner">
        <a className="brand" href="#top" aria-label="Noatun home"><BrandMark /><span>Noatun</span></a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#product">Product</a><a href="#teams">For teams</a><a href="#faq">FAQ</a></nav>
        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={() => setTheme(value => value === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}><span aria-hidden>{theme === 'dark' ? '☼' : '◐'}</span><span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span></button>
          <a className="header-link" href="https://github.com/GetNoatun/noatun-site" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a className="button button-small button-dark" href="#waitlist"><span className="header-early-label">Get early access</span><span className="header-early-short">Join</span></a>
          <button className="menu-button" type="button" aria-label="Open menu" aria-expanded={mobileNav} onClick={() => setMobileNav(value => !value)}>{mobileNav ? '×' : '≡'}</button>
        </div>
      </div>
      {mobileNav && <nav className="mobile-nav"><a href="#product" onClick={() => setMobileNav(false)}>Product</a><a href="#teams" onClick={() => setMobileNav(false)}>For teams</a><a href="#faq" onClick={() => setMobileNav(false)}>FAQ</a><a className="button button-dark" href="#waitlist" onClick={() => setMobileNav(false)}>Get early access</a></nav>}
    </header>

    <main id="top">
      <section className="hero-section">
        <div className="hero-grid" aria-hidden="true" /><div className="hero-glow" aria-hidden="true" />
        <div className="site-container hero-inner">
          <div className="hero-copy reveal"><div className="eyebrow eyebrow-accent"><span className="status-dot" />PERSONAL CLOUD / SMALL TEAMS</div><h1>Your own Drive<br /><span>and Photos.</span></h1><p className="hero-lede">Noatun gives self-hosters a private daily cloud for files, photos, documents, search, and sharing — without turning the server into a second job.</p><div className="hero-buttons"><a className="button button-accent" href="#waitlist">Get early access <span>→</span></a><a className="button button-quiet" href="#product">See the product</a></div><div className="hero-meta"><span>Self-hosted first</span><span>1 GB minimum</span><span>Built for small teams</span></div></div>
          <div className="hero-image reveal" style={{ transitionDelay: '100ms' } as CSSProperties}><div className="image-label"><span>REAL PRODUCT</span><span>NOATUN / FILES</span></div><div className="hero-shot"><img src={asset('02-drive.png')} alt="Noatun Files interface showing folders and documents" /></div><div className="image-caption">The interface is real. The infrastructure is yours.</div></div>
        </div>
      </section>

      <section id="waitlist" className="waitlist-section"><div className="site-container"><div className="waitlist-card reveal"><div className="waitlist-intro"><div className="eyebrow eyebrow-accent">EARLY ACCESS</div><h2>Put your name on the build.</h2><p>Get launch updates, early access, and founding pricing for the private cloud you can actually control.</p></div>{!success ? <WaitlistForm onSuccess={setSuccess} /> : <div className="success-state"><span className="success-icon">✓</span><div><h3>You’re on the list.</h3><p>Share your link to move up the queue.</p><div className="referral-row"><span>{referralLink}</span><button type="button" onClick={copyReferral}>{copied ? 'Copied' : 'Copy link'}</button></div><small>{success.referralCount} referrals · early access priority</small></div></div>}</div></div></section>

      <section id="product" className="section site-container"><div className="section-heading reveal"><div className="eyebrow">WHY NOATUN</div><h2>The daily cloud.<br /><em>Without the data handoff.</em></h2><p>For people who want a polished everyday workspace while keeping the infrastructure, storage boundary, and operating decisions close.</p></div><div className="principles-grid">{principles.map(item => <article className="principle-card reveal" key={item.number}><span className="principle-number">{item.number}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>

      <section className="screens-section"><div className="site-container"><div className="section-heading section-heading-wide reveal"><div className="eyebrow">SEE THE PRODUCT</div><h2>Real screens.<br /><em>Real control.</em></h2><p>No concept art. These are the actual Noatun screens across files, photos, documents, and administration.</p></div><div className="screens-grid">{screenshots.map((item, index) => <ScreenshotCard item={item} index={index} key={item.src} />)}</div></div></section>

      <section className="audience-section"><div className="site-container"><div className="section-heading reveal"><div className="eyebrow">A CLEAR FIT</div><h2>Private daily use.<br /><em>Small-team reach.</em></h2><p>Noatun starts with the personal cloud and grows naturally into a private workspace for teams that value control over breadth.</p></div><div className="audience-grid"><article className="audience-card audience-card-primary reveal"><div className="eyebrow eyebrow-accent">PERSONAL CLOUD</div><h3>For self-hosters, families, and freelancers.</h3><p>Keep files, photos, documents, notes, and sharing together instead of assembling a handful of almost-solutions.</p><ul><li>Drive + Photos + lightweight editors</li><li>PWA and Android share-to-Noatun</li><li>Search with OCR and local image tags</li></ul><span className="audience-note">Best fit: home lab, VPS, or a private archive</span></article><article className="audience-card reveal"><div className="eyebrow eyebrow-accent">SMALL TEAMS</div><h3>For agencies, practices, and private offices.</h3><p>Give a small team a useful shared workspace without pretending it is a full enterprise collaboration suite.</p><ul><li>Optional OIDC SSO through Dex</li><li>User activation, access, and quotas</li><li>Passworded, expiring external links</li><li>S3-compatible file and PostgreSQL backups</li></ul><span className="audience-note">Best fit: teams that want a private workspace they can operate</span></article></div></div></section>

      <section id="teams" className="enterprise-section"><div className="site-container enterprise-grid"><div className="enterprise-copy reveal"><div className="eyebrow eyebrow-accent">FOR SMALL TEAMS & OPERATORS</div><h2>A private workspace<br /><em>your team can actually use.</em></h2><p>For agencies, practices, studios, and small companies that need shared files and documents on infrastructure they control. Keep access, quotas, backups, monitoring, and logs visible to the people responsible for them.</p><div className="team-proof-list"><span>Optional OIDC SSO</span><span>User lifecycle controls</span><span>Quotas</span><span>External sharing</span><span>S3 + PostgreSQL backups</span></div><a className="button button-accent" href="#waitlist">Join the team preview →</a></div><div className="admin-proof reveal"><div className="admin-proof-label"><span>ADMINISTRATION</span><span>OPERATIONS</span></div><img src={asset('13-admin.png')} alt="Noatun Administration interface showing users and quotas" loading="lazy" /><div className="proof-points"><span>User access</span><span>Quotas</span><span>Monitoring</span><span>Backups</span><span>Logs</span></div></div></div></section>

      <section className="fit-section"><div className="site-container fit-grid"><div className="fit-copy reveal"><div className="eyebrow">HONEST BY DESIGN</div><h2>Own the boundary.<br /><em>Know the edges.</em></h2><p>Noatun is a focused private cloud, not a promise to replace every tool your organization uses.</p></div><div className="fit-list reveal"><div><span className="fit-label">USE NOATUN FOR</span><p>Private files, photos, documents, notes, searchable archives, and controlled sharing.</p></div><div><span className="fit-label">WAIT FOR OR CHOOSE ANOTHER TOOL IF YOU NEED</span><p>Native desktop sync, background camera backup, WebDAV, real-time co-editing, or enterprise compliance programs today.</p></div></div></div></section>

      <section className="quote-section"><div className="site-container quote-grid"><div className="quote-mark">↗</div><blockquote>Your server should feel like a product.</blockquote><div className="quote-aside"><span className="eyebrow">THE NOATUN PROMISE</span><p>Clear ownership. Calm operations. A workspace people actually want to use.</p></div></div></section>

      <section id="faq" className="faq-section site-container"><div className="section-heading reveal"><div className="eyebrow">FAQ</div><h2>Good questions.<br /><em>Straight answers.</em></h2></div><div className="faq-wrap reveal"><FAQ /></div></section>
      <section className="final-cta"><div className="site-container final-cta-inner reveal"><div><div className="eyebrow eyebrow-accent">YOUR DATA, YOUR DECISION</div><h2>Keep your data close. Make the experience better.</h2></div><a className="button button-accent" href="#waitlist">Get early access <span>→</span></a></div></section>
    </main>

    <footer className="site-footer"><div className="site-container footer-inner"><div>© {new Date().getFullYear()} Noatun · Private cloud, your way.</div><div className="footer-links"><a href="https://github.com/GetNoatun/noatun-site">GitHub ↗</a><a href="mailto:hello@noatun.app">hello@noatun.app</a></div></div></footer>
  </div>
}
