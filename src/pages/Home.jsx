import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import PixelCard from '../components/PixelCard'

/* ---------- Editable content (all taken from the existing site copy) ---------- */
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

/* ---------- Strategic framework visual: a tower built as you scroll ----------
   `s` runs from 0 to 3 and is tied to the four stages (Discover, Architect, Activate, Scale).

   0.00         Blank panel (only the corner frame marks).
   0.00 - 0.95  DISCOVER   Ground line draws in, piles are driven, the foundation slab is poured.
   0.95 - 1.95  ARCHITECT  The steel frame rises floor by floor (slabs, columns, bracing).
   1.70 - 2.60  ACTIVATE   Glazing and facade follow the frame up; the two wings are framed and clad.
   2.60 - 3.00  SCALE      Roof parapets, crown and antenna, lobby entrance, trees,
                           windows light up and the city skyline appears. Finished building.

   Layout: on desktop (lg+) the visual is a sticky column beside the stages. On phones and tablets it is a
   sticky panel pinned under the site header while the stages scroll beneath it, so it is visible on every screen.
*/
const GROUND = 340
const FLOOR_H = 24
const BAY = 28
const FLOORS = 9
const PILES = [125, 155, 185, 215, 245, 275]
const up = (n) => Math.min(1, Math.max(0, n))
const fade = (v) => ({ opacity: v, transition: 'opacity 350ms ease-out' })
const grow = (origin, axis, v) => ({ transformOrigin: origin, transform: `${axis}(${v})`, opacity: v, transition: 'transform 350ms ease-out, opacity 350ms ease-out' })
const CALM = [0.7, 1.45, 2.4, 3] /* representative build states when motion is reduced (one per stage) */
const captions = ['Breaking ground', 'Foundation laid', 'Structure rising', 'Facade going on', 'Finishing touches', 'Complete']
const pileLines = PILES.map((x) => `M${x} 352V374`).join('')

/* One block of floors. skel(i) grows the frame of floor i (0 to 1), wall(i) fills it with glass, lit lights the windows, cap draws the roof parapet. */
function Tower({ x, bays, floors, skel, wall, lit, cap, seed = 0 }) {
  const w = bays * BAY
  const top = GROUND - FLOOR_H * floors
  return (
    <g>
      {Array.from({ length: floors }, (_, i) => {
        const y = GROUND - FLOOR_H * (i + 1)
        const a = skel(i)
        const b = wall(i)
        const posts = Array.from({ length: bays + 1 }, (__, c) => `M${x + c * BAY} ${y}V${y + FLOOR_H}`).join('')
        return (
          <g key={i} style={{ transformOrigin: `${x + w / 2}px ${y + FLOOR_H}px`, transform: `scaleY(${a})`, opacity: a, transition: 'transform 350ms ease-out, opacity 350ms ease-out' }}>
            <rect x={x} y={y} width={w} height={FLOOR_H} fill="#f8f9f6" stroke="none" style={fade(b * 0.07)} />
            {/* steel bracing: visible on the bare frame, hidden once the glass arrives */}
            {Array.from({ length: bays }, (__, c) => ((i + c) % 2 === 0
              ? <path key={`x${c}`} d={`M${x + c * BAY} ${y + FLOOR_H}L${x + (c + 1) * BAY} ${y}`} strokeOpacity=".35" style={fade(a * (1 - b))} />
              : null))}
            <path d={`M${x} ${y}H${x + w}${posts}`} />
            {Array.from({ length: bays }, (__, c) => {
              const on = (i * 3 + c + seed) % 4 === 0
              return <rect key={c} x={x + c * BAY + 6} y={y + 7} width={BAY - 12} height={10} fill={on ? '#a4be2d' : '#f8f9f6'} stroke="none" style={fade(b * (on ? 0.2 + 0.7 * lit : 0.16))} />
            })}
          </g>
        )
      })}
      <path d={`M${x - 3} ${top}H${x + w + 3}`} strokeWidth="2" style={fade(cap)} />
    </g>
  )
}

function Building({ s }) {
  const frameP = up((s - 0.95) / 1.0)
  const built = frameP * FLOORS
  const groundP = up(s / 0.15)
  const piles = up((s - 0.2) / 0.4)
  const slab = up((s - 0.5) / 0.45)
  const cap = up((s - 2.6) / 0.2)
  const crown = up((s - 2.6) / 0.25)
  const door = up((s - 2.65) / 0.2)
  const trees = up((s - 2.75) / 0.2)
  const lit = up((s - 2.7) / 0.3)
  const sky = up((s - 2.5) / 0.4)
  const capIdx = s < 0.35 ? 0 : s < 0.95 ? 1 : s < 1.95 ? 2 : s < 2.6 ? 3 : s < 2.95 ? 4 : 5
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" fill="none" stroke="#f8f9f6" strokeWidth="1" aria-hidden>
      <path d="M12 36V12H36M364 12H388V36" strokeOpacity=".5" />
      <g transform="matrix(1 0 0 1.16 0 -54.4)">

      {/* distant skyline, appears once the tower is done */}
      <g strokeOpacity=".5" style={fade(sky * 0.5)}>
        <rect x="14" y="236" width="34" height="104" /><path d="M14 262H48M14 288H48M14 314H48" />
        <rect x="352" y="226" width="34" height="114" /><path d="M352 252H386M352 278H386M352 304H386" />
      </g>

      {/* DISCOVER: the scene starts blank. The ground line draws in from the centre, then the soil line */}
      <path d="M12 340H388" strokeOpacity=".6" style={grow('200px 340px', 'scaleX', groundP)} />
      <path d="M24 352H376" strokeOpacity=".2" strokeDasharray="2 6" style={grow('200px 352px', 'scaleX', up((s - 0.08) / 0.12))} />

      {/* DISCOVER: piles driven into the ground, then the foundation slab is poured on top */}
      <g strokeOpacity=".6" strokeWidth="1.5" style={grow('0px 352px', 'scaleY', piles)}><path d={pileLines} /></g>
      <rect x="118" y="340" width="164" height="12" fill="#f8f9f6" fillOpacity=".12" style={grow('200px 346px', 'scaleX', slab)} />

      {/* ARCHITECT + ACTIVATE: main tower, nine floors. Frame first, then glass follows it up */}
      <Tower x={130} bays={5} floors={FLOORS} skel={(i) => up(frameP * FLOORS - i)} wall={(i) => up(((s - 1.7) / 0.85) * FLOORS - i)} lit={lit} cap={cap} />

      {/* ACTIVATE: the two wings are framed and clad */}
      <Tower x={74} bays={2} floors={4} skel={(i) => up(((s - 2) / 0.5) * 4 - i)} wall={(i) => up(((s - 2.3) / 0.4) * 4 - i)} lit={lit} cap={cap} seed={1} />
      <Tower x={270} bays={2} floors={4} skel={(i) => up(((s - 2) / 0.5) * 4 - i)} wall={(i) => up(((s - 2.3) / 0.4) * 4 - i)} lit={lit} cap={cap} seed={2} />

      {/* SCALE: lobby entrance with canopy */}
      <g style={fade(door)}>
        <rect x="188" y="319" width="24" height="21" fill="#171a1b" />
        <path d="M200 319V340" strokeOpacity=".6" />
        <path d="M178 314H222" stroke="#a4be2d" strokeWidth="2" />
      </g>

      {/* SCALE: stepped crown, plant room and antenna with a beacon */}
      <g style={fade(crown)}>
        <rect x="160" y="110" width="80" height="14" />
        <rect x="184" y="98" width="32" height="12" />
        <path d="M200 98V66" />
        <circle cx="200" cy="63" r="3.5" fill="#a4be2d" stroke="none" className="animate-pulse motion-reduce:animate-none" />
      </g>

      {/* SCALE: street trees */}
      <g style={fade(trees)}>
        <path d="M62 340V328M338 340V328" />
        <circle cx="62" cy="320" r="8" strokeOpacity=".7" />
        <circle cx="338" cy="320" r="8" strokeOpacity=".7" />
      </g>

      </g>

      {/* caption */}
      {captions.map((t, k) => <text key={t} x="14" y="388" fill="#a4be2d" stroke="none" fontSize="13" fontWeight="600" style={fade(capIdx === k ? 1 : 0)}>{t}</text>)}
      <text x="386" y="388" textAnchor="end" fill="#f8f9f6" fillOpacity=".6" stroke="none" fontSize="13">Floors {Math.round(built)} / {FLOORS}</text>
    </svg>
  )
}

function Framework() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const refs = useRef([])
  const stickyRef = useRef(null)
  /* One scroll loop drives both the active stage and the continuous build progress.
     Progress is 0 until the first stage reaches the reading line, then one unit per stage, so the building grows with every scroll.
     Desktop: the reading line is the middle of the screen. Phones/tablets: it sits just below the pinned building panel. */
  useEffect(() => {
    let raf = 0
    const run = () => {
      raf = 0
      const vh = window.innerHeight
      let line = vh * 0.5
      const box = stickyRef.current
      if (box && window.innerWidth < 1024) {
        const bottom = (parseFloat(getComputedStyle(box).top) || 0) + box.offsetHeight
        line = bottom + (vh - bottom) * 0.2
      }
      const tops = refs.current.map((el) => (el ? el.getBoundingClientRect().top + 24 : 0))
      let v = 0
      let idx = 0
      for (let i = tops.length - 1; i >= 0; i -= 1) {
        if (line >= tops[i]) { idx = i; v = i + (i < tops.length - 1 ? Math.min(1, (line - tops[i]) / (tops[i + 1] - tops[i])) : 0); break }
      }
      setActive(idx)
      if (!calm()) {
        const q = Math.round(v * 50) / 50
        setProgress((prev) => (Math.abs(prev - q) < 0.01 ? prev : q))
      }
    }
    const queue = () => { if (!raf) raf = requestAnimationFrame(run) }
    queue()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue) }
  }, [])
  const jump = (i) => refs.current[i]?.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'center' })
  return (
    <section id="framework" className="bg-[#f2f3ef] py-24 sm:py-36" aria-labelledby="framework-title">
      <div className={wrap}>
        <header className="mb-14 max-w-3xl sm:mb-20">
          <Reveal className={eyebrow}>Strategic framework</Reveal>
          <Heading id="framework-title" lines={['From a loose opportunity', 'to a structure that scales.']} className={h2cls} />
        </header>
        {/* Mobile/tablet: the visual and the stages share one grid cell, the visual pins to the top while the stages scroll under it. Desktop: two columns. */}
        <div className="grid lg:grid-cols-12 lg:gap-16">
          <div className="pointer-events-none z-20 col-start-1 row-start-1 lg:pointer-events-auto lg:z-auto lg:col-span-5">
            <div ref={stickyRef} className="pointer-events-auto sticky top-16 -mx-5 bg-[#f2f3ef] px-5 pb-3 pt-2 sm:-mx-7 sm:px-7 md:top-[72px] lg:top-28 lg:mx-0 lg:bg-transparent lg:p-0">
              <div className="h-[min(42svh,340px)] bg-[#171a1b] p-3 sm:p-5 md:h-[min(46svh,460px)] lg:aspect-square lg:h-auto lg:p-6">
                <Building s={calm() ? CALM[active] : progress} />
              </div>
              <div className="mt-4 hidden grid-cols-4 border-t border-[#171a1b]/20 lg:grid">
                {stages.map(([name], i) => (
                  <button key={name} type="button" onClick={() => jump(i)} aria-label={`Go to stage ${i + 1}: ${name}`} className={`border-t-2 pt-3 text-left text-[13px] font-semibold transition-colors duration-500 -mt-px ${active === i ? 'border-[#7c9318] text-[#171a17]' : 'border-transparent text-[#72766f] hover:text-[#171a17]'}`}>{name}</button>
                ))}
              </div>
            </div>
          </div>
          <ol className="col-start-1 row-start-1 pt-[calc(min(42svh,340px)_+_3rem)] md:pt-[calc(min(46svh,460px)_+_3rem)] lg:col-span-7 lg:col-start-6 lg:pt-0">
            {stages.map(([name, desc, out], i) => {
              const reached = active >= i
              return (
                <li key={name} ref={(el) => { refs.current[i] = el }} className="relative min-h-[38svh] pb-14 pl-14 lg:min-h-[48vh] lg:pb-0">
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
    <div ref={ref} className="group relative flex min-h-[250px] flex-col border border-[#dce1d3] bg-[#f8f9f6] p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#bdc98b] hover:shadow-[0_14px_35px_#27300f0c] sm:min-h-[275px] sm:p-8">
      <div className="mb-7 flex items-center justify-between">
        <span className="text-sm font-semibold tabular-nums tracking-[.12em] text-[#7c9318]">0{i + 1}</span>
        <span className="h-px flex-1 bg-[#dce1d3] ml-4" aria-hidden />
      </div>
      <div className="mt-auto" style={rise(seen, 180 + i * 100)}>
        <h3 className="text-[clamp(22px,2.2vw,30px)] font-bold leading-[1.12] tracking-[-.03em]">{title}</h3>
        <p className="mt-4 max-w-[380px] text-sm leading-[1.7] text-[#555a52] sm:text-[15px]">{text}</p>
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
        <div className="mx-auto flex w-full max-w-[1720px] flex-1 flex-col px-5 py-10 sm:px-8 sm:py-12 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid flex-1 items-center gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            <div className="lg:col-span-7">
              <div style={rise(ready)}>
                <h1 id="hero-title" className="text-[clamp(60px,7.8vw,138px)] font-extrabold leading-[.88] tracking-[-.075em]">Hashir Usman</h1>
              </div>
              <Heading tag="h2" on={ready} delay={120} className="mt-7 text-[clamp(40px,5vw,88px)] font-extrabold leading-[.94] tracking-[-.065em]" lines={['Build with clarity.', <span className="text-[#7c9318]">Scale with intention.</span>]} />
              <p className="mt-6 max-w-[600px] text-base leading-[1.6] text-[#2f332e] sm:text-lg xl:text-xl" style={rise(ready, 500)}>Strategy, systems, brand, and execution for founders building lasting ventures.</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3" style={rise(ready, 620)}>
                <Link to="/ventures" className="group inline-flex min-h-12 items-center gap-3 rounded border-[1.5px] border-[#a4be2d] bg-[#a4be2d] px-6 text-[13px] font-semibold text-[#1e2618] transition-colors duration-300 hover:border-[#b3cc35] hover:bg-[#b3cc35] active:scale-[.97]">See what’s cooking <Arrow /></Link>
                <Link to="/contact" className="group inline-flex min-h-12 items-center gap-3 rounded border-[1.5px] border-[#a4aaa0] px-6 text-[13px] font-semibold transition-colors duration-300 hover:border-[#171a1b] hover:bg-[#171a1b] hover:text-white active:scale-[.97]">Got an idea? <Arrow /></Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] lg:ml-auto lg:max-h-[min(72svh,820px)] lg:max-w-none" style={{ clipPath: ready ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)', transition: `clip-path 1500ms ${EASE} 200ms` }}>
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
          <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
            {expertise.map((e, i) => {
              const baseColor = i === 2 ? '#f2f3ef' : '#f8f9f6'
              return (
                <Reveal key={e.title} delay={(i % 2) * 120}>
                  <PixelCard
                    colors={['#a4be2d', '#d4e77a', '#7c9318']}
                    glowColor="#a4be2d"
                    shape="square"
                    origin="pointer"
                    gap={12}
                    pixelSize={3}
                    speed={28}
                    revealDuration={600}
                    spotlight={0.55}
                    glow={0.35}
                    opacity={0.55}
                    fade={0.45}
                    trigger="hover"
                    intro={false}
                    theme="light"
                    radius={20}
                    baseColor={baseColor}
                    className="rounded-[20px]"
                  >
                    <div className="group relative flex h-full min-h-[340px] w-full flex-col p-7 sm:p-10">
                      <div className="flex items-start justify-between">
                        <span className="grid size-10 place-items-center rounded-full border border-[#d9ddd1] bg-white/70 text-xs font-bold tabular-nums text-[#7c9318] transition-colors duration-500 group-hover:border-[#a4be2d]/40 group-hover:bg-white/5 group-hover:text-[#a4be2d]">0{i + 1}</span>
                        <span className="grid size-14 place-items-center rounded-2xl border border-[#e2e6dc] bg-white/70 text-[#171a1b] transition-[background-color,border-color,color,transform] duration-500 group-hover:-translate-y-1 group-hover:border-[#a4be2d]/30 group-hover:bg-[#a4be2d]/10 group-hover:text-[#a4be2d]">
                          <svg viewBox="0 0 64 64" className="size-9" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>{glyphs[i]}</svg>
                        </span>
                      </div>
                      <h3 className="mt-10 max-w-[420px] text-[clamp(24px,2.4vw,34px)] font-bold leading-[1.1] tracking-[-.035em] text-[#171a17] transition-colors duration-500 group-hover:text-white">{e.title}</h3>
                      <p className="mt-4 max-w-[420px] text-[15px] leading-[1.6] text-[#72766f] transition-colors duration-500 group-hover:text-[#b9bfb0]">{e.desc}</p>
                      <ul className="mt-auto flex flex-wrap gap-2 pt-8 text-[11px] text-[#4a4f47] transition-colors duration-500 group-hover:text-[#d9ddd1]">
                        {e.tags.map((t) => <li key={t} className="rounded-full border border-[#d9ddd1] bg-white/60 px-3 py-1.5 transition-colors duration-500 group-hover:border-white/20 group-hover:bg-white/5">{t}</li>)}
                      </ul>
                      <span className="absolute bottom-0 left-8 right-8 h-[3px] rounded-full bg-[#a4be2d] opacity-35 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
                    </div>
                  </PixelCard>
                </Reveal>
              )
            })}
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
          <div className="mt-16 flex justify-center border-t border-[#d9ddd1] pt-10 sm:mt-20 sm:pt-12">
            <Link to="/ventures#collection" className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-[#a4be2d] bg-[#a4be2d] px-6 text-sm font-semibold text-[#1e2618] no-underline transition-[transform,background-color] duration-200 hover:scale-[1.02] hover:bg-[#b3cc35] active:scale-[.98]">The full lineup <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* 6. Working principles & impact */}
      <section aria-labelledby="principles-heading" className="bg-[#f2f3ef] py-20 sm:py-24">
        <div className={wrap}>
          <header className="mb-10 grid gap-6 md:mb-14 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Reveal className={eyebrow}>Working principles</Reveal>
              <Heading id="principles-heading" lines={['Three commitments', 'behind every engagement.']} className={h2cls} />
            </div>
            <Reveal delay={180} className="max-w-md text-sm leading-[1.7] text-[#72766f] lg:col-span-4 lg:pb-2 lg:text-base">A practical standard for every decision, from defining the opportunity to building for lasting growth.</Reveal>
          </header>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {principles.map(([t, d], i) => <Principle key={t} title={t} text={d} i={i} />)}
          </div>
          <dl className="mt-16 grid border-t border-[#d0d5c6] sm:grid-cols-3 sm:mt-20">
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

      
    </main>
  )
}
