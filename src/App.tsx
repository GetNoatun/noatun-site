import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import FAQ from './components/FAQ'
import WaitlistForm from './components/WaitlistForm'

type Success = { email: string; referralCode: string; referralUrl: string; referralCount: number }
type Theme = 'dark' | 'light'

const screenshots = [
  { src: '02-drive.png', label: 'Files', title: 'A clear home for the work.', body: 'Folders, documents, and search without the noise.' },
  { src: '04-photos.png', label: 'Photos', title: 'Your library, not a data set.', body: 'Keep the memories close to the rest of your workspace.' },
  { src: '10-document-editor.png', label: 'Documents', title: 'Open, edit, save.', body: 'Work on the file where the file already lives.' },
  { src: '13-admin.png', label: 'Administration', title: 'Control for the people responsible.', body: 'Users, quotas, roles, backups, and logs in view.' },
]

const principles = [
  { number: '01', title: 'Own the deployment.', body: 'Run it in your home lab, on your VPS, or inside the environment your team already trusts.' },
  { number: '02', title: 'Keep the daily work simple.', body: 'Files, photos, documents, and sharing belong in one consistent product — not five tabs and a prayer.' },
  { number: '03', title: 'Make control visible.', body: 'Quotas, users, backups, and operational surfaces should be part of the product, not an afterthought.' },
]

function asset(name: string) {
  return `/noatun-site/screenshots/${name}`
}

function BrandMark() {
  return <span className="brand-mark" aria-hidden><svg width="17" height="17" viewBox="0 0 18 18" fill="none"><path d="M3 8.2 9 3l6 5.2v6.1c0 .9-.7 1.7-1.7 1.7H4.7c-.9 0-1.7-.8-1.7-1.7V8.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M6.1 16v-5.1h5.8V16M9 7.1v.05" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
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
          <a className="header-link" href="https://github.com/fifthsegment/noatun" target="_blank" rel="noreferrer">GitHub ↗</a>
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
          <div className="hero-copy reveal"><div className="eyebrow eyebrow-accent"><span className="status-dot" />PRIVATE INFRASTRUCTURE, POLISHED PRODUCT</div><h1>Your cloud.<br /><span>On your terms.</span></h1><p className="hero-lede">Noatun is the self-hosted workspace for people and teams who want the everyday cloud without handing over the keys.</p><div className="hero-buttons"><a className="button button-accent" href="#waitlist">Join the waitlist <span>→</span></a><a className="button button-quiet" href="#product">Explore Noatun</a></div><div className="hero-meta"><span>Files</span><span>Photos</span><span>Documents</span><span>Admin</span></div></div>
          <div className="hero-image reveal" style={{ transitionDelay: '100ms' } as CSSProperties}><div className="image-label"><span>REAL PRODUCT</span><span>NOATUN / FILES</span></div><div className="hero-shot"><img src={asset('02-drive.png')} alt="Noatun Files interface showing folders and documents" /></div><div className="image-caption">The interface is real. The infrastructure is yours.</div></div>
        </div>
      </section>

      <section id="waitlist" className="waitlist-section"><div className="site-container"><div className="waitlist-card reveal"><div className="waitlist-intro"><div className="eyebrow eyebrow-accent">EARLY ACCESS</div><h2>Bring your own cloud.</h2><p>Get launch updates, early access, and founding pricing for self-hosted and managed deployments.</p></div>{!success ? <WaitlistForm onSuccess={setSuccess} /> : <div className="success-state"><span className="success-icon">✓</span><div><h3>You’re on the list.</h3><p>Share your link to move up the queue.</p><div className="referral-row"><span>{referralLink}</span><button type="button" onClick={copyReferral}>{copied ? 'Copied' : 'Copy link'}</button></div><small>{success.referralCount} referrals · early access priority</small></div></div>}</div></div></section>

      <section id="product" className="section site-container"><div className="section-heading reveal"><div className="eyebrow">THE PRODUCT</div><h2>Everything useful.<br /><em>Nothing in the way.</em></h2><p>One place for the data your life and your team actually use — with a product experience that respects the people running it.</p></div><div className="principles-grid">{principles.map(item => <article className="principle-card reveal" key={item.number}><span className="principle-number">{item.number}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>

      <section className="screens-section"><div className="site-container"><div className="section-heading section-heading-wide reveal"><div className="eyebrow">SEE IT IN ACTION</div><h2>Built for the whole<br /><em>workspace.</em></h2><p>These are the screens people use — not concept art. Explore the real Noatun interface across files, photos, documents, and administration.</p></div><div className="screens-grid">{screenshots.map((item, index) => <ScreenshotCard item={item} index={index} key={item.src} />)}</div></div></section>

      <section id="teams" className="enterprise-section"><div className="site-container enterprise-grid"><div className="enterprise-copy reveal"><div className="eyebrow eyebrow-accent">FOR TEAMS & OPERATORS</div><h2>A private workspace<br /><em>that can grow up.</em></h2><p>Start with a home lab. Move to a VPS. Roll it out to a small team. Noatun gives operators the control they need and gives everyone else a product they can simply use.</p><a className="button button-accent" href="#waitlist">Join the enterprise preview →</a></div><div className="admin-proof reveal"><div className="admin-proof-label"><span>OPERATIONS</span><span>USERS & QUOTAS</span></div><img src={asset('13-admin.png')} alt="Noatun Administration interface showing users and quotas" loading="lazy" /><div className="proof-points"><span>User controls</span><span>Quotas</span><span>Roles</span><span>Backups</span><span>Logs</span></div></div></div></section>

      <section className="quote-section"><div className="site-container quote-grid"><div className="quote-mark">“</div><blockquote>We want the convenience of a modern cloud — without making our data someone else’s business.</blockquote><div className="quote-aside"><span className="eyebrow">THE NOATUN PROMISE</span><p>Clear ownership. Calm operations. A workspace people actually want to use.</p></div></div></section>

      <section id="faq" className="faq-section site-container"><div className="section-heading reveal"><div className="eyebrow">FAQ</div><h2>Questions worth asking.</h2></div><div className="faq-wrap reveal"><FAQ /></div></section>
      <section className="final-cta"><div className="site-container final-cta-inner reveal"><div><div className="eyebrow eyebrow-accent">YOUR DATA, YOUR DECISION</div><h2>Ready to run something better?</h2></div><a className="button button-accent" href="#waitlist">Get early access <span>→</span></a></div></section>
    </main>

    <footer className="site-footer"><div className="site-container footer-inner"><div>© {new Date().getFullYear()} Noatun · Private cloud, your way.</div><div className="footer-links"><a href="https://github.com/fifthsegment/noatun">GitHub ↗</a><a href="mailto:hello@noatun.app">hello@noatun.app</a></div></div></footer>
  </div>
}
