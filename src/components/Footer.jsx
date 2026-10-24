import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, EnvelopeSimple, InstagramLogo, LinkedinLogo, MapPin, Phone, XLogo, YoutubeLogo } from '@phosphor-icons/react'

const email = 'connect@hashirusman.online'
const links = [['Home', '/'], ['About', '/about'], ['Ventures', '/ventures'], ['Contact', '/contact']]

export default function Footer() {
  const [emailValue, setEmailValue] = useState('')
  const [message, setMessage] = useState('')

  function handleSubscribe(event) {
    event.preventDefault()
    const subject = encodeURIComponent('Keep me updated')
    const body = encodeURIComponent(`Hi Hashir,\n\nI'd like to receive your updates on strategy, growth, and ventures.\n\nMy email: ${emailValue}\n`)
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
    setMessage('Send the draft in your email app to subscribe.')
  }

  return (
    <footer className="mt-2 rounded-t-[14px] bg-[#202b20] text-[#e3e8df]" aria-label="About and contact Hashir">
      <div className="mx-auto grid min-h-40 max-w-[1540px] grid-cols-[20%_32%_19%_1fr] items-center max-[1101px]:grid-cols-[22%_40%_1fr] max-[768px]:grid-cols-[30%_1fr]">
        <div className="relative min-h-40 self-stretch overflow-hidden rounded-bl-[14px] max-[1101px]:row-span-2 max-[768px]:row-span-1 max-[768px]:min-h-[210px]" aria-hidden>
          <img className="absolute left-1/2 top-0 w-[260px] max-w-none -translate-x-1/2 max-[1101px]:w-[300px] max-[768px]:left-[35%] max-[768px]:w-[240px]" src="/images/hashir-portrait.webp" srcSet="/images/hashir-portrait-small.webp 480w, /images/hashir-portrait-medium.webp 800w" sizes="260px" width="1120" height="1400" alt="" loading="lazy" />
        </div>

        <div className="px-3.5 py-[22px] max-[1101px]:p-[22px] max-[768px]:py-[22px] max-[768px]:pl-3">
          <h2 className="mb-[7px] text-[11.5px] font-semibold tracking-[-.1px] text-[#a4be2d] max-[768px]:text-[13px]">About Hashir</h2>
          <p className="text-[10.5px] leading-[1.6] tracking-[-.1px] text-[#b8c4b4] max-[768px]:text-[11px]">I partner with founders, startups, and businesses to design what's next. With 5+ years of experience across strategy, brand, systems, and growth, I turn ideas into scalable, investable, and impactful ventures.</p>
          <Link to="/about" className="mt-3 inline-flex items-center gap-2 text-[10px] text-[#a4be2d] underline underline-offset-2 transition-colors hover:text-[#b3cc35] max-[768px]:text-[11px]">More about me <ArrowUpRight size={15} aria-hidden /></Link>
        </div>

        <address className="flex min-h-[108px] flex-col justify-center gap-[13px] border-x border-[#445040] px-4 py-2 not-italic text-[10px] tracking-[-.2px] max-[1101px]:mr-[18px] max-[1101px]:border-r-0 max-[1101px]:pl-[18px] max-[768px]:col-span-2 max-[768px]:mx-5 max-[768px]:my-0 max-[768px]:min-h-0 max-[768px]:gap-3.5 max-[768px]:border-x-0 max-[768px]:border-y max-[768px]:border-[#455040] max-[768px]:px-0 max-[768px]:py-[18px] max-[768px]:text-xs">
          <a className="flex items-center gap-2.5 leading-[1.4] text-[#c8d4c4] no-underline transition-colors hover:text-[#a4be2d] max-[768px]:gap-3" href="tel:+917789800898"><Phone size={16} weight="light" className="shrink-0 text-[#a4be2d]" aria-hidden /><span>+91 77 898 00 898</span></a>
          <a className="flex items-center gap-2.5 leading-[1.4] text-[#c8d4c4] no-underline transition-colors hover:text-[#a4be2d] max-[768px]:gap-3" href={`mailto:${email}`}><EnvelopeSimple size={16} weight="light" className="shrink-0 text-[#a4be2d]" aria-hidden /><span className="break-all">{email}</span></a>
          <span className="flex items-center gap-2.5 leading-[1.4] text-[#c8d4c4] max-[768px]:gap-3"><MapPin size={16} weight="light" className="shrink-0 text-[#a4be2d]" aria-hidden /><span>Bengaluru, India</span></span>
        </address>

        <div className="px-[26px] py-[22px] pl-7 max-[1101px]:col-[2/4] max-[1101px]:grid max-[1101px]:grid-cols-2 max-[1101px]:gap-x-7 max-[1101px]:px-[22px] max-[1101px]:pb-6 max-[768px]:col-span-2 max-[768px]:block max-[768px]:px-5 max-[768px]:py-[22px]">
          <h2 className="mb-1.5 text-xs font-semibold tracking-[-.1px] text-[#a4be2d] max-[1101px]:col-start-1">Let's build what's next.</h2>
          <p className="mb-2.5 text-[9.5px] leading-[1.5] text-[#9aab94] max-[1101px]:col-start-1 max-[768px]:mb-3.5 max-[768px]:text-[11px]">Insights on strategy, growth &amp; ventures.<br />Straight to your inbox.</p>
          <form onSubmit={handleSubscribe} className="flex gap-1.5 max-[1101px]:col-start-2 max-[1101px]:row-span-2 max-[1101px]:row-start-1 max-[1101px]:self-center max-[1101px]:[&_input]:h-[34px] max-[1101px]:[&_button]:h-[34px] max-[1101px]:[&_input]:text-[10px] max-[1101px]:[&_button]:text-[10px] max-[768px]:gap-2 max-[768px]:[&_input]:h-10 max-[768px]:[&_button]:h-10 max-[768px]:[&_input]:text-[11px] max-[768px]:[&_button]:px-4 max-[768px]:[&_button]:text-[11px]">
            <label className="sr-only" htmlFor="newsletter-email">Your email address</label>
            <input id="newsletter-email" type="email" placeholder="Enter your email" value={emailValue} onChange={(event) => setEmailValue(event.target.value)} required autoComplete="email" className="h-[30px] min-w-0 flex-1 rounded border border-[#5a6657] bg-transparent px-2.5 text-[10px] text-[#f0f5ec] placeholder:text-[#7a8c76] focus-visible:border-[#a4be2d] focus-visible:outline-none" />
            <button type="submit" className="inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded border border-[#a4be2d] bg-[#a4be2d] px-3.5 text-[9px] font-semibold whitespace-nowrap text-[#1e2618] transition-colors hover:bg-[#b3cc35]">Subscribe <ArrowUpRight size={12} aria-hidden /></button>
          </form>
          {message && <p className="mt-1.5 text-[9px] text-[#d5e893] max-[1101px]:col-start-2" role="status">{message}</p>}
          <div className="mt-2.5 flex items-center gap-[11px] max-[1101px]:col-start-1 max-[1101px]:mt-1.5 max-[768px]:mt-4" aria-label="Social profiles">
            {[LinkedinLogo, XLogo, InstagramLogo, YoutubeLogo].map((Icon, index) => <span key={index} className="grid size-[26px] place-items-center rounded-full border border-[#6a7864] text-[#c8d4c4]" aria-hidden><Icon size={15} /></span>)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-5 border-t border-[#364035] px-7 py-3.5 text-[10px] text-[#8c9988] max-[768px]:flex-col max-[768px]:gap-2.5 max-[768px]:px-5 max-[768px]:py-4">
        <span>© {new Date().getFullYear()} Hashir Usman. All rights reserved.</span>
        <nav className="flex gap-[22px] max-[768px]:flex-wrap max-[768px]:justify-center max-[768px]:gap-x-[18px] max-[768px]:gap-y-3" aria-label="Footer navigation">
          {links.map(([label, to]) => <Link key={to} to={to} className="text-[10px] text-[#8c9988] no-underline transition-colors hover:text-[#a4be2d]">{label}</Link>)}
        </nav>
      </div>
    </footer>
  )
}
