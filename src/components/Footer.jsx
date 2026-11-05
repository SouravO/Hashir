import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, EnvelopeSimple, InstagramLogo, LinkedinLogo, MapPin, Phone, XLogo, YoutubeLogo } from '@phosphor-icons/react'

const email = 'connect@hashirusman.online'
const wordmark = 'Hashir Usman'
const WORDMARK_COLOR = '#e3e8df'   // base letter color
const WORDMARK_ACCENT = '#a4be2d'  // first letter of each word (H and U)
const groups = [
  { title: 'Explore', links: [['My Work', '/ventures'], ['About', '/about'], ['Founderverse', '/founderverse']] },
  { title: 'Opportunities', links: [['Join my team', '/opportunities#hiring'], ['Internships', '/opportunities#internships'], ['Become a Co-Founder', '/opportunities#co-founder']] },
]
const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', Icon: LinkedinLogo },
  { label: 'X', href: 'https://x.com/', Icon: XLogo },
  { label: 'Instagram', href: 'https://www.instagram.com/', Icon: InstagramLogo },
  { label: 'YouTube', href: 'https://www.youtube.com/', Icon: YoutubeLogo },
]

// Hover pose for each letter of the wordmark (y in %, r in deg). Index matches the characters.
const poses = [
  { y: -6, r: -4 },   // H
  { y: -14, r: 5 },   // A
  { y: -26, r: -9 },  // S
  { y: -8, r: 6 },    // H
  { y: -30, r: -12 }, // I
  { y: 10, r: 24 },   // R
  null,               // space
  { y: -16, r: -6 },  // U
  { y: -5, r: 8 },    // S
  { y: -24, r: -7 },  // M
  { y: -10, r: 5 },   // A
  { y: -18, r: -5 },  // N
]

function Wordmark({ text }) {
  const wrapRef = useRef(null)
  const textRef = useRef(null)
  const [hovered, setHovered] = useState(null)
  const [reduced, setReduced] = useState(false)

  // Scale the wordmark so it always spans the full container width
  useLayoutEffect(() => {
    const fit = () => {
      const wrap = wrapRef.current
      const el = textRef.current
      if (!wrap || !el) return
      const test = 100
      el.style.fontSize = `${test}px`
      const natural = el.offsetWidth
      if (natural > 0) el.style.fontSize = `${(test * wrap.clientWidth) / natural}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrapRef.current)
    if (document.fonts?.ready) document.fonts.ready.then(fit)
    return () => ro.disconnect()
  }, [text])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <div
      ref={wrapRef}
      className="w-full cursor-default"
      style={{ paddingTop: 6 }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setHovered(null) }}
    >
      <div
        ref={textRef}
        aria-hidden
        className="select-none"
        style={{
          display: 'flex',
          width: 'max-content',
          whiteSpace: 'nowrap',
          lineHeight: 0.8,
          letterSpacing: '-.04em',
          fontFamily: '"Kirang Haerang", cursive',
          fontWeight: 400,
        }}
      >
        {text.split('').map((char, i) => {
          if (char === ' ') {
            return <span key={i} style={{ display: 'inline-block', flexShrink: 0, width: '.14em' }} />
          }
          const pose = poses[i] || { y: -10, r: 4 }
          const isInitial = i === 0 || text[i - 1] === ' '
          const on = hovered === i && !reduced
          return (
            // Outer span stays still and receives the pointer; inner span is the one that moves.
            <span
              key={i}
              style={{ display: 'inline-block' }}
              onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHovered(i) }}
              onPointerDown={(e) => { if (e.pointerType !== 'mouse') setHovered((h) => (h === i ? null : i)) }}
            >
              <span
                style={{
                  display: 'inline-block',
                  transformOrigin: 'center',
                  willChange: 'transform',
                  color: isInitial ? WORDMARK_ACCENT : WORDMARK_COLOR,
                  transform: on ? `translateY(${pose.y}%) rotate(${pose.r}deg)` : 'translateY(0) rotate(0deg)',
                  transition: 'transform 500ms cubic-bezier(.34,1.56,.64,1)',
                }}
              >
                {char}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#202b20] text-[#e3e8df]" aria-label="About and contact Hashir">
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-6 pt-10 sm:px-8 sm:pt-12 xl:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-12 lg:items-start lg:gap-x-8">
          <section className="col-span-2 lg:col-span-4 lg:pr-10" aria-labelledby="footer-about-title">
            <p className="mb-4 max-w-md text-xs font-semibold uppercase tracking-[.18em] text-[#a4be2d]">Startup Architect. Venture Builder. Business Consultant.</p>
            <h2 id="footer-about-title" className="sr-only">Hashir Usman</h2>
            <img src="/logo.png" alt="Hashir Usman" className="h-16 w-16 object-contain" />
            <p className="mt-3 max-w-sm text-sm leading-7 text-[#b8c4b4] sm:text-[15px]">Building startups, strengthening businesses, and figuring things out along the way.</p>
            <Link to="/contact?about=strategy-call" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#a4be2d] no-underline transition-colors hover:text-[#c5d96a]">Book a Strategy Call <ArrowUpRight size={17} aria-hidden /></Link>
          </section>

          {groups.map(({ title, links }, i) => (
            <nav
              key={title}
              className={`col-span-1 ${i === 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}
              style={i === 0 ? { paddingRight: 24 } : undefined}
              aria-label={title}
            >
              <h2 className="mb-5 text-xs font-bold uppercase tracking-[.16em] text-[#a4be2d]">{title}</h2>
              <ul className="m-0 flex list-none flex-col items-start gap-3 p-0">
                {links.map(([label, to]) => <li key={label}><Link to={to} className="text-base font-light text-[#e3e8df] no-underline transition-colors hover:text-[#c5d96a] sm:text-lg">{label}</Link></li>)}
              </ul>
            </nav>
          ))}

          <section className="col-span-2 lg:col-span-3" aria-labelledby="footer-contact-title">
            <h2 id="footer-contact-title" className="mb-5 text-xs font-bold uppercase tracking-[.16em] text-[#a4be2d]">Get in touch</h2>
            <address className="flex flex-col gap-3.5 not-italic text-base sm:text-[17px]">
              <a className="flex items-center gap-3 font-light text-[#e3e8df] no-underline transition-colors hover:text-[#c5d96a]" href="tel:+917789800898"><Phone size={19} weight="light" className="shrink-0 text-[#a4be2d]" aria-hidden /><span>+91 77 898 00 898</span></a>
              <a className="flex items-center gap-3 break-all font-light text-[#e3e8df] no-underline transition-colors hover:text-[#c5d96a]" href={`mailto:${email}`}><EnvelopeSimple size={19} weight="light" className="shrink-0 text-[#a4be2d]" aria-hidden /><span className="border-b border-[#e3e8df]/70 pb-0.5">{email}</span></a>
              <span className="flex items-center gap-3 font-light text-[#e3e8df]"><MapPin size={19} weight="light" className="shrink-0 text-[#a4be2d]" aria-hidden /><span>Bengaluru, India</span></span>
            </address>
            <div className="mt-5 flex flex-wrap items-center gap-5">
              {socials.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="text-[#e3e8df] no-underline transition-colors hover:text-[#a4be2d]"><Icon size={24} aria-hidden /></a>)}
            </div>
          </section>
        </div>

        <div className="mt-4 lg:mt-6">
          <Wordmark text={wordmark} />
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-3 text-xs text-[#9eac99] md:flex-row md:items-end">
          <div className="flex flex-wrap items-center justify-center gap-y-2 text-center md:justify-start md:text-left" style={{ columnGap: 20 }}>
            <Link to="/privacy" className="text-[#b8c4b4] underline-offset-4 hover:underline">Privacy Policy</Link>
            <span className="text-[#b8c4b4]">Build with clarity. Scale with intention. Made with ideas and a little chaos.</span>
          </div>
          <span>© {new Date().getFullYear()} Hashir Usman. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
