import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowUpRight, CaretDown, EnvelopeSimple, Lightbulb, LinkedinLogo, MapPin, Phone, UserCircle } from '@phosphor-icons/react'

const reveal = 'opacity-0 translate-y-5 transition-all duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0'

// `slug` lets other pages preselect a topic, for example /contact?about=funding
const topics = [
  { slug: 'strategy-call', label: 'I want to book a strategy call' },
  { slug: 'consulting', label: 'I need business consulting' },
  { slug: 'startup-idea', label: 'I’ve got a startup idea' },
  { slug: 'valuation', label: 'I need valuation support' },
  { slug: 'funding', label: 'I’m exploring funding' },
  { slug: 'co-build', label: 'I want to co-build' },
  { slug: 'other', label: 'Something else' },
]

// Visual-only helpers: serif display font, soft motion, film grain
const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&display=swap');
.ct-serif{font-family:'Fraunces','Cormorant Garamond',Georgia,'Times New Roman',serif;font-optical-sizing:auto}
@keyframes ct-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes ct-drift{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(-18px,10px,0)}}
.ct-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:ct-draw 1.6s .7s cubic-bezier(.16,1,.3,1) forwards}
.ct-drift{animation:ct-drift 16s ease-in-out infinite}
.ct-grain::before{content:'';position:absolute;inset:0;z-index:-5;pointer-events:none;opacity:.12;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
@media (prefers-reduced-motion:reduce){.ct-drift{animation:none}.ct-draw{animation:none;stroke-dashoffset:0}}
`

export default function Contact() {
  const { search } = useLocation()
  const [prepared, setPrepared] = useState(false)
  const [topic, setTopic] = useState('')

  useEffect(() => {
    const slug = new URLSearchParams(search).get('about')
    const match = topics.find((item) => item.slug === slug)
    // Keep the selected form topic in sync with links from other pages.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (match) setTopic(match.label)
  }, [search])

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
    const phone = data.get('phone')
    const subject = data.get('topic')
    const body = `Hi Hashir,\n\nI'm ${data.get('name')}.\nEmail: ${data.get('email')}${phone ? `\nPhone / WhatsApp: ${phone}` : ''}\nThis is about: ${data.get('topic')}\n\n${data.get('message')}\n\nThank you!`
    window.location.href = `mailto:connect@hashirusman.online?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setPrepared(true)
  }

  const fieldClass = 'peer w-full min-w-0 rounded-2xl border border-[#dfe5d2] bg-[#fafbf6] px-4 py-4 text-[15px] leading-[1.5] text-[#171a17] transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-[#9aa592] hover:border-[#c4d198] focus-visible:border-[#7c9318] focus-visible:bg-white focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_#a4be2d2e,0_12px_24px_-16px_#7c9318]'
  const fieldIconClass = 'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9db13f] transition-colors duration-300 peer-focus-visible:text-[#4f6212]'
  const labelClass = 'grid gap-2.5 text-[13px] font-semibold leading-[1.4] tracking-[.01em] text-[#3d4637] transition-colors focus-within:text-[#4f6212]'
  const star = <span className="text-[#7c9318]" aria-hidden> *</span>
  const linkClass = 'group flex items-center gap-4 border-b border-white/10 py-5 text-[#e7ece4] no-underline transition-all duration-300 first:pt-0 last:border-b-0 hover:pl-2 hover:text-[#d3e66b]'
  const iconClass = 'grid size-12 shrink-0 place-items-center rounded-full border border-[#a4be2d]/40 bg-[#a4be2d]/[.08] text-[#a4be2d] transition-all duration-300 group-hover:border-[#a4be2d] group-hover:bg-[#a4be2d] group-hover:text-[#1e2618]'
  const arrowClass = 'ml-auto shrink-0 text-[#8e9d88] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#a4be2d]'

  return (
    <main id="main" className="relative isolate mx-auto w-full max-w-[1600px] px-5 pb-20 sm:px-8 lg:pb-28 xl:px-10">
      <style>{css}</style>

      {/* soft warm backdrop behind the content */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_38%_at_92%_58%,#e8efcf_0%,transparent_72%),radial-gradient(50%_36%_at_4%_92%,#edf1db_0%,transparent_72%)]"
        aria-hidden
      />
      <svg viewBox="0 0 400 560" className="pointer-events-none absolute -left-24 bottom-10 -z-10 hidden w-[420px] opacity-60 lg:block" fill="none" stroke="#b9c98a" strokeWidth="1" aria-hidden>
        <path d="M20 560V220A180 180 0 0 1 380 220V560" strokeOpacity=".5" />
        <path d="M60 560V220A140 140 0 0 1 340 220V560" strokeOpacity=".35" />
        <path d="M100 560V220A100 100 0 0 1 300 220V560" strokeOpacity=".22" />
      </svg>

      <section className="ct-grain relative isolate mt-6 overflow-hidden rounded-[36px] bg-[radial-gradient(120%_120%_at_0%_0%,#26301f_0%,#181d17_52%,#101312_100%)] px-6 pb-24 pt-12 text-[#f8f9f6] shadow-[0_50px_100px_-55px_#0b0f0a] sm:mt-8 sm:px-10 sm:pb-28 sm:pt-16 lg:px-14 lg:pb-32 lg:pt-24 xl:px-20" aria-labelledby="contact-title">
        {/* warm glows */}
        <div className="pointer-events-none absolute -bottom-44 -left-28 -z-10 size-[480px] rounded-full bg-[#a4be2d]/20 blur-[130px]" aria-hidden />

        {/* flowing ribbon lines */}
        <svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" className="ct-drift pointer-events-none absolute inset-0 -z-10 h-full w-full" fill="none" stroke="#a4be2d" strokeWidth="1" aria-hidden>
          {Array.from({ length: 10 }).map((_, i) => (
            <path
              key={i}
              d={`M-60 ${200 + i * 20} C 140 ${70 + i * 20}, 330 ${400 + i * 20}, 540 ${240 + i * 20} S 780 ${90 + i * 20}, 880 ${220 + i * 20}`}
              strokeOpacity={0.07 + i * 0.03}
            />
          ))}
        </svg>

        <div data-reveal className={`${reveal} relative max-w-3xl`}>
          <span className="mb-8 inline-flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[.32em] text-[#a4be2d] before:h-px before:w-10 before:bg-gradient-to-r before:from-transparent before:to-[#a4be2d]">Say hello</span>
          <h1 id="contact-title" className="ct-serif text-[clamp(48px,7vw,96px)] font-medium leading-[.98] tracking-[-.035em]">Got something<br /><span className="relative inline-block bg-gradient-to-r from-[#a4be2d] via-[#c5d96a] to-[#e6f29a] bg-clip-text pb-2 pr-2 italic text-transparent">on your mind?
            <svg viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-3 w-full" fill="none" stroke="#a4be2d" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <path className="ct-draw" pathLength="1" vectorEffect="non-scaling-stroke" d="M2 9 C 80 2, 190 2, 298 8" />
            </svg>
          </span></h1>
          <p className="ct-serif mt-9 max-w-[600px] text-lg font-normal italic leading-[1.7] text-[#c9d1c4] sm:text-xl">An idea. A business problem. An interesting collaboration.</p>
        </div>
        <div className="relative mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/15 pt-5 text-sm text-[#b8c4b4] sm:mt-16 sm:pt-6">
          <span className="grid size-9 place-items-center rounded-full border border-[#a4be2d]/40"><MapPin size={16} weight="light" className="text-[#a4be2d]" aria-hidden /></span>
          <span>Bengaluru, India</span><span className="text-[#a4be2d]/60" aria-hidden>·</span><span className="ct-serif italic">Big ideas. Simple words. Good energy.</span>
        </div>
      </section>

      <div className="relative z-10 mx-2 -mt-12 grid items-stretch gap-5 sm:mx-6 lg:mx-10 lg:-mt-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,.7fr)] lg:gap-7">
        <section data-reveal style={{ transitionDelay: '100ms' }} className={`${reveal} relative isolate overflow-hidden rounded-[32px] border border-[#e4e8da] bg-white p-6 shadow-[0_50px_100px_-50px_#18220d7a] sm:p-10 lg:p-12`} aria-labelledby="form-heading">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#7c9318] via-[#a4be2d] to-[#e6f29a]" aria-hidden />
          <svg viewBox="0 0 240 240" className="pointer-events-none absolute -right-16 -top-16 -z-10 w-60 opacity-80" fill="none" stroke="#c5d38c" strokeWidth="1" aria-hidden>
            <path d="M20 240V120A100 100 0 0 1 220 120V240" strokeOpacity=".7" />
            <path d="M50 240V120A70 70 0 0 1 190 120V240" strokeOpacity=".5" />
            <path d="M80 240V120A40 40 0 0 1 160 120V240" strokeOpacity=".35" />
          </svg>
          <div className="pointer-events-none absolute -bottom-28 -left-24 -z-10 size-72 rounded-full bg-[#a4be2d]/10 blur-[80px]" aria-hidden />
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[.28em] text-[#7c9318] before:h-px before:w-8 before:bg-[#a4be2d]">I’m listening</p>
              <h2 id="form-heading" className="ct-serif text-3xl font-medium tracking-[-.025em] text-[#171a17] sm:text-4xl">Tell me a little about it</h2>
            </div>
            <p className="ct-serif max-w-xs border-l border-[#a4be2d] pl-4 text-[15px] italic leading-6 text-[#72766f]">Or maybe you just want to ask something.</p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className={labelClass}><span>What should I call you?{star}</span>
                <span className="relative block"><input className={`${fieldClass} pl-12`} autoComplete="name" name="name" required maxLength={100} /><UserCircle size={20} weight="light" className={fieldIconClass} aria-hidden /></span>
              </label>
              <label className={labelClass}><span>Your email{star}</span>
                <span className="relative block"><input className={`${fieldClass} pl-12`} autoComplete="email" type="email" name="email" placeholder="you@company.com" required maxLength={254} /><EnvelopeSimple size={20} weight="light" className={fieldIconClass} aria-hidden /></span>
              </label>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className={labelClass}>Phone / WhatsApp
                <span className="relative block"><input className={`${fieldClass} pl-12`} autoComplete="tel" type="tel" name="phone" maxLength={30} /><Phone size={20} weight="light" className={fieldIconClass} aria-hidden /></span>
              </label>
              <label className={labelClass}>
                <span>What’s this about?{star}</span>
                <span className="relative block">
                  <select className={`${fieldClass} cursor-pointer appearance-none pl-12 pr-14`} name="topic" value={topic} onChange={(event) => setTopic(event.target.value)} required>
                    <option value="" disabled>Choose one</option>
                    {topics.map((item) => <option key={item.slug} value={item.label}>{item.label}</option>)}
                  </select>
                  <Lightbulb size={20} weight="light" className={fieldIconClass} aria-hidden />
                  <span className="pointer-events-none absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-[#edf3d6] text-[#4f6212]"><CaretDown size={14} weight="bold" aria-hidden /></span>
                </span>
              </label>
            </div>
            <label className={labelClass}><span>Tell me a little more…{star}</span><textarea className={`${fieldClass} min-h-44 resize-y`} name="message" rows={5} required maxLength={3000} /></label>
            <div className="mt-2 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-[#edf0e7] pt-7">
              <button className="group relative inline-flex min-h-14 items-center justify-center gap-5 overflow-hidden rounded-full bg-[#1e2618] py-1.5 pl-8 pr-1.5 text-sm font-semibold tracking-[.01em] text-[#f3f7e2] shadow-[0_18px_34px_-16px_#1e2618] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2a3a22] hover:shadow-[0_26px_42px_-16px_#1e2618] active:scale-[.98]" type="submit">Send It My Way <span className="grid size-11 place-items-center rounded-full bg-[#a4be2d] text-[#1e2618] transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight size={18} aria-hidden /></span></button>
              <p className="ct-serif flex items-center text-[13px] italic leading-[1.6] text-[#68745e] before:mr-2.5 before:inline-block before:size-1.5 before:shrink-0 before:rounded-full before:bg-[#a4be2d]" role="status">{prepared ? 'Your email draft is ready. Send it from your email app.' : 'This opens an email draft in your email app.'}</p>
            </div>
          </form>
        </section>

        <aside data-reveal style={{ transitionDelay: '220ms' }} className={`${reveal} relative isolate flex flex-col overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,#2c3d2a_0%,#1c271d_55%,#131a14_100%)] p-6 text-[#e3e8df] shadow-[0_50px_100px_-50px_#0b140a] sm:p-10 lg:p-11`} aria-label="Contact links">
          <div className="pointer-events-none absolute -right-20 -top-20 -z-10 size-72 rounded-full bg-[#a4be2d]/25 blur-[90px]" aria-hidden />
          <svg viewBox="0 0 300 300" className="pointer-events-none absolute -bottom-6 -right-12 -z-10 w-[300px] opacity-50" fill="none" stroke="#a4be2d" strokeWidth="1" aria-hidden>
            <path d="M10 300V150A140 140 0 0 1 290 150V300" strokeOpacity=".55" />
            <path d="M50 300V150A100 100 0 0 1 250 150V300" strokeOpacity=".4" />
            <path d="M90 300V150A60 60 0 0 1 210 150V300" strokeOpacity=".3" />
          </svg>
          <p className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[.28em] text-[#a4be2d] before:h-px before:w-8 before:bg-[#a4be2d]">Or just say hello</p>
          <h2 className="ct-serif text-3xl font-medium tracking-[-.025em] sm:text-4xl">Connect directly</h2>
          <p className="ct-serif mt-3 text-[15px] italic leading-6 text-[#b8c4b4]">Good things usually start with a conversation.</p>
          <div className="my-8 h-px bg-gradient-to-r from-[#a4be2d]/70 via-[#465243] to-transparent" />
          <div className="flex flex-col">
            <a href="mailto:connect@hashirusman.online" className={linkClass}><span className={iconClass}><EnvelopeSimple size={20} weight="light" aria-hidden /></span><span className="min-w-0"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[.18em] text-[#9eac99]">Email</span><span className="block break-all text-sm font-medium">connect@hashirusman.online</span></span><ArrowUpRight size={16} className={arrowClass} aria-hidden /></a>
            <a href="tel:+917789800898" className={linkClass}><span className={iconClass}><Phone size={20} weight="light" aria-hidden /></span><span><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[.18em] text-[#9eac99]">Phone</span><span className="block text-sm font-medium">+91 77 898 00 898</span></span><ArrowUpRight size={16} className={arrowClass} aria-hidden /></a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className={linkClass}><span className={iconClass}><LinkedinLogo size={20} weight="light" aria-hidden /></span><span><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[.18em] text-[#9eac99]">LinkedIn</span><span className="block text-sm font-medium">Connect on LinkedIn</span></span><ArrowUpRight size={16} className={arrowClass} aria-hidden /></a>
          </div>
          <div className="mt-auto pt-10"><div className="h-px bg-[#465243]" /><p className="mt-5 flex items-center gap-2 text-sm text-[#b8c4b4]"><MapPin size={17} weight="light" className="text-[#a4be2d]" aria-hidden /> Bengaluru, India<span className="relative ml-auto flex size-2.5" aria-hidden><span className="absolute inline-flex size-full animate-ping rounded-full bg-[#a4be2d] opacity-60" /><span className="relative inline-flex size-2.5 rounded-full bg-[#a4be2d]" /></span></p></div>
        </aside>
      </div>
    </main>
  )
}
