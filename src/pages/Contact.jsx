import { useEffect, useState } from 'react'
import { ArrowUpRight, EnvelopeSimple, LinkedinLogo, MapPin, Phone } from '@phosphor-icons/react'

const reveal = 'opacity-0 translate-y-5 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0'

export default function Contact() {
  const [prepared, setPrepared] = useState(false)

  useEffect(() => {
    document.title = 'Contact | Hashir Usman'
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-y-5')
        entry.target.classList.add('opacity-100', 'translate-y-0')
        observer.unobserve(entry.target)
      }
    }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = "Let's build what's next"
    const body = `Hi Hashir,\n\nI'm ${data.get('name')}.\nEmail: ${data.get('email')}\n\n${data.get('message')}\n\nI'd love to arrange a call. Please let me know a suitable time.\n\nThank you!`
    window.location.href = `mailto:connect@hashirusman.online?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setPrepared(true)
  }

  const fieldClass = 'w-full min-w-0 rounded-xl border border-[#d4dbc8] bg-[#fbfcf9] px-4 py-3.5 text-[15px] leading-[1.5] text-[#171a17] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#8a9482] focus-visible:border-[#7c9318] focus-visible:bg-white focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_#a4be2d28]'
  const labelClass = 'grid gap-2 text-sm font-semibold leading-[1.4] text-[#41483c]'

  return (
    <main id="main" className="mx-auto w-full max-w-[1600px] px-5 pb-20 sm:px-8 lg:pb-28 xl:px-10">
      <section className="relative isolate mt-6 overflow-hidden rounded-[28px] bg-[#171a1b] px-6 py-12 text-[#f8f9f6] sm:mt-8 sm:px-10 sm:py-16 lg:px-14 lg:py-20 xl:px-20" aria-labelledby="contact-title">
        <svg viewBox="0 0 600 500" className="pointer-events-none absolute -right-24 -top-36 -z-10 w-[min(68vw,760px)] opacity-35 sm:-right-12 sm:-top-48" fill="none" stroke="#a4be2d" aria-hidden>
          {[120, 200, 280].map((r) => <circle key={r} cx="360" cy="230" r={r} strokeOpacity=".45" />)}
          <path d="M360 0V500M60 230H600M120 390H530" strokeOpacity=".3" />
          <path d="M110 390H220V310H330V230H440V150H550" strokeWidth="2" strokeOpacity=".8" />
          {[[220, 310], [330, 230], [440, 150]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="6" fill="#a4be2d" stroke="none" />)}
        </svg>
        <div data-reveal className={`${reveal} relative max-w-3xl`}>
          <span className="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[.18em] text-[#a4be2d] before:h-px before:w-8 before:bg-[#a4be2d]">Get in touch</span>
          <h1 id="contact-title" className="text-[clamp(48px,7vw,96px)] font-extrabold leading-[.92] tracking-[-.07em]">Let's build<br /><span className="text-[#a4be2d]">what's next.</span></h1>
          <p className="mt-6 max-w-[600px] text-base leading-[1.7] text-[#c4ccc0] sm:text-lg">Have a venture in mind or a business ready for its next chapter? Tell me what you're working on and where you want to take it.</p>
        </div>
        <div className="relative mt-10 flex items-center gap-3 border-t border-white/15 pt-5 text-sm text-[#b8c4b4] sm:mt-14 sm:pt-6">
          <MapPin size={18} weight="light" className="text-[#a4be2d]" aria-hidden />
          <span>Bengaluru, India</span><span className="text-white/30" aria-hidden>·</span><span>Open to meaningful conversations</span>
        </div>
      </section>

      <div className="mt-8 grid items-stretch gap-5 lg:mt-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,.75fr)] lg:gap-7">
        <section data-reveal className={`${reveal} rounded-3xl border border-[#e2e6dc] bg-white p-6 shadow-[0_18px_50px_-38px_#18220d42] sm:p-9 lg:p-11`} aria-labelledby="form-heading">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div><p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-[#7c9318]">Start here</p><h2 id="form-heading" className="text-2xl font-bold tracking-[-.04em] sm:text-3xl">Send a message</h2></div>
            <p className="max-w-xs text-sm leading-6 text-[#72766f]">Share a little about your idea, business, or next move.</p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>Your name<input className={fieldClass} autoComplete="name" name="name" placeholder="How should I call you?" required maxLength={100} /></label>
              <label className={labelClass}>Email address<input className={fieldClass} autoComplete="email" type="email" name="email" placeholder="you@company.com" required maxLength={254} /></label>
            </div>
            <label className={labelClass}>What are you working on?<textarea className={`${fieldClass} min-h-36 resize-y`} name="message" placeholder="A little about your idea, business, or next big move…" rows={5} required maxLength={3000} /></label>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
              <button className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#a4be2d] bg-[#a4be2d] px-6 text-sm font-semibold text-[#1e2618] transition-colors hover:border-[#b3cc35] hover:bg-[#b3cc35] active:scale-[.98]" type="submit">Let's connect <ArrowUpRight size={18} aria-hidden /></button>
              <p className="text-xs leading-[1.6] text-[#68745e]" role="status">{prepared ? 'Your email draft is ready — send it from your email app.' : 'This opens an email draft so we can find a good time to talk.'}</p>
            </div>
          </form>
        </section>

        <aside className="flex flex-col rounded-3xl bg-[#202b20] p-6 text-[#e3e8df] sm:p-9 lg:p-10" aria-label="Contact links">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-[#a4be2d]">Prefer a direct hello?</p>
          <h2 className="text-2xl font-bold tracking-[-.04em] sm:text-3xl">Connect directly</h2>
          <p className="mt-3 text-sm leading-6 text-[#b8c4b4]">Reach out through any of these channels. I’ll be glad to hear what you’re building.</p>
          <div className="my-7 h-px bg-[#465243]" />
          <div className="flex flex-col gap-6">
            <a href="mailto:connect@hashirusman.online" className="group flex items-center gap-3.5 text-[#e7ece4] no-underline transition-colors hover:text-[#c5d96a]"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#34432b] text-[#a4be2d]"><EnvelopeSimple size={20} weight="light" aria-hidden /></span><span className="min-w-0"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[.14em] text-[#9eac99]">Email</span><span className="block break-all text-sm font-medium">connect@hashirusman.online</span></span></a>
            <a href="tel:+917789800898" className="group flex items-center gap-3.5 text-[#e7ece4] no-underline transition-colors hover:text-[#c5d96a]"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#34432b] text-[#a4be2d]"><Phone size={20} weight="light" aria-hidden /></span><span><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[.14em] text-[#9eac99]">Phone</span><span className="block text-sm font-medium">+91 77 898 00 898</span></span></a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="group flex items-center gap-3.5 text-[#e7ece4] no-underline transition-colors hover:text-[#c5d96a]"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#34432b] text-[#a4be2d]"><LinkedinLogo size={20} weight="light" aria-hidden /></span><span><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[.14em] text-[#9eac99]">LinkedIn</span><span className="block text-sm font-medium">Connect on LinkedIn</span></span><ArrowUpRight size={16} className="ml-auto text-[#8e9d88] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden /></a>
          </div>
          <div className="mt-auto pt-8"><div className="h-px bg-[#465243]" /><p className="mt-5 flex items-center gap-2 text-sm text-[#b8c4b4]"><MapPin size={17} weight="light" className="text-[#a4be2d]" aria-hidden /> Bengaluru, India</p></div>
        </aside>
      </div>
    </main>
  )
}
