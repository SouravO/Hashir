import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

/* ---------- Editable content (all taken from the existing site copy) ---------- */
const metrics = [
  ['20+', 'Social Media Profiles', 'Designed & Managed'],
  ['30+', 'Venture & Business', 'Transformations'],
  ['5+', 'Domains of', 'Experience'],
  ['20+', 'Business & Startup', 'Plans Delivered'],
]

const statement = 'Strong ventures are not ideas with a logo. They are a *market understood*, a *business model made clear*, and a plan *carried out* with discipline: strategy, positioning, and execution built as one structure.'

const expertise = [
  { title: 'Venture Architecture & Business Design', desc: 'Shape an opportunity into a focused, investable venture with a plan to reach market.', tags: ['Opportunity framing', 'Business models', 'Investor narratives'] },
  { title: 'Business Strategy & Market Positioning', desc: 'Clarify positioning and priorities so the next stage has a clear direction.', tags: ['Positioning', 'Brand strategy', 'Clear priorities'] },
  { title: 'Go-to-Market Strategy & Growth', desc: 'Connect launch planning, brand, and marketing so a venture reaches its market with intent.', tags: ['Launch planning', 'Marketing', 'Growth consulting'] },
  { title: 'Business Systems & Venture Scaling', desc: 'Build the operating processes and practical systems that support execution as the venture grows.', tags: ['Operating processes', 'Practical systems', 'Execution support'] },
]

const glyphs = [
  <><rect x="6" y="6" width="52" height="52" /><rect x="18" y="18" width="28" height="28" /><path d="M6 6l12 12M58 6L46 18M6 58l12-12M58 58L46 46" /></>,
  <><path d="M8 8v48h48" /><path d="M8 56L56 8" strokeDasharray="3 4" /><circle cx="34" cy="30" r="5" /><path d="M34 35v21M29 30H8" strokeDasharray="2 3" /></>,
  <><path d="M6 54h14V40h14V26h14V12h6" /><circle cx="54" cy="12" r="4" /></>,
  <><rect x="6" y="46" width="10" height="10" /><rect x="18" y="32" width="16" height="16" /><rect x="36" y="8" width="22" height="22" /><path d="M16 51h2M34 40h2" /></>,
]

const stages = [
  ['Discover', 'Identify opportunities, understand markets, and define the problem.', 'A defined problem and a clear opportunity.'],
  ['Architect', 'Establish positioning, business models, strategy, and operating structures.', 'Positioning, a business model, and an operating structure.'],
  ['Activate', 'Translate strategy into execution, launch plans, and practical systems.', 'A launch plan and the systems to carry it out.'],
  ['Scale', 'Refine operations, improve performance, and establish sustainable growth.', 'Sharper operations and a base for lasting growth.'],
]

/* Add `challenge` and `outcome` text to any venture and it appears automatically. Leave empty until verified. */
const ventures = [
  { name: 'Moonbliss', category: 'Wellness', year: '2020', work: 'Built from the ground up — positioning, identity, digital presence, and go-to-market strategy.', scope: ['Positioning', 'Identity', 'Digital presence', 'Go-to-market'], challenge: '', outcome: '', panel: 'bg-[#133629] text-[#f2f3ef]', stroke: '#a4be2d', mark: 'font-serif tracking-[-.03em] text-[clamp(44px,7.4vw,108px)]' },
  { name: 'Kesha', category: 'Lifestyle', year: '2021', work: 'Shaped the brand identity and social media presence for a lifestyle label.', scope: ['Brand identity', 'Social media presence'], challenge: '', outcome: '', panel: 'bg-[#adca2d] text-[#171a1b]', stroke: '#171a1b', mark: 'font-serif tracking-[-.02em] text-[clamp(48px,8vw,116px)]' },
  { name: 'sol.', category: 'Consumer Goods', year: '2021', work: 'Designed the go-to-market plan and brand systems for a sustainability-focused venture.', scope: ['Go-to-market plan', 'Brand systems'], challenge: '', outcome: '', panel: 'bg-[#171a1b] text-[#a4be2d]', stroke: '#a4be2d', mark: 'font-sans font-medium tracking-[-.06em] text-[clamp(72px,12vw,176px)]' },
]
const shapes = [
  <><circle cx="300" cy="90" r="60" /><circle cx="300" cy="90" r="38" /></>,
  <><path d="M0 220Q100 140 200 220T400 220" /><path d="M0 250Q100 170 200 250T400 250" /></>,
  <><circle cx="90" cy="210" r="52" /><path d="M90 130v-30M90 290v20M10 210H-10M170 210h30" /></>,
]

const principles = [
  ['Clarity before complexity', 'Define the problem, the model, and the message before adding anything else. Teams move faster when they know what matters.'],
  ['Strategy connected to execution', 'A strategy only counts when people can act on it. Every engagement ends in decisions, priorities, and next steps.'],
  ['Sustainable systems over short-term wins', 'Build the processes, brand, and operating habits that keep a venture growing long after launch.'],
]
const impact = [
  [5, '+', 'years', 'Across strategy, brand, systems, and growth'],
  [6, '', 'ventures', 'Built and supported across several domains'],
  [10, '+', 'decks', 'Investor-ready pitch decks delivered'],
]

/* ---------- Motion + style helpers (kept local to this page) ---------- */
const EASE = 'cubic-bezier(0.16,1,0.3,1)'
const calm = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const rise = (on, d = 0, y = 26) => ({ opacity: on ? 1 : 0, transform: on ? 'none' : `translateY(${y}px)`, transition: `opacity 900ms ${EASE} ${d}ms, transform 900ms ${EASE} ${d}ms` })
const wrap = 'mx-auto w-full max-w-[1280px] px-5 sm:px-7'
const eyebrow = 'mb-5 flex items-center gap-3 text-[13px] font-semibold text-[#617319] before:h-px before:w-8 before:bg-[#7c9318]'
const h2cls = 'text-[clamp(34px,5vw,66px)] font-extrabold leading-[1.02] tracking-[-.045em]'
const dotted = '[background-image:radial-gradient(#d5e48145_.8px,transparent_1px)] [background-size:12px_12px]'

function useInView(margin = '0px 0px -12% 0px') {
  const ref = useRef(null)
  const [seen, setSeen] = useState(calm)
  useEffect(() => {
    const el = ref.current
    if (seen || !el) return undefined
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [seen, margin])
  return [ref, seen]
}

function useScrollProgress() {
  const ref = useRef(null)
  const [p, setP] = useState(() => (calm() ? 1 : 0))
  useEffect(() => {
    if (calm()) return undefined
    let raf = 0
    const run = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setP(Math.round(Math.min(1, Math.max(0, (window.innerHeight * 0.8 - r.top) / (r.height * 0.85))) * 100) / 100)
    }
    const queue = () => { if (!raf) raf = requestAnimationFrame(run) }
    queue()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue) }
  }, [])
  return [ref, p]
}

function Reveal({ as: Tag = 'div', delay = 0, y = 26, className = '', children, ...rest }) {
  const [ref, seen] = useInView()
  return <Tag ref={ref} className={className} style={rise(seen, delay, y)} {...rest}>{children}</Tag>
}

/* Masked line reveal: each line slides up from behind its own clip. */
function Heading({ lines, tag: Tag = 'h2', id, className = '', delay = 0, on }) {
  const [ref, seen] = useInView()
  const go = on ?? seen
  return (
    <Tag id={id} ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden py-[.07em] -my-[.07em]">
          <span className="block" style={{ transform: go ? 'none' : 'translateY(110%)', transition: `transform 1100ms ${EASE} ${delay + i * 110}ms` }}>{line}</span>
        </span>
      ))}
    </Tag>
  )
}

function CountUp({ to, suffix = '' }) {
  const [ref, seen] = useInView()
  const [n, setN] = useState(() => (calm() ? to : 0))
  useEffect(() => {
    if (!seen) return undefined
    if (calm()) { setN(to); return undefined }
    let raf = 0
    let t0
    const step = (t) => {
      t0 ??= t
      const k = Math.min(1, (t - t0) / 1300)
      setN(Math.round(to * (1 - (1 - k) ** 3)))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [seen, to])
  return <span ref={ref}>{n}{suffix}</span>
}

const Arrow = () => <ArrowUpRight size={18} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

/* ---------- Strategic framework diagram: scattered dots become a structure ---------- */
const scatter = [[62, 88], [318, 52], [146, 196], [352, 162], [84, 300], [226, 274], [330, 338], [40, 176], [190, 60]]
const gridPts = [110, 200, 290].flatMap((y) => [110, 200, 290].map((x) => [x, y]))

function Blueprint({ stage }) {
  const fade = (on, d = 0) => ({ opacity: on ? 1 : 0, transition: `opacity 900ms ${EASE} ${d}ms` })
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" fill="none" stroke="#f8f9f6" strokeWidth="1" aria-hidden>
      <circle cx="200" cy="200" r="150" strokeDasharray="2 6" strokeOpacity=".5" style={fade(stage === 0)} />
      <g strokeOpacity=".28" style={fade(stage >= 1, 300)}>
        <rect x="70" y="70" width="260" height="260" />
        {[110, 200, 290].map((v) => <path key={v} d={`M${v} 70V330M70 ${v}H330`} />)}
      </g>
      <g stroke="#a4be2d" strokeOpacity=".6" style={{ transformOrigin: '200px 200px', transform: stage >= 3 ? 'scale(1)' : 'scale(.8)', opacity: stage >= 3 ? 1 : 0, transition: `transform 1200ms ${EASE}, opacity 900ms ${EASE}` }}>
        <rect x="34" y="34" width="332" height="332" />
        <rect x="8" y="8" width="384" height="384" strokeOpacity=".5" />
      </g>
      <path d="M110 290H200V200H290V110" pathLength="1" strokeDasharray="1" stroke="#a4be2d" strokeWidth="2.5" style={{ strokeDashoffset: stage >= 2 ? 0 : 1, transition: 'stroke-dashoffset 1400ms ease' }} />
      {gridPts.map(([x, y], i) => {
        const [px, py] = stage >= 1 ? [x, y] : scatter[i]
        const hot = stage >= 2 && [6, 4, 2].includes(i)
        return <circle key={i} r={hot ? 7 : 4.5} fill={hot ? '#a4be2d' : '#f8f9f6'} stroke="none" style={{ transform: `translate(${px}px, ${py}px)`, transition: `transform 1200ms ${EASE} ${i * 50}ms` }} />
      })}
    </svg>
  )
}

function Framework() {
  const [active, setActive] = useState(0)
  const refs = useRef([])
  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.dataset.i)) }), { rootMargin: '-45% 0px -45% 0px' })
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])
  const jump = (i) => refs.current[i]?.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'center' })
  return (
    <section id="framework" className="bg-[#f2f3ef] py-24 sm:py-36" aria-labelledby="framework-title">
      <div className={wrap}>
        <header className="mb-14 max-w-3xl sm:mb-20">
          <Reveal className={eyebrow}>Strategic framework</Reveal>
          <Heading id="framework-title" lines={['From a loose opportunity', 'to a structure that scales.']} className={h2cls} />
        </header>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="aspect-square bg-[#171a1b] p-6">
                <Blueprint stage={active} />
              </div>
              <div className="mt-4 grid grid-cols-4 border-t border-[#171a1b]/20">
                {stages.map(([name], i) => (
                  <button key={name} type="button" onClick={() => jump(i)} aria-label={`Go to stage ${i + 1}: ${name}`} className={`border-t-2 pt-3 text-left text-[13px] font-semibold transition-colors duration-500 -mt-px ${active === i ? 'border-[#7c9318] text-[#171a17]' : 'border-transparent text-[#72766f] hover:text-[#171a17]'}`}>{name}</button>
                ))}
              </div>
            </div>
          </div>
          <ol className="lg:col-span-7">
            {stages.map(([name, desc, out], i) => {
              const reached = active >= i
              return (
                <li key={name} ref={(el) => { refs.current[i] = el }} data-i={i} className="relative pb-14 pl-14 lg:min-h-[48vh] lg:pb-0">
                  <span className={`absolute left-0 top-1 z-10 grid size-7 place-items-center rounded-full border text-[11px] font-bold transition-colors duration-700 ${reached ? 'border-[#a4be2d] bg-[#a4be2d] text-[#1e2618]' : 'border-[#c4c9b9] bg-[#f2f3ef] text-[#72766f]'}`}>{i + 1}</span>
                  {i < stages.length - 1 && (
                    <span className="absolute bottom-0 left-[13px] top-9 w-px bg-[#d0d5c6]" aria-hidden>
                      <span className="absolute inset-0 origin-top bg-[#7c9318]" style={{ transform: `scaleY(${active > i ? 1 : 0})`, transition: `transform 900ms ${EASE}` }} />
                    </span>
                  )}
                  <h3 className="text-[clamp(34px,4.4vw,60px)] font-extrabold leading-none tracking-[-.045em] transition-colors duration-700" style={{ color: reached ? '#171a17' : '#8e9487' }}>{name}</h3>
                  <p className="mt-5 max-w-[460px] text-lg leading-[1.55] text-[#4a4f47]">{desc}</p>
                  <p className="mt-6 max-w-[460px] border-t border-[#d0d5c6] pt-4 text-sm text-[#72766f]">What comes out: <span className={`font-semibold transition-colors duration-700 ${reached ? 'text-[#617319]' : ''}`}>{out}</span></p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Showcase({ v, i }) {
  const [ref, seen] = useInView('0px 0px -15% 0px')
  const flip = i % 2 === 1
  const rows = [['Category', v.category], ['Year', v.year], ['Scope', v.scope.join(', ')], ['Challenge', v.challenge], ['Outcome', v.outcome]].filter(([, t]) => t)
  const draw = { strokeDashoffset: seen ? 0 : 1, transition: `stroke-dashoffset 2000ms ${EASE} 500ms` }
  return (
    <article ref={ref} className={`group grid items-center gap-8 lg:grid-cols-12 lg:gap-14 ${i ? 'mt-24 lg:mt-40' : ''}`} aria-label={v.name}>
      <div className={`relative aspect-[4/3] overflow-hidden ${v.panel} ${flip ? 'lg:order-2 lg:col-span-6 lg:col-start-7' : 'lg:col-span-7'}`} style={{ clipPath: seen ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)', transition: `clip-path 1300ms ${EASE}` }}>
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" fill="none" stroke={v.stroke} strokeOpacity=".4" aria-hidden>
          <path d="M16 40V16H40M360 16H384V40M384 260V284H360M40 284H16V260" strokeOpacity=".7" />
          <g strokeDasharray="1" style={draw}>{shapes[i]}</g>
        </svg>
        <div className="absolute inset-0 grid place-items-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"><span className={v.mark}>{v.name}</span></div>
        <span className="absolute bottom-5 left-6 text-[13px] font-medium opacity-80">{v.category}, {v.year}</span>
      </div>
      <div className={flip ? 'lg:order-1 lg:col-span-5 lg:col-start-1' : 'lg:col-span-5 lg:col-start-8'}>
        <Reveal delay={150}><h3 className="text-[clamp(38px,4.6vw,64px)] font-extrabold leading-none tracking-[-.05em]">{v.name}</h3></Reveal>
        <Reveal delay={250}><p className="mt-5 max-w-[440px] text-lg leading-[1.55] text-[#4a4f47]">{v.work}</p></Reveal>
        <Reveal delay={350}>
          <dl className="mt-8 border-t border-[#d9ddd1] text-sm">
            {rows.map(([k, t]) => <div key={k} className="grid grid-cols-[96px_1fr] gap-4 border-b border-[#e7e9e2] py-3.5"><dt className="text-[#72766f]">{k}</dt><dd className="font-medium">{t}</dd></div>)}
          </dl>
          <Link to="/ventures" className="group/link mt-8 inline-flex items-center gap-2 border-b-[1.5px] border-[#171a17] pb-1 text-sm font-semibold transition-colors hover:border-[#7c9318] hover:text-[#617319]">View on the Ventures page <ArrowUpRight size={16} aria-hidden className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" /></Link>
        </Reveal>
      </div>
    </article>
  )
}

function Principle({ title, text, i }) {
  const [ref, seen] = useInView()
  return (
    <div ref={ref} className={['', 'md:pt-14', 'md:pt-28'][i]}>
      <div className="h-px bg-[#7c9318]" style={{ transform: seen ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: `transform 1400ms ${EASE} ${i * 150}ms` }} />
      <div style={rise(seen, 250 + i * 150)}>
        <h3 className="mt-6 text-[clamp(24px,2.4vw,32px)] font-bold leading-[1.12] tracking-[-.03em]">{title}</h3>
        <p className="mt-4 max-w-[380px] text-[15px] leading-[1.65] text-[#555a52]">{text}</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [ready, setReady] = useState(calm)
  const [statRef, p] = useScrollProgress()
  useEffect(() => {
    document.title = 'Hashir Usman | Venture Architect & Business Consultant'
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])
  const words = (() => { let on = false; return statement.split(' ').map((t) => { if (t.startsWith('*')) on = true; const hot = on; if (/\*\W*$/.test(t)) on = false; return [t.replaceAll('*', ''), hot] }) })()
  const line = (d) => ({ strokeDashoffset: ready ? 0 : 1, transition: `stroke-dashoffset 1800ms ${EASE} ${d}ms` })

  return (
    <main id="main" className="overflow-x-clip font-sans text-[#171a17]">
      {/* 1. Hero */}
      <section id="home" aria-labelledby="hero-title" className="relative flex min-h-[calc(100svh-72px)] flex-col max-[768px]:min-h-[calc(100svh-64px)]">
        <div className={`${wrap} flex flex-1 flex-col pb-5 pt-8 sm:pt-10 lg:pt-12`}>
          <div className="grid flex-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <div style={rise(ready)}>
                <h1 id="hero-title" className="text-[clamp(58px,8.5vw,112px)] font-extrabold leading-[.88] tracking-[-.075em]">Hashir Usman</h1>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[.14em] text-[#687060] sm:text-xs">Venture Architect <span aria-hidden>·</span> Business Consultant</p>
              </div>
              <Heading tag="h2" on={ready} delay={120} className="mt-6 text-[clamp(38px,5.2vw,72px)] font-extrabold leading-[.94] tracking-[-.065em]" lines={['Build with clarity.', <span className="text-[#7c9318]">Scale with intention.</span>]} />
              <p className="mt-5 max-w-[440px] text-[15px] leading-[1.55] text-[#2f332e] sm:text-base" style={rise(ready, 500)}>I help founders and businesses turn opportunities into structured, investable ventures through strategy, systems, brand, and execution.</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3" style={rise(ready, 620)}>
                <Link to="/ventures" className="group inline-flex min-h-12 items-center gap-3 rounded border-[1.5px] border-[#a4be2d] bg-[#a4be2d] px-6 text-[13px] font-semibold text-[#1e2618] transition-colors duration-300 hover:border-[#b3cc35] hover:bg-[#b3cc35] active:scale-[.97]">Explore ventures <Arrow /></Link>
                <Link to="/contact" className="group inline-flex min-h-12 items-center gap-3 rounded border-[1.5px] border-[#a4aaa0] px-6 text-[13px] font-semibold transition-colors duration-300 hover:border-[#171a1b] hover:bg-[#171a1b] hover:text-white active:scale-[.97]">Book a call <Arrow /></Link>
                <a href="#positioning" className="group ml-2 hidden items-center gap-2 text-[11px] text-[#3a3e35] sm:inline-flex">Scroll <ArrowDown size={16} aria-hidden className="animate-bounce-down motion-reduce:animate-none" /></a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] lg:ml-auto lg:max-h-[min(68svh,600px)] lg:max-w-none" style={{ clipPath: ready ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)', transition: `clip-path 1500ms ${EASE} 200ms` }}>
                <div className={`absolute inset-0 left-[10%] top-[8%] rounded-tl-[20px] bg-[#adca2d] ${dotted}`} aria-hidden />
                <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" fill="none" stroke="#171a1b" aria-hidden>
                  <g strokeOpacity=".22">{[100, 200, 300].map((x) => <path key={x} d={`M${x} 0V500`} />)}{[120, 230, 340, 450].map((y) => <path key={y} d={`M0 ${y}H400`} />)}</g>
                  <path d="M0 450H100V340H200V230H300V120H400" pathLength="1" strokeDasharray="1" strokeWidth="2" style={line(700)} />
                  {[[100, 340], [200, 230], [300, 120]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" fill="#f8f9f6" strokeWidth="1.5" style={{ opacity: ready ? 1 : 0, transition: `opacity 700ms ease ${1100 + i * 350}ms` }} />)}
                  <path d="M12 36V12H36M364 12H388V36" strokeOpacity=".7" />
                </svg>
                <img className="absolute inset-0 h-full w-full max-w-none object-cover object-top" src="/images/hashir-portrait.webp" srcSet="/images/hashir-portrait-small.webp 480w, /images/hashir-portrait-medium.webp 800w, /images/hashir-portrait.webp 1120w" sizes="(max-width:1023px) 94vw, 40vw" width="1120" height="1400" alt="Portrait of Hashir Usman" fetchPriority="high" />
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 border-t border-[#d9ddd1] md:grid-cols-4" aria-label="Experience in numbers">
            {metrics.map(([n, a, b], i) => (
              <div key={a} className={`py-5 pr-4 md:px-5 md:first:pl-0 ${i ? 'md:border-l md:border-[#e3e6dd]' : ''} ${i % 2 ? 'pl-4' : ''}`} style={rise(ready, 1000 + i * 90, 16)}>
                <strong className="mb-1.5 block text-[clamp(26px,3vw,36px)] font-bold leading-none tracking-[-.04em] text-[#7c9318]">{n}</strong>
                <p className="text-[11px] leading-[1.5] text-[#30372b]">{a}<br />{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Positioning statement: words light up as you scroll */}
      <section id="positioning" aria-labelledby="positioning-title" className="bg-[#171a1b] py-28 text-[#f8f9f6] sm:py-40">
        <div className={`${wrap} grid gap-10 lg:grid-cols-12`}>
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="mb-4 text-[13px] font-semibold text-[#a4be2d]">The thinking behind the work</p>
              <div className="h-px w-full max-w-[160px] bg-white/15"><div className="h-px origin-left bg-[#a4be2d]" style={{ transform: `scaleX(${p})`, transition: 'transform 300ms linear' }} /></div>
            </div>
          </div>
          <div ref={statRef} className="lg:col-span-9">
            <h2 id="positioning-title" className="text-[clamp(30px,4.8vw,68px)] font-bold leading-[1.1] tracking-[-.04em]">
              {words.map(([w, hot], i) => <span key={i} style={{ color: i / words.length < p ? (hot ? '#a4be2d' : '#f8f9f6') : '#5d6558', transition: 'color 500ms ease' }}>{w} </span>)}
            </h2>
          </div>
        </div>
      </section>

      {/* 3. Core expertise: a bordered architectural grid */}
      <section id="services" aria-labelledby="expertise-heading" className="py-24 sm:py-36">
        <div className={wrap}>
          <header className="mb-14 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Reveal className={eyebrow}>Core expertise</Reveal>
              <Heading id="expertise-heading" lines={['Four disciplines.', 'One connected structure.']} className={h2cls} />
            </div>
            <Reveal delay={200} className="lg:col-span-4"><p className="max-w-[380px] text-[15px] leading-[1.65] text-[#72766f]">Practical support from shaping the opportunity through to building the systems that help it grow.</p></Reveal>
          </header>
          <div className="grid border-l border-t border-[#d9ddd1] md:grid-cols-2">
            {expertise.map((e, i) => (
              <Reveal key={e.title} delay={(i % 2) * 120} className="border-b border-r border-[#d9ddd1]">
                <div className="group relative flex h-full min-h-[340px] flex-col p-7 transition-colors duration-500 hover:bg-[#171a1b] sm:p-10">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold text-[#7c9318] transition-colors duration-500 group-hover:text-[#a4be2d]">0{i + 1}</span>
                    <svg viewBox="0 0 64 64" className="size-14 text-[#171a1b] transition-colors duration-500 group-hover:text-[#a4be2d]" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>{glyphs[i]}</svg>
                  </div>
                  <h3 className="mt-14 max-w-[420px] text-[clamp(24px,2.4vw,34px)] font-bold leading-[1.1] tracking-[-.035em] transition-colors duration-500 group-hover:text-white">{e.title}</h3>
                  <p className="mt-4 max-w-[420px] text-[15px] leading-[1.6] text-[#72766f] transition-colors duration-500 group-hover:text-[#b9bfb0]">{e.desc}</p>
                  <ul className="mt-auto flex flex-wrap gap-y-2 pt-8 text-xs text-[#4a4f47] transition-colors duration-500 group-hover:text-[#d9ddd1]">
                    {e.tags.map((t) => <li key={t} className="mr-3 border-l border-[#c4c9b9] pl-3 first:border-0 first:pl-0 group-hover:border-white/25">{t}</li>)}
                  </ul>
                  <span className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-[#a4be2d] transition-transform duration-700 group-hover:scale-x-100" aria-hidden />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Strategic framework */}
      <Framework />

      {/* 5. Selected ventures */}
      <section id="work" aria-labelledby="work-heading" className="py-24 sm:py-36">
        <div className={wrap}>
          <header className="mb-16 grid gap-8 lg:mb-24 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Reveal className={eyebrow}>Selected ventures</Reveal>
              <Heading id="work-heading" lines={['A few ventures,', 'built with intention.']} className={h2cls} />
            </div>
            <Reveal delay={200} className="lg:col-span-4 lg:text-right"><Link to="/ventures" className="group inline-flex items-center gap-2 text-sm font-semibold text-[#617319] transition-colors hover:text-[#171a17]">All ventures <Arrow /></Link></Reveal>
          </header>
          {ventures.map((v, i) => <Showcase key={v.name} v={v} i={i} />)}
        </div>
      </section>

      {/* 6. Working principles & impact */}
      <section aria-labelledby="principles-heading" className="bg-[#f2f3ef] py-24 sm:py-36">
        <div className={wrap}>
          <header className="mb-16 max-w-3xl">
            <Reveal className={eyebrow}>Working principles</Reveal>
            <Heading id="principles-heading" lines={['Three commitments', 'behind every engagement.']} className={h2cls} />
          </header>
          <div className="grid gap-12 md:grid-cols-3 md:gap-10">
            {principles.map(([t, d], i) => <Principle key={t} title={t} text={d} i={i} />)}
          </div>
          <dl className="mt-24 grid border-t border-[#d0d5c6] sm:grid-cols-3 sm:mt-32">
            {impact.map(([n, s, unit, text], i) => (
              <Reveal key={unit} delay={i * 120} className={`py-8 sm:pr-8 ${i ? 'sm:border-l sm:border-[#d0d5c6] sm:pl-8' : ''}`}>
                <dt className="sr-only">{unit}</dt>
                <dd>
                  <strong className="block text-[clamp(56px,8vw,112px)] font-extrabold leading-none tracking-[-.06em] text-[#7c9318]"><CountUp to={n} suffix={s} /> <span className="text-[clamp(18px,2vw,26px)] tracking-[-.02em] text-[#171a17]">{unit}</span></strong>
                  <p className="mt-3 max-w-[260px] text-[13px] leading-[1.55] text-[#72766f]">{text}</p>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* 7. Closing CTA */}
      <section aria-labelledby="cta-title" className="relative overflow-hidden bg-[#171a1b] py-28 text-[#f8f9f6] sm:py-40">
        <svg viewBox="0 0 600 600" className="pointer-events-none absolute -right-[20%] top-1/2 w-[90vw] max-w-[900px] -translate-y-1/2 opacity-30 lg:right-[-8%]" fill="none" stroke="#a4be2d" strokeWidth="1" aria-hidden>
          {[280, 200, 120].map((r) => <circle key={r} cx="300" cy="300" r={r} strokeOpacity=".5" />)}
          <path d="M300 0V600M0 300H600" strokeOpacity=".3" />
        </svg>
        <div className={`${wrap} relative`}>
          <Reveal className="mb-6 flex items-center gap-3 text-[13px] font-semibold text-[#a4be2d] before:h-px before:w-8 before:bg-[#a4be2d]">For founders, operators, and business leaders</Reveal>
          <Heading id="cta-title" lines={['Let’s build', 'what’s next.']} className="text-[clamp(52px,12vw,190px)] font-extrabold leading-[.92] tracking-[-.07em]" />
          <Reveal delay={200}><p className="mt-8 max-w-[480px] text-base leading-[1.6] text-[#b9bfb0]">Bring a business challenge, an early idea, or a venture that needs structure. We will start with the problem.</p></Reveal>
          <div className="mt-14 max-w-3xl border-b border-white/15">
            {[['/contact', 'Start a conversation', 'Discuss a venture or a business challenge.'], ['/ventures', 'Explore selected ventures', 'See how earlier ventures were built.']].map(([to, t, s], i) => (
              <Reveal key={to} delay={300 + i * 120}>
                <Link to={to} className="group flex items-center justify-between gap-6 border-t border-white/15 py-6 transition-colors duration-300 hover:text-[#a4be2d]">
                  <span><span className="block text-[clamp(22px,3vw,40px)] font-bold tracking-[-.03em]">{t}</span><span className="mt-1 block text-sm text-[#a5ac9b]">{s}</span></span>
                  <ArrowUpRight size={36} aria-hidden className="shrink-0 transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:translate-x-1.5" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
