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
  const [navVisible, setNavVisible] = useState(true)
  const navRef = useRef(null)
  const buttonRef = useRef(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentY = Math.max(0, window.scrollY)
      setScrolled(currentY > 12)
      if (currentY < 24) setNavVisible(true)
      else if (currentY > lastScrollY.current + 4) setNavVisible(false)
      else if (currentY < lastScrollY.current - 4) setNavVisible(true)
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
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

  const pillClass = ({ isActive }) => `group relative isolate inline-flex min-h-10 items-center justify-center overflow-hidden rounded-full bg-white/55 px-4 pb-1 pt-0 text-[13px] font-medium no-underline shadow-[inset_0_1px_0_#ffffff,0_2px_6px_#10200808] transition-colors duration-200 before:absolute before:inset-0 before:-z-10 before:scale-[.7] before:rounded-full before:bg-[#a4be2d] before:opacity-0 before:transition-[transform,opacity] before:duration-300 hover:text-[#1e2618] hover:before:scale-100 hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c9318] focus-visible:ring-offset-2 ${isActive ? 'bg-[#a4be2d] text-[#1e2618] before:scale-100 before:opacity-100' : 'text-[#636a5e]'}`

  return (
    <>
      <a href="#main" className="fixed left-4 top-3 z-[200] -translate-y-[160%] rounded bg-[#171a17] px-4 py-2.5 text-[13px] text-white no-underline transition-transform focus:translate-y-0">Skip to content</a>
      <header className={`sticky top-0 z-[100] border-b bg-[#f8f9f6]/95 backdrop-blur-md transition-[transform,background-color,border-color,box-shadow] duration-300 ${navVisible ? 'translate-y-0' : 'pointer-events-none -translate-y-full'} ${scrolled ? 'border-[#e7e9e2] shadow-[0_4px_20px_#10200810]' : 'border-transparent'}`}>
        <div className="relative mx-auto flex h-[80px] w-full max-w-[1760px] items-center gap-4 px-5 sm:px-8 xl:px-10 max-[768px]:h-16">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Link to="/" onClick={() => setMenuOpen(false)} aria-label="HU – Hashir Usman home" className="group grid size-12 shrink-0 animate-page-enter place-items-center rounded-full bg-[#a4be2d] text-[17px] font-extrabold tracking-[-1.5px] text-[#1e2618] no-underline shadow-[inset_0_1px_0_#ffffff80,0_4px_12px_#26320f1c] transition-transform duration-300 hover:rotate-[-8deg] hover:scale-105 max-[768px]:size-11">HU.</Link>

            <nav className="hidden animate-page-enter items-center gap-1.5 rounded-full border border-[#e2e5dc] bg-[#f0f0f3]/75 p-1.5 shadow-[0_12px_28px_-16px_#18181b55,0_4px_12px_-8px_#18181b2b] backdrop-blur-xl lg:flex" aria-label="Main navigation">
              {links.map((link) => <NavLink key={link.to} end={link.to === '/'} to={link.to} className={pillClass}>{({ isActive }) => <>
                <span className="relative z-10">{link.label}</span>
                <span aria-hidden className={`absolute bottom-[5px] left-1/2 size-1 -translate-x-1/2 rounded-full bg-current transition-[opacity,transform] duration-300 ${isActive ? 'scale-100 opacity-100' : 'scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-60'}`} />
              </>}</NavLink>)}
            </nav>
          </div>

          <nav ref={navRef} id="main-nav" className={`${menuOpen ? 'flex' : 'hidden'} absolute left-4 right-4 top-[calc(100%+8px)] z-50 flex-col rounded-2xl border border-[#e2e5dc] bg-[#f8f9f6] p-2 shadow-[0_16px_38px_#1020081a] animate-menu-drop lg:hidden sm:left-8 sm:right-8`} aria-label="Main navigation">
            {links.map((link) => <NavLink key={link.to} end={link.to === '/'} to={link.to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `rounded-xl px-4 py-3.5 text-sm font-medium no-underline transition-colors ${isActive ? 'bg-[#eaf0db] text-[#34420f]' : 'text-[#636a5e] hover:bg-[#eef0e9] hover:text-[#171a17]'}`}>{link.label}</NavLink>)}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5">
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#a4be2d] bg-[#a4be2d] px-5 text-xs font-semibold text-[#1e2618] no-underline transition-[transform,background-color] duration-200 hover:scale-[1.02] hover:bg-[#b3cc35] active:scale-[.98] max-[420px]:min-h-10 max-[420px]:px-3 max-[420px]:text-[11px]">Let’s cook<ArrowUpRight size={15} aria-hidden /></Link>
            <button ref={buttonRef} type="button" className="grid size-11 shrink-0 place-items-center rounded-full border border-[#e2e5dc] bg-white/70 text-[#171a17] transition-colors hover:border-[#b3c87c] hover:bg-[#eaf0db] lg:hidden max-[420px]:size-10" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={21} aria-hidden /> : <List size={21} aria-hidden />}</button>
          </div>
        </div>
      </header>
    </>
  )
}
