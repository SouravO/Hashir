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
const PRICE = { physical: '₹5,000', digital: '₹3,500' }
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
  { q: 'Who is Founder Versa for?', a: 'Aspiring and early-stage founders who want to make better decisions. No prior experience needed.' },
  { q: 'Physical, digital, or both?', a: DIGITAL_AVAILABLE ? `A physical collection at ${PRICE.physical} and a digital collection at ${PRICE.digital}.` : `A physical collection at ${PRICE.physical}.` },
  { q: 'How is this different from free resources?', a: 'Free resources can be great. This is an organised starting point: the essentials in one place, with case studies and frameworks to return to.' },
  { q: 'How do delivery, payment and refunds work?', a: TERMS_PENDING },
]

/* ---------- Style helpers ---------- */
const EASE = [0.16, 1, 0.3, 1]
const VIEW = { once: true, margin: '0px 0px -8% 0px' }
const wrap = 'mx-auto w-full max-w-[1200px] px-5 sm:px-8 xl:px-10'
const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4be2d]'
const h2 = 'text-[clamp(30px,4.4vw,62px)] font-extrabold leading-[1.04] tracking-[-.04em]'
const num = (s) => parseInt(s.replace(/\D/g, ''), 10)

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,600;1,9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap');
.fv-root{font-family:'Manrope',system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.fv-serif{font-family:'Fraunces',Georgia,'Times New Roman',serif;font-style:italic;font-weight:600;letter-spacing:-.02em}
@keyframes fv-caret{50%{opacity:0}}
.fv-caret{animation:fv-caret 1s steps(1) infinite}
@keyframes fv-orbit{to{transform:rotate(360deg)}}
.fv-orbit{animation:fv-orbit 14s linear infinite}
@media (prefers-reduced-motion:reduce){.fv-caret,.fv-orbit{animation:none}.fv-marq{overflow-x:auto}}
`

/* ---------- Motion primitives ---------- */
function Reveal({ as = 'div', delay = 0, y = 24, className = '', children, ...rest }) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag initial={reduce ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEW} transition={{ duration: 0.8, delay: delay / 1000, ease: EASE }} className={className} {...rest}>
      {children}
    </Tag>
  )
}

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
    <img src={BOOK_IMAGE} alt="Founder Versa book cover" decoding="async" draggable={false} onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} style={{ filter: 'drop-shadow(0 36px 40px rgba(0,0,0,.5))' }} className={`block h-auto w-full rounded-[6px] ${className}`} />
  )
}

/* ---------- 1. Hero: questions type out full screen, then the book lands ---------- */
function Typed({ text, accent, onDone }) {
  const [n, setN] = useState(0)
  const done = useRef(onDone)
  done.current = onDone
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
    <p className={`relative m-0 text-[clamp(38px,7.4vw,112px)] font-extrabold leading-[1.04] tracking-[-.04em] ${accent ? 'text-[#a4be2d]' : 'text-white'}`}>
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
        <text fill="currentColor" fontSize="14" fontWeight="800"><textPath href="#fv-seal" textLength="496" lengthAdjust="spacing">Founder Versa · 10 books · Founder Versa · 10 books ·</textPath></text>
      </svg>
      <span className="fv-serif text-[34px] leading-none sm:text-[40px]">10</span>
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
    <span className="fv-serif relative inline-block text-[#a4be2d]">
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
  const done = stage >= QUESTIONS.length
  useEffect(() => { if (reduce) setStage(QUESTIONS.length) }, [reduce])
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
    <section aria-label="Founder Versa" onPointerMove={onMove} className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-[#101310] text-white lg:min-h-[100svh]">
      <div className="absolute inset-0 -z-20">
        <img src={HERO_IMAGE} alt="" decoding="async" draggable={false} onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} className="size-full object-cover saturate-[.8]" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(95deg,#101310_0%,#101310f0_40%,#101310c0_75%,#101310e0_100%)]" />
      <motion.div aria-hidden style={{ background: glow }} className="absolute inset-0 -z-10" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[.09] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />

      <div className={`${wrap} pt-3 sm:pt-8`}><img src={LOGO_IMAGE} alt="Founder Versa" className="h-10 w-auto object-contain sm:h-16" /></div>

      <div className={`${wrap} flex flex-1 items-center py-3 sm:py-10`}>
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={stage} initial={reduce ? false : { opacity: 0, filter: 'blur(12px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -40, filter: 'blur(12px)' }} transition={{ duration: 0.5, ease: EASE }} className="w-full max-w-[1000px]">
              <Typed text={QUESTIONS[stage]} accent={stage === QUESTIONS.length - 1} onDone={() => setStage((s) => s + 1)} />
            </motion.div>
          ) : (
            <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="grid w-full items-center gap-3 sm:gap-14 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-7">
                <h1 className="m-0 text-[clamp(36px,9vw,58px)] font-extrabold leading-[.98] tracking-[-.045em] lg:text-[clamp(40px,5.6vw,84px)]">
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
                  <Cta to={ORDER.physical} track="cta-hero" className="max-sm:min-h-11 max-sm:gap-2 max-sm:pl-4 max-sm:text-[13px]">Buy the collection</Cta>
                </motion.div>
              </div>
              <div className="mx-auto w-full max-w-[220px] sm:max-w-[300px] lg:col-span-5 lg:max-w-none"><BookFan /></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!done && (
        <div className={`${wrap} pb-6`}>
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
const stackTones = ['bg-[#101310]', 'bg-[#153B2B]', 'bg-[#101310]', 'bg-[#153B2B]']

function StackCard({ i, n, p, children, tone }) {
  const reduce = useReducedMotion()
  const scale = useTransform(p, [i / n, 1], [1, 1 - (n - 1 - i) * 0.04])
  return (
    <div className="sticky mb-[12svh] last:mb-0" style={{ top: `calc(5.5rem + ${i * 14}px)` }}>
      <motion.div style={reduce ? undefined : { scale, transformOrigin: 'top center' }} className={`relative overflow-hidden rounded-[26px] border border-white/10 p-6 shadow-[0_24px_60px_rgba(16,19,16,.28)] sm:p-9 ${tone}`}>
        <motion.span aria-hidden initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: '0px 0px -20% 0px' }} transition={{ duration: 1.2, ease: EASE }} className="absolute inset-x-0 top-0 block h-[2px] origin-left bg-[#a4be2d]" />
        {children}
      </motion.div>
    </div>
  )
}

function Problem() {
  const list = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: list, offset: ['start 30%', 'end 70%'] })
  const n = costs.length + 1
  return (
    <>
      <div className="relative overflow-hidden bg-[#101310] py-12 sm:py-16" aria-label="Questions every founder has">
        <Marquee items={questionRows[0]} className="-mx-10 w-[calc(100%+5rem)] -rotate-2 bg-[#a4be2d] text-[#101310]" />
        <Marquee items={questionRows[1]} reverse className="relative -mx-10 -mt-6 w-[calc(100%+5rem)] rotate-1 border-y border-white/20 bg-[#153B2B] text-white" />
      </div>

      <section aria-labelledby="problem-title" className="bg-[#F2F3EF] pb-20 pt-20 text-[#101310] sm:pb-28 sm:pt-28">
        <div className={wrap}>
          <div className="grid items-end gap-x-12 gap-y-5 lg:grid-cols-12">
            <Lines as="h2" id="problem-title" lines={['Learning on the job', <span key="p" className="fv-serif text-[#617319]">is the expensive way.</span>]} delay={100} className={`lg:col-span-8 ${h2}`} />
            <Reveal as="p" delay={250} className="m-0 text-[17px] font-medium leading-[1.6] text-[#4a4f47] lg:col-span-4">Four mistakes founders pay for. Each one has a fix.</Reveal>
          </div>

          <div ref={list} className="mt-12 sm:mt-16">
            {costs.map((item, i) => {
              const { Icon } = item
              const fix = books[COST_FIX[i]]
              return (
                <StackCard key={item.a} i={i} n={n} p={p} tone={stackTones[i]}>
                  <div className="grid gap-8 text-white md:grid-cols-12 md:gap-12">
                    <div className="md:col-span-7">
                      <div className="flex items-center gap-4">
                        <span aria-hidden className="grid size-11 place-items-center rounded-full bg-[#a4be2d] text-[#101310]"><Icon size={22} weight="bold" /></span>
                        <span className="text-sm font-bold tabular-nums text-white/50">{i + 1} / {costs.length}</span>
                      </div>
                      <h3 className="m-0 mt-8 text-[clamp(30px,4vw,58px)] font-extrabold leading-[1.02] tracking-[-.04em]">
                        {item.a}<br /><span className="fv-serif text-[#a4be2d]">{item.b}</span>
                      </h3>
                    </div>
                    <div className="flex flex-col justify-between gap-8 md:col-span-5 md:border-l md:border-white/15 md:pl-10">
                      <p className="m-0 text-[clamp(16px,1.5vw,19px)] leading-[1.65] text-[#cdd8c6]">{item.text}</p>
                      <p className="m-0 inline-flex w-fit items-center gap-3 rounded-full border border-white/20 py-2 pl-2 pr-5 text-[14.5px] font-semibold">
                        <span aria-hidden className="grid size-7 place-items-center rounded-full bg-[#a4be2d] text-[#101310]"><Check size={13} weight="bold" /></span>
                        Fixed in {fix.title}
                      </p>
                    </div>
                  </div>
                </StackCard>
              )
            })}

            <StackCard i={n - 1} n={n} p={p} tone="bg-[#a4be2d] !border-[#a4be2d]">
              <div className="grid items-end gap-8 text-[#101310] md:grid-cols-12 md:gap-12">
                <h3 className="m-0 text-[clamp(30px,4vw,58px)] font-extrabold leading-[1.02] tracking-[-.04em] md:col-span-8">
                  Ten books.<br /><span className="fv-serif">Every part of building a business.</span>
                </h3>
                <div className="md:col-span-4 md:justify-self-end"><Cta to="#collection" tone="dark" track="cta-problem">See the collection</Cta></div>
              </div>
            </StackCard>
          </div>
        </div>
      </section>
    </>
  )
}

/* ---------- 3. The collection: scroll down, the shelf slides sideways ---------- */
const cardW = 'w-[min(62vw,290px,31svh)]'

function BookCard({ b, n }) {
  return (
    <article className={`group relative shrink-0 ${cardW}`}>
      <div className="relative">
        <Book className="relative z-10 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:-rotate-1" />
        <span aria-hidden className="pointer-events-none absolute inset-x-[8%] -bottom-3 z-0 h-6 rounded-[50%] bg-black/70 blur-xl transition-all duration-500 group-hover:scale-90 group-hover:opacity-60" />
        <span aria-hidden className="pointer-events-none absolute inset-0 z-20 rounded-[6px] bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,.2)_48%,transparent_62%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="mt-7 flex items-start gap-4">
        <span aria-hidden className="fv-serif text-[34px] leading-[.9] text-[#a4be2d]">{String(n + 1).padStart(2, '0')}</span>
        <span aria-hidden className="mt-0.5 h-11 w-px shrink-0 bg-white/20" />
        <div className="min-w-0">
          <h3 className="m-0 text-[clamp(16px,1.4vw,19px)] font-extrabold leading-[1.2] tracking-[-.02em]">{b.title}</h3>
          <p className="m-0 mt-1.5 text-[14px] leading-[1.45] text-white/60">{b.text}</p>
        </div>
      </div>
      {/* Add each book’s checkout link here later. */}
      <button type="button" data-track={`buy-book-${n + 1}`} className={`mt-5 inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-full border border-white/25 py-1 pl-5 pr-1 text-[14px] font-bold text-white transition-colors duration-300 hover:border-[#a4be2d] hover:bg-[#a4be2d] hover:text-[#101310] ${focus}`}>
        Buy this book
        <span aria-hidden className="grid size-9 place-items-center rounded-full bg-[#a4be2d] text-[#101310]"><ArrowUpRight size={15} /></span>
      </button>
    </article>
  )
}

function Collection() {
  const ref = useRef(null)
  const track = useRef(null)
  const [dims, setDims] = useState({ max: 0, vh: 0 })
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useEffect(() => {
    const measure = () => { if (track.current) setDims({ max: Math.max(0, track.current.scrollWidth - window.innerWidth), vh: window.innerHeight }) }
    measure()
    window.addEventListener('resize', measure)
    const t = setTimeout(measure, 700)
    return () => { window.removeEventListener('resize', measure); clearTimeout(t) }
  }, [])
  const x = useTransform(p, [0, 1], [0, -dims.max])
  const count = useTransform(p, (v) => String(Math.max(1, Math.min(books.length, Math.round(v * books.length)))).padStart(2, '0'))
  const bar = useSpring(p, { stiffness: 140, damping: 26 })

  return (
    // Scroll length equals the sideways distance, so the shelf moves at the speed you scroll.
    <section id="collection" ref={ref} aria-labelledby="collection-title" style={{ height: dims.vh ? dims.max + dims.vh : '300svh' }} className="relative bg-[#101310] text-white">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div aria-hidden className="absolute -left-40 top-0 size-[520px] rounded-full bg-[#153B2B]/80 blur-[120px]" />
        <motion.div ref={track} style={{ x }} className="relative flex w-max items-center gap-6 pl-5 pr-[12vw] pt-6 sm:gap-8 sm:pl-12 xl:pl-[max(3rem,calc((100vw-1200px)/2+2.5rem))]">
          <div className="w-[80vw] shrink-0 pr-4 sm:w-[500px]">
            <Lines as="h2" id="collection-title" lines={['Ten books.', <span key="c" className="fv-serif text-[#a4be2d]">Every part of building a business.</span>]} delay={100} className={h2} />
            <p className="m-0 mt-8 inline-flex items-center gap-3 text-base font-bold text-white/80">Keep scrolling <motion.span aria-hidden animate={{ x: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}><ArrowRight size={20} /></motion.span></p>
          </div>
          {books.map((b, n) => <BookCard key={b.title} b={b} n={n} />)}
          <div className={`shrink-0 pl-4 ${cardW}`}>
            <Book />
            <div className="mt-7"><Cta to="#pricing" track="cta-collection">Own all ten</Cta></div>
          </div>
        </motion.div>
        <div className={`${wrap} pointer-events-none absolute inset-x-0 bottom-6 flex items-center gap-4`}>
          <p className="m-0 text-sm font-extrabold tabular-nums text-[#a4be2d]"><motion.span>{count}</motion.span> <span className="text-white/40">/ {books.length}</span></p>
          <span aria-hidden className="relative block h-[3px] flex-1 overflow-hidden rounded-full bg-white/15"><motion.span style={{ scaleX: bar }} className="absolute inset-0 origin-left rounded-full bg-[#a4be2d]" /></span>
        </div>
      </div>
    </section>
  )
}

/* ---------- 4. The offer: one giant price, flip between formats ---------- */
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

function Offer() {
  const reduce = useReducedMotion()
  const formats = [
    { key: 'physical', name: 'Physical', price: num(PRICE.physical), to: ORDER.physical, track: 'cta-physical', tag: 'In print' },
    ...(DIGITAL_AVAILABLE ? [{ key: 'digital', name: 'Digital', price: num(PRICE.digital), to: ORDER.digital, track: 'cta-digital', tag: 'In digital format' }] : []),
  ]
  const [i, setI] = useState(0)
  const f = formats[i]
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative isolate scroll-mt-0 overflow-hidden bg-[#a4be2d] py-20 text-[#101310] sm:py-28">
      <span aria-hidden className="pointer-events-none absolute -right-[8%] -top-[12%] -z-10 size-[60vw] max-h-[720px] max-w-[720px] rounded-full bg-[#bfd85a]" />
      <div className={`${wrap} grid items-center gap-x-10 gap-y-12 lg:grid-cols-12`}>
        <div className="lg:col-span-7">
          <Lines as="h2" id="pricing-title" lines={['Own the', <span key="p" className="fv-serif">playbook.</span>]} delay={100} className={h2} />

          {formats.length > 1 && (
            <div role="tablist" aria-label="Format" className="relative mt-9 inline-flex rounded-full bg-[#101310] p-1.5">
              {formats.map((o, n) => (
                <button key={o.key} type="button" role="tab" aria-selected={i === n} onClick={() => setI(n)} className={`relative rounded-full px-6 py-3 text-[15px] font-bold transition-colors duration-300 ${i === n ? 'text-[#101310]' : 'text-white/70 hover:text-white'} ${focus}`}>
                  {i === n && <motion.span layoutId="fmt-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} aria-hidden className="absolute inset-0 rounded-full bg-[#a4be2d]" />}
                  <span className="relative">{o.name}</span>
                </button>
              ))}
            </div>
          )}

          <p className="m-0 mt-6 text-[clamp(72px,14vw,176px)] font-extrabold leading-[.88] tracking-[-.07em]" aria-live="polite"><AnimatedPrice value={f.price} /></p>

          <ul className="m-0 mt-8 flex list-none flex-wrap gap-2.5 p-0">
            {['All 10 books', 'Case studies + frameworks', f.tag].map((item) => (
              <li key={item} className="inline-flex items-center gap-2 rounded-full border border-[#101310]/25 px-4 py-2 text-[15px] font-bold">
                <Check size={14} weight="bold" aria-hidden />{item}
              </li>
            ))}
          </ul>
          <div className="mt-9 max-w-[420px]"><Cta to={f.to} tone="dark" track={f.track} full>Buy the {f.name.toLowerCase()} collection</Cta></div>
          <p className="m-0 mt-5 max-w-[34ch] text-[15px] font-semibold text-[#101310]/75">Costs less than one wrong decision.</p>
        </div>

        <div className="mx-auto w-full max-w-[260px] sm:max-w-[320px] lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div key={f.key} initial={reduce ? false : { opacity: 0, rotateY: 70, scale: 0.9 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} exit={{ opacity: 0, rotateY: -70, scale: 0.9 }} transition={{ duration: 0.5, ease: EASE }} style={{ transformPerspective: 1200 }}>
              <motion.div animate={reduce ? undefined : { y: [0, -12, 0], rotate: [-2, 2, -2] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}>
                {f.key === 'digital'
                  ? <div className="rounded-[30px] border-[12px] border-[#101310] bg-[#101310] shadow-[0_40px_60px_rgba(0,0,0,.3)]"><Book className="rounded-[14px] !drop-shadow-none" /></div>
                  : <Book />}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ---------- 5. Quick answers, then the closing call to action ---------- */
function FaqItem({ item, open, onToggle, index }) {
  return (
    <Reveal delay={index * 50} className="border-t border-white/15">
      <button type="button" aria-expanded={open} aria-controls={`faq-${index}`} onClick={onToggle} className={`flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 bg-transparent py-4 text-left text-[clamp(18px,1.8vw,24px)] font-bold leading-[1.3] tracking-[-.02em] text-white ${focus}`}>
        {item.q}
        <motion.span aria-hidden animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease: EASE }} className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${open ? 'border-[#a4be2d] bg-[#a4be2d] text-[#101310]' : 'border-white/30'}`}><Plus size={16} weight="bold" /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={`faq-${index}`} role="region" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="overflow-hidden">
            <p className="m-0 max-w-[58ch] pb-6 text-[17px] leading-[1.7] text-[#cdd8c6]">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  )
}

function Word({ progress, range, accent, children }) {
  const reduce = useReducedMotion()
  const opacity = useTransform(progress, range, [0.15, 1])
  return <motion.span style={reduce ? undefined : { opacity }} className={`mr-[.25em] inline-block ${accent ? 'text-[#a4be2d]' : ''}`}>{children}</motion.span>
}

// A round button with text circling it.
function RoundBuy({ to }) {
  return (
    <Magnetic className="inline-flex">
      <Link to={to} data-track="cta-final" aria-label="Buy the Founder Versa collection" className={`group relative grid size-[170px] place-items-center rounded-full bg-[#a4be2d] text-[#101310] no-underline sm:size-[210px] ${focus}`}>
        <svg aria-hidden viewBox="0 0 200 200" className="fv-orbit absolute inset-0 size-full">
          <defs><path id="fv-circ" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" /></defs>
          <text fill="currentColor" fontSize="15" fontWeight="800"><textPath href="#fv-circ" textLength="496" lengthAdjust="spacing">Buy now · 10 books · Buy now · 10 books ·</textPath></text>
        </svg>
        <span className="grid size-[72px] place-items-center rounded-full bg-[#101310] text-[#a4be2d] transition-transform duration-300 group-hover:rotate-45 sm:size-20"><ArrowUpRight size={32} aria-hidden /></span>
      </Link>
    </Magnetic>
  )
}

// Headline words light up one by one as the section scrolls into the middle of the screen.
function Finale() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const words = useScroll({ target: ref, offset: ['start 80%', 'center 50%'] }).scrollYProgress
  const bg = useScroll({ target: ref, offset: ['start end', 'end start'] }).scrollYProgress
  const imgY = useTransform(bg, [0, 1], ['-8%', '8%'])
  const lines = [{ text: 'Build with knowledge.' }, { text: 'Learn from mistakes.' }, { text: 'Grow with intention.', accent: true }]
  const total = lines.reduce((sum, l) => sum + l.text.split(' ').length, 0)
  let count = 0
  return (
    <div id="finale" ref={ref} className="relative isolate mt-20 overflow-hidden px-5 py-24 text-center sm:mt-28 sm:py-36">
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <motion.img src={HERO_IMAGE} alt="" loading="lazy" decoding="async" draggable={false} onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} style={reduce ? { scale: 1.2 } : { y: imgY, scale: 1.2 }} className="size-full object-cover opacity-30 saturate-[.8]" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,#101310_0%,#101310b3_40%,#101310_100%)]" />
      <motion.div aria-hidden animate={reduce ? undefined : { scale: [1, 1.2, 1], opacity: [0.35, 0.65, 0.35] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-1/2 top-1/2 -z-10 size-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#153B2B] blur-[110px]" />
      <h2 className="m-0 text-[clamp(32px,6vw,84px)] font-extrabold leading-[1.04] tracking-[-.045em]">
        {lines.map((line) => (
          <span key={line.text} className="block">
            {line.text.split(' ').map((word) => {
              const start = (count / total) * 0.7
              count += 1
              return <Word key={`${line.text}-${word}`} progress={words} range={[start, start + 0.3]} accent={line.accent}>{word}</Word>
            })}
          </span>
        ))}
      </h2>
      <Reveal delay={200} className="mt-14 flex justify-center"><RoundBuy to={ORDER.physical} /></Reveal>
    </div>
  )
}

function Closing() {
  const [open, setOpen] = useState(0)
  return (
    <section aria-labelledby="faq-title" className="bg-[#101310] py-20 text-white sm:py-28">
      <div className={`${wrap} grid gap-x-16 gap-y-10 lg:grid-cols-12`}>
        <div className="lg:col-span-4"><Lines as="h2" id="faq-title" lines={['Quick', <span key="a" className="fv-serif text-[#a4be2d]">answers.</span>]} delay={100} className={h2} /></div>
        <div className="lg:col-span-8">
          <div className="border-b border-white/15">
            {faqs.map((item, n) => <FaqItem key={item.q} item={item} index={n} open={open === n} onToggle={() => setOpen(open === n ? -1 : n)} />)}
          </div>
        </div>
      </div>
      <Finale />
    </section>
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
  useEffect(() => { document.title = 'Founder Versa | Hashir Usman' }, [])
  return (
    <main id="main" className="fv-root overflow-x-clip bg-[#101310] text-white">
      <style>{CSS}</style>
      <motion.div aria-hidden style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-[#a4be2d]" />
      <Hero />
      <Problem />
      <Collection />
      <Offer />
      <Closing />
      <StickyBuy />
    </main>
  )
}
