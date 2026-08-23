import { useEffect, useState } from 'react'
import type { CSSProperties, Dispatch, ReactNode, SetStateAction } from 'react'
import BrandMark, { type Theme } from './components/BrandMark'
import ProductWindow from './components/ProductWindow'
import TeamWaitlistForm from './components/TeamWaitlistForm'

type Success = { email: string; referralCode: string; referralUrl: string; referralCount: number }

const proofScreens = [
  { src: '13-admin.png', label: 'ADMINISTRATION', title: 'Keep administration in view.', body: 'See user access, quotas, monitoring, backup history, and logs in one place.' },
  { src: '10-document-editor.png', label: 'DOCUMENTS', title: 'Work where files already live.', body: 'Edit documents, spreadsheets, and Markdown without adding a second workspace.' },
  { src: '02-drive.png', label: 'FILES', title: 'Share outside without opening the whole workspace.', body: 'Create file and folder links with optional passwords and expiration.' },
]

const capabilities = [
  { label: 'ACCESS', title: 'Connect your identity provider.', body: 'Use OIDC single sign-on, activate or deactivate users, and revoke sessions when access changes.' },
  { label: 'CAPACITY', title: 'Set quotas and see capacity.', body: 'Set per-user storage quotas and review storage, database, CPU, memory, and container status.' },
  { label: 'SHARING', title: 'Share outside with clear limits.', body: 'Create file, folder, and photo links with optional passwords, expiration, previews, and downloads.' },
  { label: 'RECOVERY', title: 'Give operators a way back.', body: 'Back up files to S3-compatible storage, back up PostgreSQL, review job history, and restore the database when needed.' },
]

function asset(name: string) {
  return `/screenshots/${name}`
}

function useTheme(): [Theme, Dispatch<SetStateAction<Theme>>] {
  const [theme, setTheme] = useState<Theme>(() => {
    const requested = new URLSearchParams(window.location.search).get('theme')
    return requested === 'dark' || requested === 'light' ? requested : ((localStorage.getItem('noatun-theme-v2') as Theme) || 'light')
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('noatun-theme-v2', theme)
    document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.setAttribute('href', `/noatun-icon${theme === 'light' ? '-light' : ''}.png`)
  }, [theme])
  return [theme, setTheme]
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` } as CSSProperties}>{children}</div>
}

export default function EnterprisePage() {
  const [theme, setTheme] = useTheme()
  const [success, setSuccess] = useState<Success | null>(null)

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('in')), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return <div className="site-shell enterprise-page">
    <header className="site-header">
      <div className="site-container header-inner">
        <a className="brand" href="/" aria-label="Noatun home"><BrandMark theme={theme} /><span>Noatun</span></a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#capabilities">Admin controls</a><a href="#deployment">Deployment</a><a href="#faq">FAQ</a></nav>
        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={() => setTheme(value => value === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}><span aria-hidden>{theme === 'dark' ? '☼' : '◐'}</span><span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span></button>
          <a className="header-link" href="/">For personal use</a>
          <a className="button button-small button-dark" href="#contact">Request team access</a>
        </div>
      </div>
    </header>

    <main id="top">
      <section className="enterprise-hero">
        <div className="hero-grid" aria-hidden="true" /><div className="hero-glow" aria-hidden="true" />
        <div className="site-container enterprise-hero-grid">
          <Reveal className="enterprise-hero-copy"><div className="eyebrow eyebrow-accent"><span className="status-dot" />PRIVATE FILE WORKSPACE / IT-LED TEAMS</div><h1>Your team’s files.<br /><span>On infrastructure you control.</span></h1><p className="hero-lede">Noatun gives agencies, practices, studios, and private offices one focused place for files, documents, photos, search, and external sharing.</p><div className="hero-buttons"><a className="button button-accent" href="#contact">Request team early access <span>→</span></a><a className="button button-quiet" href="#capabilities">Review admin controls</a></div><div className="hero-meta"><span>OIDC identity provider</span><span>User access + quotas</span><span>Backup + restore</span></div></Reveal>
          <Reveal className="enterprise-hero-image" delay={100}><div className="image-label"><span>ADMINISTRATION</span><span>NOATUN / USERS & QUOTAS</span></div><ProductWindow label="ADMIN" className="enterprise-hero-product-window"><div className="hero-shot"><img src={asset('13-admin.png')} alt="Noatun Administration interface showing users, quotas, monitoring, and logs" /></div></ProductWindow><div className="image-caption">The workspace for the team. The controls for the operator.</div></Reveal>
        </div>
      </section>

      <section className="enterprise-proof-strip"><div className="site-container enterprise-proof-items"><span><b>01</b> Connect identity</span><span><b>02</b> Control access and quotas</span><span><b>03</b> Share outside the team</span><span><b>04</b> Back up and restore</span></div></section>

      <section id="capabilities" className="enterprise-capabilities"><div className="site-container"><Reveal className="section-heading"><div className="eyebrow">ADMINISTRATION & OPERATIONS</div><h2>Useful for the team.<br /><em>Visible to the operator.</em></h2><p>Noatun keeps everyday file work simple while giving operators the controls needed to manage a small deployment.</p></Reveal><div className="capability-grid">{capabilities.map((item, index) => <Reveal className="capability-card" delay={index * 70} key={item.label}><span className="principle-number">{item.label}</span><h3>{item.title}</h3><p>{item.body}</p></Reveal>)}</div></div></section>

      <section className="enterprise-proof-section"><div className="site-container"><Reveal className="section-heading section-heading-wide"><div className="eyebrow">FILES & OPERATIONS</div><h2>One place to work.<br /><em>One place to operate.</em></h2><p>Give the team a focused workspace for files and documents, with administration kept close at hand.</p></Reveal><div className="enterprise-proof-grid">{proofScreens.map((item, index) => <Reveal className="enterprise-proof-card" delay={index * 70} key={item.src}><ProductWindow label={item.label}><div className="screenshot-frame"><img src={asset(item.src)} alt={`Noatun ${item.label.toLowerCase()} interface`} loading="lazy" /></div></ProductWindow><div className="screenshot-copy"><div className="eyebrow">{item.label}</div><h3>{item.title}</h3><p>{item.body}</p></div></Reveal>)}</div></div></section>

      <section id="deployment" className="deployment-section"><div className="site-container deployment-grid"><Reveal className="deployment-copy"><div className="eyebrow eyebrow-accent">DEPLOYMENT</div><h2>Deploy where<br /><em>your team trusts.</em></h2><p>Run Noatun on a VPS or in a private environment. Docker Compose is the simplest path, with Helm charts available for Kubernetes operators.</p><a className="button button-accent" href="#contact">Tell us about your deployment →</a></Reveal><Reveal className="deployment-list" delay={100}><div><span className="fit-label">SELF-HOSTED FIRST</span><p>Keep application data and storage in the environment your team chooses.</p></div><div><span className="fit-label">BACKUP TARGET</span><p>Send file and PostgreSQL backups to an S3-compatible destination you control.</p></div><div><span className="fit-label">NOT CURRENTLY INCLUDED</span><p>Native desktop sync, real-time co-editing, high-availability guarantees, and compliance certifications.</p></div></Reveal></div></section>

      <section className="enterprise-fit-section"><div className="site-container enterprise-fit-grid"><Reveal className="fit-copy"><div className="eyebrow">GOOD FIT</div><h2>A focused workspace<br /><em>for IT-led teams.</em></h2><p>Noatun fits small teams that want useful file workflows and visible administration without operating a broad collaboration suite.</p></Reveal><Reveal className="fit-list" delay={100}><div><span className="fit-label">STRONGEST FIT</span><p>Agencies, practices, studios, private offices, NGOs, and technical teams that operate their own infrastructure.</p></div><div><span className="fit-label">NOT PROVIDED TODAY</span><p>Native sync, automatic camera backup, real-time co-editing, SCIM, legal holds, compliance attestations, or an SLA-backed managed service.</p></div></Reveal></div></section>

      <section id="faq" className="enterprise-faq-section"><div className="site-container"><Reveal className="section-heading"><div className="eyebrow">TEAM FAQ</div><h2>Specific questions.<br /><em>Clear answers.</em></h2></Reveal><div className="enterprise-faq-list"><details open><summary>Who operates the deployment?</summary><p>Noatun is self-hosted first. Your team or infrastructure partner is responsible for TLS, updates, access policy, backups, and the environment where Noatun runs.</p></details><details><summary>Does Noatun support single sign-on?</summary><p>Yes. Noatun can connect an OIDC identity provider. Local accounts, account activation, session revocation, and administrator access are also available.</p></details><details><summary>What activity is visible?</summary><p>Noatun records product activity and exposes administration logs and system monitoring. It is not currently positioned as a compliance-grade audit or legal-retention system.</p></details><details><summary>Can we back up files and the database?</summary><p>Yes. Operators can configure S3-compatible file backups and PostgreSQL database backups, review job history, and start a database restore from the administration interface.</p></details><details><summary>Is high availability supported?</summary><p>Noatun includes Docker Compose and Helm deployment paths, but it does not currently claim high-availability, multi-region, or SLA-backed operation.</p></details><details><summary>What is the licensing and support model?</summary><p>Commercial terms and support options are being shaped with early teams. Request team early access and include your support or deployment requirements in the form below.</p></details></div></div></section>

      <section id="contact" className="enterprise-contact"><div className="site-container"><div className="enterprise-contact-card"><Reveal className="enterprise-contact-intro"><div className="eyebrow eyebrow-accent">TEAM EARLY ACCESS</div><h2>Tell us about your deployment.</h2><p>Share your current workspace, team size, and operating requirements. We are working with early teams that value control and can help shape the product.</p></Reveal>{!success ? <TeamWaitlistForm onSuccess={setSuccess} /> : <div className="success-state"><span className="success-icon">✓</span><div><h3>Request received.</h3><p>Thanks, {success.email}. We will use the details you provided to follow up about team early access.</p></div></div>}</div></div></section>
    </main>

    <footer className="site-footer"><div className="site-container footer-inner"><div>© {new Date().getFullYear()} Noatun · Private file workspace for small teams.</div><div className="footer-links"><a href="/">For personal use</a><a href="mailto:hello@noatun.app">hello@noatun.app</a></div></div></footer>
  </div>
}
