import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import FAQ from './components/FAQ'
import BrandMark, { type Theme } from './components/BrandMark'
import ProductWindow from './components/ProductWindow'
import WaitlistForm from './components/WaitlistForm'

type Success = { email: string; referralCode: string; referralUrl: string; referralCount: number }

const screenshots = [
  { src: '02-drive.png', label: 'Files', title: 'Everything you use, in one private place.', body: 'Folders, uploads, previews, version restore, and search in one workspace.' },
  { src: '04-photos.png', label: 'Photos', title: 'A photo library that stays yours.', body: 'Keep photos, video, albums, and sharing with the rest of your private cloud.' },
  { src: '10-document-editor.png', label: 'Documents', title: 'Work where the file lives.', body: 'Edit documents, spreadsheets, and Markdown without moving them elsewhere.' },
  { src: '13-admin.png', label: 'Administration', title: 'The controls operators need, in one place.', body: 'Manage user access, quotas, backups, monitoring, and logs.' },
]

const principles = [
  { number: '01', title: 'Replace the pile of apps.', body: 'Files, photos, documents, notes, and sharing in one focused private cloud.' },
  { number: '02', title: 'Find what you forgot.', body: 'Search file names, text found by OCR, local image tags, and email.' },
  { number: '03', title: 'Keep the stack understandable.', body: 'Start with Docker Compose on a home server or VPS, with the controls kept in view.' },
]

function asset(name: string) {
  return `/noatun-site/screenshots/${name}`
}

function ScreenshotCard({ item, index }: { item: typeof screenshots[number]; index: number }) {
  return <article className={`screenshot-card reveal ${index === 0 ? 'screenshot-card-wide' : ''}`} style={{ transitionDelay: `${index * 70}ms` } as CSSProperties}>
    <ProductWindow label={item.label}><div className="screenshot-frame"><img src={asset(item.src)} alt={`Noatun ${item.label} interface`} loading={index === 0 ? 'eager' : 'lazy'} /></div></ProductWindow>
    <div className="screenshot-copy"><div className="eyebrow">{item.label}</div><h3>{item.title}</h3><p>{item.body}</p></div>
  </article>
}

export default function App() {
  const [success, setSuccess] = useState<Success | null>(null)
  const [copied, setCopied] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => { const requested = new URLSearchParams(window.location.search).get('theme'); return requested === 'light' || requested === 'dark' ? requested : ((localStorage.getItem('noatun-theme-v2') as Theme) || 'light') })
  const referralLink = useMemo(() => success?.referralUrl ?? '', [success])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('noatun-theme-v2', theme)
    document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.setAttribute('href', `/noatun-site/noatun-icon${theme === 'light' ? '-light' : ''}.png`)
  }, [theme])
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
        <a className="brand" href="#top" aria-label="Noatun home"><BrandMark theme={theme} /><span>Noatun</span></a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#product">Product</a><a href="/noatun-site/enterprise/">For teams ↗</a><a href="#faq">FAQ</a></nav>
        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={() => setTheme(value => value === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}><span aria-hidden>{theme === 'dark' ? '☼' : '◐'}</span><span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span></button>
          <a className="button button-small button-dark" href="#waitlist"><span className="header-early-label">Get early access</span><span className="header-early-short">Join</span></a>
          <button className="menu-button" type="button" aria-label="Open menu" aria-expanded={mobileNav} onClick={() => setMobileNav(value => !value)}>{mobileNav ? '×' : '≡'}</button>
        </div>
      </div>
      {mobileNav && <nav className="mobile-nav"><a href="#product" onClick={() => setMobileNav(false)}>Product</a><a href="/noatun-site/enterprise/" onClick={() => setMobileNav(false)}>For teams ↗</a><a href="#faq" onClick={() => setMobileNav(false)}>FAQ</a><a className="button button-dark" href="#waitlist" onClick={() => setMobileNav(false)}>Get early access</a></nav>}
    </header>

    <main id="top">
      <section className="hero-section">
        <div className="hero-grid" aria-hidden="true" /><div className="hero-glow" aria-hidden="true" />
        <div className="site-container hero-inner">
          <div className="hero-copy reveal"><div className="eyebrow eyebrow-accent"><span className="status-dot" />PRIVATE CLOUD / SELF-HOSTED</div><h1>Your own Drive<br /><span>and Photos.</span></h1><p className="hero-lede">Noatun brings files, photos, documents, search, and sharing into one private cloud you can run yourself — without stitching several separate apps together.</p><div className="hero-buttons"><a className="button button-accent" href="#waitlist">Get early access <span>→</span></a><a className="button button-quiet" href="/noatun-site/enterprise/">For teams <span>↗</span></a></div><div className="hero-meta"><span>Self-hosted first</span><span>Browser + PWA</span><span>Small-team path</span></div></div>
          <div className="hero-image reveal" style={{ transitionDelay: '100ms' } as CSSProperties}><div className="image-label"><span>PRIVATE PHOTO LIBRARY</span><span>NOATUN / PHOTOS</span></div><ProductWindow label="PHOTOS" className="hero-product-window"><div className="hero-shot"><img src={asset(theme === 'light' ? '07-photos-light-list.png' : '04-photos.png')} alt="Noatun Photos interface showing a private photo library" /></div></ProductWindow><div className="image-caption">Browse, search, and share your library from the same private cloud.</div></div>
        </div>
      </section>

      <section id="waitlist" className="waitlist-section"><div className="site-container"><div className="waitlist-card reveal"><div className="waitlist-intro"><div className="eyebrow eyebrow-accent">EARLY ACCESS</div><h2>Join Noatun early access.</h2><p>Get product updates and be among the first to try the private cloud you can run yourself.</p></div>{!success ? <WaitlistForm onSuccess={setSuccess} /> : <div className="success-state"><span className="success-icon">✓</span><div><h3>You’re on the list.</h3><p>Share your link to move up the queue.</p><div className="referral-row"><span>{referralLink}</span><button type="button" onClick={copyReferral}>{copied ? 'Copied' : 'Copy link'}</button></div><small>{success.referralCount} referrals · early access priority</small></div></div>}</div></div></section>

      <section id="product" className="section site-container"><div className="section-heading reveal"><div className="eyebrow">WHY NOATUN</div><h2>The cloud you use every day.<br /><em>Without handing it over.</em></h2><p>Get a polished place for everyday files and photos while keeping the server and storage under your control.</p></div><div className="principles-grid">{principles.map(item => <article className="principle-card reveal" key={item.number}><span className="principle-number">{item.number}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>

      <section className="screens-section"><div className="site-container"><div className="section-heading section-heading-wide reveal"><div className="eyebrow">ONE PRIVATE WORKSPACE</div><h2>Files, photos, and documents.<br /><em>All in one place.</em></h2><p>Browse daily files, organize photos, edit documents, and manage the deployment from one focused workspace.</p></div><div className="screens-grid">{screenshots.map((item, index) => <ScreenshotCard item={item} index={index} key={item.src} />)}</div></div></section>

      <section className="audience-section"><div className="site-container"><div className="section-heading reveal"><div className="eyebrow">CHOOSE YOUR PATH</div><h2>Personal cloud first.<br /><em>Team workspace when needed.</em></h2><p>Start with a private place for your own files, then add the access and operating controls a small team needs.</p></div><div className="audience-grid"><article className="audience-card audience-card-primary reveal"><div className="eyebrow eyebrow-accent">PERSONAL CLOUD</div><h3>For self-hosters, families, and freelancers.</h3><p>Keep files, photos, documents, notes, and sharing together instead of assembling a handful of separate services.</p><ul><li>Drive + Photos + lightweight editors</li><li>Installable PWA and Android sharing</li><li>Search with OCR and local image tags</li></ul><span className="audience-note">Best fit: home server, VPS, or private archive</span></article><article className="audience-card reveal"><div className="eyebrow eyebrow-accent">SMALL TEAMS</div><h3>For agencies, practices, and private offices.</h3><p>Give your team a focused shared workspace without the breadth and operating overhead of a full collaboration suite.</p><ul><li>Connect an OIDC identity provider</li><li>Control user access and quotas</li><li>Passworded, expiring external links</li><li>S3-compatible file and PostgreSQL backups</li></ul><a className="audience-note audience-link" href="/noatun-site/enterprise/">Explore Noatun for teams ↗</a></article></div></div></section>

      <section id="teams" className="enterprise-section"><div className="site-container enterprise-grid"><div className="enterprise-copy reveal"><div className="eyebrow eyebrow-accent">FOR SMALL TEAMS & OPERATORS</div><h2>A private file workspace<br /><em>built for small teams.</em></h2><p>Give an agency, practice, studio, or private office shared files and documents on infrastructure it controls. Keep user access, quotas, backups, monitoring, and logs visible to the people responsible for them.</p><div className="team-proof-list"><span>OIDC identity provider</span><span>User access controls</span><span>Quotas</span><span>External sharing</span><span>S3 + PostgreSQL backups</span></div><a className="button button-accent" href="/noatun-site/enterprise/">See team deployments →</a></div><div className="admin-proof reveal"><div className="admin-proof-label"><span>ADMINISTRATION</span><span>OPERATIONS</span></div><img src={asset('13-admin.png')} alt="Noatun Administration interface showing users and quotas" loading="lazy" /><div className="proof-points"><span>User access</span><span>Quotas</span><span>Monitoring</span><span>Backups</span><span>Logs</span></div></div></div></section>

      <section className="fit-section"><div className="site-container fit-grid"><div className="fit-copy reveal"><div className="eyebrow">CLEAR SCOPE</div><h2>Know what it does.<br /><em>Know what it does not.</em></h2><p>Noatun is a focused private cloud with a clear set of capabilities today.</p></div><div className="fit-list reveal"><div><span className="fit-label">INCLUDED TODAY</span><p>Private files, photos, documents, notes, searchable archives, and controlled sharing.</p></div><div><span className="fit-label">NOT CURRENTLY INCLUDED</span><p>Native desktop sync, background camera backup, WebDAV, real-time co-editing, or enterprise compliance certifications.</p></div></div></div></section>

      <section className="quote-section"><div className="site-container quote-grid"><div className="quote-mark">↗</div><blockquote>Own the infrastructure. Keep the experience.</blockquote><div className="quote-aside"><span className="eyebrow">BUILT FOR DAILY USE</span><p>Files, photos, documents, and sharing without a patchwork of separate services.</p></div></div></section>

      <section id="faq" className="faq-section site-container"><div className="section-heading reveal"><div className="eyebrow">FAQ</div><h2>Good questions.<br /><em>Straight answers.</em></h2></div><div className="faq-wrap reveal"><FAQ /></div></section>
      <section className="final-cta"><div className="site-container final-cta-inner reveal"><div><div className="eyebrow eyebrow-accent">PRIVATE CLOUD, YOUR WAY</div><h2>Your own Drive and Photos. On your infrastructure.</h2></div><a className="button button-accent" href="#waitlist">Get early access <span>→</span></a></div></section>
    </main>

    <footer className="site-footer"><div className="site-container footer-inner"><div>© {new Date().getFullYear()} Noatun · Private personal cloud.</div><div className="footer-links"><a href="/noatun-site/enterprise/">For teams ↗</a><a href="mailto:hello@noatun.app">hello@noatun.app</a></div></div></footer>
  </div>
}
