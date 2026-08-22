const faqs = [
  { q: 'Why not just use Google Drive?', a: 'Because convenience and control should not be mutually exclusive. Noatun gives you a focused place for files, photos, documents, and sharing — while the infrastructure stays yours.' },
  { q: 'Why not Nextcloud?', a: 'Nextcloud is broad and powerful. Noatun is deliberately more focused: a lighter daily cloud for people who want less plugin sprawl, less maintenance anxiety, and a cleaner product experience.' },
  { q: 'Can we run it ourselves?', a: 'Yes. Self-hosting is the foundation: run Noatun in your home lab, on a VPS, or inside the environment your team already trusts. A managed path is planned for teams that want the product without operating the server.' },
  { q: 'Is it useful for a small team?', a: 'That is where the product is headed: shared files and documents for the team, plus the operational basics an owner or IT lead needs — users, quotas, roles, backups, and logs.' },
  { q: 'What do I get by joining the waitlist?', a: 'Launch updates, early access, and founding pricing. You also help shape the product by telling us what is frustrating about your current setup.' },
]

export default function FAQ() {
  return (
    <div className="faq-list overflow-hidden rounded-[18px]">
      {faqs.map((faq, index) => (
        <details key={faq.q} className={`faq-item group ${index < faqs.length - 1 ? 'border-b' : ''}`}>
          <summary className="faq-summary flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4.5 text-left">
            <span className="faq-question text-[14px] font-medium tracking-[-0.01em]">{faq.q}</span>
            <span className="faq-chevron grid h-7 w-7 shrink-0 place-items-center rounded-full transition group-open:rotate-180">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M2 4.5 6 8.5l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </summary>
          <p className="faq-answer px-5 pb-5 text-[13px] leading-relaxed">{faq.a}</p>
        </details>
      ))}
    </div>
  )
}
