import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, List, MapPin, X } from '@phosphor-icons/react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/ventures', label: 'Ventures' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    navRef.current?.querySelector('a')?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onOutside = (event) => {
      if (!navRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onOutside)
    }
  }, [menuOpen])

  const navLinkClass = ({ isActive }) => `relative py-2.5 text-xs font-medium tracking-[-0.1px] no-underline transition-colors duration-150 after:absolute after:inset-x-0 after:bottom-0.5 after:h-[1.5px] after:origin-left after:bg-[#7c9318] after:transition-transform after:duration-200 hover:text-[#171a17] hover:after:scale-x-100 ${isActive ? 'text-[#171a17] after:scale-x-100' : 'text-[#72766f] after:scale-x-0'}`

  return (
    <>
      <a href="#main" className="fixed top-3 left-4 z-[200] -translate-y-[160%] rounded bg-[#171a17] px-4 py-2.5 text-[13px] text-white no-underline transition-transform focus:translate-y-0">Skip to content</a>
      <header className={`sticky top-0 z-[100] border-b bg-[#f8f9f6] transition-all duration-200 ${scrolled ? 'border-[#e7e9e2] shadow-[0_2px_16px_#10200810]' : 'border-transparent'}`}>
        <div className="relative mx-auto flex h-[72px] max-w-[1540px] items-center gap-10 px-8 max-[768px]:h-16 max-[768px]:gap-3.5 max-[768px]:px-[18px]">
        <Link to="/" onClick={() => setMenuOpen(false)} className="shrink-0 text-[34px] font-extrabold leading-none tracking-[-4px] text-[#809719] no-underline transition-colors hover:text-[#7c9318] max-[768px]:text-[30px]" aria-label="HU – Hashir Usman home">HU.</Link>

        <nav className="flex items-center gap-6 max-[1200px]:hidden" aria-label="Main navigation">
          {links.map((link) => <NavLink key={link.to} end={link.to === '/'} to={link.to} onClick={() => setMenuOpen(false)} className={navLinkClass}>{link.label}</NavLink>)}
        </nav>

        {menuOpen && (
          <nav ref={navRef} id="main-nav" className="absolute top-[72px] right-0 left-0 z-50 hidden flex-col items-stretch gap-0 rounded-b-xl border border-[#e7e9e2] bg-[#f8f9f6] px-[22px] py-2 shadow-[0_8px_32px_#10200818] animate-menu-drop max-[1200px]:flex max-[768px]:top-16" aria-label="Main navigation">
            {links.map((link, i) => <NavLink key={link.to} end={link.to === '/'} to={link.to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `border-b py-3.5 text-sm font-medium no-underline last:border-0 ${isActive ? 'text-[#171a17]' : 'text-[#72766f]'} ${i === links.length - 1 ? 'border-transparent' : 'border-[#e7e9e2]'}`}>{link.label}</NavLink>)}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-4">
          <span className="inline-flex items-center gap-[5px] whitespace-nowrap text-[10px] text-[#72766f] max-[1200px]:hidden"><MapPin size={14} weight="light" className="text-[#7c9318]" aria-hidden /> Bengaluru, India</span>
          <Link to="/contact" className="inline-flex min-h-9 items-center justify-center gap-2 rounded border border-[#a4be2d] bg-[#a4be2d] px-4 text-[11px] font-semibold text-[#1e2618] no-underline transition-colors hover:border-[#b3cc35] hover:bg-[#b3cc35]">Get in touch <ArrowUpRight size={15} aria-hidden /></Link>
          <button ref={buttonRef} type="button" className="hidden size-10 items-center justify-center rounded-full border border-[#e7e9e2] text-[#171a17] transition-colors hover:bg-[#eaf0db] hover:border-[#b3c87c] max-[1200px]:inline-flex" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={22} /> : <List size={22} />}</button>
        </div>
        </div>
      </header>
    </>
  )
}
