export type Theme = 'dark' | 'light'

export default function BrandMark({ theme }: { theme: Theme }) {
  return <span className="brand-mark" aria-hidden><img src={theme === 'light' ? '/noatun-site/noatun-icon-light.png' : '/noatun-site/noatun-icon.png'} alt="" /></span>
}
