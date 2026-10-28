import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowUpRight, CaretDown, EnvelopeSimple, LinkedinLogo, MapPin, Phone, Sparkle } from '@phosphor-icons/react'

const reveal = 'opacity-0 translate-y-5 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0'

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

// Visual-only helpers: keyframes + grain overlay for the hero
const css = `
@keyframes ct-spin{to{transform:rotate(360deg)}}
@keyframes ct-spin-rev{to{transform:rotate(-360deg)}}
@keyframes ct-float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-14px) rotate(3deg)}}
@keyframes ct-pulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.6)}}
@keyframes ct-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes ct-dash{to{stroke-dashoffset:-64}}
.ct-orbit{transform-origin:360px 230px;transform-box:view-box}
.ct-spin{animation:ct-spin 70s linear infinite}
.ct-spin-rev{animation:ct-spin-rev 110s linear infinite}
.ct-float{animation:ct-float 7s ease-in-out infinite}
.ct-node{transform-box:fill-box;transform-origin:center;animation:ct-pulse 3s ease-in-out infinite}
.ct-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:ct-draw 1.4s .6s cubic-bezier(.16,1,.3,1) forwards}
.ct-flow{stroke-dasharray:6 10;animation:ct-dash 4s linear infinite}
.ct-grain::before{content:'';position:absolute;inset:0;z-index:-5;pointer-events:none;opacity:.14;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
@media (prefers-reduced-motion:reduce){.ct-spin,.ct-spin-rev,.ct-float,.ct-node,.ct-flow{animation:none}.ct-draw{animation:none;stroke-dashoffset:0}}
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

  const fieldClass = 'w-full min-w-0 rounded-xl border border-[#d4dbc8] bg-[#f7f9f2] px-4 py-3.5 text-[15px] leading-[1.5] text-[#171a17] shadow-[inset_0_1px_2px_#18220d0a] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#8a9482] hover:border-[#b9c7a0] focus-visible:border-[#7c9318] focus-visible:bg-white focus-visible:outline-none focus-visible:shadow-[0_0_0_4px_#a4be2d33]'
  const labelClass = 'grid gap-2 text-sm font-semibold leading-[1.4] text-[#41483c] transition-colors focus-within:text-[#4f6212]'
  const star = <span className="text-[#7c9318]" aria-hidden> *</span>
  const linkClass = 'group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[.04] p-3.5 pr-4 text-[#e7ece4] no-underline backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#a4be2d]/50 hover:bg-white/[.09] hover:text-[#c5d96a]'
  const iconClass = 'grid size-11 shrink-0 place-items-center rounded-xl bg-[#34432b] text-[#a4be2d] transition-colors duration-300 group-hover:bg-[#a4be2d] group-hover:text-[#1e2618]'
  const arrowClass = 'ml-auto shrink-0 text-[#8e9d88] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#a4be2d]'

  return (
    <main id="main" className="relative isolate mx-auto w-full max-w-[1600px] px-5 pb-20 sm:px-8 lg:pb-28 xl:px-10">
      <style>{css}</style>

      {/* soft dotted backdrop behind the content */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background-image:radial-gradient(#cdd8b4_1.2px,transparent_1.2px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_75%,transparent)]"
        aria-hidden
      />

      <section className="ct-grain relative isolate mt-6 overflow-hidden rounded-[32px] bg-[radial-gradient(120%_120%_at_0%_0%,#232a26_0%,#171a1b_55%,#101213_100%)] px-6 pb-24 pt-12 text-[#f8f9f6] shadow-[0_40px_90px_-50px_#0b0f0a] sm:mt-8 sm:px-10 sm:pb-28 sm:pt-16 lg:px-14 lg:pb-32 lg:pt-20 xl:px-20" aria-labelledby="contact-title">
        {/* glows */}
        <div className="pointer-events-none absolute -bottom-40 -left-28 -z-10 size-[460px] rounded-full bg-[#a4be2d]/20 blur-[120px]" aria-hidden />
        <div className="pointer-events-none absolute -right-20 -top-24 -z-10 size-[380px] rounded-full bg-[#5f7d12]/30 blur-[110px]" aria-hidden />

        <svg viewBox="0 0 600 500" className="pointer-events-none absolute -right-24 -top-36 -z-10 w-[min(68vw,760px)] opacity-40 sm:-right-12 sm:-top-48" fill="none" stroke="#a4be2d" aria-hidden>
          <circle cx="360" cy="230" r="120" strokeOpacity=".5" />
          <g className="ct-orbit ct-spin">
            <circle cx="360" cy="230" r="200" strokeOpacity=".6" strokeDasharray="3 9" />
            <circle cx="560" cy="230" r="5" fill="#a4be2d" stroke="none" />
          </g>
          <g className="ct-orbit ct-spin-rev">
            <circle cx="360" cy="230" r="280" strokeOpacity=".5" strokeDasharray="2 12" />
            <circle cx="558" cy="32" r="4" fill="#d3e66b" stroke="none" />
            <circle cx="240" cy="230" r="4" fill="#d3e66b" stroke="none" />
          </g>
          <path d="M360 0V500M60 230H600M120 390H530" strokeOpacity=".25" />
          <path d="M110 390H220V310H330V230H440V150H550" strokeWidth="2" strokeOpacity=".35" />
          <path className="ct-flow" d="M110 390H220V310H330V230H440V150H550" strokeWidth="2" strokeOpacity=".95" />
          {[[220, 310], [330, 230], [440, 150]].map(([cx, cy], i) => (
            <g key={cx}>
              <circle className="ct-node" style={{ animationDelay: `${i * 0.6}s` }} cx={cx} cy={cy} r="14" fill="#a4be2d" fillOpacity=".25" stroke="none" />
              <circle cx={cx} cy={cy} r="6" fill="#a4be2d" stroke="none" />
            </g>
          ))}
        </svg>

        {/* floating glass chips (decorative) */}
        <div className="pointer-events-none absolute right-[9%] top-[16%] hidden xl:block" aria-hidden>
          <span className="ct-float grid size-16 place-items-center rounded-2xl border border-white/15 bg-white/[.06] text-[#a4be2d] shadow-[0_24px_50px_-24px_#000] backdrop-blur-md"><EnvelopeSimple size={28} weight="light" /></span>
        </div>
        <div className="pointer-events-none absolute bottom-[26%] right-[24%] hidden xl:block" aria-hidden>
          <span className="ct-float grid size-14 place-items-center rounded-full border border-white/15 bg-white/[.06] text-[#d3e66b] shadow-[0_24px_50px_-24px_#000] backdrop-blur-md" style={{ animationDelay: '-2.5s' }}><Phone size={24} weight="light" /></span>
        </div>
        <div className="pointer-events-none absolute bottom-[34%] right-[5%] hidden xl:block" aria-hidden>
          <span className="ct-float grid size-12 place-items-center rounded-xl border border-[#a4be2d]/30 bg-[#a4be2d]/10 text-[#a4be2d] backdrop-blur-md" style={{ animationDelay: '-4.5s' }}><Sparkle size={20} weight="fill" /></span>
        </div>

        <div data-reveal className={`${reveal} relative max-w-3xl`}>
          <span className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#a4be2d]/30 bg-[#a4be2d]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.18em] text-[#a4be2d] backdrop-blur-sm before:size-1.5 before:rounded-full before:bg-[#a4be2d] before:shadow-[0_0_10px_2px_#a4be2d]">Say hello</span>
          <h1 id="contact-title" className="text-[clamp(48px,7vw,96px)] font-extrabold leading-[.92] tracking-[-.07em]">Got something<br /><span className="relative inline-block bg-gradient-to-r from-[#a4be2d] via-[#c5d96a] to-[#e6f29a] bg-clip-text pb-1 text-transparent">on your mind?
            <svg viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full" fill="none" stroke="#a4be2d" strokeWidth="3" strokeLinecap="round" aria-hidden>
              <path className="ct-draw" pathLength="1" vectorEffect="non-scaling-stroke" d="M2 7 Q 20 0 38 7 T 74 7 T 110 7 T 146 7 T 182 7 T 218 7 T 254 7 T 298 7" />
            </svg>
          </span></h1>
          <p className="mt-8 max-w-[600px] text-base leading-[1.7] text-[#c4ccc0] sm:text-lg">An idea. A business problem. An interesting collaboration.</p>
        </div>
        <div className="relative mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/15 pt-5 text-sm text-[#b8c4b4] sm:mt-14 sm:pt-6">
          <span className="grid size-8 place-items-center rounded-full bg-[#a4be2d]/15"><MapPin size={16} weight="light" className="text-[#a4be2d]" aria-hidden /></span>
          <span>Bengaluru, India</span><span className="text-white/30" aria-hidden>·</span><span>Big ideas. Simple words. Good energy.</span>
        </div>
      </section>

      <div className="relative z-10 mx-2 -mt-12 grid items-stretch gap-5 sm:mx-6 lg:mx-10 lg:-mt-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,.75fr)] lg:gap-7">
        <section data-reveal style={{ transitionDelay: '100ms' }} className={`${reveal} relative isolate overflow-hidden rounded-[28px] border border-[#e2e6dc] bg-white p-6 shadow-[0_40px_90px_-45px_#18220d70] sm:p-9 lg:p-11`} aria-labelledby="form-heading">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#7c9318] via-[#a4be2d] to-[#e6f29a]" aria-hidden />
          <div className="pointer-events-none absolute -right-2 top-4 -z-10 h-24 w-24 opacity-70 [background-image:radial-gradient(#b9c98a_1.6px,transparent_1.6px)] [background-size:12px_12px] [mask-image:radial-gradient(circle_at_top_right,black,transparent_75%)]" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 size-64 rounded-full bg-[#a4be2d]/10 blur-[70px]" aria-hidden />
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div><p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-[#7c9318]">I’m listening</p><h2 id="form-heading" className="text-2xl font-bold tracking-[-.04em] sm:text-3xl">Tell me a little about it</h2></div>
            <p className="max-w-xs border-l-2 border-[#a4be2d] pl-4 text-sm leading-6 text-[#72766f]">Or maybe you just want to ask something.</p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}><span>What should I call you?{star}</span><input className={fieldClass} autoComplete="name" name="name" required maxLength={100} /></label>
              <label className={labelClass}><span>Your email{star}</span><input className={fieldClass} autoComplete="email" type="email" name="email" placeholder="you@company.com" required maxLength={254} /></label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>Phone / WhatsApp<input className={fieldClass} autoComplete="tel" type="tel" name="phone" maxLength={30} /></label>
              <label className={labelClass}>
                <span>What’s this about?{star}</span>
                <span className="relative block">
                  <select className={`${fieldClass} cursor-pointer appearance-none pr-14`} name="topic" value={topic} onChange={(event) => setTopic(event.target.value)} required>
                    <option value="" disabled>Choose one</option>
                    {topics.map((item) => <option key={item.slug} value={item.label}>{item.label}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-[#e9f0d2] text-[#4f6212]"><CaretDown size={14} weight="bold" aria-hidden /></span>
                </span>
              </label>
            </div>
            <label className={labelClass}><span>Tell me a little more…{star}</span><textarea className={`${fieldClass} min-h-40 resize-y`} name="message" rows={5} required maxLength={3000} /></label>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-[#edf0e7] pt-6">
              <button className="group relative inline-flex min-h-14 items-center justify-center gap-4 overflow-hidden rounded-full border border-[#a4be2d] bg-[#a4be2d] py-1.5 pl-7 pr-1.5 text-sm font-semibold text-[#1e2618] shadow-[0_14px_30px_-14px_#7c9318] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b3cc35] hover:bg-[#b3cc35] hover:shadow-[0_22px_38px_-14px_#7c9318] active:scale-[.98]" type="submit">Send It My Way <span className="grid size-11 place-items-center rounded-full bg-[#1e2618] text-[#a4be2d] transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight size={18} aria-hidden /></span></button>
              <p className="flex items-center text-xs leading-[1.6] text-[#68745e] before:mr-2 before:inline-block before:size-1.5 before:shrink-0 before:rounded-full before:bg-[#a4be2d]" role="status">{prepared ? 'Your email draft is ready. Send it from your email app.' : 'This opens an email draft in your email app.'}</p>
            </div>
          </form>
        </section>

        <aside data-reveal style={{ transitionDelay: '220ms' }} className={`${reveal} relative isolate flex flex-col overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#2a3a2c_0%,#1c271d_55%,#141b15_100%)] p-6 text-[#e3e8df] shadow-[0_40px_90px_-45px_#0b140a] sm:p-9 lg:p-10`} aria-label="Contact links">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-[.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:36px_36px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" aria-hidden />
          <div className="pointer-events-none absolute -right-20 -top-20 -z-10 size-64 rounded-full bg-[#a4be2d]/25 blur-[80px]" aria-hidden />
          <svg viewBox="0 0 300 300" className="pointer-events-none absolute -bottom-24 -right-24 -z-10 w-[320px] opacity-30" fill="none" stroke="#a4be2d" aria-hidden>
            <circle cx="150" cy="150" r="140" strokeDasharray="3 9" />
            <circle cx="150" cy="150" r="95" strokeOpacity=".6" />
            <circle cx="150" cy="150" r="50" strokeOpacity=".4" />
          </svg>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-[#a4be2d]">Or just say hello</p>
          <h2 className="text-2xl font-bold tracking-[-.04em] sm:text-3xl">Connect directly</h2>
          <p className="mt-3 text-sm leading-6 text-[#b8c4b4]">Good things usually start with a conversation.</p>
          <div className="my-7 h-px bg-gradient-to-r from-[#a4be2d]/60 via-[#465243] to-transparent" />
          <div className="flex flex-col gap-3.5">
            <a href="mailto:connect@hashirusman.online" className={linkClass}><span className={iconClass}><EnvelopeSimple size={20} weight="light" aria-hidden /></span><span className="min-w-0"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[.14em] text-[#9eac99]">Email</span><span className="block break-all text-sm font-medium">connect@hashirusman.online</span></span><ArrowUpRight size={16} className={arrowClass} aria-hidden /></a>
            <a href="tel:+917789800898" className={linkClass}><span className={iconClass}><Phone size={20} weight="light" aria-hidden /></span><span><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[.14em] text-[#9eac99]">Phone</span><span className="block text-sm font-medium">+91 77 898 00 898</span></span><ArrowUpRight size={16} className={arrowClass} aria-hidden /></a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className={linkClass}><span className={iconClass}><LinkedinLogo size={20} weight="light" aria-hidden /></span><span><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[.14em] text-[#9eac99]">LinkedIn</span><span className="block text-sm font-medium">Connect on LinkedIn</span></span><ArrowUpRight size={16} className={arrowClass} aria-hidden /></a>
          </div>
          <div className="mt-auto pt-8"><div className="h-px bg-[#465243]" /><p className="mt-5 flex items-center gap-2 text-sm text-[#b8c4b4]"><MapPin size={17} weight="light" className="text-[#a4be2d]" aria-hidden /> Bengaluru, India<span className="relative ml-auto flex size-2.5" aria-hidden><span className="absolute inline-flex size-full animate-ping rounded-full bg-[#a4be2d] opacity-60" /><span className="relative inline-flex size-2.5 rounded-full bg-[#a4be2d]" /></span></p></div>
        </aside>
      </div>
    </main>
  )
}
