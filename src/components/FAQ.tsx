const faqs = [
  {
    q: 'Does it sync like Nextcloud / Dropbox?',
    a: 'Not yet. Today: browser Drive + installable PWA + Android share-target upload. WebDAV is the next bet — then rclone, Finder, Explorer, Cyberduck mounts. We concede native clients to Nextcloud until WebDAV ships.',
  },
  {
    q: 'How does migrating work?',
    a: 'No one-click importer yet. Export from Google Takeout (files + photos) or Nextcloud, then upload into Noatun — see the migration sketch. We validate the path before launch so switching anxiety is low.',
  },
  {
    q: 'Will it really fit a $5 / 1 GB VPS?',
    a: 'Composing without SSO measured ~0.4 GiB idle, under ~0.8 GiB with a light Drive+Photos library (Aug 2026). Call it 1 GB minimum, 2 GB recommended for real photo libraries + AI tags. Full numbers in the RAM benchmark.',
  },
  {
    q: 'What about photos — is it better than Immich?',
    a: 'Immich wins pure photos — we concede that. Noatun wins when you also need Drive + light docs/notes in one login, one backup, one compose file. If you only need photo backup, use Immich.',
  },
  {
    q: 'What is the price?',
    a: 'Self-host core stays free (AGPL-3.0). Managed Noatun is the primary monetization — family band anchored at €3–15 managed Nextcloud today; our target is $8–20/mo. Early waitlist locks a founding price.',
  },
]

export default function FAQ() {
  return (
    <div className="divide-y divide-white/6 rounded-[18px] bg-white/[0.03] ring-1 ring-white/8 overflow-hidden">
      {faqs.map((f, i) => (
        <details key={i} className="group">
          <summary className="list-none flex items-center justify-between gap-4 px-5 py-4 cursor-pointer">
            <span className="text-[14px] font-medium tracking-tight text-white/90">{f.q}</span>
            <span className="shrink-0 h-7 w-7 grid place-items-center rounded-full bg-white/6 ring-1 ring-white/10 text-white/60 group-open:rotate-180 transition">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </span>
          </summary>
          <div className="px-5 pb-4 -mt-1">
            <p className="text-[13px] leading-relaxed text-white/55">{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  )
}
