const faqs = [
  { q: 'What is Noatun?', a: 'Noatun is a self-hosted private cloud for files, photos, documents, search, and sharing. It is built for personal use first, with administration and access controls for small teams.' },
  { q: 'Can I download it today?', a: 'Noatun is currently accepting early-access signups. The screens on this site show working product software, but general availability and public downloads have not launched yet.' },
  { q: 'Can I run it myself?', a: 'Yes. Self-hosting is the foundation. Docker Compose is the simplest deployment path for a home server or VPS, with Helm charts available for Kubernetes operators.' },
  { q: 'Does it work like Dropbox sync or automatic phone backup?', a: 'Not yet. Noatun is currently browser-first, with an installable PWA and Android share-to-Noatun support. Native desktop sync, WebDAV, background camera backup, and full offline sync are not included today.' },
  { q: 'How does it handle photos and search?', a: 'Noatun supports photo libraries, video, albums, sharing, OCR, and optional local image tagging. Search can cover file names, extracted text, local image tags, and synced email. Larger photo and image-recognition workloads need more memory.' },
  { q: 'Is it useful for a small team?', a: 'Yes, for teams that need a focused private file workspace rather than a full collaboration suite. Noatun can connect an OIDC identity provider and includes user activation, quotas, external links, monitoring, logs, and operator-managed backups.' },
  { q: 'How much server capacity do I need?', a: 'The benchmark baseline is about 0.4 GiB at idle and under 0.8 GiB with a light Drive and Photos library. 1 GB is the minimum; 2 GB is recommended for a real photo library.' },
  { q: 'Is Noatun end-to-end encrypted or compliance-certified?', a: 'No. Noatun keeps data on infrastructure you control, but it is not an end-to-end encrypted vault or a compliance program. You remain responsible for TLS, access policies, backups, updates, and the environment it runs in.' },
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
