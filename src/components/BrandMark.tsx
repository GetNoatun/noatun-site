export type Theme = 'dark' | 'light'

export default function BrandMark({ theme }: { theme: Theme }) {
  return <span className="brand-mark" aria-hidden><img src={theme === 'light' ? '/noatun-icon-light.png' : '/noatun-icon.png'} alt="" /></span>
}
