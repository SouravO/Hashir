import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Briefcase, EnvelopeSimple, GraduationCap, Handshake, Phone } from '@phosphor-icons/react'

const openings = [
  {
    id: 'hiring',
    number: '01',
    title: 'We’re hiring',
    eyebrow: 'Build with us',
    description: 'Bring sharp thinking, a bias for action, and care for the details. Tell us where you do your best work and how you could help us build.',
    note: 'Open to exceptional people across strategy, operations, growth, and creative work.',
    Icon: Briefcase,
    value: 'We’re Hiring',
    background: '#d9ee72',
    foreground: '#202b20',
    tag: '01 / THE TEAM',
  },
  {
    id: 'internships',
    number: '02',
    title: 'Internships',
    eyebrow: 'Learn by doing',
    description: 'Get close to the work, take ownership of real projects, and learn how ideas become businesses. Curiosity and follow-through matter most.',
    note: 'Share what you’re studying, what you’re curious about, and when you’re available.',
    Icon: GraduationCap,
    value: 'Internship',
    background: '#ffb79f',
    foreground: '#321b18',
    tag: '02 / THE START',
  },
  {
    id: 'co-founder',
    number: '03',
    title: 'Become a co-founder',
    eyebrow: 'Make something matter',
    description: 'Have a point of view, complementary strengths, and the appetite to build for the long haul? Let’s explore what we could create together.',
    note: 'Tell us about the problem you want to solve and the part you want to play.',
    Icon: Handshake,
    value: 'Become a Co-Founder',
    background: '#b9c9ff',
    foreground: '#172342',
    tag: '03 / THE BIG IDEA',
  },
]

const field = 'w-full rounded-xl border border-[#dfe5d2] bg-[#fbfcf8] px-4 py-3.5 text-sm text-[#171a17] outline-none transition focus:border-[#7c9318] focus:bg-white focus:ring-4 focus:ring-[#a4be2d]/20 placeholder:text-[#9aa592]'

export default function Opportunities() {
  const [role, setRole] = useState('')
  const [submission, setSubmission] = useState('idle')

  useEffect(() => {
    document.title = 'Opportunities | Hashir Usman'
  }, [])

  function chooseRole(value) {
    setRole(value)
    setSubmission('idle')
    window.setTimeout(() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSubmission('sending')
    try {
      const response = await fetch('/api/submit-opportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      })
      const result = await response.json().catch(() => ({}))
      setSubmission(response.ok && result.ok ? 'sent' : 'error')
    } catch {
      setSubmission('error')
    }
  }

  return (
    <main id="main" className="mx-auto w-full max-w-[1600px] px-5 pb-20 sm:px-8 lg:pb-28 xl:px-10">
      <section className="relative isolate mt-6 overflow-hidden rounded-[32px] bg-[radial-gradient(ellipse_at_78%_48%,#34432a_0%,#202b20_47%,#182019_100%)] px-6 py-10 text-[#f8f9f6] sm:mt-8 sm:px-10 sm:py-14 lg:min-h-[360px] lg:px-16 lg:py-16" aria-labelledby="opportunities-title">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-48 z-0 size-[520px] rounded-full border border-[#a4be2d]/20" />
        <div aria-hidden className="pointer-events-none absolute -right-4 -top-32 z-0 size-[380px] rounded-full border border-[#a4be2d]/20" />
        <div aria-hidden className="pointer-events-none absolute right-[-70px] top-[-70px] z-0 size-[240px] rounded-full bg-[#a4be2d]/15 blur-[90px]" />
        <div className="relative z-10">
          <p className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[.3em] text-[#b8d047] before:h-px before:w-9 before:bg-[#a4be2d]">A seat at the table</p>
          <h1 id="opportunities-title" className="max-w-[1050px] text-[clamp(48px,7.6vw,104px)] font-semibold leading-[.92] tracking-[-.07em]">Come make a little<br /><span className="text-[#b8d047]">good trouble.</span></h1>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/15 pt-5 text-xs text-[#c2cdc0] sm:text-sm"><span>Pick your path.</span><span className="size-1 rounded-full bg-[#a4be2d]" /><span>Bring your point of view.</span><span className="size-1 rounded-full bg-[#a4be2d]" /><span>Build something that matters.</span></div>
        </div>
      </section>

      <section id="openings" className="scroll-mt-28 py-11 sm:py-14 lg:py-16" aria-labelledby="openings-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-7">
          <div><p className="mb-2 text-xs font-semibold uppercase tracking-[.2em] text-[#718526]">Three ways to join</p><h2 id="openings-title" className="text-3xl font-semibold tracking-[-.05em] text-[#171a17] sm:text-4xl">What feels like you?</h2></div>
          <span className="pb-1 text-xs text-[#697064]">Choose a card to get started ↗</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {openings.map(({ id, number, title, description, Icon, value, background, foreground, tag }) => (
            <article id={id} key={id} style={{ backgroundColor: background, color: foreground }} className="group relative isolate flex min-h-[285px] scroll-mt-28 flex-col overflow-hidden rounded-[24px] border border-black/5 p-5 shadow-[0_16px_34px_-28px_#18220d88] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-26px_#18220daa] sm:min-h-[310px] sm:p-7">
              <span aria-hidden className="pointer-events-none absolute -right-12 -top-12 z-0 size-48 rounded-full border border-current/20 transition-transform duration-500 group-hover:scale-125" />
              <span aria-hidden className="pointer-events-none absolute -bottom-12 -right-2 z-0 select-none text-[150px] font-black leading-none tracking-[-.1em] opacity-[.07]">{number}</span>
              <div className="relative z-10 flex items-center justify-between text-[10px] font-bold tracking-[.16em]"><span>{tag}</span><span className="grid size-10 place-items-center rounded-full border border-current/25"><Icon size={21} weight="light" aria-hidden /></span></div>
              <span className="relative z-10 mt-7 text-[10px] font-semibold uppercase tracking-[.15em] opacity-60">{number} / 03</span>
              <h3 className="relative z-10 mt-1 text-[clamp(25px,3vw,34px)] font-semibold leading-[1.02] tracking-[-.045em]">{title}</h3>
              <p className="relative z-10 mt-3 max-w-[34ch] text-xs leading-5 opacity-75">{description}</p>
              <button type="button" onClick={() => chooseRole(value)} className="relative z-10 mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-4 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">Apply <ArrowUpRight size={17} aria-hidden /></button>
            </article>
          ))}
        </div>
      </section>

      {role && <section id="application" className="scroll-mt-24 grid overflow-hidden rounded-[30px] bg-[#202b20] text-[#f8f9f6] lg:grid-cols-[.75fr_1.25fr]" aria-labelledby="application-title">
        <div className="relative isolate overflow-hidden p-7 sm:p-10 lg:p-12">
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-24 -z-10 size-72 rounded-full bg-[#a4be2d]/15 blur-[85px]" />
          <button type="button" onClick={() => { setRole(''); setSubmission('idle') }} className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-[#c2cdc0] hover:text-white"><ArrowLeft size={15} aria-hidden /> All opportunities</button>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[.25em] text-[#b8d047]">Your next move</p>
          <h2 id="application-title" className="max-w-md text-4xl font-semibold leading-[1.02] tracking-[-.05em] sm:text-5xl">{role} <span className="text-[#b8d047]">sounds like you.</span></h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#c2cdc0]">Share a little about yourself and we’ll take it from there.</p>
          <div className="mt-9 grid gap-3 border-t border-white/15 pt-6 text-sm">
            <a href={`mailto:connect@hashirusman.online?subject=${encodeURIComponent(`Opportunity: ${role}`)}`} className="inline-flex items-center gap-3 text-[#d3e66b] no-underline hover:text-white"><EnvelopeSimple size={19} aria-hidden /> Email the team instead <ArrowUpRight size={15} aria-hidden /></a>
            <a href="tel:+917789800898" className="inline-flex items-center gap-3 text-[#c2cdc0] no-underline hover:text-white"><Phone size={18} aria-hidden /> +91 77 898 00 898</a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid content-start gap-5 bg-white p-6 text-[#171a17] sm:p-9 lg:p-12">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-xs font-semibold text-[#3d4637]">Your name <span className="text-[#7c9318]">*</span><input className={field} name="name" autoComplete="name" placeholder="Name" required maxLength={100} /></label>
            <label className="grid gap-2 text-xs font-semibold text-[#3d4637]">Email address <span className="text-[#7c9318]">*</span><input className={field} name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label>
          </div>
          <input type="hidden" name="role" value={role} />
          <input className="hidden" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label className="grid gap-2 text-xs font-semibold text-[#3d4637]">LinkedIn or portfolio <span className="font-normal text-[#899081]">(optional)</span><input className={field} name="linkedin" type="url" placeholder="https://" maxLength={500} /></label>
          <label className="grid gap-2 text-xs font-semibold text-[#3d4637]">A little about you and what you’d like to build <span className="text-[#7c9318]">*</span><textarea className={`${field} min-h-32 resize-y`} name="message" placeholder="A few sentences is plenty…" required maxLength={3000} /></label>
          <button type="submit" disabled={submission === 'sending'} className="inline-flex min-h-12 items-center justify-center gap-2 justify-self-start rounded-full bg-[#a4be2d] px-6 text-sm font-semibold text-[#1e2618] transition hover:bg-[#b8d047] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7c9318]">{submission === 'sending' ? 'Sending application…' : 'Send application'} {submission !== 'sending' && <ArrowUpRight size={17} aria-hidden />}</button>
          {submission === 'sent' && <p role="status" className="m-0 text-sm leading-6 text-[#4f6212]">Application sent. Thanks for reaching out — the team will be in touch.</p>}
          {submission === 'error' && <p role="alert" className="m-0 text-sm leading-6 text-[#8c3929]">We couldn’t send this right now. Please email <a className="font-semibold underline" href={`mailto:connect@hashirusman.online?subject=${encodeURIComponent(`Opportunity application: ${role}`)}`}>connect@hashirusman.online</a> directly.</p>}
        </form>
      </section>}
    </main>
  )
}
