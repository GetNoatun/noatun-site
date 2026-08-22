import type { ReactNode } from 'react'

export default function ProductWindow({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return <div className={`product-window ${className}`}>
    <div className="product-window-bar" aria-hidden="true">
      <span className="window-dots"><i /><i /><i /></span>
      <span className="window-title">NOATUN / {label}</span>
      <span className="window-status">SELF-HOSTED</span>
    </div>
    {children}
  </div>
}
