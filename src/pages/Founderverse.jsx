import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useAnimationFrame, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChartLineUp, Check, CurrencyInr, Lightbulb, Megaphone, Plus } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

/* ---------- Assets already used in the project ---------- */
const HERO_IMAGE = '/founderverse.png'
const BOOK_IMAGE = '/book.png'
const LOGO_IMAGE = '/fv-logo.png'

/* ---------- Offer settings: confirm these before launch ---------- */
const ORDER = { physical: '/contact', digital: '/contact' } // point at real checkout links
const DIGITAL_AVAILABLE = true
const PRICE = { physical: '₹4,999', digital: '₹3,499' }
const REGULAR_PRICE = { physical: 24999, digital: 17499 }
const TERMS_PENDING = 'These details will be confirmed before launch.'

/* ---------- Content ---------- */
// The hero asks these one by one, full screen, before the book appears.
const QUESTIONS = [
  'Got a business idea?',
  'Do you know if anyone will actually pay for it?',
  'Can you see your cash running out before it does?',
  'Most founders don’t fail from a lack of ideas. They fail at what nobody taught them.',
]
const questionRows = [
  ['How do I validate my idea?', 'Where are my first customers?', 'What do investors want?', 'Is my business actually profitable?'],
  ['Will my cash last?', 'Why would anyone buy from me?', 'When should I hire?', 'How do I survive month three?'],
]
const costs = [
  { a: 'Idea', b: 'without validation.', text: 'You spend before you know anyone wants it.', Icon: Lightbulb },
  { a: 'Marketing', b: 'without strategy.', text: 'You pay for attention you can’t turn into sales.', Icon: Megaphone },
  { a: 'Revenue', b: 'without clarity.', text: 'Money comes in. Margins and cash flow stay a mystery.', Icon: CurrencyInr },
  { a: 'Growth', b: 'without foundation.', text: 'You scale before the business can hold the weight.', Icon: ChartLineUp },
]
const books = [
  { title: 'Startup Fundamentals', text: 'Validate an idea. Turn a problem into a business.' },
  { title: 'Business Models', text: 'How businesses create value and earn revenue.' },
  { title: 'Marketing & Growth', text: 'Positioning, distribution, reaching the right people.' },
  { title: 'Customer Acquisition', text: 'How customers decide, and how to keep them.' },
  { title: 'Finance & Planning', text: 'Budgets, margins and cash flow, made clear.' },
  { title: 'Fundraising & Investors', text: 'What investors expect, and how to prepare.' },
  { title: 'Team & Leadership', text: 'Build a team. Make better decisions.' },
  { title: 'Operations & Execution', text: 'Systems and priorities for the daily work.' },
  { title: 'Startup Case Studies', text: 'Real decisions and lessons from real businesses.' },
  { title: 'Scaling & Long-Term Growth', text: 'Grow in a way that lasts.' },
]
const faqs = [
  { q: 'Who is Founderverse for?', a: 'Aspiring and early-stage founders who want to make better decisions. No prior experience needed.' },
  { q: 'Physical, digital, or both?', a: DIGITAL_AVAILABLE ? `A physical collection at ${PRICE.physical} and a digital collection at ${PRICE.digital}.` : `A physical collection at ${PRICE.physical}.` },
  { q: 'How is this different from free resources?', a: 'Free resources can be great. This is an organised starting point: the essentials in one place, with case studies and frameworks to return to.' },
  { q: 'How do delivery, payment and refunds work?', a: TERMS_PENDING },
]

/* ---------- Style helpers ---------- */
const EASE = [0.16, 1, 0.3, 1]
const VIEW = { once: true, margin: '0px 0px -8% 0px' }
const wrap = 'mx-auto w-full max-w-[1200px] px-5 sm:px-8 xl:px-10'
const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4be2d]'
const num = (s) => parseInt(s.replace(/\D/g, ''), 10)

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
.fv-root{font-family:'Manrope',system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.fv-accent{font-family:inherit;font-style:normal;font-weight:inherit;letter-spacing:inherit}
@keyframes fv-caret{50%{opacity:0}}
.fv-caret{animation:fv-caret 1s steps(1) infinite}
@keyframes fv-orbit{to{transform:rotate(360deg)}}
.fv-orbit{animation:fv-orbit 14s linear infinite}
@media (prefers-reduced-motion:reduce){.fv-caret,.fv-orbit{animation:none}.fv-marq{overflow-x:auto}}
`

/* ---------- Motion primitives ---------- */
// Headings: each line slides up from behind its own clip.
function Lines({ as: Tag = 'div', lines, delay = 0, step = 120, className = '', ...rest }) {
  const reduce = useReducedMotion()
  return (
    <Tag className={`block ${className}`} {...rest}>
      {lines.map((line, index) => (
        <motion.span key={index} initial={reduce ? false : 'hidden'} whileInView="show" viewport={VIEW} className="-my-[.1em] block overflow-hidden py-[.1em]">
          <motion.span variants={{ hidden: { y: '110%' }, show: { y: 0, transition: { duration: 1, delay: (delay + index * step) / 1000, ease: EASE } } }} className="block">{line}</motion.span>
        </motion.span>
      ))}
    </Tag>
  )
}

// Buttons gently follow the mouse. Touch and keyboard are unaffected.
function Magnetic({ children, className = '' }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })
  const move = (event) => {
    if (event.pointerType !== 'mouse') return
    const r = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - r.left - r.width / 2) * 0.16)
    y.set((event.clientY - r.top - r.height / 2) * 0.3)
  }
  return <motion.div style={{ x: sx, y: sy }} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0) }} className={className}>{children}</motion.div>
}

function Cta({ to, children, track, tone = 'lime', full = false, className = '' }) {
  const tones = {
    lime: { btn: 'border-[#a4be2d] bg-[#a4be2d] text-[#101310] hover:border-[#bfd85a] hover:bg-[#bfd85a]', dot: 'bg-[#101310] text-[#a4be2d]' },
    dark: { btn: 'border-[#101310] bg-[#101310] text-white hover:border-[#153B2B] hover:bg-[#153B2B]', dot: 'bg-[#a4be2d] text-[#101310]' },
    outline: { btn: 'border-white/30 bg-transparent text-white hover:border-[#a4be2d] hover:bg-[#a4be2d] hover:text-[#101310]', dot: 'bg-[#a4be2d] text-[#101310]' },
  }
  const t = tones[tone]
  const cls = `group inline-flex min-h-14 items-center gap-4 rounded-full border py-1.5 pl-7 pr-1.5 text-left text-[15px] font-bold leading-tight no-underline transition-[background-color,border-color,color] duration-300 active:scale-[.98] ${full ? 'w-full justify-between' : ''} ${t.btn} ${focus} ${className}`
  const body = (
    <>
      {children}
      <span className={`grid size-11 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${t.dot}`}><ArrowUpRight size={18} aria-hidden /></span>
    </>
  )
  return (
    <Magnetic className={full ? 'w-full' : 'inline-flex'}>
      {to.startsWith('/') ? <Link to={to} data-track={track} className={cls}>{body}</Link> : <a href={to} data-track={track} className={cls}>{body}</a>}
    </Magnetic>
  )
}

function Book({ className = '' }) {
  return (
    <img src={BOOK_IMAGE} alt="Founderverse book cover" decoding="async" draggable={false} onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} style={{ filter: 'drop-shadow(0 36px 40px rgba(0,0,0,.5))' }} className={`block h-auto w-full rounded-[6px] ${className}`} />
  )
}

/* ---------- 1. Hero: questions type out full screen, then the book lands ---------- */
function Typed({ text, accent, onDone }) {
  const [n, setN] = useState(0)
  const done = useRef(onDone)
  useEffect(() => { done.current = onDone }, [onDone])
  useEffect(() => {
    let i = 0
    let hold
    const id = setInterval(() => {
      i += 1
      setN(i)
      if (i >= text.length) { clearInterval(id); hold = setTimeout(() => done.current(), 1300) }
    }, 36)
    return () => { clearInterval(id); clearTimeout(hold) }
  }, [text])
  // The full sentence sits invisible underneath so lines never jump while typing.
  return (
    <p className={`relative m-0 text-[clamp(34px,6.4vw,94px)] font-extrabold leading-[1.04] tracking-[-.04em] ${accent ? 'text-[#a4be2d]' : 'text-white'}`}>
      <span aria-hidden className="invisible">{text}</span>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="absolute inset-0">{text.slice(0, n)}<span className="fv-caret ml-1 inline-block h-[.85em] w-[.07em] translate-y-[.08em] bg-[#a4be2d]" /></span>
    </p>
  )
}

// A rotating stamp that sits on the corner of the book fan.
function Seal() {
  return (
    <div aria-hidden className="absolute -right-2 -top-3 z-30 grid size-24 place-items-center rounded-full bg-[#a4be2d] text-[#101310] shadow-[0_16px_40px_rgba(0,0,0,.45)] sm:size-28 lg:-right-8 lg:top-2">
      <svg viewBox="0 0 200 200" className="fv-orbit absolute inset-0 size-full">
        <defs><path id="fv-seal" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" /></defs>
        <text fill="currentColor" fontSize="14" fontWeight="800"><textPath href="#fv-seal" textLength="496" lengthAdjust="spacing">Founderverse · 10 books · Founderverse · 10 books ·</textPath></text>
      </svg>
      <span className="fv-accent text-[34px] leading-none sm:text-[40px]">10</span>
    </div>
  )
}

// Five covers stand in for the collection. They fan out; on hover they slide behind the front book.
// `spread` runs from 0 (all stacked behind the front cover) to 1 (fully fanned).
function FanCard({ i, spread, sx }) {
  const d = i - 2
  const a = Math.abs(d)
  // Outer covers start opening later and finish closing first, so the motion ripples.
  const t = useTransform(spread, [a * 0.06, 1], [0, 1])
  const x = useTransform(t, (v) => `${d * 8 * v}%`)
  const y = useTransform(t, (v) => `${d * d * 1.2 * v}%`)
  const rotate = useTransform(t, (v) => d * 6 * v)
  const scale = useTransform(t, [0, 1], [d === 0 ? 1.04 : 1, 1])
  const opacity = useTransform(t, [0, 0.12], [d === 0 ? 1 : 0, 1])
  const dim = useTransform(t, (v) => 0.2 * a * v)
  const shift = useTransform([sx, t], ([s, v]) => s * d * 20 * v)
  return (
    <motion.div style={{ x, y, rotate, scale, opacity, zIndex: 10 - a, transformOrigin: '50% 140%' }} className="absolute left-[19%] top-[6%] w-[62%]">
      <motion.div style={{ x: shift }} className="relative">
        <Book />
        {d !== 0 && <motion.span aria-hidden style={{ opacity: dim }} className="absolute inset-0 rounded-[6px] bg-[#101310]" />}
      </motion.div>
    </motion.div>
  )
}

function BookFan() {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 90, damping: 16 })
  const sy = useSpring(my, { stiffness: 90, damping: 16 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-10, 10])
  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8])

  const spread = useSpring(reduce ? 1 : 0, { stiffness: 70, damping: 16, mass: 1 })
  const isOpen = useRef(true)
  const setOpen = (open) => { isOpen.current = open; spread.set(open ? 1 : 0) }
  // The first fan-out happens a moment after the hero appears.
  useEffect(() => {
    const id = setTimeout(() => setOpen(true), reduce ? 0 : 650)
    return () => clearTimeout(id)
  }, [reduce]) // eslint-disable-line react-hooks/exhaustive-deps

  const onMove = (event) => {
    if (reduce || event.pointerType !== 'mouse') return
    const r = event.currentTarget.getBoundingClientRect()
    mx.set((event.clientX - r.left) / r.width - 0.5)
    my.set((event.clientY - r.top) / r.height - 0.5)
  }
  const onEnter = (event) => { if (event.pointerType === 'mouse') setOpen(false) }
  const onLeave = (event) => {
    mx.set(0); my.set(0)
    if (event.pointerType === 'mouse') setOpen(true)
  }
  // Touch screens have no hover: a tap closes the stack, the next tap opens it again.
  const onUp = (event) => { if (event.pointerType === 'touch') setOpen(!isOpen.current) }

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: EASE }}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onPointerUp={onUp}
      className="relative mx-auto w-full max-w-[300px] cursor-pointer touch-manipulation sm:max-w-[380px] lg:max-w-[440px]"
    >
      <motion.div aria-hidden animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.45, 0.85, 0.45] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-[-10%] -z-10 rounded-full bg-[#a4be2d]/20 blur-3xl" />
      <motion.div animate={reduce ? undefined : { y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
        <motion.div style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1200 }} className="relative aspect-[1/1.08]">
          {[0, 1, 2, 3, 4].map((i) => <FanCard key={i} i={i} spread={spread} sx={sx} />)}
        </motion.div>
      </motion.div>
      <span aria-hidden className="absolute inset-x-[12%] -bottom-2 -z-10 h-8 rounded-[50%] bg-black/60 blur-2xl" />
      <Seal />
    </motion.div>
  )
}

// The serif word gets a lime stroke that draws itself underneath.
function Before() {
  const reduce = useReducedMotion()
  return (
    <span className="fv-accent relative inline-block text-[#a4be2d]">
      before
      <svg aria-hidden viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute inset-x-[2%] -bottom-[.02em] h-[.14em] w-[96%] overflow-visible">
        <motion.path d="M2 8 C 45 2, 120 1, 198 6" fill="none" stroke="#a4be2d" strokeWidth="3.5" strokeLinecap="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 1, ease: EASE }} />
      </svg>
    </span>
  )
}

const HERO_LINES = [<>Learn it <Before /></>, 'it costs you.']

function Hero() {
  const reduce = useReducedMotion()
  const [stage, setStage] = useState(0)
  const done = reduce || stage >= QUESTIONS.length
  const startPrice = DIGITAL_AVAILABLE ? PRICE.digital : PRICE.physical

  // A soft lime light follows the cursor across the hero.
  const gx = useMotionValue(0)
  const gy = useMotionValue(0)
  const glow = useMotionTemplate`radial-gradient(540px circle at ${gx}px ${gy}px, rgba(164,190,45,.13), transparent 70%)`
  const onMove = (event) => {
    if (reduce || event.pointerType !== 'mouse') return
    const r = event.currentTarget.getBoundingClientRect()
    gx.set(event.clientX - r.left)
    gy.set(event.clientY - r.top)
  }

  return (
    <section aria-label="Founderverse" onPointerMove={onMove} className="relative isolate flex h-[calc(100svh-80px)] min-h-0 flex-col overflow-hidden bg-[#101310] text-white max-[768px]:h-[calc(100svh-64px)]">
      <div className="absolute inset-0 -z-20">
        <img src={HERO_IMAGE} alt="" decoding="async" draggable={false} onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} className="size-full object-cover saturate-[.8]" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(95deg,#101310_0%,#101310f0_40%,#101310c0_75%,#101310e0_100%)]" />
      <motion.div aria-hidden style={{ background: glow }} className="absolute inset-0 -z-10" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[.09] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />

      <div className={`${wrap} shrink-0 pt-3 sm:pt-5`}><img src={LOGO_IMAGE} alt="Founderverse" className="h-14 w-auto object-contain sm:h-20" /></div>

      <div className={`${wrap} flex min-h-0 flex-1 items-center py-2 sm:py-[clamp(12px,3svh,28px)]`}>
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={stage} initial={reduce ? false : { opacity: 0, filter: 'blur(12px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -40, filter: 'blur(12px)' }} transition={{ duration: 0.5, ease: EASE }} className="w-full max-w-[1000px]">
              <Typed text={QUESTIONS[stage]} accent={stage === QUESTIONS.length - 1} onDone={() => setStage((s) => s + 1)} />
            </motion.div>
          ) : (
            <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="grid w-full items-center gap-4 sm:gap-8 lg:grid-cols-12">
              <div className="order-2 lg:order-1 lg:col-span-7">
                <h1 className="m-0 text-[clamp(34px,8vw,52px)] font-extrabold leading-[.98] tracking-[-.045em] lg:text-[clamp(38px,5vw,72px)]">
                  {HERO_LINES.map((line, i) => (
                    <span key={i} className="-my-[.12em] block overflow-hidden py-[.12em]">
                      <motion.span initial={reduce ? false : { y: '115%' }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.1 + i * 0.14, ease: EASE }} className="block">{line}</motion.span>
                    </span>
                  ))}
                </h1>
                <motion.p initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.6, ease: EASE }} className="m-0 mt-3 max-w-[30ch] text-[15px] font-medium leading-[1.45] text-white/75 sm:mt-7 sm:text-[clamp(17px,1.5vw,20px)] sm:leading-[1.55]">
                  The ten-book playbook for building a business that lasts.
                </motion.p>
                <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.8, ease: EASE }} className="mt-5 flex max-w-[640px] flex-wrap items-center gap-x-4 gap-y-3 border-t border-white/15 pt-4 sm:mt-9 sm:gap-x-7 sm:gap-y-6 sm:pt-8">
                  <p className="m-0">
                    <span className="block text-[13px] font-medium text-white/55">From</span>
                    <span className="block text-[clamp(30px,3.2vw,42px)] font-extrabold leading-none tracking-[-.04em]">{startPrice}</span>
                  </p>
                  <span aria-hidden className="hidden h-12 w-px bg-white/20 sm:block" />
                  <Cta to={ORDER.physical} track="cta-hero" className="max-sm:min-h-11 max-sm:gap-2 max-sm:pl-4 max-sm:pr-1 max-sm:text-[13px] [&>a>span]:max-sm:size-10">Buy the collection</Cta>
                </motion.div>
              </div>
              <div className="order-1 mx-auto w-full max-w-[min(68vw,34svh,300px)] sm:max-w-[min(34svh,300px)] lg:order-2 lg:col-span-5 lg:max-w-[min(440px,52svh)]"><BookFan /></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!done && (
        <div className={`${wrap} shrink-0 pb-3 sm:pb-4`}>
          <div className="flex items-center justify-between border-t border-white/15 pt-4">
            <div aria-hidden className="flex gap-2">
              {QUESTIONS.map((q, i) => <span key={q} className={`h-1 rounded-full transition-all duration-500 ${i === stage ? 'w-10 bg-[#a4be2d]' : i < stage ? 'w-4 bg-white/60' : 'w-4 bg-white/20'}`} />)}
            </div>
            <button type="button" onClick={() => setStage(QUESTIONS.length)} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:text-white ${focus}`}>
              Skip <ArrowRight size={14} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

/* ---------- 2. Crossed question bands, then the four costs told one at a time ---------- */
// Drifts on its own, speeds up and reverses with page scroll, pauses on hover.
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"
const headline = 'font-extrabold leading-[1.04] tracking-[-.04em]'

/* ---------- Shared shell: lime cursor light + grain, same as the hero ---------- */
function Stage({ id, labelledby, innerRef, style, className = '', children }) {
  const reduce = useReducedMotion()
  const gx = useMotionValue(-999)
  const gy = useMotionValue(-999)
  const glow = useMotionTemplate`radial-gradient(520px circle at ${gx}px ${gy}px, rgba(164,190,45,.12), transparent 70%)`
  const onMove = (event) => {
    if (reduce || event.pointerType !== 'mouse') return
    const r = event.currentTarget.getBoundingClientRect()
    gx.set(event.clientX - r.left)
    gy.set(event.clientY - r.top)
  }
  return (
    <section id={id} ref={innerRef} style={style} aria-labelledby={labelledby} onPointerMove={onMove} className={`relative isolate overflow-x-clip text-white ${className}`}>
      <motion.div aria-hidden style={{ background: glow }} className="absolute inset-0 -z-10" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      {children}
    </section>
  )
}

// Headline whose words light up one by one as it scrolls into view.
function LitWord({ p, range, accent, children }) {
  const reduce = useReducedMotion()
  const opacity = useTransform(p, range, [0.16, 1])
  return <motion.span style={reduce ? undefined : { opacity }} className={`mr-[.25em] inline-block ${accent ? 'text-[#a4be2d]' : ''}`}>{children}</motion.span>
}

function Lit({ lines, className = '', ...rest }) {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const total = lines.reduce((sum, l) => sum + l.t.split(' ').length, 0)
  return (
    <h2 ref={ref} className={className} {...rest}>
      {lines.map((line, lineIndex) => {
        const wordsBefore = lines.slice(0, lineIndex).reduce((sum, prior) => sum + prior.t.split(' ').length, 0)
        return (
        <span key={line.t} className="block">
          {line.t.split(' ').map((word, w) => {
            const start = ((wordsBefore + w) / total) * 0.7
            return <LitWord key={`${word}-${w}`} p={p} range={[start, start + 0.3]} accent={line.accent}>{word}</LitWord>
          })}
        </span>
        )
      })}
    </h2>
  )
}

/* ---------- 2. Problem: two crossed bands, then four costs stacking up ---------- */
// Drifts on its own, speeds up and reverses with page scroll, pauses on hover.
function Marquee({ items, reverse = false, className = '' }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const smooth = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(smooth, [0, 1000], [0, 5], { clamp: false })
  const hover = useRef(false)
  const base = reverse ? 1 : -1
  useAnimationFrame((_, delta) => {
    if (reduce || hover.current) return
    const f = boost.get()
    const dir = f < 0 ? -base : base
    let v = x.get() + dir * 2.4 * (delta / 1000) * (1 + Math.abs(f))
    if (v <= -50) v += 50
    if (v > 0) v -= 50
    x.set(v)
  })
  const xp = useTransform(x, (v) => `${v}%`)
  return (
    <div className={`fv-marq overflow-hidden py-4 sm:py-5 ${className}`} onPointerEnter={() => { hover.current = true }} onPointerLeave={() => { hover.current = false }}>
      <motion.div style={{ x: xp }} className="flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex shrink-0">
            {[...items, ...items].map((text, i) => (
              <span key={`${copy}-${i}`} className="mr-8 inline-flex items-center gap-8 whitespace-nowrap text-[clamp(22px,3.2vw,44px)] font-extrabold tracking-[-.03em]">
                {text}<span aria-hidden className="text-[.7em]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// Each cost points to the book that answers it.
const COST_FIX = [0, 2, 4, 9]

function StackCard({ i, n, p, Icon, item, fix }) {
  const reduce = useReducedMotion()
  const scale = useTransform(p, [i / n, 1], [1, 1 - (n - 1 - i) * 0.04])
  const mx = useMotionValue(-400)
  const my = useMotionValue(-400)
  const spot = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(164,190,45,.16), transparent 65%)`
  const move = (event) => {
    if (event.pointerType !== 'mouse') return
    const r = event.currentTarget.getBoundingClientRect()
    mx.set(event.clientX - r.left)
    my.set(event.clientY - r.top)
  }
  return (
    <div className="sticky mb-[10svh] last:mb-0" style={{ top: `calc(5rem + ${i * 14}px)` }}>
      <motion.div onPointerMove={move} style={reduce ? undefined : { scale, transformOrigin: 'top center' }} className={`relative overflow-hidden rounded-[28px] border border-white/10 p-6 shadow-[0_30px_70px_rgba(0,0,0,.45)] sm:p-10 ${i % 2 ? 'bg-[#12281d]' : 'bg-[#161b16]'}`}>
        <motion.span aria-hidden style={{ background: spot }} className="pointer-events-none absolute inset-0" />
        <Icon aria-hidden weight="thin" className="pointer-events-none absolute -bottom-10 -right-6 size-[clamp(180px,30vw,340px)] text-[#a4be2d] opacity-[.09]" />
        <motion.span aria-hidden initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: '0px 0px -20% 0px' }} transition={{ duration: 1.2, ease: EASE }} className="absolute inset-x-0 top-0 block h-[2px] origin-left bg-[#a4be2d]" />
        <div className="relative grid gap-8 md:grid-cols-12 md:gap-12">
          <div className="min-w-0 md:col-span-7">
            <div className="flex items-center gap-4">
              <span aria-hidden className="grid size-11 place-items-center rounded-full bg-[#a4be2d] text-[#101310]"><Icon size={22} weight="bold" /></span>
              <span className="text-sm font-bold tabular-nums text-white/50">{i + 1} / {n}</span>
            </div>
            <h3 className="m-0 mt-8 text-[clamp(28px,4vw,58px)] font-extrabold leading-[1] tracking-[-.045em]">
              {item.a}<br /><span className="text-[#a4be2d]">{item.b}</span>
            </h3>
          </div>
          <div className="flex min-w-0 flex-col justify-between gap-8 md:col-span-5 md:border-l md:border-white/15 md:pl-10">
            <p className="m-0 text-[clamp(16px,1.5vw,19px)] leading-[1.65] text-[#cdd8c6]">{item.text}</p>
            <p className="m-0 inline-flex w-fit max-w-full items-center gap-3 rounded-full border border-white/20 bg-[#101310]/60 py-2 pl-2 pr-5 text-[14.5px] font-semibold">
              <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full bg-[#a4be2d] text-[#101310]"><Check size={13} weight="bold" /></span>
              Fixed in {fix.title}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Problem() {
  const list = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: list, offset: ['start 30%', 'end 70%'] })
  const n = costs.length
  return (
    <Stage labelledby="problem-title" className="bg-gradient-to-b from-[#101310] via-[#101310] to-[#0e2018] pb-24 sm:pb-36">
      <div className="overflow-hidden py-14 sm:py-20" aria-label="Questions every founder has">
        <Marquee items={questionRows[0]} className="-mx-10 w-[calc(100%+5rem)] -rotate-2 bg-[#a4be2d] text-[#101310]" />
        <Marquee items={questionRows[1]} reverse className="relative -mx-10 -mt-6 w-[calc(100%+5rem)] rotate-1 border-y border-white/20 bg-[#153B2B] text-white" />
      </div>

      <div className={`${wrap} pt-12 sm:pt-20`}>
        <div className="grid items-end gap-x-12 gap-y-6 lg:grid-cols-12">
          <Lit id="problem-title" lines={[{ t: 'Learning on the job' }, { t: 'is the expensive way.', accent: true }]} className={`m-0 lg:col-span-8 ${headline} text-[clamp(32px,5.4vw,74px)]`} />
          <p className="m-0 max-w-[34ch] text-[17px] font-medium leading-[1.6] text-white/65 lg:col-span-4">Four mistakes founders pay for. Each one has a fix.</p>
        </div>

        <div ref={list} className="mt-12 sm:mt-20">
          {costs.map((item, i) => <StackCard key={item.a} i={i} n={n} p={p} Icon={item.Icon} item={item} fix={books[COST_FIX[i]]} />)}
        </div>

        
      </div>
    </Stage>
  )
}

/* ---------- 3. The collection: scroll down, the shelf slides sideways ---------- */
const cardW = 'w-[clamp(150px,min(62vw,30svh),290px)]'

function BookCard({ b, n }) {
  return (
    <article className={`group relative shrink-0 ${cardW}`}>
      <div className="relative">
        <Book className="relative z-10 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:-rotate-1" />
        <span aria-hidden className="pointer-events-none absolute inset-x-[8%] -bottom-3 z-0 h-6 rounded-[50%] bg-black/70 blur-xl transition-all duration-500 group-hover:scale-90 group-hover:opacity-60" />
        <span aria-hidden className="pointer-events-none absolute inset-0 z-20 rounded-[6px] bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,.2)_48%,transparent_62%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="mt-6 flex items-start gap-3 sm:mt-7 sm:gap-4">
        <span aria-hidden className="text-[clamp(26px,3vw,36px)] font-extrabold leading-[.9] tracking-[-.04em] text-[#a4be2d]">{String(n + 1).padStart(2, '0')}</span>
        <span aria-hidden className="mt-0.5 h-11 w-px shrink-0 bg-white/20" />
        <div className="min-w-0">
          <h3 className="m-0 text-[clamp(15px,1.4vw,19px)] font-extrabold leading-[1.2] tracking-[-.02em]">{b.title}</h3>
          <p className="m-0 mt-1.5 text-[13.5px] leading-[1.45] text-white/60 sm:text-[14px]">{b.text}</p>
        </div>
      </div>
      {/* Add each book’s checkout link here later. */}
      <button type="button" data-track={`buy-book-${n + 1}`} className={`mt-4 inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-full border border-white/25 py-1 pl-5 pr-1 text-[14px] font-bold text-white transition-colors duration-300 hover:border-[#a4be2d] hover:bg-[#a4be2d] hover:text-[#101310] sm:mt-5 ${focus}`}>
        Buy this book
        <span aria-hidden className="grid size-9 place-items-center rounded-full bg-[#a4be2d] text-[#101310]"><ArrowUpRight size={15} /></span>
      </button>
    </article>
  )
}

function Collection() {
  const ref = useRef(null)
  const track = useRef(null)
  const reduce = useReducedMotion()
  const [dims, setDims] = useState({ max: 0, vh: 0 })
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useEffect(() => {
    const measure = () => { if (track.current) setDims({ max: Math.max(0, track.current.scrollWidth - window.innerWidth), vh: window.innerHeight }) }
    measure()
    window.addEventListener('resize', measure)
    const t = setTimeout(measure, 700)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure)
    return () => { window.removeEventListener('resize', measure); clearTimeout(t) }
  }, [])
  const x = useTransform(p, [0, 1], [0, -dims.max])
  // Fast scrolling bends the shelf slightly, like a page being turned.
  const velocity = useSpring(useVelocity(p), { damping: 40, stiffness: 300 })
  const skewX = useTransform(velocity, [-0.6, 0.6], [5, -5])
  const count = useTransform(p, (v) => String(Math.max(1, Math.min(books.length, Math.round(v * books.length)))).padStart(2, '0'))
  const bar = useSpring(p, { stiffness: 140, damping: 26 })

  return (
    // Scroll length equals the sideways distance, so the shelf moves at the speed you scroll.
    <Stage id="collection" innerRef={ref} labelledby="collection-title" style={{ height: dims.vh ? dims.max + dims.vh : '300svh' }} className="bg-gradient-to-b from-[#0e2018] to-[#101310]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div aria-hidden className="absolute -left-40 top-0 size-[520px] rounded-full bg-[#153B2B]/70 blur-[120px]" />
        <motion.div ref={track} style={reduce ? { x } : { x, skewX }} className="relative flex w-max items-center gap-6 pb-6 pl-5 pr-[12vw] pt-6 sm:gap-8 sm:pl-12 xl:pl-[max(3rem,calc((100vw-1200px)/2+2.5rem))]">
          <div className="w-[80vw] shrink-0 pr-4 sm:w-[520px]">
            <Lines as="h2" id="collection-title" lines={['Ten books.', <span key="c" className="text-[#a4be2d]">Every part of building a business.</span>]} delay={100} className={`${headline} text-[clamp(28px,4vw,54px)]`} />
            <p className="m-0 mt-8 inline-flex items-center gap-3 text-base font-bold text-white/80">Keep scrolling <motion.span aria-hidden animate={reduce ? undefined : { x: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}><ArrowRight size={20} /></motion.span></p>
          </div>
          {books.map((b, n) => <BookCard key={b.title} b={b} n={n} />)}
          <div className={`shrink-0 pl-4 ${cardW}`}>
            <Book />
            <div className="mt-7"><Cta to="#pricing" track="cta-collection">Own all ten</Cta></div>
          </div>
        </motion.div>
        <div className={`${wrap} pointer-events-none absolute inset-x-0 bottom-5 flex items-center gap-4`}>
          <p className="m-0 text-sm font-extrabold tabular-nums text-[#a4be2d]"><motion.span>{count}</motion.span> <span className="text-white/40">/ {books.length}</span></p>
          <span aria-hidden className="relative block h-[3px] flex-1 overflow-hidden rounded-full bg-white/15"><motion.span style={{ scaleX: bar }} className="absolute inset-0 origin-left rounded-full bg-[#a4be2d]" /></span>
        </div>
      </div>
    </Stage>
  )
}

/* ---------- 4. The offer: one giant price in a panel with a travelling light on its edge ---------- */
function AnimatedPrice({ value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => `₹${Math.round(v).toLocaleString('en-IN')}`)
  useEffect(() => {
    if (!inView) return undefined
    const c = animate(mv, value, { duration: reduce ? 0 : 1.1, ease: EASE })
    return () => c.stop()
  }, [inView, value, reduce, mv])
  return <motion.span ref={ref}>{text}</motion.span>
}

// The book follows the pointer in 3D.
function Tilt({ children, className = '' }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 16 })
  const sy = useSpring(my, { stiffness: 120, damping: 16 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-14, 14])
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10])
  const move = (event) => {
    if (reduce || event.pointerType !== 'mouse') return
    const r = event.currentTarget.getBoundingClientRect()
    mx.set((event.clientX - r.left) / r.width - 0.5)
    my.set((event.clientY - r.top) / r.height - 0.5)
  }
  return (
    <div onPointerMove={move} onPointerLeave={() => { mx.set(0); my.set(0) }} style={{ perspective: 1200 }} className={className}>
      <motion.div style={reduce ? undefined : { rotateX, rotateY }}>{children}</motion.div>
    </div>
  )
}

function Offer() {
  const reduce = useReducedMotion()
  const formats = [
    { key: 'physical', name: 'Physical', price: num(PRICE.physical), regularPrice: REGULAR_PRICE.physical, to: ORDER.physical, track: 'cta-physical', tag: 'In print' },
    ...(DIGITAL_AVAILABLE ? [{ key: 'digital', name: 'Digital', price: num(PRICE.digital), regularPrice: REGULAR_PRICE.digital, to: ORDER.digital, track: 'cta-digital', tag: 'In digital format' }] : []),
  ]
  const [i, setI] = useState(0)
  const f = formats[i]
  const off = Math.round((1 - f.price / f.regularPrice) * 100)
  return (
    <Stage id="pricing" labelledby="pricing-title" className="bg-[#101310] py-20 sm:py-32">
      <span aria-hidden className="absolute left-1/2 top-1/2 -z-10 size-[80vw] max-h-[820px] max-w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#153B2B]/70 blur-[130px]" />
      <div className={wrap}>
        <div className="relative overflow-hidden rounded-[34px] p-px">
          <motion.span aria-hidden animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }} style={{ x: '-50%', y: '-50%', background: 'conic-gradient(from 0deg, rgba(255,255,255,.08) 0 60%, #a4be2d 82%, rgba(255,255,255,.08) 100%)' }} className="absolute left-1/2 top-1/2 aspect-square w-[200%]" />
          <div className="relative overflow-hidden rounded-[33px] bg-[#0f1a14]">
            <span aria-hidden className="pointer-events-none absolute -right-[10%] -top-[30%] size-[520px] rounded-full bg-[#a4be2d]/15 blur-[110px]" />
            <div className="relative grid items-center gap-x-10 gap-y-14 p-6 sm:p-10 lg:grid-cols-12 lg:p-14">
              <div className="min-w-0 lg:col-span-7">
                <Lines as="h2" id="pricing-title" lines={['Own the', <span key="p" className="text-[#a4be2d]">playbook.</span>]} delay={100} className={`${headline} text-[clamp(30px,4.5vw,60px)]`} />

                {formats.length > 1 && (
                  <div role="tablist" aria-label="Format" className="relative mt-8 inline-flex rounded-full border border-white/15 bg-white/5 p-1.5">
                    {formats.map((o, n) => (
                      <button key={o.key} type="button" role="tab" aria-selected={i === n} onClick={() => setI(n)} className={`relative min-h-11 rounded-full px-5 py-2.5 text-[15px] font-bold transition-colors duration-300 sm:px-6 ${i === n ? 'text-[#101310]' : 'text-white/70 hover:text-white'} ${focus}`}>
                        {i === n && <motion.span layoutId="fmt-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} aria-hidden className="absolute inset-0 rounded-full bg-[#a4be2d]" />}
                        <span className="relative">{o.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                <p className="m-0 mt-7 flex flex-wrap items-center gap-3 text-base font-semibold text-white/55" aria-label={`Regular price ₹${f.regularPrice.toLocaleString('en-IN')}`}>
                  <span>Regular price <del className="ml-1 tabular-nums">₹{f.regularPrice.toLocaleString('en-IN')}</del></span>
                  <span className="rounded-full bg-[#a4be2d] px-3 py-1 text-[13px] font-extrabold text-[#101310]">{off}% off</span>
                </p>
                <p className="m-0 mt-2 text-[clamp(56px,11vw,140px)] font-extrabold leading-[.9] tracking-[-.07em] text-[#a4be2d]" aria-live="polite"><AnimatedPrice value={f.price} /></p>

                <ul className="m-0 mt-8 flex list-none flex-wrap gap-2.5 p-0">
                  {['All 10 books', 'Case studies + frameworks', f.tag].map((item) => (
                    <li key={item} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[14.5px] font-bold">
                      <Check size={14} weight="bold" aria-hidden className="text-[#a4be2d]" />{item}
                    </li>
                  ))}
                </ul>
                <div className="mt-9 max-w-[420px]"><Cta to={f.to} track={f.track} full>Buy the {f.name.toLowerCase()} collection</Cta></div>
                <p className="m-0 mt-5 max-w-[34ch] text-[15px] font-semibold text-white/70">Costs less than one wrong decision.</p>
              </div>

              <div className="relative mx-auto w-full max-w-[240px] sm:max-w-[300px] lg:col-span-5">
                <Tilt>
                  <AnimatePresence mode="wait">
                    <motion.div key={f.key} initial={reduce ? false : { opacity: 0, rotateY: 70, scale: 0.9 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} exit={{ opacity: 0, rotateY: -70, scale: 0.9 }} transition={{ duration: 0.5, ease: EASE }} style={{ transformPerspective: 1200 }}>
                      <motion.div animate={reduce ? undefined : { y: [0, -12, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
                        {f.key === 'digital'
                          ? <div className="rounded-[30px] border-[12px] border-[#1c231d] bg-[#1c231d] shadow-[0_40px_60px_rgba(0,0,0,.5)]"><Book className="rounded-[14px] !drop-shadow-none" /></div>
                          : <Book />}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </Tilt>
                <Seal />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Stage>
  )
}

/* ---------- 5. Quick answers ---------- */
function FaqItem({ item, open, onToggle, index }) {
  return (
    <div className={`rounded-[22px] border transition-colors duration-300 ${open ? 'border-[#a4be2d]/50 bg-white/[.05]' : 'border-white/10 hover:border-white/25'}`}>
      <h3 className="m-0">
        <button type="button" aria-expanded={open} aria-controls={`faq-${index}`} onClick={onToggle} className={`flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 rounded-[22px] bg-transparent px-5 py-4 text-left text-[clamp(17px,1.8vw,23px)] font-bold leading-[1.3] tracking-[-.02em] text-white sm:px-7 ${focus}`}>
          {item.q}
          <motion.span aria-hidden animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease: EASE }} className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${open ? 'border-[#a4be2d] bg-[#a4be2d] text-[#101310]' : 'border-white/30'}`}><Plus size={16} weight="bold" /></motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={`faq-${index}`} role="region" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
            <p className="m-0 max-w-[58ch] px-5 pb-6 text-[16.5px] leading-[1.7] text-[#cdd8c6] sm:px-7">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <Stage labelledby="faq-title" className="bg-gradient-to-b from-[#101310] to-[#0e2018] py-20 sm:py-28">
      <div className={`${wrap} grid gap-x-16 gap-y-10 lg:grid-cols-12`}>
        <div className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <Lines as="h2" id="faq-title" lines={['Quick', <span key="a" className="text-[#a4be2d]">answers.</span>]} delay={100} className={`${headline} text-[clamp(30px,4.5vw,60px)]`} />
        </div>
        <div className="flex min-w-0 flex-col gap-3 lg:col-span-8">
          {faqs.map((item, n) => <FaqItem key={item.q} item={item} index={n} open={open === n} onToggle={() => setOpen(open === n ? -1 : n)} />)}
        </div>
      </div>
    </Stage>
  )
}

/* ---------- 6. Finale: the hero’s photo returns, the words light up, the logo closes the page ---------- */
// A round button with text circling it.
function RoundBuy({ to }) {
  return (
    <Magnetic className="inline-flex">
      <Link to={to} data-track="cta-final" aria-label="Buy the Founderverse collection" className={`group relative grid size-[170px] place-items-center rounded-full bg-[#a4be2d] text-[#101310] no-underline sm:size-[210px] ${focus}`}>
        <svg aria-hidden viewBox="0 0 200 200" className="fv-orbit absolute inset-0 size-full">
          <defs><path id="fv-circ" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" /></defs>
          <text fill="currentColor" fontSize="15" fontWeight="800"><textPath href="#fv-circ" textLength="496" lengthAdjust="spacing">Buy now · 10 books · Buy now · 10 books ·</textPath></text>
        </svg>
        <span className="grid size-[72px] place-items-center rounded-full bg-[#101310] text-[#a4be2d] transition-transform duration-300 group-hover:rotate-45 sm:size-20"><ArrowUpRight size={32} aria-hidden /></span>
      </Link>
    </Magnetic>
  )
}

function Finale() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const bg = useScroll({ target: ref, offset: ['start end', 'end start'] }).scrollYProgress
  const imgY = useTransform(bg, [0, 1], ['-8%', '8%'])
  return (
    <Stage id="finale" innerRef={ref} labelledby="finale-title" className="bg-[#0e2018] px-5 pb-16 pt-28 text-center sm:pb-20 sm:pt-40">
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <motion.img src={HERO_IMAGE} alt="" loading="lazy" decoding="async" draggable={false} onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} style={reduce ? { scale: 1.2 } : { y: imgY, scale: 1.2 }} className="size-full object-cover opacity-30 saturate-[.8]" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,#0e2018_0%,#101310b3_40%,#101310_100%)]" />
      <motion.div aria-hidden animate={reduce ? undefined : { scale: [1, 1.2, 1], opacity: [0.35, 0.65, 0.35] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-1/2 top-1/2 -z-10 size-[min(460px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a4be2d]/20 blur-[110px]" />
      <Lit id="finale-title" lines={[{ t: 'Build with knowledge.' }, { t: 'Learn from mistakes.' }, { t: 'Grow with intention.', accent: true }]} className={`m-0 text-[clamp(30px,5.6vw,80px)] ${headline}`} />
      <div className="mt-14 flex justify-center"><RoundBuy to={ORDER.physical} /></div>
      <img src={LOGO_IMAGE} alt="Founderverse" loading="lazy" className="mx-auto mt-20 h-14 w-auto object-contain opacity-80 sm:mt-28 sm:h-20" />
    </Stage>
  )
}

// A buy button that follows the visitor once the hero is behind them, and steps aside at the offer and the finale.
function StickyBuy() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const inside = (id) => {
      const el = document.getElementById(id)
      if (!el) return false
      const r = el.getBoundingClientRect()
      return r.top < window.innerHeight * 0.6 && r.bottom > 0
    }
    const check = () => setShow(window.scrollY > window.innerHeight * 0.9 && !inside('pricing') && !inside('finale'))
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:justify-end sm:px-8">
          <Link to={ORDER.physical} data-track="cta-sticky" className={`group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#a4be2d] py-1.5 pl-6 pr-1.5 text-[15px] font-extrabold text-[#101310] no-underline shadow-[0_12px_40px_rgba(0,0,0,.35)] transition-colors hover:bg-[#bfd85a] ${focus}`}>
            Buy the collection
            <span className="grid size-9 place-items-center rounded-full bg-[#101310] text-[#a4be2d] transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight size={16} aria-hidden /></span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Founderverse() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })
  useEffect(() => { document.title = 'Founderverse | Hashir Usman' }, [])
  return (
    <main id="main" className="fv-root overflow-x-clip bg-[#101310] text-white">
      <style>{CSS}</style>
      <motion.div aria-hidden style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-[#a4be2d]" />
      <Hero />
      <Problem />
      <Collection />
      <Offer />
      <Faq />
      <Finale />
      <StickyBuy />
    </main>
  )
}
