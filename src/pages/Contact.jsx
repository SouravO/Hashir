import { useEffect, useState } from 'react'
import { ArrowUpRight, EnvelopeSimple, LinkedinLogo } from '@phosphor-icons/react'

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

  const fieldClass = 'w-full min-w-0 rounded border-[1.5px] border-[#d4dbc8] bg-white px-3.5 py-[11px] text-sm leading-[1.4] text-[#171a17] transition-[border-color,box-shadow] duration-150 placeholder:text-[#8a9482] focus-visible:border-[#7c9318] focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_#a4be2d28]'
  const labelClass = 'grid gap-[7px] text-xs font-medium leading-[1.4] text-[#41483c]'

  return (
    <main id="main" className="mx-auto max-w-[1200px] px-7 pb-[72px] max-[768px]:px-[18px]">
      <section className="py-[52px] pb-10 max-[768px]:pt-9" aria-labelledby="contact-title"><div data-reveal className={reveal}><span className="mb-3.5 inline-block text-[11px] font-semibold tracking-[.2px] text-[#617319]">Get in Touch</span><h1 id="contact-title" className="mb-[22px] text-[clamp(48px,6vw,84px)] font-extrabold leading-[.96] tracking-[-.065em] text-[#809719] max-[768px]:text-[clamp(42px,11vw,62px)]">Let's build<br />what's next.</h1><p className="max-w-[500px] text-base leading-[1.65] tracking-[-.3px] text-[#3a3e36]">Have a venture in mind or a business ready for its next chapter? Send me a note and tell me what you're working on.</p></div></section>

      <div className="grid grid-cols-[1fr_360px] items-start gap-10 max-[1024px]:grid-cols-1">
        <section data-reveal className={reveal} aria-labelledby="form-heading"><h2 id="form-heading" className="mb-1.5 text-[22px] font-bold tracking-[-.6px]">Send a message</h2><p className="mb-1 text-sm text-[#72766f]">Share a little about your idea, business, or next move.</p>
          <form onSubmit={handleSubmit} className="mt-7 grid gap-[18px]">
            <div className="grid grid-cols-2 gap-4 max-[441px]:grid-cols-1">
              <label className={labelClass}>Your name<input className={fieldClass} autoComplete="name" name="name" placeholder="How should I call you?" required maxLength={100} /></label>
              <label className={labelClass}>Email address<input className={fieldClass} autoComplete="email" type="email" name="email" placeholder="you@company.com" required maxLength={254} /></label>
            </div>
            <label className={labelClass}>What are you working on?<textarea className={`${fieldClass} min-h-[110px] resize-y`} name="message" placeholder="A little about your idea, business, or next big move…" rows={4} required maxLength={3000} /></label>
            <button className="inline-flex min-h-11 w-fit items-center justify-center gap-3 rounded border-[1.5px] border-[#a4be2d] bg-[#a4be2d] px-[22px] text-xs font-semibold text-[#1e2618] transition-colors hover:border-[#b3cc35] hover:bg-[#b3cc35] active:scale-[.97]" type="submit">Let's connect <ArrowUpRight size={18} aria-hidden /></button>
            <p className="text-[11px] leading-[1.55] text-[#68745e]" role="status">{prepared ? 'Your email draft is ready — send it from your email app.' : 'This opens an email draft so we can find a good time to talk.'}</p>
          </form>
        </section>

        <aside className="rounded-2xl border border-[#e7e9e2] bg-[#f2f3ef] p-7" aria-label="Contact links"><h2 className="mb-5 text-base font-bold tracking-[-.3px]">Connect directly</h2><div className="flex flex-col gap-[18px]">
          <a href="mailto:connect@hashirusman.online" className="group flex items-center gap-3.5 text-[#171a17] no-underline transition-colors hover:text-[#7c9318]"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#e4eccc] text-[#7c9318]"><EnvelopeSimple size={18} weight="light" aria-hidden /></span><span><span className="mb-0.5 block text-[10px] font-medium uppercase tracking-[.4px] text-[#72766f]">Email</span><span className="block break-all text-[13px] font-medium tracking-[-.2px]">connect@hashirusman.online</span></span></a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="group flex items-center gap-3.5 text-[#171a17] no-underline transition-colors hover:text-[#7c9318]"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#e4eccc] text-[#7c9318]"><LinkedinLogo size={18} weight="light" aria-hidden /></span><span><span className="mb-0.5 block text-[10px] font-medium uppercase tracking-[.4px] text-[#72766f]">LinkedIn</span><span className="block text-[13px] font-medium tracking-[-.2px]">Visit LinkedIn</span></span></a>
        </div></aside>
      </div>
    </main>
  )
}
