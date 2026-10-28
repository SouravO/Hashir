import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { brands, brandImage } from '../data/brands'

/* ---------- Editable content (taken from the HU. content blueprint) ---------- */
const statement = 'I build businesses, and fix a few things along the way. I work with *startup founders*, *business owners*, and *teams* to turn ideas into plans, and plans into action.'

const expertise = [
  { title: 'Venture Architecture', desc: 'Making startup ideas more practical, testable, and ready to build.', tags: ['Idea validation', 'Business models', 'Venture strategy'] },
  { title: 'Business Strategy', desc: 'Understanding the market, the business model, and what the next move should be.', tags: ['Market assessment', 'Management consulting', 'Growth roadmaps'] },
  { title: 'Brand & Growth', desc: 'Helping businesses get noticed, understood, chosen, and purchased.', tags: ['Positioning', 'Go-to-market', 'Customer acquisition'] },
  { title: 'Systems & Scaling', desc: 'Making operations, people, processes, and performance work better together.', tags: ['SOPs & workflows', 'KPIs & reporting', 'Automation & AI'] },
]

const stages = [
  ['Opportunity', 'Customer problem, market understanding, competitors, and idea validation.', 'A clearer view of whether the idea has a market.'],
  ['Business', 'Business model, revenue structure, pricing, positioning, and the brand that carries it.', 'A model that explains how the money works.'],
  ['Launch', 'MVP planning, go-to-market strategy, launch priorities, and early customer acquisition.', 'A clear answer to what should happen first.'],
  ['Growth', 'Team roles, SOPs, reporting, milestones, and funding readiness for what comes next.', 'Systems that can handle growth, and milestones to aim for.'],
]

const principles = [
  ['Startup idea call', 'Got an idea you can’t stop thinking about? We’ll work out what makes sense, what needs testing, and what to do next.'],
  ['Business strategy call', 'Something not working the way you expected? We’ll look at the business, find the gaps, and see what needs attention.'],
  ['Systems and scaling call', 'Growing faster than your systems? We’ll look at SOPs, teams, and workflows to make the operation easier to manage.'],
]
const impact = [
  [10, '', 'areas of work', 'From startup architecture to funding preparation'],
  [5, '', 'strategy calls', 'One-to-one, from first idea to founder direction'],
  [1, '', 'conversation', 'Is where good things usually start'],
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

/* ---------- Strategic framework visual: one corporate office building, built from the ground up as you scroll ----------
   `s` runs from 0 to 3 and is tied to the four stages (Opportunity, Business, Launch, Growth).

   0.00         Blank panel (only the corner frame marks).
   0.00 - 0.95  OPPORTUNITY  Ground line draws in, piles are driven, the foundation slab is poured.
   0.95 - 1.95  BUSINESS     The two-storey podium is framed, then the steel frame of the tower rises floor by floor
                             (slabs, columns, bracing), finishing with the stepped upper section.
   1.50 - 2.60  LAUNCH       Glass curtain wall follows the frame up the front and side faces.
   2.60 - 3.00  GROWTH       Crisp roof edges and rooftop plant room, entrance with canopy, trees, windows light up. Finished building.

   Shape: a tall glass office tower seen from a corner, so the front face, the shaded side face and the roofs are all visible.
   A wide podium at the base, a 12-floor main tower, and a narrower 4-floor upper section that steps back at the top.
   Every roof has a solid edge band (parapet). No antenna, no mast.
   Everything is placed with pt(X, Y, Z): X across, Y up, Z depth into the scene.

   Layout: on desktop (lg+) the visual is a sticky column beside the stages. On phones and tablets it is a
   sticky panel pinned under the site header while the stages scroll beneath it, so it is visible on every screen.
*/
const GROUND = 340
const K = 0.42 /* how far one unit of depth shifts right on screen */
const L = 0.2 /* how far one unit of depth shifts up on screen */
const PODIUM = { x0: 82, w: 190, z0: 0, d: 110, base: 0, floors: 2, fh: 20, mx: 8, mz: 4 }
const MAIN = { x0: 122, w: 110, z0: 22, d: 66, base: 40, floors: 12, fh: 15, mx: 5, mz: 3 }
const UPPER = { x0: 133, w: 88, z0: 33, d: 44, base: 220, floors: 4, fh: 15, mx: 4, mz: 2 }
const PODIUM_TOP = PODIUM.base + PODIUM.floors * PODIUM.fh
const MAIN_TOP = MAIN.base + MAIN.floors * MAIN.fh
const UPPER_TOP = UPPER.base + UPPER.floors * UPPER.fh
const TOTAL_FLOORS = PODIUM.floors + MAIN.floors + UPPER.floors
const PILES = [86, 114, 142, 170, 198, 226, 254, 276]
const up = (n) => Math.min(1, Math.max(0, n))
const fade = (v) => ({ opacity: v, transition: 'opacity 350ms ease-out' })
const grow = (origin, axis, v) => ({ transformOrigin: origin, transform: `${axis}(${v})`, opacity: v, transition: 'transform 350ms ease-out, opacity 350ms ease-out' })
const CALM = [0.7, 1.45, 2.4, 3] /* representative build states when motion is reduced (one per stage) */
const captions = ['Breaking ground', 'Foundation laid', 'Structure rising', 'Facade going on', 'Finishing touches', 'Complete']
const pileLines = PILES.map((x) => `M${x} 350V374`).join('')
const pt = (X, Y, Z) => `${(X + K * Z).toFixed(1)} ${(GROUND - Y - L * Z).toFixed(1)}`
const poly = (...p) => `M${p.join('L')}Z`
const DARK = '#171a1b'

/* One block of floors with a front face and a shaded right face.
   skel(i) grows the frame of floor i (0 to 1), wall(i) fills it with glass, lit lights the windows. */
function Block({ x0, w, z0, d, base, floors, fh, mx, mz, skel, wall, lit, seed = 0 }) {
  const xr = x0 + w
  const z1 = z0 + d
  const bwF = w / mx
  const bwS = d / mz
  return (
    <g>
      {Array.from({ length: floors }, (_, i) => {
        const yb = base + fh * i
        const yt = yb + fh
        const a = skel(i)
        const b = wall(i)
        const front = poly(pt(x0, yt, z0), pt(xr, yt, z0), pt(xr, yb, z0), pt(x0, yb, z0))
        const side = poly(pt(xr, yt, z0), pt(xr, yt, z1), pt(xr, yb, z1), pt(xr, yb, z0))
        const frontPosts = Array.from({ length: mx + 1 }, (__, c) => `M${pt(x0 + c * bwF, yt, z0)}L${pt(x0 + c * bwF, yb, z0)}`).join('')
        const sidePosts = Array.from({ length: mz + 1 }, (__, c) => `M${pt(xr, yt, z0 + c * bwS)}L${pt(xr, yb, z0 + c * bwS)}`).join('')
        return (
          <g key={i} style={{ transformOrigin: `${x0 + w / 2}px ${GROUND - yb}px`, transform: `scaleY(${a})`, opacity: a, transition: 'transform 350ms ease-out, opacity 350ms ease-out' }}>
            {/* solid backing so nothing behind the face shows through */}
            <path d={front} fill={DARK} stroke="none" />
            <path d={side} fill={DARK} stroke="none" />
            {/* glass: the front catches more light than the side */}
            <path d={front} fill="#f8f9f6" stroke="none" style={fade(b * 0.09)} />
            <path d={side} fill="#f8f9f6" stroke="none" style={fade(b * 0.03)} />
            {/* steel bracing: visible on the bare frame, hidden once the glass arrives */}
            {Array.from({ length: mx }, (__, c) => ((i + c) % 2 === 0
              ? <path key={`x${c}`} d={`M${pt(x0 + c * bwF, yb, z0)}L${pt(x0 + (c + 1) * bwF, yt, z0)}`} strokeOpacity=".35" style={fade(a * (1 - b))} />
              : null))}
            {/* floor edges and mullions */}
            <path d={`M${pt(x0, yt, z0)}L${pt(xr, yt, z0)}L${pt(xr, yt, z1)}${frontPosts}${sidePosts}`} />
            {i === 0 && <path d={`M${pt(x0, yb, z0)}L${pt(xr, yb, z0)}L${pt(xr, yb, z1)}`} strokeWidth="1.6" />}
            {/* heavier corner piers: they give the building its clean vertical edges */}
            <path d={`M${pt(x0, yt, z0)}L${pt(x0, yb, z0)}M${pt(xr, yt, z0)}L${pt(xr, yb, z0)}`} strokeWidth="2.2" strokeLinecap="square" />
            <path d={`M${pt(xr, yt, z1)}L${pt(xr, yb, z1)}`} strokeWidth="1.4" />
            {/* ribbon windows, front face */}
            {Array.from({ length: mx }, (__, c) => {
              const on = (i * 3 + c + seed) % 4 === 0
              return <rect key={`f${c}`} x={x0 + c * bwF + 3.5 + K * z0} y={GROUND - yb - fh * 0.72 - L * z0} width={bwF - 7} height={fh * 0.42} fill={on ? '#a4be2d' : '#f8f9f6'} stroke="none" style={fade(b * (on ? 0.2 + 0.7 * lit : 0.16))} />
            })}
            {/* ribbon windows, side face (in perspective, dimmer) */}
            {Array.from({ length: mz }, (__, c) => {
              const on = (i * 2 + c + seed) % 5 === 0
              const za = z0 + c * bwS + 3
              const zb = z0 + (c + 1) * bwS - 3
              return <path key={`s${c}`} d={poly(pt(xr, yb + fh * 0.72, za), pt(xr, yb + fh * 0.72, zb), pt(xr, yb + fh * 0.3, zb), pt(xr, yb + fh * 0.3, za))} fill={on ? '#a4be2d' : '#f8f9f6'} stroke="none" style={fade(b * (on ? 0.15 + 0.45 * lit : 0.09))} />
            })}
          </g>
        )
      })}
    </g>
  )
}

/* Flat roof seen from above, finished with a solid edge band (parapet) along the front and the side. */
function Roof({ x0, w, z0, d, y, v, inset = 3, lip = 3 }) {
  const xr = x0 + w
  const z1 = z0 + d
  const bandF = poly(pt(x0, y, z0), pt(xr, y, z0), pt(xr, y - lip, z0), pt(x0, y - lip, z0))
  const bandS = poly(pt(xr, y, z0), pt(xr, y, z1), pt(xr, y - lip, z1), pt(xr, y - lip, z0))
  return (
    <g style={fade(v)} strokeLinejoin="round">
      <path d={bandF} fill={DARK} stroke="none" />
      <path d={bandS} fill={DARK} stroke="none" />
      <path d={poly(pt(x0, y, z0), pt(xr, y, z0), pt(xr, y, z1), pt(x0, y, z1))} fill="#f8f9f6" fillOpacity=".07" strokeWidth="1.8" />
      <path d={poly(pt(x0 + inset, y, z0 + inset), pt(xr - inset, y, z0 + inset), pt(xr - inset, y, z1 - inset), pt(x0 + inset, y, z1 - inset))} strokeOpacity=".45" />
      <path d={bandF} fill="#f8f9f6" fillOpacity=".2" strokeWidth="1.6" />
      <path d={bandS} fill="#f8f9f6" fillOpacity=".08" strokeWidth="1.6" />
    </g>
  )
}

/* Small solid box, used for the rooftop plant room. */
function Box({ x0, w, z0, d, y, h, v }) {
  const xr = x0 + w
  const z1 = z0 + d
  const yt = y + h
  const front = poly(pt(x0, yt, z0), pt(xr, yt, z0), pt(xr, y, z0), pt(x0, y, z0))
  const side = poly(pt(xr, yt, z0), pt(xr, yt, z1), pt(xr, y, z1), pt(xr, y, z0))
  const top = poly(pt(x0, yt, z0), pt(xr, yt, z0), pt(xr, yt, z1), pt(x0, yt, z1))
  return (
    <g style={fade(v)} strokeLinejoin="round">
      <path d={front} fill={DARK} />
      <path d={side} fill={DARK} />
      <path d={top} fill={DARK} />
      <path d={front} fill="#f8f9f6" fillOpacity=".1" stroke="none" />
      <path d={side} fill="#f8f9f6" fillOpacity=".04" stroke="none" />
      <path d={top} fill="#f8f9f6" fillOpacity=".14" stroke="none" />
      <path d={[1, 2].map((k) => `M${pt(x0, y + (h * k) / 3, z0)}L${pt(xr, y + (h * k) / 3, z0)}`).join('')} strokeOpacity=".4" />
    </g>
  )
}

function Building({ s }) {
  const groundP = up(s / 0.15)
  const piles = up((s - 0.2) / 0.4)
  const slab = up((s - 0.5) / 0.45)
  const podFrame = up((s - 0.95) / 0.25) * PODIUM.floors
  const mainFrame = up((s - 1.2) / 0.5) * MAIN.floors
  const upperFrame = up((s - 1.7) / 0.25) * UPPER.floors
  const built = podFrame + mainFrame + upperFrame
  const podGlass = up((s - 1.8) / 0.4) * PODIUM.floors
  const mainGlass = up((s - 1.5) / 0.9) * MAIN.floors
  const upperGlass = up((s - 2.3) / 0.3) * UPPER.floors
  const podRoof = up((s - 2.2) / 0.2)
  const mainRoof = up((s - 2.4) / 0.2)
  const cap = up((s - 2.6) / 0.2)
  const crown = up((s - 2.6) / 0.25)
  const door = up((s - 2.65) / 0.2)
  const trees = up((s - 2.75) / 0.2)
  const lit = up((s - 2.7) / 0.3)
  const capIdx = s < 0.35 ? 0 : s < 0.95 ? 1 : s < 1.95 ? 2 : s < 2.6 ? 3 : s < 2.95 ? 4 : 5
  const doorX = PODIUM.x0 + PODIUM.w / 2
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" fill="none" stroke="#f8f9f6" strokeWidth="1" aria-hidden>
      <path d="M12 36V12H36M364 12H388V36" strokeOpacity=".5" />

      {/* OPPORTUNITY: the scene starts blank. The ground line draws in from the centre, then the soil line */}
      <path d="M12 340H388" strokeOpacity=".6" style={grow('200px 340px', 'scaleX', groundP)} />
      <path d="M24 352H376" strokeOpacity=".2" strokeDasharray="2 6" style={grow('200px 352px', 'scaleX', up((s - 0.08) / 0.12))} />

      {/* OPPORTUNITY: piles driven into the ground, then the foundation slab is poured on top */}
      <g strokeOpacity=".6" strokeWidth="1.5" style={grow('0px 352px', 'scaleY', piles)}><path d={pileLines} /></g>
      <g style={grow('177px 340px', 'scaleX', slab)} strokeLinejoin="round">
        <path d={poly(pt(76, 0, -4), pt(278, 0, -4), pt(278, 0, 114), pt(76, 0, 114))} fill="#f8f9f6" fillOpacity=".07" strokeOpacity=".3" />
        <path d={poly(pt(76, 0, -4), pt(278, 0, -4), pt(278, -8, -4), pt(76, -8, -4))} fill="#f8f9f6" fillOpacity=".14" strokeOpacity=".8" />
        <path d={poly(pt(278, 0, -4), pt(278, 0, 114), pt(278, -8, 114), pt(278, -8, -4))} fill="#f8f9f6" fillOpacity=".06" strokeOpacity=".5" />
      </g>

      {/* BUSINESS + LAUNCH: podium first, then the tower, then the stepped upper section. Frame first, then glass follows it up */}
      <Block {...PODIUM} skel={(i) => up(podFrame - i)} wall={(i) => up(podGlass - i)} lit={lit} seed={3} />
      <Roof x0={PODIUM.x0} w={PODIUM.w} z0={PODIUM.z0} d={PODIUM.d} y={PODIUM_TOP} v={podRoof} lip={2.5} />
      <Block {...MAIN} skel={(i) => up(mainFrame - i)} wall={(i) => up(mainGlass - i)} lit={lit} />
      <Roof x0={MAIN.x0} w={MAIN.w} z0={MAIN.z0} d={MAIN.d} y={MAIN_TOP} v={mainRoof} />
      <Block {...UPPER} skel={(i) => up(upperFrame - i)} wall={(i) => up(upperGlass - i)} lit={lit} seed={1} />

      {/* GROWTH: crisp roof edge and rooftop plant room */}
      <Roof x0={UPPER.x0} w={UPPER.w} z0={UPPER.z0} d={UPPER.d} y={UPPER_TOP} v={cap} />
      <Box x0={UPPER.x0 + 22} w={44} z0={UPPER.z0 + 10} d={24} y={UPPER_TOP} h={9} v={crown} />

      {/* GROWTH: entrance with canopy */}
      <g style={fade(door)}>
        <rect x={doorX - 12} y={GROUND - 16} width="24" height="16" fill={DARK} />
        <path d={`M${doorX} ${GROUND - 16}V${GROUND}`} strokeOpacity=".6" />
        <path d={poly(pt(doorX - 19, 18, 0), pt(doorX + 19, 18, 0), pt(doorX + 19, 18, -9), pt(doorX - 19, 18, -9))} fill="#a4be2d" fillOpacity=".25" stroke="#a4be2d" strokeWidth="1.5" />
      </g>

      {/* GROWTH: street trees */}
      <g style={fade(trees)}>
        <path d="M52 340V330M346 340V330" />
        <circle cx="52" cy="324" r="6" strokeOpacity=".7" />
        <circle cx="346" cy="324" r="6" strokeOpacity=".7" />
      </g>

      {/* caption */}
      {captions.map((t, k) => <text key={t} x="14" y="388" fill="#a4be2d" stroke="none" fontSize="13" fontWeight="600" style={fade(capIdx === k ? 1 : 0)}>{t}</text>)}
      <text x="386" y="388" textAnchor="end" fill="#f8f9f6" fillOpacity=".6" stroke="none" fontSize="13">Floors {Math.round(built)} / {TOTAL_FLOORS}</text>
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
          <Reveal className={eyebrow}>From idea to actual business</Reveal>
          <Heading id="framework-title" lines={['That idea in your head?', 'Give it somewhere to go.']} className={h2cls} />
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

/* ---------- Brand portfolio: every brand image, two rows drifting in opposite directions ----------
   Data lives in src/data/brands.js. Each card links to that brand's full brief on the Ventures page.
   The rows pause on hover/focus, and become plain scrollable rows when the visitor prefers reduced motion. */
const MARQUEE_CSS = `
@keyframes bm-slide{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}
.bm-track{animation:bm-slide var(--bm-d,70s) linear infinite;will-change:transform}
.bm-rev{animation-direction:reverse}
.bm-row:hover .bm-track,.bm-row:focus-within .bm-track{animation-play-state:paused}
@media (prefers-reduced-motion:reduce){.bm-track{animation:none}.bm-row{overflow-x:auto}.bm-dup{display:none}}
`
const ventureCount = brands.filter((b) => b.scope.some((s) => s.startsWith('Venture'))).length

/* Brand artwork with a text fallback, so a missing file never shows a broken-image icon. */
function BrandArt({ b, alt = '', className = '', imgClass = '' }) {
  const [bad, setBad] = useState(false)
  return (
    <div className={`relative overflow-hidden bg-[#f2f3ef] ${className}`}>
      {bad
        ? <span className="absolute inset-0 grid place-items-center p-3 text-center text-sm font-bold text-[#171a1b]/60">{b.name}</span>
        : <img src={brandImage(b.file)} alt={alt} loading="lazy" decoding="async" draggable={false} onError={() => setBad(true)} className={`absolute inset-0 size-full object-cover ${imgClass}`} />}
    </div>
  )
}

function BrandCard({ b, dup }) {
  return (
    <li aria-hidden={dup || undefined} className={`w-[220px] shrink-0 sm:w-[260px] lg:w-[280px] ${dup ? 'bm-dup' : ''}`}>
      <Link
        to={`/ventures#brand-${b.id}`}
        tabIndex={dup ? -1 : undefined}
        className="group/card flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] text-[#f8f9f6] no-underline transition-[transform,border-color,background-color] duration-500 hover:-translate-y-1.5 hover:border-[#a4be2d]/60 hover:bg-white/[.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a4be2d]"
      >
        <BrandArt b={b} alt={dup ? '' : `${b.name} brand artwork`} className="aspect-square" imgClass="transition-transform duration-[1200ms] ease-out group-hover/card:scale-[1.06]" />
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="m-0 text-lg font-bold tracking-[-.03em]">{b.name}</h3>
          </div>
          <p className="m-0 mt-1 text-xs font-semibold text-[#a4be2d]">{b.category}</p>
          <p className="m-0 mt-3 line-clamp-2 text-[13px] leading-[1.55] text-[#b9bfb0]">{b.short}</p>
        </div>
      </Link>
    </li>
  )
}

function MarqueeRow({ items, reverse = false, seconds = 70 }) {
  const loop = [...items, ...items]
  return (
    <div className="bm-row relative overflow-hidden py-3 [-webkit-mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]">
      <ul className={`bm-track m-0 flex w-max list-none gap-4 p-0 pr-4 sm:gap-5 sm:pr-5 ${reverse ? 'bm-rev' : ''}`} style={{ '--bm-d': `${seconds}s` }}>
        {loop.map((b, i) => <BrandCard key={`${b.id}-${i}`} b={b} dup={i >= items.length} />)}
      </ul>
    </div>
  )
}

function Portfolio() {
  const rows = [brands.filter((_, i) => i % 2 === 0), brands.filter((_, i) => i % 2 === 1)]
  const sectors = new Set(brands.map((b) => b.group)).size
  const stats = [[<CountUp key="b" to={brands.length} />, 'startups & businesses'], [<CountUp key="s" to={sectors} />, 'industries'], [<CountUp key="v" to={ventureCount} />, 'venture projects']]
  return (
    <section id="brands" aria-labelledby="brands-heading" className="relative overflow-hidden bg-[#171a1b] py-24 text-[#f8f9f6] sm:py-36">
      <style>{MARQUEE_CSS}</style>
      <div aria-hidden className="pointer-events-none absolute -top-48 left-1/2 size-[680px] -translate-x-1/2 rounded-full bg-[#a4be2d]/10 blur-3xl" />
      <div className={`${wrap} relative`}>
        <header className="mb-12 grid gap-8 sm:mb-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal className="mb-5 flex items-center gap-3 text-[13px] font-semibold text-[#a4be2d] before:h-px before:w-8 before:bg-[#a4be2d]">The work</Reveal>
            <Heading id="brands-heading" lines={[`${brands.length} builds.`, 'A lot of stories.']} className={h2cls} />
          </div>
          <Reveal delay={200} className="lg:col-span-4"><p className="max-w-[400px] text-[15px] leading-[1.65] text-[#a5ac9b]">Different industries. Different headaches. Some started as ideas, some needed structure, others needed a fresh way of doing things.</p></Reveal>
        </header>
        <dl className="m-0 grid grid-cols-3 border-y border-white/15">
          {stats.map(([n, label], i) => (
            <Reveal key={label} delay={i * 100} className={`flex flex-col py-6 sm:py-8 ${i ? 'border-l border-white/15 pl-4 sm:pl-8' : 'pr-4'}`}>
              <dd className="m-0 text-[clamp(30px,5vw,64px)] font-extrabold leading-none tracking-[-.05em] text-[#a4be2d]">{n}</dd>
              <dt className="order-2 mt-2 text-xs text-[#a5ac9b] sm:text-sm">{label}</dt>
            </Reveal>
          ))}
        </dl>
      </div>

      <div className="relative mt-10 space-y-2 sm:mt-14 sm:space-y-3">
        <MarqueeRow items={rows[0]} seconds={75} />
        <MarqueeRow items={rows[1]} seconds={85} reverse />
      </div>

      <div className={`${wrap} relative mt-12 flex flex-col items-start justify-between gap-6 sm:mt-16 sm:flex-row sm:items-center`}>
        <p className="m-0 max-w-[44ch] text-sm leading-[1.65] text-[#a5ac9b]">Tap any project to see what it is and the scope I worked on.</p>
        <Link to="/ventures#collection" className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-[#a4be2d] bg-[#a4be2d] px-6 text-sm font-semibold text-[#1e2618] no-underline transition-[transform,background-color] duration-200 hover:scale-[1.02] hover:bg-[#b3cc35] active:scale-[.98]">See All Startups &amp; Businesses <Arrow /></Link>
      </div>
    </section>
  )
}

/* ---------- Core expertise: dark tech cards with particles + animated icons ----------
   Visual only. Each card is a dark panel with a drifting dot-particle field that lights up and parts around the cursor,
   a soft lime glow and a lit border that follow the pointer, and an icon that comes alive on hover:
     Venture Architecture  layers that float apart (building up a structure)
     Business Strategy     compass whose needle swings to a bearing
     Brand & Growth        bars that grow with a rising arrow
     Systems & Scaling     meshed gears that turn
   On touch devices the card in view plays the same animation. Motion is switched off for reduced-motion visitors. */
const gearPath = (ro, ri, n, hole) => {
  const s = (Math.PI * 2) / n
  const pt = (r, a) => `${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`
  let d = ''
  for (let k = 0; k < n; k += 1) {
    const a = k * s
    d += `${k ? 'L' : 'M'}${pt(ri, a - 0.32 * s)}L${pt(ro, a - 0.2 * s)}L${pt(ro, a + 0.2 * s)}L${pt(ri, a + 0.32 * s)}`
  }
  return `${d}ZM${hole} 0a${hole} ${hole} 0 1 0 ${-2 * hole} 0a${hole} ${hole} 0 1 0 ${2 * hole} 0Z`
}
const GEAR_A = gearPath(26, 20, 8, 8)
const GEAR_B = gearPath(15, 11.5, 6, 4)
const COMPASS_TICKS = Array.from({ length: 12 }, (_, k) => {
  const a = (k * Math.PI) / 6
  return [48 + 26 * Math.cos(a), 48 + 26 * Math.sin(a), 48 + 29.5 * Math.cos(a), 48 + 29.5 * Math.sin(a)]
})

const Grad = ({ id }) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#e6f29a" />
      <stop offset="1" stopColor="#7c9318" />
    </linearGradient>
  </defs>
)

function IconLayers({ id }) {
  const rh = (cy) => `M48 ${cy - 16}L82 ${cy}L48 ${cy + 16}L14 ${cy}Z`
  return (
    <svg viewBox="0 0 96 96" className="tk-float tk-run size-full" aria-hidden>
      <Grad id={id} />
      <g stroke="#0e1112" strokeWidth="2" strokeLinejoin="round">
        <path className="tk-ly tk-ly-3" d={rh(64)} fill={`url(#${id})`} fillOpacity=".5" />
        <path className="tk-ly tk-ly-2" d={rh(50)} fill={`url(#${id})`} fillOpacity=".78" />
        <g className="tk-ly tk-ly-1">
          <path d={rh(36)} fill={`url(#${id})`} />
          <path d="M48 28L66 36L48 44L30 36Z" fill="#0e1112" fillOpacity=".28" stroke="none" />
        </g>
      </g>
    </svg>
  )
}

function IconCompass({ id }) {
  return (
    <svg viewBox="0 0 96 96" className="size-full" aria-hidden>
      <Grad id={id} />
      <circle cx="48" cy="48" r="38" fill={`url(#${id})`} />
      <circle cx="48" cy="48" r="31" fill="#0e1112" />
      <g className="tk-ticks tk-run" stroke="#a4be2d" strokeOpacity=".65" strokeWidth="2" strokeLinecap="round">
        {COMPASS_TICKS.map(([x1, y1, x2, y2], k) => <line key={k} x1={x1.toFixed(1)} y1={y1.toFixed(1)} x2={x2.toFixed(1)} y2={y2.toFixed(1)} />)}
      </g>
      <g className="tk-needle">
        <path d="M48 24L55 48H41Z" fill={`url(#${id})`} />
        <path d="M48 72L55 48H41Z" fill="#a4be2d" fillOpacity=".35" />
      </g>
      <circle cx="48" cy="48" r="3" fill="#0e1112" stroke="#d3e66b" strokeWidth="1.5" />
    </svg>
  )
}

function IconGrowth({ id }) {
  return (
    <svg viewBox="0 0 96 96" className="size-full" aria-hidden>
      <Grad id={id} />
      <g fill={`url(#${id})`}>
        <rect className="tk-bar tk-bar-1" x="14" y="58" width="16" height="24" rx="3" />
        <rect className="tk-bar tk-bar-2" x="40" y="44" width="16" height="38" rx="3" />
        <rect className="tk-bar tk-bar-3" x="66" y="30" width="16" height="52" rx="3" />
      </g>
      <g className="tk-arrow">
        <g className="tk-nudge tk-run" fill="none" stroke="#e6f29a" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 42L34 26L48 34L74 10" />
          <path d="M58 10H74V26" />
        </g>
      </g>
    </svg>
  )
}

function IconGears({ id }) {
  return (
    <svg viewBox="0 0 96 96" className="size-full" aria-hidden>
      <Grad id={id} />
      <g transform="translate(38 56)">
        <path className="tk-gear-a tk-run" d={GEAR_A} fill={`url(#${id})`} fillRule="evenodd" stroke="#0e1112" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <g transform="translate(68 32)">
        <path className="tk-gear-b tk-run" d={GEAR_B} fill={`url(#${id})`} fillOpacity=".85" fillRule="evenodd" stroke="#0e1112" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

const ICONS = [IconLayers, IconCompass, IconGrowth, IconGears]

const TECH_CSS = `
.tk-sec-grid{background-image:linear-gradient(rgba(23,26,27,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(23,26,27,.045) 1px,transparent 1px);background-size:56px 56px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 45%,#000 20%,transparent 100%);mask-image:radial-gradient(ellipse 80% 70% at 50% 45%,#000 20%,transparent 100%)}

/* card shell */
.tk-card{--mx:50%;--my:50%;background:linear-gradient(160deg,#181c1d 0%,#0d1011 100%);border:1px solid rgba(255,255,255,.08);box-shadow:0 24px 50px -34px rgba(8,12,6,.7);transition:transform .5s cubic-bezier(.16,1,.3,1),border-color .5s ease,box-shadow .5s ease}
.tk-card:is(:hover,[data-on="true"]){transform:translateY(-3px);border-color:rgba(164,190,45,.4);box-shadow:0 36px 70px -34px rgba(8,12,6,.8),0 0 44px -18px rgba(164,190,45,.4)}

/* light that follows the cursor */
.tk-corner{background:radial-gradient(120% 90% at 0% 0%,rgba(164,190,45,.3),transparent 55%)}
.tk-glow{background:radial-gradient(340px circle at var(--mx) var(--my),rgba(164,190,45,.2),transparent 65%)}
.tk-edge{padding:1px;border-radius:inherit;background:radial-gradient(260px circle at var(--mx) var(--my),rgba(190,214,64,.95),transparent 70%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)}
.tk-corner,.tk-glow,.tk-edge{opacity:0;transition:opacity .6s ease}
.tk-card:is(:hover,[data-on="true"]) :is(.tk-corner,.tk-glow,.tk-edge){opacity:1}

/* icon holder */
.tk-icon{position:relative;display:grid;width:104px;height:104px;place-items:center}
.tk-orbit{position:absolute;inset:0;opacity:.45;transition:opacity .5s ease;animation:tk-rot 16s linear infinite}
.tk-art{display:block;width:84px;height:84px;opacity:.72;filter:saturate(.8) drop-shadow(0 0 0 rgba(164,190,45,0));transition:opacity .5s ease,filter .6s ease,transform .6s cubic-bezier(.16,1,.3,1)}
.tk-card:is(:hover,[data-on="true"]) .tk-art{opacity:1;filter:saturate(1.1) drop-shadow(0 0 14px rgba(164,190,45,.6));transform:scale(1.06)}
.tk-card:is(:hover,[data-on="true"]) .tk-orbit{opacity:1}

/* looping motion (paused until the card is active, so nothing snaps back on leave) */
@keyframes tk-rot{to{transform:rotate(360deg)}}
@keyframes tk-rot-rev{to{transform:rotate(-360deg)}}
@keyframes tk-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes tk-nudge{0%,100%{transform:translate(0,0)}50%{transform:translate(3px,-3px)}}
.tk-ticks,.tk-gear-a,.tk-gear-b,.tk-nudge,.tk-ly{transform-box:fill-box;transform-origin:center}
.tk-ticks{animation:tk-rot 24s linear infinite}
.tk-gear-a{animation:tk-rot 14s linear infinite}
.tk-gear-b{animation:tk-rot-rev 10.5s linear infinite}
.tk-float{animation:tk-bob 3.2s ease-in-out infinite}
.tk-nudge{animation:tk-nudge 1.8s ease-in-out infinite}
.tk-run,.tk-orbit{animation-play-state:paused}
.tk-card:is(:hover,[data-on="true"]) :is(.tk-run,.tk-orbit){animation-play-state:running}

/* state changes */
.tk-ly{transition:transform .8s cubic-bezier(.34,1.56,.64,1)}
.tk-card:is(:hover,[data-on="true"]) .tk-ly-1{transform:translateY(-10px)}
.tk-card:is(:hover,[data-on="true"]) .tk-ly-3{transform:translateY(10px)}
.tk-needle{transform-box:fill-box;transform-origin:center;transition:transform 1.1s cubic-bezier(.34,1.56,.64,1)}
.tk-card:is(:hover,[data-on="true"]) .tk-needle{transform:rotate(50deg)}
.tk-bar{transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(.6);transition:transform .9s cubic-bezier(.34,1.56,.64,1)}
.tk-bar-2{transition-delay:.08s}
.tk-bar-3{transition-delay:.16s}
.tk-card:is(:hover,[data-on="true"]) .tk-bar{transform:scaleY(1)}
.tk-arrow{transition:transform .9s cubic-bezier(.34,1.56,.64,1)}
.tk-card:is(:hover,[data-on="true"]) .tk-arrow{transform:translate(4px,-4px)}

/* text bits */
.tk-badge{border:1px solid rgba(255,255,255,.14);color:#a4be2d;transition:border-color .5s ease,background-color .5s ease}
.tk-card:is(:hover,[data-on="true"]) .tk-badge{border-color:rgba(164,190,45,.55);background-color:rgba(164,190,45,.1)}
.tk-tag{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#cfd5c5;transition:border-color .5s ease,background-color .5s ease,color .5s ease}
.tk-card:is(:hover,[data-on="true"]) .tk-tag{border-color:rgba(164,190,45,.45);background:rgba(164,190,45,.08);color:#e4eccd}
.tk-line{transform:scaleX(.12);transform-origin:left;transition:transform .9s cubic-bezier(.16,1,.3,1)}
.tk-card:is(:hover,[data-on="true"]) .tk-line{transform:scaleX(1)}

@media (prefers-reduced-motion:reduce){
  .tk-orbit,.tk-ticks,.tk-gear-a,.tk-gear-b,.tk-float,.tk-nudge{animation:none}
  .tk-card,.tk-ly,.tk-needle,.tk-bar,.tk-arrow,.tk-art,.tk-line{transition-duration:.01ms}
}
`

/* Dot particles: a grid of dots that drift and twinkle, then light up and part around the cursor. Only runs while on screen. */
function ParticleField({ pointer }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return undefined
    const still = calm()
    const GAP = 16
    const R = 130
    const t0 = performance.now()
    let w = 0
    let h = 0
    let dots = []
    let raf = 0
    let live = false
    let last = 0
    const build = () => {
      const r = c.getBoundingClientRect()
      w = r.width
      h = r.height
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      c.width = Math.round(w * dpr)
      c.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      for (let y = GAP / 2; y < h; y += GAP) for (let x = GAP / 2; x < w; x += GAP) dots.push({ x, y, p: Math.random() * 6.283, s: 0.5 + Math.random() })
    }
    const paint = (tm) => {
      ctx.clearRect(0, 0, w, h)
      const P = pointer.current
      let color = ''
      for (let i = 0; i < dots.length; i += 1) {
        const d = dots[i]
        let a = 0.1 + 0.07 * Math.sin(tm * d.s + d.p)
        let x = d.x + Math.sin(tm * 0.5 + d.p) * 1.2
        let y = d.y + Math.cos(tm * 0.4 + d.p) * 1.2
        let size = 1.6
        let hot = false
        if (P.on) {
          const dx = x - P.x
          const dy = y - P.y
          const dist = Math.hypot(dx, dy)
          if (dist < R) {
            const k = 1 - dist / R
            a += k * 0.8
            size += k * 1.6
            hot = true
            if (dist > 0.01) { x += (dx / dist) * k * 7; y += (dy / dist) * k * 7 }
          }
        }
        const col = hot ? '#b8d23c' : '#d6dfc8'
        if (col !== color) { ctx.fillStyle = col; color = col }
        ctx.globalAlpha = Math.min(1, a)
        ctx.fillRect(x - size / 2, y - size / 2, size, size)
      }
      ctx.globalAlpha = 1
    }
    const frame = (now) => {
      raf = 0
      if (live && !still) raf = requestAnimationFrame(frame)
      if (now - last < 32) return
      last = now
      paint((now - t0) / 1000)
    }
    const io = new IntersectionObserver(([en]) => {
      live = en.isIntersecting
      if (!live) return
      if (still) paint(0)
      else if (!raf) raf = requestAnimationFrame(frame)
    })
    const ro = new ResizeObserver(() => { build(); if (still && live) paint(0) })
    build()
    io.observe(c)
    ro.observe(c)
    return () => { live = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect() }
  }, [pointer])
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full" />
}

function TechCard({ e, i }) {
  const ref = useRef(null)
  const pointer = useRef({ x: 0, y: 0, on: false })
  const Icon = ICONS[i]
  const move = (ev) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ev.clientX - r.left
    const y = ev.clientY - r.top
    pointer.current.x = x
    pointer.current.y = y
    pointer.current.on = true
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
  }
  const leave = () => { pointer.current.on = false }
  /* touch screens have no hover: the card that is mostly in view plays its animation */
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(hover: none)').matches) return undefined
    const io = new IntersectionObserver(([en]) => el.setAttribute('data-on', en.intersectionRatio > 0.6 ? 'true' : 'false'), { threshold: [0, 0.6] })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <article ref={ref} onPointerMove={move} onPointerLeave={leave} className="tk-card group relative isolate flex h-full min-h-[380px] w-full flex-col overflow-hidden rounded-[20px] p-7 sm:p-9">
      <span aria-hidden className="tk-corner absolute inset-0 -z-10" />
      <span aria-hidden className="tk-glow absolute inset-0 -z-10" />
      <ParticleField pointer={pointer} />
      <span aria-hidden className="tk-edge pointer-events-none absolute inset-0" />

      <div className="relative flex items-start justify-between">
        <span className="tk-icon">
          <svg viewBox="0 0 104 104" className="tk-orbit" fill="none" aria-hidden><circle cx="52" cy="52" r="50" stroke="rgba(164,190,45,.55)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="110 205" /></svg>
          <span className="tk-art"><Icon id={`tki-${i}`} /></span>
        </span>
        <span className="tk-badge grid size-10 place-items-center rounded-full text-xs font-bold tabular-nums">0{i + 1}</span>
      </div>

      <div className="relative mt-auto pt-10">
        <h3 className="max-w-[420px] text-[clamp(24px,2.4vw,34px)] font-bold leading-[1.1] tracking-[-.035em] text-white">{e.title}</h3>
        <p className="mt-4 max-w-[420px] text-[15px] leading-[1.6] text-[#a5ac9b]">{e.desc}</p>
        <ul className="mt-7 flex flex-wrap gap-2 border-t border-white/10 pt-6 text-[11px]">
          {e.tags.map((t) => <li key={t} className="tk-tag rounded-full px-3 py-1.5">{t}</li>)}
        </ul>
      </div>

      <span aria-hidden className="tk-line absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#7c9318] to-[#c5d96a]" />
    </article>
  )
}

/* ---------- Strategy calls: "Got 100 questions?" ----------
   One dark stage with a pointer-following light and a giant outlined question mark.
   Left: the three calls as a picker. Each call is a question the visitor might be asking.
   Right: a lime answer card for the picked call, with a three-step roadmap that draws itself.
   The picker advances by itself (the progress line under the active call drives it), pauses on hover/focus or when off screen,
   and stops for good as soon as the visitor picks one. Reduced-motion visitors get a static version with no autoplay.
   Content comes from `principles` (question = first sentence, answer = the rest) and `impact` above. */
const callSteps = [
  ['What makes sense', 'What needs testing', 'What to do next'],
  ['The business', 'The gaps', 'What needs attention'],
  ['SOPs', 'Teams', 'Workflows'],
]
const calls = principles.map(([title, text], i) => {
  const k = text.indexOf('?') + 1
  return { title, q: text.slice(0, k), a: text.slice(k).trim(), steps: callSteps[i] }
})

const CALLS_CSS = `
.qa-panel{--mx:78%;--my:14%;background:linear-gradient(165deg,#1a1e1f 0%,#0e1112 100%);box-shadow:0 44px 90px -56px rgba(10,14,6,.85)}
.qa-grid{background-image:radial-gradient(rgba(214,223,200,.12) 1px,transparent 1.3px);background-size:24px 24px;-webkit-mask-image:radial-gradient(ellipse 85% 75% at 70% 30%,#000 5%,transparent 100%);mask-image:radial-gradient(ellipse 85% 75% at 70% 30%,#000 5%,transparent 100%)}
.qa-spot{background:radial-gradient(560px circle at var(--mx) var(--my),rgba(164,190,45,.17),transparent 65%);opacity:.75;transition:opacity .6s ease}
.qa-panel:hover .qa-spot{opacity:1}
.qa-mark{position:absolute;right:-1%;top:-14%;font-size:clamp(300px,44vw,620px);font-weight:800;line-height:1;letter-spacing:-.06em;color:transparent;-webkit-text-stroke:1.5px rgba(164,190,45,.2);transform:rotate(7deg);animation:qa-float 10s ease-in-out infinite}
@keyframes qa-float{0%,100%{transform:translateY(0) rotate(7deg)}50%{transform:translateY(-16px) rotate(7deg)}}

/* picker */
.qa-tab{transition:border-color .5s ease,background-color .5s ease}
.qa-tab:focus-visible,.qa-cta:focus-visible{outline:2px solid #a4be2d;outline-offset:3px}
.qa-fill{transform-origin:left;animation:qa-fill 7s linear forwards}
@keyframes qa-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.qa-stage:hover .qa-fill,.qa-stage:focus-within .qa-fill{animation-play-state:paused}

/* answer card */
.qa-card{background:linear-gradient(140deg,#c4dc4a 0%,#a4be2d 55%,#8ea61b 100%);box-shadow:0 30px 70px -40px rgba(164,190,45,.55)}
.qa-card-dots{background-image:radial-gradient(rgba(26,34,16,.2) 1px,transparent 1.3px);background-size:16px 16px;-webkit-mask-image:linear-gradient(135deg,transparent 45%,#000 100%);mask-image:linear-gradient(135deg,transparent 45%,#000 100%)}
.qa-up{animation:qa-up .9s cubic-bezier(.16,1,.3,1) both}
@keyframes qa-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.qa-line{transform-origin:left;animation:qa-line 1.3s linear .5s both}
@keyframes qa-line{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.qa-node{background:#171a1b;color:#c8e24a;animation:qa-node .5s ease both}
@keyframes qa-node{from{background:rgba(23,26,27,0);color:#1a2210;transform:scale(.85)}to{background:#171a1b;color:#c8e24a;transform:scale(1)}}

/* numbers */
.qa-num{display:inline-block;background:linear-gradient(180deg,#eef7b0 0%,#a4be2d 60%,#7c9318 100%);-webkit-background-clip:text;background-clip:text;color:transparent}

@media (prefers-reduced-motion:reduce){
  .qa-mark{animation:none}
  .qa-fill,.qa-up,.qa-line,.qa-node{animation:none}
  .qa-spot,.qa-tab{transition-duration:.01ms}
}
`

function Conversation() {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(() => !calm())
  const [live, setLive] = useState(false)
  const panel = useRef(null)
  const stage = useRef(null)
  const call = calls[active]
  const pick = (i) => { setActive(i); setAuto(false) }
  const next = () => setActive((a) => (a + 1) % calls.length)
  const spot = (ev) => {
    const el = panel.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${ev.clientX - r.left}px`)
    el.style.setProperty('--my', `${ev.clientY - r.top}px`)
  }
  /* the autoplay only runs while the picker is on screen */
  useEffect(() => {
    const el = stage.current
    if (!el) return undefined
    const io = new IntersectionObserver(([en]) => setLive(en.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section aria-labelledby="principles-heading" className="bg-[#f2f3ef] py-20 sm:py-24">
      <style>{CALLS_CSS}</style>
      <div className={wrap}>
        <div ref={panel} onPointerMove={spot} className="qa-panel relative isolate overflow-hidden rounded-[24px] px-5 py-12 text-[#f8f9f6] sm:rounded-[32px] sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <span aria-hidden className="qa-grid pointer-events-none absolute inset-0 -z-10" />
          <span aria-hidden className="qa-spot pointer-events-none absolute inset-0 -z-10" />
          <span aria-hidden className="qa-mark pointer-events-none -z-10 select-none">?</span>

          <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Reveal className="mb-5 flex items-center gap-3 text-[13px] font-semibold text-[#a4be2d] before:h-px before:w-8 before:bg-[#a4be2d]">One conversation can help</Reveal>
              <Heading id="principles-heading" lines={['Got 100 questions?', <span className="text-[#a4be2d]">Start with the right one.</span>]} className="text-[clamp(32px,4.4vw,58px)] font-extrabold leading-[1.02] tracking-[-.045em]" />
            </div>
            <Reveal delay={180} className="max-w-md text-sm leading-[1.7] text-[#a5ac9b] lg:col-span-4 lg:pb-2 lg:text-base">You don’t always need a complete business transformation. Sometimes you just need a focused conversation to decide what to do next.</Reveal>
          </header>

          <div ref={stage} className="qa-stage mt-12 grid gap-4 sm:mt-16 lg:grid-cols-12 lg:gap-6">
            {/* the picker */}
            <Reveal delay={80} className="flex flex-col gap-3 lg:col-span-5">
              {calls.map((c, i) => {
                const on = active === i
                return (
                  <button
                    key={c.title}
                    type="button"
                    aria-pressed={on}
                    onClick={() => pick(i)}
                    className={`qa-tab group relative flex-1 overflow-hidden rounded-2xl border p-5 text-left sm:p-6 ${on ? 'border-[#a4be2d]/50 bg-white/[.07]' : 'border-white/10 bg-white/[.02] hover:border-white/25 hover:bg-white/[.04]'}`}
                  >
                    <span className="flex items-start gap-4">
                      <span className={`grid size-9 shrink-0 place-items-center rounded-full border text-xs font-bold tabular-nums transition-colors duration-500 ${on ? 'border-[#a4be2d] bg-[#a4be2d] text-[#1e2618]' : 'border-white/20 text-[#a4be2d] group-hover:border-[#a4be2d]/60'}`}>0{i + 1}</span>
                      <span className="block">
                        <span className="block text-xl font-bold leading-tight tracking-[-.03em] sm:text-2xl">{c.title}</span>
                        <span className={`mt-1.5 block text-sm leading-[1.5] transition-colors duration-500 ${on ? 'text-[#d3dac6]' : 'text-[#8f9686]'}`}>{c.q}</span>
                      </span>
                    </span>
                    {on && (
                      <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
                        <span className={`block h-full bg-[#a4be2d] ${auto ? 'qa-fill' : ''}`} style={auto && !live ? { animationPlayState: 'paused' } : undefined} onAnimationEnd={auto ? next : undefined} />
                      </span>
                    )}
                  </button>
                )
              })}
            </Reveal>

            {/* the answer */}
            <Reveal delay={160} className="lg:col-span-7">
              <div aria-live="polite" className="qa-card relative flex h-full min-h-[440px] flex-col overflow-hidden rounded-[22px] p-6 text-[#1a2210] sm:p-9 lg:p-10">
                <span aria-hidden className="qa-card-dots absolute inset-0" />
                <div key={active} className="relative flex flex-1 flex-col">
                  <h3 className="qa-up relative max-w-[560px] text-[clamp(26px,3.2vw,46px)] font-extrabold leading-[1.04] tracking-[-.045em]">{call.q}</h3>
                  <p className="qa-up relative mt-5 max-w-[480px] text-base leading-[1.6] text-[#2d3a12] sm:text-lg" style={{ animationDelay: '140ms' }}>{call.a}</p>

                  <div className="relative mt-auto pt-12">
                    <span aria-hidden className="absolute left-[16.66%] right-[16.66%] top-[calc(3rem+14px)] h-px bg-[#1a2210]/20">
                      <span className="qa-line block h-full bg-[#1a2210]" />
                    </span>
                    <ol className="relative grid grid-cols-3 gap-3">
                      {call.steps.map((t, k) => (
                        <li key={t} className="flex flex-col items-center text-center">
                          <span className="qa-node grid size-7 place-items-center rounded-full border border-[#1a2210] text-[11px] font-bold" style={{ animationDelay: `${500 + k * 650}ms` }}>{k + 1}</span>
                          <span className="qa-up mt-3 text-[13px] font-semibold leading-tight sm:text-sm" style={{ animationDelay: `${500 + k * 650}ms` }}>{t}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <Link to="/contact" className="qa-cta group mt-9 inline-flex min-h-12 w-fit items-center gap-3 rounded-full bg-[#171a1b] px-6 text-[13px] font-semibold text-[#f8f9f6] no-underline transition-[transform,background-color] duration-300 hover:bg-black active:scale-[.97]">Book this call <Arrow /></Link>
                </div>
              </div>
            </Reveal>
          </div>

          {/* numbers */}
          <dl className="m-0 mt-12 grid border-t border-white/15 sm:mt-16 sm:grid-cols-3">
            {impact.map(([n, s, unit, text], i) => (
              <Reveal key={unit} delay={i * 120} className={`group relative py-8 sm:pr-8 ${i ? 'sm:border-l sm:border-white/15 sm:pl-8' : ''}`}>
                <span aria-hidden className="absolute left-0 top-[-1px] h-px w-12 bg-[#a4be2d] transition-[width] duration-700 group-hover:w-full" />
                <dt className="sr-only">{unit}</dt>
                <dd className="m-0">
                  <span className="flex items-baseline gap-3">
                    <strong className="qa-num text-[clamp(52px,6vw,92px)] font-extrabold leading-none tracking-[-.06em]"><CountUp to={n} suffix={s} /></strong>
                    <span aria-hidden className="whitespace-nowrap text-[clamp(18px,2vw,26px)] font-bold tracking-[-.02em]">{unit}</span>
                  </span>
                  <p className="mt-3 max-w-[260px] text-[13px] leading-[1.55] text-[#a5ac9b]">{text}</p>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [ready, setReady] = useState(calm)
  const [statRef, p] = useScrollProgress()
  useEffect(() => {
    document.title = 'Hashir Usman | Startup Architect, Venture Builder & Business Consultant'
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
              <Heading tag="h2" on={ready} delay={120} className="mt-7 text-[clamp(40px,5vw,88px)] font-extrabold leading-[.94] tracking-[-.065em]" lines={['Is your business growing?', <span className="text-[#7c9318]">Or just getting busier?</span>]} />
              <p className="mt-6 max-w-[600px] text-base leading-[1.6] text-[#2f332e] sm:text-lg xl:text-xl" style={rise(ready, 500)}>Startup architect. Venture builder. Business consultant. I help people start businesses, fix what’s not working, and build systems that make growth a little less chaotic.</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3" style={rise(ready, 620)}>
                <Link to="/contact" className="group inline-flex min-h-12 items-center gap-3 rounded border-[1.5px] border-[#a4be2d] bg-[#a4be2d] px-6 text-[13px] font-semibold text-[#1e2618] transition-colors duration-300 hover:border-[#b3cc35] hover:bg-[#b3cc35] active:scale-[.97]">Book a Strategy Call <Arrow /></Link>
                <Link to="/ventures" className="group inline-flex min-h-12 items-center gap-3 rounded border-[1.5px] border-[#a4aaa0] px-6 text-[13px] font-semibold transition-colors duration-300 hover:border-[#171a1b] hover:bg-[#171a1b] hover:text-white active:scale-[.97]">See My Work <Arrow /></Link>
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
              <p className="mb-4 text-[13px] font-semibold text-[#a4be2d]">A little about me</p>
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

      {/* 3. Core expertise: dark tech cards, particles + animated icons */}
      <section id="services" aria-labelledby="expertise-heading" className="relative isolate overflow-hidden py-24 sm:py-36">
        <style>{TECH_CSS}</style>
        <div aria-hidden className="tk-sec-grid pointer-events-none absolute inset-0 -z-10" />
        <div className={wrap}>
          <header className="mb-14 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Reveal className={eyebrow}>The bigger picture</Reveal>
              <Heading id="expertise-heading" lines={['Four things I spend a lot', 'of time thinking about.']} className={h2cls} />
            </div>
            <Reveal delay={200} className="lg:col-span-4"><p className="max-w-[380px] text-[15px] leading-[1.65] text-[#72766f]">From that first crazy idea to a business that’s ready for its next big move.</p></Reveal>
          </header>
          <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
            {expertise.map((e, i) => (
              <Reveal key={e.title} delay={(i % 2) * 120} className="h-full">
                <TechCard e={e} i={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Strategic framework */}
      <Framework />

      {/* 5b. Brand portfolio: all brand images with a short description each, linking to the Ventures page */}
      <Portfolio />

      {/* 6. Strategy calls & numbers */}
      <Conversation />
    </main>
  )
}