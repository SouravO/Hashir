import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, List, MapPin, X } from '@phosphor-icons/react'
import './Navbar.css'

export default function Navbar({ onBookCall }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)
  const menuBtnRef = useRef(null)
  const location = useLocation()

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Click outside / Escape to close
  useEffect(() => {
    if (!menuOpen) return
    menuRef.current?.querySelector('a')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); menuBtnRef.current?.focus() }
    }
    const onOutside = (e) => {
      if (!menuRef.current?.contains(e.target) && !menuBtnRef.current?.contains(e.target))
        setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onOutside)
    }
  }, [menuOpen])

  const navLinks = [
    { to: '/about',     label: 'About' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/services',  label: 'Services' },
    { to: '/process',   label: 'Process' },
    { to: '/ventures',  label: 'Ventures' },
    { to: '/insights',  label: 'Insights' },
    { to: '/results',   label: 'Results' },
    { to: '/contact',   label: 'Contact' },
  ]

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="wordmark" aria-label="HU – Hashir Usman home">HU.</Link>

        <nav
          ref={menuRef}
          id="main-nav"
          className={`main-nav ${menuOpen ? 'main-nav--open' : ''}`}
          aria-label="Main navigation"
        >
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <span className="navbar-location">
            <MapPin size={14} weight="light" aria-hidden />
            Bengaluru, India
          </span>
          <button className="btn btn-primary btn-sm" onClick={onBookCall}>
            Book a Call <ArrowUpRight size={15} aria-hidden />
          </button>
          <button
            ref={menuBtnRef}
            className="icon-btn menu-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>
    </header>
  )
}
