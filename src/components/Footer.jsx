import { Link } from 'react-router-dom'
import { ArrowUpRight, EnvelopeSimple, InstagramLogo, LinkedinLogo, MapPin, Phone, XLogo, YoutubeLogo } from '@phosphor-icons/react'

const email = 'connect@hashirusman.online'
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

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-[#202b20] text-[#e3e8df]" aria-label="About and contact Hashir">
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-6 pt-10 sm:px-8 sm:pt-12 xl:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-12 lg:items-start lg:gap-x-8">
          <section className="col-span-2 lg:col-span-4 lg:pr-10" aria-labelledby="footer-about-title">
            <h2 id="footer-about-title" className="sr-only">Hashir Usman</h2>
            <img src="/logo.png" alt="Hashir Usman" className="h-16 w-16 object-contain" />
            <p className="mt-4 mb-0 max-w-md text-xs font-semibold uppercase tracking-[.18em] text-[#a4be2d]">Startup Architect. Venture Builder. Business Consultant.</p>
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
