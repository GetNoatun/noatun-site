const faqs=[
  { q:'Synkroniserer det som Nextcloud / Dropbox?', a:'Ikke ennå. I dag: nettleser + PWA + deling til Noatun på Android. WebDAV er neste — da åpnes rclone, Finder, Utforsker og Cyberduck. Vi innrømmer at Nextcloud har klientene, til WebDAV er på plass.' },
  { q:'Hvordan flytter jeg over?', a:'Ingen ett-klikks import ennå. Eksporter via Google Takeout eller Nextcloud, last opp til Noatun. Vi validerer stien før lansering så det føles trygt. Se migration-sketch.' },
  { q:'Får det plass på en $5 / 1 GB VPS?', a:'Målt uten SSO: ~0,4 GiB i ro, under 0,8 GiB med lett bibliotek (aug 2026). Trygg historie: 1 GB minimum, 2 GB anbefalt for ekte fotobibliotek + AI-merking. Full benchmark lenket.' },
  { q:'Bedre enn Immich for bilder?', a:'Immich vinner ren bilde-backup — vi innrømmer det. Noatun vinner når du også trenger Drive + lette dokumenter i én innlogging, én backup, én compose-fil. Bare bilder? Bruk Immich.' },
  { q:'Hva koster det?', a:'Selv-host forblir AGPL-3.0 og gratis. Driftet Noatun sikter mot $8–20/mnd familie (forankret mot €3–15 driftet Nextcloud). Tidlig venteliste låser grunnpris.' },
]
export default function FAQ(){
  return (
    <div className="divide-y divide-zinc-200 rounded-[18px] bg-white ring-1 ring-zinc-200 overflow-hidden">
      {faqs.map((f,i)=> (
        <details key={i} className="group">
          <summary className="list-none flex items-center justify-between gap-4 px-5 py-4 cursor-pointer">
            <span className="text-[14px] font-medium tracking-tight text-zinc-900">{f.q}</span>
            <span className="shrink-0 h-7 w-7 grid place-items-center rounded-full bg-zinc-100 ring-1 ring-zinc-200 text-zinc-500 group-open:rotate-180 transition">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </span>
          </summary>
          <div className="px-5 pb-4 -mt-1"><p className="text-[13px] leading-relaxed text-zinc-600">{f.a}</p></div>
        </details>
      ))}
    </div>
  )
}
