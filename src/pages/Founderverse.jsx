import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChartLineUp, Check, CurrencyInr, Lightbulb, Megaphone, Plus } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

/* ---------- Assets already used in the project ---------- */
const HERO_IMAGE = '/founderverse.png'
const BOOK_IMAGE = '/book.png'
const LOGO_IMAGE = '/fv-logo.png'

/* ---------- Offer settings: confirm these before launch ---------- */
// Where the buy buttons go. Point them at the real checkout links when they exist.
const ORDER = { physical: '/contact', digital: '/contact' }
// Set to false to hide the digital collection if that format is no longer offered.
const DIGITAL_AVAILABLE = true
const PRICE = { physical: '₹5,000', digital: '₹3,500' }
// Shown for delivery, payment and refund questions until the real terms are confirmed.
const TERMS_PENDING = 'These details will be confirmed before launch.'

/* ---------- Content (condensed from the Founder Versa landing page brief) ---------- */
const proof = ['10 Books', 'Startup Case Studies', 'Business Frameworks', 'Practical Knowledge']

// Floating chips around the hero book (hidden on very small screens by size, kept short).
const chips = [
  { label: 'Case studies', cls: 'right-[-10%] top-[-3%]', d: 5 },
  { label: 'Frameworks', cls: 'right-[-14%] top-[52%]', d: 6.5 },
  { label: 'Cash flow', cls: 'left-[-10%] bottom-[8%]', d: 5.8 },
]

// Two rows for the scrolling question band.
const questionRows = [
  [
    'How to validate your idea before investing in it?',
    'How to find your first customers?',
    'How to market a product people actually want?',
  ],
  [
    'How to understand cash flow before money runs out?',
    'How to approach investors and understand what they’re looking for?',
    'How to build a business that survives its first few months?',
  ],
]

const costs = [
  { title: 'Idea without validation', text: 'You invest time and money before knowing whether customers want it.' },
  { title: 'Marketing without strategy', text: 'You spend on customers without understanding positioning or what makes people buy.' },
  { title: 'Revenue without clarity', text: 'Sales come in, but margins and cash flow stay a mystery.' },
  { title: 'Growth without foundation', text: 'You scale before your product and operations are ready.' },
]
const costIcons = [Lightbulb, Megaphone, CurrencyInr, ChartLineUp]

// To show a real cover for a book, add cover: '/books/01.png' (or similar) to its entry.
const books = [
  { title: 'Startup Fundamentals', text: 'Understand the building blocks of entrepreneurship, idea validation, and turning a problem into a potential business.' },
  { title: 'Business Models', text: 'Learn how businesses create value, reach customers, and generate revenue.' },
  { title: 'Marketing & Growth', text: 'Explore positioning, customer acquisition, distribution, and strategies for reaching the right audience.' },
  { title: 'Customer Acquisition', text: 'Understand customer needs, buying behaviour, and ways to attract and retain customers.' },
  { title: 'Finance & Financial Planning', text: 'Learn essential business numbers, budgeting, cash flow, margins, and financial planning.' },
  { title: 'Fundraising & Investors', text: 'Explore startup funding concepts, investor expectations, and how founders prepare for fundraising.' },
  { title: 'Team & Leadership', text: 'Understand team building, leadership, decision-making, and working with people.' },
  { title: 'Operations & Execution', text: 'Learn about systems, processes, priorities, and the practical work involved in running a business.' },
  { title: 'Startup Case Studies', text: 'Study business examples to understand decisions, challenges, strategies, and lessons from the real world.' },
  { title: 'Scaling & Long-Term Growth', text: 'Explore the foundations of sustainable growth, expansion, and building a business for the long term.' },
]

const reasons = [
  'One structured collection, not scattered advice',
  'Case studies and frameworks you can apply',
  'A reference library to return to as you grow',
]

const faqs = [
  { q: 'Who is Founder Versa for?', a: 'Aspiring and early-stage founders who want to understand business fundamentals and make more informed decisions. No prior experience is needed, and the concepts stay useful as a reference library as you grow.' },
  { q: 'What is included in the collection?', a: `Ten startup-focused books: ${books.map((b) => b.title).join(', ')}.` },
  { q: 'Is it physical, digital, or both?', a: DIGITAL_AVAILABLE ? `There is a physical collection at ${PRICE.physical} and a digital collection at ${PRICE.digital}.` : `There is a physical collection at ${PRICE.physical}.` },
  { q: 'How is this different from free online resources?', a: 'Free resources can be valuable. Founder Versa is for people who want a more organized starting point: essential concepts in one place, startup case studies, and frameworks you can return to.' },
  { q: 'How do delivery, payment and refunds work?', a: TERMS_PENDING },
]

/* ---------- Style helpers ---------- */
const EASE = [0.16, 1, 0.3, 1]
const VIEW = { once: true, margin: '0px 0px -8% 0px' }
const wrap = 'mx-auto w-full max-w-[1200px] px-5 sm:px-8 xl:px-10'
const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4be2d]'
const band = 'py-16 sm:py-20 lg:py-24'
const h2 = 'text-[clamp(30px,4vw,52px)] font-bold leading-[1.1] tracking-[-.03em]'
const lead = 'text-[clamp(20px,2.2vw,28px)] font-semibold leading-[1.3] tracking-[-.02em]'
const copyLight = 'text-[17px] leading-[1.75] text-[#4a4f47]'
const copyDark = 'text-[17px] leading-[1.75] text-[#cdd8c6]'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
.fv-root{font-family:'Manrope',system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.fv-fade{-webkit-mask-image:linear-gradient(to right,transparent,#000 7%,#000 93%,transparent);mask-image:linear-gradient(to right,transparent,#000 7%,#000 93%,transparent)}
.fv-scroll{scrollbar-width:none}
.fv-scroll::-webkit-scrollbar{display:none}
@keyframes fv-spin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
.fv-spin{transform:translate(-50%,-50%);animation:fv-spin 7s linear infinite}
@media (prefers-reduced-motion:reduce){.fv-spin{animation:none}.fv-marq{overflow-x:auto}}
`

/* ---------- Motion primitives ---------- */
function Reveal({ as = 'div', delay = 0, y = 24, className = '', children, ...rest }) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: 0.8, delay: delay / 1000, ease: EASE }}
      className={className}
      {...rest}
    >
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
        // The in-view trigger sits on the clip wrapper. A child translated out of its
        // overflow-hidden parent counts as "not visible" and would never animate in.
        <motion.span
          key={index}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={VIEW}
          className="-my-[.1em] block overflow-hidden py-[.1em]"
        >
          <motion.span
            variants={{
              hidden: { y: '110%' },
              show: { y: 0, transition: { duration: 1, delay: (delay + index * step) / 1000, ease: EASE } },
            }}
            className="block"
          >
            {line}
          </motion.span>
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
  const reset = () => { x.set(0); y.set(0) }
  return <motion.div style={{ x: sx, y: sy }} onPointerMove={move} onPointerLeave={reset} className={className}>{children}</motion.div>
}

function Cta({ to, children, track, tone = 'lime', full = false }) {
  const tones = {
    lime: { btn: 'border-[#a4be2d] bg-[#a4be2d] text-[#101310] hover:border-[#bfd85a] hover:bg-[#bfd85a]', dot: 'bg-[#101310] text-[#a4be2d]' },
    dark: { btn: 'border-[#101310] bg-[#101310] text-white hover:border-[#153B2B] hover:bg-[#153B2B]', dot: 'bg-[#a4be2d] text-[#101310]' },
    outline: { btn: 'border-white/30 bg-transparent text-white hover:border-[#a4be2d] hover:bg-[#a4be2d] hover:text-[#101310]', dot: 'bg-[#a4be2d] text-[#101310]' },
  }
  const t = tones[tone]
  const cls = `group inline-flex min-h-14 items-center gap-4 rounded-full border py-1.5 pl-7 pr-1.5 text-left text-[15px] font-semibold leading-tight no-underline transition-[background-color,border-color,color] duration-300 active:scale-[.98] ${full ? 'w-full justify-between' : ''} ${t.btn} ${focus}`
  const body = (
    <>
      {children}
      <span className={`grid size-11 shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${t.dot}`}>
        <ArrowUpRight size={18} aria-hidden />
      </span>
    </>
  )
  return (
    <Magnetic className={full ? 'w-full' : 'inline-flex'}>
      {to.startsWith('/')
        ? <Link to={to} data-track={track} className={cls}>{body}</Link>
        : <a href={to} data-track={track} className={cls}>{body}</a>}
    </Magnetic>
  )
}

function Book({ className = '' }) {
  return (
    <img
      src={BOOK_IMAGE}
      alt="Founder Versa book cover"
      decoding="async"
      draggable={false}
      onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
      style={{ filter: 'drop-shadow(0 36px 40px rgba(0,0,0,.45))' }}
      className={`block h-auto w-full rounded-[6px] ${className}`}
    />
  )
}

// Small round previous / next buttons for the book explorer.
function Stepper({ onPrev, onNext, label }) {
  const cls = `grid size-11 place-items-center rounded-full border border-white/25 text-white transition-colors duration-300 hover:border-[#a4be2d] hover:bg-[#a4be2d] hover:text-[#101310] ${focus}`
  return (
    <div className="flex gap-2">
      <button type="button" onClick={onPrev} aria-label={`Previous ${label}`} className={cls}><ArrowLeft size={18} aria-hidden /></button>
      <button type="button" onClick={onNext} aria-label={`Next ${label}`} className={cls}><ArrowRight size={18} aria-hidden /></button>
    </div>
  )
}

// Counts the price up when it scrolls into view.
function Price({ value, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const prefix = (value.match(/^\D*/) || [''])[0]
  const target = parseInt(value.replace(/\D/g, ''), 10)
  const valid = !Number.isNaN(target)
  const [n, setN] = useState(valid ? 0 : target)

  useEffect(() => {
    if (!valid) return undefined
    if (reduce) { setN(target); return undefined }
    if (!inView) return undefined
    const controls = animate(0, target, { duration: 1.6, ease: EASE, onUpdate: (v) => setN(Math.round(v)) })
    return () => controls.stop()
  }, [inView, reduce, target, valid])

  return <span ref={ref} className={className}>{valid ? `${prefix}${n.toLocaleString('en-IN')}` : value}</span>
}

/* ---------- 1. Hero: the promise, the price, the action ---------- */
function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const bookY = useTransform(scrollYProgress, [0, 1], [0, -70])

  // Mouse tilt for the 3D book.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 16 })
  const sy = useSpring(my, { stiffness: 120, damping: 16 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-14, 14])
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10])
  const onMove = (event) => {
    if (reduce || event.pointerType !== 'mouse') return
    const r = event.currentTarget.getBoundingClientRect()
    mx.set((event.clientX - r.left) / r.width - 0.5)
    my.set((event.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  return (
    <section ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} aria-labelledby="hero-title" className="relative isolate flex flex-col overflow-hidden bg-[#101310] text-white">
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <motion.img src={HERO_IMAGE} alt="" decoding="async" draggable={false} onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} style={{ y: bgY, scale: 1.12 }} className="size-full object-cover saturate-[.8]" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(95deg,#101310_0%,#101310eb_38%,#10131099_75%,#101310c4_100%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-[linear-gradient(to_top,#101310,#10131000)]" />

      <div className={`${wrap} grid items-center gap-14 pb-12 pt-28 sm:pt-32 lg:grid-cols-12 lg:gap-10 lg:pb-16 lg:pt-36`}>
        <div className="lg:col-span-7">
          <Reveal as="img" src={LOGO_IMAGE} alt="Founder Versa" className="mb-8 h-16 w-auto object-contain sm:h-20" />
          <Lines
            as="h1"
            id="hero-title"
            lines={['Your idea isn’t enough.', <span key="a" className="text-[#a4be2d]">Understand what it takes to build a business.</span>]}
            delay={100}
            step={160}
            className="text-[clamp(36px,4.8vw,68px)] font-bold leading-[1.06] tracking-[-.035em]"
          />
          <Reveal as="p" delay={450} className="mt-7 max-w-[50ch] border-l-2 border-[#a4be2d] pl-5 text-base font-medium leading-[1.7] text-white sm:text-lg">
            10 practical startup books to help you make more informed decisions and avoid common entrepreneurial mistakes.
          </Reveal>
          <Reveal delay={600} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Cta to="#pricing" track="cta-hero">Get the Founder Versa Collection</Cta>
            <p className="m-0 text-sm font-medium text-[#cdd8c6]">
              From <span className="text-base font-bold text-white">{DIGITAL_AVAILABLE ? PRICE.digital : PRICE.physical}</span>
            </p>
          </Reveal>
        </div>

        <Reveal delay={250} className="mx-auto w-full max-w-[240px] sm:max-w-[300px] lg:col-span-5 lg:max-w-[330px] lg:justify-self-center">
          <motion.div style={{ y: bookY }} className="relative">
            <motion.div
              aria-hidden
              animate={reduce ? undefined : { scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-[-14%] -z-10 rounded-full bg-[#a4be2d]/25 blur-3xl"
            />
            <motion.div animate={reduce ? undefined : { y: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
              <motion.div style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}>
                <Book />
              </motion.div>
            </motion.div>
            {chips.map((chip) => (
              <motion.span
                key={chip.label}
                animate={reduce ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: chip.d, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute z-10 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md sm:text-[13px] ${chip.cls}`}
              >
                <span aria-hidden className="size-1.5 rounded-full bg-[#a4be2d]" />
                {chip.label}
              </motion.span>
            ))}
          </motion.div>
        </Reveal>
      </div>

      <div className={wrap}>
        <ul className="m-0 grid list-none grid-cols-2 border-t border-white/15 p-0 text-sm font-medium text-white/90 sm:grid-cols-4">
          {proof.map((item, i) => (
            <Reveal as="li" key={item} delay={700 + i * 80} y={12} className={`flex items-center gap-3 py-5 ${i % 2 ? 'pl-5' : ''} ${i ? 'sm:border-l sm:border-white/15 sm:pl-6' : ''}`}>
              <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-full bg-[#a4be2d] text-[#101310]"><Check size={11} weight="bold" /></span>
              {item}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- 2. Problem: a scroll-reactive question band, costs below ---------- */
// Drifts on its own, speeds up and reverses with the page scroll, pauses on hover.
function Marquee({ items, reverse = false }) {
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
    let v = x.get() + dir * 2.2 * (delta / 1000) * (1 + Math.abs(f))
    if (v <= -50) v += 50
    if (v > 0) v -= 50
    x.set(v)
  })
  const xp = useTransform(x, (v) => `${v}%`)

  return (
    <div className="fv-marq fv-fade overflow-hidden" onPointerEnter={() => { hover.current = true }} onPointerLeave={() => { hover.current = false }}>
      <motion.div style={{ x: xp }} className="flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex shrink-0">
            {[...items, ...items].map((text, i) => (
              <span key={`${copy}-${i}`} className="mr-3 inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-[#101310]/15 bg-white px-6 py-4 text-[15px] font-semibold text-[#101310] sm:text-[16px]">
                <span aria-hidden className="size-2 shrink-0 rounded-full bg-[#a4be2d]" />
                {text}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function Rule({ delay }) {
  const reduce = useReducedMotion()
  return (
    <span aria-hidden className="relative mb-6 block h-px w-full bg-[#cfd5c2]">
      <motion.span
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEW}
        transition={{ duration: 1.2, delay: delay / 1000, ease: EASE }}
        className="absolute inset-y-[-1px] left-0 block h-[3px] w-full origin-left bg-[#a4be2d]"
      />
    </span>
  )
}

function Problem() {
  return (
    <section aria-labelledby="problem-title" className={`overflow-hidden bg-[#F2F3EF] text-[#101310] ${band}`}>
      <div className={`${wrap} grid items-end gap-x-16 gap-y-6 lg:grid-cols-12`}>
        <div className="lg:col-span-7">
          <Lines as="h2" id="problem-title" lines={['Businesses don’t struggle', 'only because of', <span key="p" className="text-[#617319]">bad ideas.</span>]} delay={100} className={h2} />
        </div>
        <Reveal as="p" delay={250} className={`m-0 text-[#2c3328] lg:col-span-5 ${lead}`}>
          Sometimes, founders don’t know what they don’t know. <span className="text-[#4a4f47]">Do you?</span>
        </Reveal>
      </div>

      <Reveal delay={150} className="mt-12 grid gap-3 sm:mt-14">
        <Marquee items={questionRows[0]} />
        <Marquee items={questionRows[1]} reverse />
      </Reveal>

      <div className={`${wrap} mt-14 sm:mt-16`}>
        <ul className="m-0 grid list-none gap-x-8 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {costs.map((item, i) => {
            const Icon = costIcons[i]
            return (
              <Reveal as="li" key={item.title} delay={i * 90}>
                <Rule delay={i * 90 + 200} />
                <span aria-hidden className="grid size-11 place-items-center rounded-full bg-[#153B2B] text-[#a4be2d]"><Icon size={22} weight="light" /></span>
                <h3 className="m-0 mt-5 text-[19px] font-bold leading-[1.25] tracking-[-.02em]">{item.title}</h3>
                <p className="m-0 mt-2 text-[15.5px] leading-[1.65] text-[#4a4f47]">{item.text}</p>
              </Reveal>
            )
          })}
        </ul>

        <div className="mt-14 flex flex-col items-start justify-between gap-8 border-t border-[#cfd5c2] pt-10 sm:mt-16 lg:flex-row lg:items-center">
          <Reveal as="p" className="m-0 max-w-[32ch] text-[clamp(20px,2.2vw,28px)] font-bold leading-[1.3] tracking-[-.025em]">
            Start learning before these questions become expensive problems.
          </Reveal>
          <Reveal delay={120}>
            <Cta to="#collection" tone="dark" track="cta-problem">Explore the 10-Book Collection</Cta>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------- 3. The collection: swipeable explorer for the ten books ---------- */
const panelVariants = {
  enter: (d) => ({ opacity: 0, x: d * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d * -48 }),
}

function BookExplorer() {
  const [[active, dir], setState] = useState([0, 1])
  const total = books.length
  const book = books[active]
  const select = (n, d = n > active ? 1 : -1) => setState([(n + total) % total, d])

  return (
    <div className="mt-12 grid gap-5 lg:grid-cols-12 lg:gap-8">
      <div role="tablist" aria-orientation="vertical" className="fv-scroll -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:col-span-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-b lg:border-white/15 lg:p-0">
        {books.map((item, n) => {
          const on = active === n
          return (
            <button
              key={item.title}
              type="button"
              role="tab"
              id={`book-tab-${n}`}
              aria-selected={on}
              aria-controls="book-panel"
              onClick={() => select(n)}
              className={`relative flex shrink-0 items-center gap-3 rounded-full border px-4 py-2.5 text-left text-[15px] font-semibold transition-colors duration-300 lg:w-full lg:shrink lg:justify-between lg:rounded-none lg:border-0 lg:border-t lg:border-white/15 lg:py-3.5 lg:pl-5 lg:pr-0 lg:text-[17px] ${on ? 'border-[#a4be2d] text-[#101310] lg:text-[#a4be2d]' : 'border-white/20 text-white/70 hover:text-white lg:text-white/60'} ${focus}`}
            >
              {on && <motion.span layoutId="book-pill" transition={{ type: 'spring', stiffness: 420, damping: 36 }} aria-hidden className="absolute inset-0 rounded-full bg-[#a4be2d] lg:inset-y-2.5 lg:right-auto lg:w-[3px]" />}
              <span className="relative">{item.title}</span>
              <ArrowRight size={16} aria-hidden className={`relative hidden shrink-0 transition-[opacity,transform,translate] duration-300 lg:block ${on ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
            </button>
          )
        })}
      </div>

      <div role="tabpanel" id="book-panel" aria-labelledby={`book-tab-${active}`} className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-3xl bg-[linear-gradient(150deg,#1b4a36_0%,#153B2B_55%,#101310_130%)] p-7 sm:p-10 lg:col-span-7">
        <div className="flex items-center justify-between gap-4">
          <p className="m-0 text-sm font-bold tabular-nums text-[#a4be2d]">{String(active + 1).padStart(2, '0')} <span className="text-white/40">/ {String(total).padStart(2, '0')}</span></p>
          <Stepper onPrev={() => select(active - 1, -1)} onNext={() => select(active + 1, 1)} label="book" />
        </div>
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={active}
            custom={dir}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: EASE }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) select(active + 1, 1)
              else if (info.offset.x > 60) select(active - 1, -1)
            }}
            className="cursor-grab pt-10 active:cursor-grabbing"
          >
            <h3 className="m-0 text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.1] tracking-[-.03em]">{book.title}</h3>
            <p className="m-0 mt-4 max-w-[44ch] text-[17px] leading-[1.7] text-[#cdd8c6]">{book.text}</p>
            {book.cover && <img src={book.cover} alt={`${book.title} cover`} loading="lazy" draggable={false} className="mt-5 h-28 w-auto rounded-[4px]" />}
          </motion.div>
        </AnimatePresence>
        <span aria-hidden className="mt-8 block h-[3px] w-full overflow-hidden rounded-full bg-white/15">
          <motion.span animate={{ scaleX: (active + 1) / total }} transition={{ duration: 0.5, ease: EASE }} className="block h-full w-full origin-left rounded-full bg-[#a4be2d]" />
        </span>
      </div>
    </div>
  )
}

function ParallaxBook() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4])
  return <motion.div ref={ref} style={{ y, rotate }}><Book /></motion.div>
}

function Collection() {
  return (
    <section id="collection" aria-labelledby="collection-title" className={`relative isolate scroll-mt-16 overflow-hidden bg-[#101310] text-white ${band}`}>
      <div aria-hidden className="absolute -left-40 top-0 -z-10 size-[520px] rounded-full bg-[#153B2B]/70 blur-[120px]" />
      <div className={wrap}>
        <div className="grid items-center gap-x-16 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Lines
              as="h2"
              id="collection-title"
              lines={['Don’t just dream about building.', <span key="c" className="text-[#a4be2d]">Learn to think like someone who builds.</span>]}
              delay={100}
              className={h2}
            />
            <Reveal as="p" className={`m-0 mt-7 max-w-[52ch] ${copyDark}`}>
              Founder Versa is a collection of 10 startup-focused books covering the essential areas of business. One structured starting point for your entrepreneurial journey.
            </Reveal>
          </div>
          <Reveal delay={200} className="hidden w-full max-w-[250px] lg:col-span-4 lg:block lg:justify-self-end">
            <ParallaxBook />
          </Reveal>
        </div>

        <BookExplorer />

        <ul className="m-0 mt-12 grid list-none gap-4 border-t border-white/15 p-0 pt-8 sm:grid-cols-3 sm:gap-8">
          {reasons.map((item, i) => (
            <Reveal as="li" key={item} delay={i * 90} className="flex items-start gap-3.5 text-[16px] font-medium leading-[1.5] text-[#dfe6d8]">
              <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#a4be2d] text-[#101310]"><Check size={11} weight="bold" /></span>
              {item}
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-12 flex justify-center">
          <Cta to="#pricing" track="cta-collection">Get All 10 Books</Cta>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- 4. The offer: spotlight cards, glowing edge on the main one ---------- */
const spot = (event) => {
  const r = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--mx', `${event.clientX - r.left}px`)
  event.currentTarget.style.setProperty('--my', `${event.clientY - r.top}px`)
}

function Offer() {
  const offers = [
    { name: 'Physical Collection', price: PRICE.physical, format: 'in print', cta: 'Get the Complete Collection', to: ORDER.physical, track: 'cta-physical', primary: true },
    ...(DIGITAL_AVAILABLE ? [{ name: 'Digital Collection', price: PRICE.digital, format: 'in digital format', cta: 'Get the Digital Collection', to: ORDER.digital, track: 'cta-digital', primary: false }] : []),
  ]
  return (
    <section id="pricing" aria-labelledby="pricing-title" className={`scroll-mt-16 bg-[#F2F3EF] text-[#101310] ${band}`}>
      <div className={wrap}>
        <div className="grid items-end gap-x-16 gap-y-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Lines as="h2" id="pricing-title" lines={['Your founder journey deserves', <span key="p" className="text-[#617319]">a stronger starting point.</span>]} delay={100} className={h2} />
          </div>
          <Reveal as="p" delay={250} className={`m-0 max-w-[48ch] lg:col-span-5 ${copyLight}`}>
            Soon you’ll decide who your customer is, what to invest in, and when to hire or raise money. Start building your knowledge now, and put it to work when the time comes.
          </Reveal>
        </div>

        <ul className={`m-0 mt-12 grid list-none gap-5 p-0 ${offers.length > 1 ? 'md:grid-cols-2' : 'max-w-[560px]'}`}>
          {offers.map((offer, i) => (
            <Reveal as="li" key={offer.name} delay={i * 120} y={40} className={`relative flex overflow-hidden rounded-3xl p-px ${offer.primary ? 'bg-[#a4be2d]/30' : 'bg-[#cfd5c2]'}`}>
              {offer.primary && <span aria-hidden className="fv-spin absolute left-1/2 top-1/2 aspect-square w-[260%] bg-[conic-gradient(from_0deg,transparent_0_72%,#a4be2d_88%,transparent_100%)]" />}
              <div onPointerMove={spot} className={`group/card relative flex flex-1 flex-col overflow-hidden rounded-[23px] p-7 sm:p-9 ${offer.primary ? 'bg-[#101310] text-white' : 'bg-white'}`}>
                <span
                  aria-hidden
                  style={{ background: 'radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(164,190,45,.18), transparent 60%)' }}
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                />
                <p className={`relative m-0 text-sm font-semibold ${offer.primary ? 'text-[#a4be2d]' : 'text-[#617319]'}`}>{offer.name}</p>
                <p className="relative m-0 mt-3 text-[clamp(44px,5vw,64px)] font-extrabold leading-none tracking-[-.04em]"><Price value={offer.price} /></p>
                <ul className="relative m-0 mt-7 grid list-none gap-3 p-0">
                  {[`All 10 startup books ${offer.format}`, 'Case studies and frameworks'].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15.5px] font-medium leading-[1.5]">
                      <span aria-hidden className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${offer.primary ? 'bg-[#a4be2d] text-[#101310]' : 'bg-[#153B2B] text-[#a4be2d]'}`}><Check size={11} weight="bold" /></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="relative mt-auto pt-9"><Cta to={offer.to} tone={offer.primary ? 'lime' : 'dark'} track={offer.track} full>{offer.cta}</Cta></div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------- 5. FAQ and closing call to action ---------- */
function FaqItem({ item, open, onToggle, index }) {
  return (
    <Reveal delay={index * 50} className="border-t border-[#cfd5c2]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`faq-${index}`}
        onClick={onToggle}
        className={`flex min-h-16 w-full cursor-pointer items-center justify-between gap-6 bg-transparent py-4 text-left text-[clamp(17px,1.7vw,21px)] font-semibold leading-[1.35] tracking-[-.015em] text-[#101310] ${focus}`}
      >
        {item.q}
        <motion.span aria-hidden animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3, ease: EASE }} className={`grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${open ? 'border-[#a4be2d] bg-[#a4be2d]' : 'border-[#101310]/25'}`}>
          <Plus size={15} weight="bold" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-${index}`}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className={`m-0 max-w-[62ch] pb-6 ${copyLight}`}>{item.a}</p>
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

// Headline words light up one by one as the card scrolls into the middle of the screen.
function FinalCard() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const words = useScroll({ target: ref, offset: ['start 85%', 'center 55%'] }).scrollYProgress
  const bg = useScroll({ target: ref, offset: ['start end', 'end start'] }).scrollYProgress
  const imgY = useTransform(bg, [0, 1], ['-8%', '8%'])
  const lines = [
    { text: 'Build with knowledge.' },
    { text: 'Learn from mistakes.' },
    { text: 'Grow with intention.', accent: true },
  ]
  const total = lines.reduce((sum, l) => sum + l.text.split(' ').length, 0)
  let count = 0

  return (
    <div ref={ref} className="relative isolate overflow-hidden rounded-[28px] bg-[#101310] px-6 py-16 text-center text-white sm:px-12 sm:py-24">
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <motion.img src={HERO_IMAGE} alt="" loading="lazy" decoding="async" draggable={false} onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} style={reduce ? { scale: 1.2 } : { y: imgY, scale: 1.2 }} className="size-full object-cover opacity-35 saturate-[.8]" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,#101310_0%,#101310b3_45%,#101310f2_100%)]" />
      <motion.div
        aria-hidden
        animate={reduce ? undefined : { scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-1/2 -z-10 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#153B2B] blur-[110px]"
      />
      <h2 id="final-title" className="m-0 text-[clamp(32px,5vw,68px)] font-bold leading-[1.05] tracking-[-.04em]">
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
      <Reveal as="p" delay={200} className={`mx-auto mt-7 max-w-[34ch] text-white ${lead}`}>
        For those who want to build, not just dream.
      </Reveal>
      <Reveal delay={300} className="mt-9 flex justify-center">
        <Cta to="#pricing" track="cta-final">Start Your Founder Journey</Cta>
      </Reveal>
    </div>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section aria-labelledby="faq-title" className={`bg-white text-[#101310] ${band}`}>
      <div className={`${wrap} grid gap-x-16 gap-y-10 lg:grid-cols-12`}>
        <div className="lg:col-span-4">
          <Lines as="h2" id="faq-title" lines={['Frequently asked', 'questions']} delay={100} className={h2} />
        </div>
        <div className="lg:col-span-8">
          <div className="border-b border-[#cfd5c2]">
            {faqs.map((item, i) => (
              <FaqItem key={item.q} item={item} index={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </div>

      <div className={`${wrap} mt-16 sm:mt-24`}>
        <FinalCard />
      </div>
    </section>
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
      <Faq />
    </main>
  )
}