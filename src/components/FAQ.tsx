const faqs = [
  { q: 'Where does Noatun run?', a: 'On your hardware or a VPS you control. It is designed for the home lab and for small, practical deployments — not a cloud bill that grows with every feature.' },
  { q: 'What can I keep in it?', a: 'Your everyday essentials: files, photos, notes, and shareable links. Noatun focuses on making those things feel like one coherent product.' },
  { q: 'Do I need to be a Linux expert?', a: 'Noatun is built for people comfortable running their own infrastructure, but the experience should still feel approachable once it is running. The goal is less maintenance, not more.' },
  { q: 'Can I choose managed hosting?', a: 'Yes. Self-hosting is the foundation; a managed option is planned for people who want the same product without maintaining the server.' },
  { q: 'How do I get early access?', a: 'Join the waitlist above. We will share launch news, early access, and founding pricing with the people who sign up.' },
]

export default function FAQ() {
  return (
    <div className="overflow-hidden rounded-[18px] bg-white ring-1 ring-zinc-200">
      {faqs.map((faq, index) => (
        <details key={faq.q} className={`group ${index < faqs.length - 1 ? 'border-b border-zinc-200' : ''}`}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4.5 text-left">
            <span className="text-[14px] font-medium tracking-[-0.01em] text-zinc-900">{faq.q}</span>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-500 transition group-open:rotate-180">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden><path d="M2 4.5 6 8.5l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </summary>
          <p className="px-5 pb-5 text-[13px] leading-relaxed text-zinc-600">{faq.a}</p>
        </details>
      ))}
    </div>
  )
}
