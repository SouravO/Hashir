import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChartLineUp, Compass, Gear, SquaresFour } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { brands } from '../data/brands'

/* ---------- Editable content (taken from the HU. content blueprint) ---------- */
const statement = 'I build businesses, and fix a few things along the way. I work with *startup founders*, *business owners*, and *teams* to turn ideas into plans, and plans into action.'
const styledWords = (text) => {
  const tokens = text.split(' ')
  return tokens.map((token, index) => {
    const start = tokens.slice(0, index + 1).findLastIndex((word) => word.startsWith('*'))
    const end = tokens.slice(0, index).findLastIndex((word) => /\*\W*$/.test(word))
    return [token.replaceAll('*', ''), start > end]
  })
}

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
    if (!seen || calm()) return undefined
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
   2.60 - 3.00  GROWTH       Crisp roof edges and rooftop plant room, entrance with canopy, trees, windows light up,
                             and the green HU. flag is raised on the roof. Finished building.

   Shape: a tall glass office tower seen from a corner, so the front face, the shaded side face and the roofs are all visible.
   A wide podium at the base, a 12-floor main tower, and a narrower 4-floor upper section that steps back at the top.
   Every roof has a solid edge band (parapet). No antenna, no mast. The only thing above the plant room is the flagpole.
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
/* Flagpole standing on the rooftop plant room: screen position of its base, pole height, and flag size. */
const FLAG = { x: UPPER.x0 + 44 + K * (UPPER.z0 + 22), y: GROUND - (UPPER_TOP + 9) - L * (UPPER.z0 + 22), pole: 24, w: 28, h: 15 }

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
  const flagP = up((s - 2.75) / 0.2)
  const capIdx = s < 0.35 ? 0 : s < 0.95 ? 1 : s < 1.95 ? 2 : s < 2.6 ? 3 : s < 2.95 ? 4 : 5
  const doorX = PODIUM.x0 + PODIUM.w / 2
  const poleTop = FLAG.y - FLAG.pole
  const flagTop = poleTop + 2
  const flagPath = `M${FLAG.x} ${flagTop}C${FLAG.x + FLAG.w * 0.3} ${flagTop - 2.5} ${FLAG.x + FLAG.w * 0.65} ${flagTop + 2.5} ${FLAG.x + FLAG.w} ${flagTop}V${flagTop + FLAG.h}C${FLAG.x + FLAG.w * 0.65} ${flagTop + FLAG.h + 2.5} ${FLAG.x + FLAG.w * 0.3} ${flagTop + FLAG.h - 2.5} ${FLAG.x} ${flagTop + FLAG.h}Z`
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

      {/* GROWTH: flagpole on the plant room with the green HU. flag */}
      <g style={fade(flagP)}>
        <path d={`M${FLAG.x} ${FLAG.y}V${poleTop}`} strokeWidth="1.4" />
        <circle cx={FLAG.x} cy={poleTop - 1.5} r="1.6" fill="#a4be2d" stroke="none" />
      </g>
      <g style={grow(`${FLAG.x}px ${flagTop + FLAG.h / 2}px`, 'scaleX', flagP)}>
        <path d={flagPath} fill="#a4be2d" stroke="none" />
        <text x={FLAG.x + FLAG.w / 2} y={flagTop + FLAG.h / 2 + 3} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={DARK} stroke="none">HU.</text>
      </g>

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
    <section id="framework" className="bg-[#f2f3ef] pb-24 pt-8 sm:py-36" aria-labelledby="framework-title">
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

/* ---------- One looping, wave-like row of venture logos ---------- */
const logoVentures = [
  ['davone-removebg-preview.png', 'dayone'], ['heydossa-removebg-preview.png', 'heydossa'],
  ['SUITE-SPOT-removebg-preview.png', 'suite-spot'], ['popsi-removebg-preview.png', 'popsi'],
  ['NOWO-removebg-preview.png', 'no-two'], ['nothingelse-removebg-preview.png', 'nothing-else'],
  ['CarBrOker-removebg-preview.png', 'car-broker'], ['zaati-removebg-preview.png', 'zaati'],
  ['ezka-removebg-preview.png', 'ezkaa'], ['moonBLISS-removebg-preview.png', 'moonbliss'],
  ['HOUSE-of-Biss-removebg-preview.png', 'house-of-bliss'], ['DE-COFF-removebg-preview.png', 'de-coff'],
  ['aidesignersecosystem-removebg-preview.png', 'ai-designers'], ['barelogic-removebg-preview.png', 'bare-logic'],
  ['celebrations-e-removebg-preview.png', 'celebrations'], ['beyondthebussiness-removebg-preview.png', 'beyond-the-business'],
  ['CURRY-BAG-removebg-preview.png', 'curry-bag'], ['the-grid-store-removebg-preview.png', 'the-grid-store'],
  ['hungry-potato-removebg-preview.png', 'hungry-potato'], ['Hosther_hostels-removebg-preview.png', 'hosther'],
  ['sOl-removebg-preview.png', 'sol'], ['nk-reactives-removebg-preview.png', 'nk-reactives'],
  ['hyzo-removebg-preview.png', 'hyzo'],
]
const logoById = new Map(brands.map((brand) => [brand.id, brand]))
const LOGO_CAROUSEL_CSS = `
@keyframes venture-loop{to{transform:translate3d(-50%,0,0)}}
.venture-track{animation:venture-loop 64s linear infinite;will-change:transform}
.venture-track-reverse{animation-direction:reverse}
.venture-window:hover .venture-track,.venture-window:focus-within .venture-track{animation-play-state:paused}
@media(max-width:640px){.venture-track{animation-duration:52s}}
@media(prefers-reduced-motion:reduce){.venture-track{animation:none;transform:none}.venture-duplicates{display:none}.venture-window{overflow-x:auto}}
`

function Portfolio() {
  const rows = [logoVentures.filter((_, index) => index % 2 === 0), logoVentures.filter((_, index) => index % 2 === 1)]
  return (
    <section id="brands" aria-label="Venture logos" className="overflow-hidden bg-[#171a1b] py-16 sm:py-24">
      <style>{LOGO_CAROUSEL_CSS}</style>
      <h2 className="mb-6 text-center text-[clamp(30px,4.5vw,54px)] font-extrabold leading-[1.05] tracking-[-.055em] text-white sm:mb-8">
        Ventures <span className="text-[#a4be2d]">I’ve helped build</span>
      </h2>
      <div className="venture-carousel space-y-0">
        {rows.map((items, rowIndex) => {
          const loop = [...items, ...items]
          return <div key={rowIndex} className="venture-window overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]">
            <ul className={`venture-track m-0 flex w-max list-none items-center gap-8 p-0 pr-8 sm:gap-14 sm:pr-14 lg:gap-20 lg:pr-20 ${rowIndex ? 'venture-track-reverse' : ''}`}>
              {loop.map(([file, id], index) => {
                const brand = logoById.get(id)
                const duplicate = index >= items.length
                if (!brand) return null
                return (
                  <li key={`${id}-${index}`} aria-hidden={duplicate || undefined} className={`flex h-32 w-[170px] shrink-0 items-center justify-center sm:h-44 sm:w-[230px] ${duplicate ? 'venture-duplicates' : ''}`}>
                    <Link to={`/ventures#brand-${id}`} tabIndex={duplicate ? -1 : undefined} aria-label={duplicate ? undefined : `View ${brand.name}`} className="grid size-full place-items-center rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4be2d]">
                      <img src={`/caurosal/${encodeURIComponent(file)}`} alt={duplicate ? '' : brand.name} loading="lazy" draggable="false" className="max-h-[90%] max-w-[94%] object-contain transition-transform duration-300 hover:scale-110" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        })}
      </div>
    </section>
  )
}

const EXPERTISE_ICONS = [SquaresFour, Compass, ChartLineUp, Gear]

function TechCard({ e, i }) {
  const Icon = EXPERTISE_ICONS[i]
  return (
    <article className="group flex h-full min-h-[320px] flex-col rounded-[22px] border border-white/10 bg-[#171a1b] p-7 transition-colors duration-300 hover:border-[#a4be2d]/45 hover:bg-[#1c211d] sm:min-h-[340px] sm:p-9">
      <div className="flex items-start justify-between">
        <span className="grid size-14 place-items-center rounded-2xl bg-[#a4be2d]/10 text-[#b8d23c]">
          <Icon size={30} weight="light" aria-hidden />
        </span>
        <span className="grid size-9 place-items-center rounded-full border border-white/15 text-xs font-semibold tabular-nums text-[#a4be2d]">0{i + 1}</span>
      </div>
      <div className="mt-auto pt-9">
        <h3 className="text-[clamp(24px,2.4vw,34px)] font-bold leading-[1.1] tracking-[-.035em] text-white">{e.title}</h3>
        <p className="mt-3 max-w-[44ch] text-[15px] leading-[1.65] text-[#b7beb0]">{e.desc}</p>
        <ul className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5 text-[11px]">
          {e.tags.map((tag) => <li key={tag} className="rounded-full border border-white/15 px-3 py-1.5 text-[#d2d8cb]">{tag}</li>)}
        </ul>
      </div>
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
  const words = styledWords(statement)
  const line = (d) => ({ strokeDashoffset: ready ? 0 : 1, transition: `stroke-dashoffset 1800ms ${EASE} ${d}ms` })

  return (
    <main id="main" className="overflow-x-clip font-sans text-[#171a17]">
      {/* 1. Hero */}
      <section id="home" aria-labelledby="hero-title" className="relative flex min-h-[calc(100svh-72px)] flex-col max-[768px]:min-h-[calc(100svh-64px)]">
        <div className="mx-auto flex w-full max-w-[1720px] flex-1 flex-col px-5 py-10 sm:px-8 sm:py-12 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid flex-1 items-center gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            <div className="contents lg:col-span-7 lg:block">
              <div style={rise(ready)}>
                <h1 id="hero-title" className="text-[clamp(60px,7.8vw,138px)] font-extrabold leading-[.88] tracking-[-.075em]">Hashir Usman</h1>
              </div>
              <Heading tag="h2" on={ready} delay={120} className="mt-7 text-[clamp(40px,5vw,88px)] font-extrabold leading-[.94] tracking-[-.065em]" lines={['Is your business growing?', <span className="text-[#7c9318]">Or just getting busier?</span>]} />
              <p className="order-1 mt-6 max-w-[600px] text-base leading-[1.6] text-[#2f332e] sm:text-lg xl:text-xl lg:order-none" style={rise(ready, 500)}>Startup architect. Venture builder. Business consultant. I help people start businesses, fix what’s not working, and build systems that make growth a little less chaotic.</p>
              <div className="order-3 mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 lg:order-none" style={rise(ready, 620)}>
                <Link to="/contact" className="group inline-flex min-h-12 items-center gap-3 rounded border-[1.5px] border-[#a4be2d] bg-[#a4be2d] px-6 text-[13px] font-semibold text-[#1e2618] transition-colors duration-300 hover:border-[#b3cc35] hover:bg-[#b3cc35] active:scale-[.97]">Book a Strategy Call <Arrow /></Link>
                <Link to="/ventures" className="group inline-flex min-h-12 items-center gap-3 rounded border-[1.5px] border-[#a4aaa0] px-6 text-[13px] font-semibold transition-colors duration-300 hover:border-[#171a1b] hover:bg-[#171a1b] hover:text-white active:scale-[.97]">See My Work <Arrow /></Link>
              </div>
            </div>
            <div className="order-2 lg:order-none lg:col-span-5">
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

      {/* 3. Core expertise */}
      <section id="services" aria-labelledby="expertise-heading" className="bg-[#f2f3ef] pb-0 pt-20 sm:py-28">
        <div className={wrap}>
          <header className="mb-12 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Reveal className={eyebrow}>The bigger picture</Reveal>
              <Heading id="expertise-heading" lines={['Four things I spend a lot', 'of time thinking about.']} className={h2cls} />
            </div>
            <Reveal delay={200} className="lg:col-span-4"><p className="max-w-[380px] text-[15px] leading-[1.65] text-[#72766f]">From that first crazy idea to a business that’s ready for its next big move.</p></Reveal>
          </header>
          <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
            {expertise.map((item, index) => (
              <Reveal key={item.title} delay={(index % 2) * 100} className="h-full">
                <TechCard e={item} i={index} />
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
