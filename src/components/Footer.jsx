import { Link } from 'react-router-dom'
import { ArrowUpRight, EnvelopeSimple, InstagramLogo, LinkedinLogo, MapPin, Phone, XLogo, YoutubeLogo } from '@phosphor-icons/react'

const email = 'connect@hashirusman.online'
const links = [['Home', '/'], ['About', '/about'], ['Ventures', '/ventures'], ['Founderverse', '/founderverse'], ['Contact', '/contact']]
const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', Icon: LinkedinLogo },
  { label: 'X', href: 'https://x.com/', Icon: XLogo },
  { label: 'Instagram', href: 'https://www.instagram.com/', Icon: InstagramLogo },
  { label: 'YouTube', href: 'https://www.youtube.com/', Icon: YoutubeLogo },
]

export default function Footer() {
  return (
    <footer className="mt-2 rounded-t-2xl bg-[#202b20] text-[#e3e8df]" aria-label="About and contact Hashir">
      <div className="mx-auto grid w-full max-w-[1600px] gap-9 px-6 py-12 sm:px-8 sm:py-14 md:grid-cols-2 lg:grid-cols-12 lg:items-start lg:gap-8 xl:px-10 xl:py-16">
        <section className="md:col-span-2 lg:col-span-4 lg:pr-8" aria-labelledby="footer-about-title">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[.18em] text-[#a4be2d]">Venture architect · Business consultant</p>
          <h2 id="footer-about-title" className="sr-only">Hashir Usman</h2>
          <img src="/logo.png" alt="Hashir Usman" className="h-24 w-24 object-contain" />
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#b8c4b4] sm:text-[15px]">I partner with founders and businesses to turn promising ideas into clear strategies, strong brands, and ventures built to grow.</p>
          <Link to="/about" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#a4be2d] no-underline transition-colors hover:text-[#c5d96a]">More about me <ArrowUpRight size={17} aria-hidden /></Link>
        </section>

        <section className="lg:col-span-3 lg:border-l lg:border-[#445040] lg:pl-7 xl:pl-8" aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title" className="mb-6 text-xs font-semibold uppercase tracking-[.16em] text-[#a4be2d]">Get in touch</h2>
          <address className="flex flex-col gap-5 not-italic text-sm sm:text-[15px]">
            <a className="flex items-center gap-3 text-[#e0e6dc] no-underline transition-colors hover:text-[#c5d96a]" href="tel:+917789800898"><Phone size={19} weight="light" className="shrink-0 text-[#a4be2d]" aria-hidden /><span>+91 77 898 00 898</span></a>
            <a className="flex items-center gap-3 break-all text-[#e0e6dc] no-underline transition-colors hover:text-[#c5d96a]" href={`mailto:${email}`}><EnvelopeSimple size={19} weight="light" className="shrink-0 text-[#a4be2d]" aria-hidden /><span>{email}</span></a>
            <span className="flex items-center gap-3 text-[#e0e6dc]"><MapPin size={19} weight="light" className="shrink-0 text-[#a4be2d]" aria-hidden /><span>Bengaluru, India</span></span>
          </address>
        </section>

        <nav className="lg:col-span-2 lg:border-l lg:border-[#445040] lg:pl-7 xl:pl-8" aria-label="Footer navigation">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-[.16em] text-[#a4be2d]">Explore</h2>
          <ul className="flex flex-col items-start gap-4">
            {links.map(([label, to]) => <li key={to}><Link to={to} className="text-sm text-[#d4ddd0] no-underline transition-colors hover:text-[#c5d96a] sm:text-[15px]">{label}</Link></li>)}
          </ul>
        </nav>

        <section className="lg:col-span-3 lg:border-l lg:border-[#445040] lg:pl-7 xl:pl-8" aria-labelledby="footer-social-title">
          <h2 id="footer-social-title" className="mb-6 text-xs font-semibold uppercase tracking-[.16em] text-[#a4be2d]">Connect</h2>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {socials.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-10 shrink-0 place-items-center rounded-full border border-[#596653] text-[#d4ddd0] no-underline transition-colors hover:border-[#a4be2d] hover:bg-[#a4be2d] hover:text-[#1e2618] sm:size-11"><Icon size={19} aria-hidden /></a>)}
          </div>
          <p className="mt-5 max-w-[260px] text-sm leading-6 text-[#9eac99]">Ideas on strategy, growth, and building ventures.</p>
        </section>
      </div>

      <div className="border-t border-[#3a4639]">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-4 px-6 py-5 text-xs text-[#9eac99] sm:px-8 md:flex-row xl:px-10">
          <span>© {new Date().getFullYear()} Hashir Usman. All rights reserved.</span>
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-[#b8c4b4] no-underline transition-colors hover:text-[#c5d96a]">Back to home <ArrowUpRight size={14} aria-hidden /></Link>
        </div>
      </div>
    </footer>
  )
}
