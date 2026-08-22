import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, Dispatch, ReactNode, SetStateAction } from 'react'
import BrandMark, { type Theme } from './components/BrandMark'
import ProductWindow from './components/ProductWindow'
import WaitlistForm from './components/WaitlistForm'

type Success = { email: string; referralCode: string; referralUrl: string; referralCount: number }

const proofScreens = [
  { src: '13-admin.png', label: 'ADMINISTRATION', title: 'The operator view stays visible.', body: 'Users, quotas, monitoring, backups, and logs in one place.' },
  { src: '10-document-editor.png', label: 'DOCUMENTS', title: 'The team can work where files live.', body: 'Documents, spreadsheets, and Markdown without a second workspace.' },
  { src: '02-drive.png', label: 'FILES', title: 'External sharing has boundaries.', body: 'Share files and folders with optional passwords and expiration.' },
]

const capabilities = [
  { label: 'ACCESS', title: 'Connect the identity layer.', body: 'Use optional OIDC SSO through Dex, activate or deactivate users, and revoke sessions when access changes.' },
  { label: 'CAPACITY', title: 'Keep usage understandable.', body: 'Set per-user storage quotas and see storage, database, CPU, memory, and container status from the admin surface.' },
  { label: 'SHARING', title: 'Send the right link.', body: 'Create public file, folder, and photo links with optional passwords, expiration, previews, and downloads.' },
  { label: 'RECOVERY', title: 'Give operators a way back.', body: 'Back up files to S3-compatible storage, back up PostgreSQL, review job history, and restore the database when needed.' },
]

function asset(name: string) {
  return `/noatun-site/screenshots/${name}`
}

function useTheme(): [Theme, Dispatch<SetStateAction<Theme>>] {
  const [theme, setTheme] = useState<Theme>(() => {
    const requested = new URLSearchParams(window.location.search).get('theme')
    return requested === 'dark' || requested === 'light' ? requested : ((localStorage.getItem('noatun-theme') as Theme) || 'light')
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('noatun-theme', theme)
    document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.setAttribute('href', `/noatun-site/noatun-icon${theme === 'light' ? '-light' : ''}.png`)
  }, [theme])
  return [theme, setTheme]
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` } as CSSProperties}>{children}</div>
}

export default function EnterprisePage() {
  const [theme, setTheme] = useTheme()
  const [success, setSuccess] = useState<Success | null>(null)
  const [copied, setCopied] = useState(false)
  const referralLink = useMemo(() => success?.referralUrl ?? '', [success])

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

  return <div className="site-shell enterprise-page">
    <header className="site-header">
      <div className="site-container header-inner">
        <a className="brand" href="/noatun-site/" aria-label="Noatun home"><BrandMark theme={theme} /><span>Noatun</span></a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#capabilities">Capabilities</a><a href="#deployment">Deployment</a><a href="#faq">FAQ</a></nav>
        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={() => setTheme(value => value === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}><span aria-hidden>{theme === 'dark' ? '☼' : '◐'}</span><span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span></button>
          <a className="header-link" href="/noatun-site/">For personal use</a>
          <a className="button button-small button-dark" href="#contact">Talk to us</a>
        </div>
      </div>
    </header>

    <main id="top">
      <section className="enterprise-hero">
        <div className="hero-grid" aria-hidden="true" /><div className="hero-glow" aria-hidden="true" />
        <div className="site-container enterprise-hero-grid">
          <Reveal className="enterprise-hero-copy"><div className="eyebrow eyebrow-accent"><span className="status-dot" />PRIVATE WORKSPACE / SMALL TEAMS</div><h1>Private infrastructure.<br /><span>Practical team work.</span></h1><p className="hero-lede">Noatun gives agencies, practices, studios, and private offices a focused place for files, documents, photos, search, and sharing — on infrastructure they control.</p><div className="hero-buttons"><a className="button button-accent" href="#contact">Request a team preview <span>→</span></a><a className="button button-quiet" href="#capabilities">See the controls</a></div><div className="hero-meta"><span>Optional OIDC SSO</span><span>User quotas</span><span>Operator-managed backups</span></div></Reveal>
          <Reveal className="enterprise-hero-image" delay={100}><div className="image-label"><span>REAL PRODUCT</span><span>NOATUN / ADMIN</span></div><ProductWindow label="ADMIN" className="enterprise-hero-product-window"><div className="hero-shot"><img src={asset('13-admin.png')} alt="Noatun Administration interface showing users, quotas, monitoring, and logs" /></div></ProductWindow><div className="image-caption">A private workspace with an operator view.</div></Reveal>
        </div>
      </section>

      <section className="enterprise-proof-strip"><div className="site-container enterprise-proof-items"><span><b>01</b> Connect identity</span><span><b>02</b> Set boundaries</span><span><b>03</b> Share externally</span><span><b>04</b> Recover deliberately</span></div></section>

      <section id="capabilities" className="enterprise-capabilities"><div className="site-container"><Reveal className="section-heading"><div className="eyebrow">THE OPERATOR SURFACE</div><h2>Useful for the team.<br /><em>Visible to the operator.</em></h2><p>Noatun keeps the everyday workspace simple while exposing the controls a small team actually needs to run it responsibly.</p></Reveal><div className="capability-grid">{capabilities.map((item, index) => <Reveal className="capability-card" delay={index * 70} key={item.label}><span className="principle-number">{item.label}</span><h3>{item.title}</h3><p>{item.body}</p></Reveal>)}</div></div></section>

      <section className="enterprise-proof-section"><div className="site-container"><Reveal className="section-heading section-heading-wide"><div className="eyebrow">REAL PRODUCT PROOF</div><h2>Not a slide deck.<br /><em>Actual working surfaces.</em></h2><p>Use the same private cloud for administration, documents, files, and controlled sharing.</p></Reveal><div className="enterprise-proof-grid">{proofScreens.map((item, index) => <Reveal className="enterprise-proof-card" delay={index * 70} key={item.src}><ProductWindow label={item.label}><div className="screenshot-frame"><img src={asset(item.src)} alt={`Noatun ${item.label.toLowerCase()} interface`} loading="lazy" /></div></ProductWindow><div className="screenshot-copy"><div className="eyebrow">{item.label}</div><h3>{item.title}</h3><p>{item.body}</p></div></Reveal>)}</div></div></section>

      <section id="deployment" className="deployment-section"><div className="site-container deployment-grid"><Reveal className="deployment-copy"><div className="eyebrow eyebrow-accent">DEPLOYMENT</div><h2>Start where<br /><em>you trust.</em></h2><p>Run Noatun in a home lab, VPS, or private environment. Docker Compose is the simplest path, with a Helm deployment path for Kubernetes operators.</p><a className="button button-accent" href="#contact">Discuss a deployment →</a></Reveal><Reveal className="deployment-list" delay={100}><div><span className="fit-label">SELF-HOSTED FIRST</span><p>Your storage boundary stays in the environment you choose.</p></div><div><span className="fit-label">BACKUP TARGET</span><p>Send file and PostgreSQL backups to an S3-compatible destination you control.</p></div><div><span className="fit-label">CLEAR LIMITS</span><p>No native desktop sync, real-time co-editing, or compliance program is being implied.</p></div></Reveal></div></section>

      <section className="enterprise-fit-section"><div className="site-container enterprise-fit-grid"><Reveal className="fit-copy"><div className="eyebrow">GOOD FIT</div><h2>For teams that want<br /><em>ownership with a workflow.</em></h2><p>Noatun is a strong fit for small teams that need a polished private workspace, not a broad enterprise suite with an ecosystem to administer.</p></Reveal><Reveal className="fit-list" delay={100}><div><span className="fit-label">START HERE</span><p>Agencies, practices, studios, private offices, NGOs, and technical teams with a clear storage boundary.</p></div><div><span className="fit-label">PLAN AHEAD</span><p>Teams requiring native sync, automatic camera backup, real-time collaboration, SCIM, legal holds, or formal compliance attestations should treat those as roadmap or integration work.</p></div></Reveal></div></section>

      <section id="faq" className="enterprise-faq-section"><div className="site-container"><Reveal className="section-heading"><div className="eyebrow">TEAM FAQ</div><h2>Specific questions.<br /><em>Clear answers.</em></h2></Reveal><div className="enterprise-faq-list"><details open><summary>Does Noatun support SSO?</summary><p>Optional OIDC SSO is available through Dex. Local accounts, activation controls, session revocation, and admin access remain part of the product.</p></details><details><summary>Can we back up files and the database?</summary><p>Yes. Operators can configure S3-compatible file backups and PostgreSQL database backups, review job history, and restore the database when needed.</p></details><details><summary>Is this an enterprise compliance platform?</summary><p>No. Noatun is a private workspace for small teams. It does not currently provide compliance certifications, end-to-end encryption, legal holds, SCIM, or an SLA-backed managed service.</p></details></div></div></section>

      <section id="contact" className="enterprise-contact"><div className="site-container"><div className="enterprise-contact-card"><Reveal className="enterprise-contact-intro"><div className="eyebrow eyebrow-accent">TEAM PREVIEW</div><h2>Bring your operating questions.</h2><p>Tell us how your team stores, shares, and protects files today. We are looking for early teams who value control and can help shape the product.</p></Reveal>{!success ? <WaitlistForm onSuccess={setSuccess} /> : <div className="success-state"><span className="success-icon">✓</span><div><h3>You’re on the list.</h3><p>Share your link to move up the queue.</p><div className="referral-row"><span>{referralLink}</span><button type="button" onClick={copyReferral}>{copied ? 'Copied' : 'Copy link'}</button></div><small>{success.referralCount} referrals · early access priority</small></div></div>}</div></div></section>
    </main>

    <footer className="site-footer"><div className="site-container footer-inner"><div>© {new Date().getFullYear()} Noatun · Private cloud, your way.</div><div className="footer-links"><a href="/noatun-site/">Personal cloud</a><a href="mailto:hello@noatun.app">hello@noatun.app</a></div></div></footer>
  </div>
}
