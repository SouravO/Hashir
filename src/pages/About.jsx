import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MapPin } from '@phosphor-icons/react'

/* -------------------------------------------------------------------------------------------
   ABOUT PAGE · "Built Along the Way" career journey

   A real roadmap: a winding road drawn as you scroll, nine chapters as stops on it, and the
   chapter you are reading is the one that is lit. All scroll-linked motion runs through ONE
   shared requestAnimationFrame loop (reads first, writes second) to avoid layout thrash.

   Palette: ink #101310 · forest #153B2B · lime #a4be2d · paper #F2F3EF · olive #617319
------------------------------------------------------------------------------------------- */

const wrap = 'mx-auto w-full max-w-[1320px] px-[18px] md:px-7'
const sectionPad = 'py-[clamp(56px,7vw,112px)]'
const REVEAL = 'clamp(0, calc((var(--p,1) - .08) / .3), 1)'

const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect
const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------- Shared scroll loop (one rAF for everything) -------------------- */

const subs = new Set()
let raf = 0
let bound = false

function tick() {
  raf = 0
  const vh = window.innerHeight
  const list = Array.from(subs)
  const values = list.map((s) => s.read(vh)) // 1) read every layout value
  list.forEach((s, i) => s.write(values[i])) // 2) then write every style
}
const request = () => { if (!raf) raf = requestAnimationFrame(tick) }

function subscribe(sub) {
  subs.add(sub)
  if (!bound) {
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    bound = true
  }
  sub.write(sub.read(window.innerHeight)) // paint the right state before the first frame
  return () => {
    subs.delete(sub)
    if (!subs.size && bound) {
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      cancelAnimationFrame(raf)
      raf = 0
      bound = false
    }
  }
}

// Writes scroll progress (0 as the element enters the viewport, 1 as it leaves) into --p.
function useProgress(ref) {
  useIso(() => {
    const el = ref.current
    if (!el) return undefined
    if (prefersReduced()) {
      el.style.setProperty('--p', '.5')
      return undefined
    }
    let last = ''
    return subscribe({
      read: (vh) => {
        const r = el.getBoundingClientRect()
        return unit((vh - r.top) / (vh + r.height)).toFixed(3)
      },
      write: (v) => {
        if (v !== last) {
          last = v
          el.style.setProperty('--p', v)
        }
      },
    })
  }, [ref])
}

// Fires once when an element enters the viewport.
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [on, setOn] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window))
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, on]
}

// Words are dim until you scroll them into the reading zone.
function Scrub({ as: Tag = 'p', text, className = '', ...rest }) {
  const ref = useRef(null)
  useProgress(ref)
  const words = text.split(' ')
  return (
    <Tag ref={ref} className={className} {...rest}>
      {words.map((word, i) => (
        <span key={i} style={{ opacity: `clamp(.16, calc((var(--p,1) - ${(0.1 + (i / words.length) * 0.32).toFixed(3)}) * 16 + .16), 1)` }}>
          {word}{' '}
        </span>
      ))}
    </Tag>
  )
}

// Fades in once, when it enters the viewport.
function Fade({ as: Tag = 'div', delay = 0, className = '', children }) {
  const [ref, on] = useInView(0.15)
  return (
    <Tag ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-opacity duration-[1200ms] motion-reduce:transition-none ${on ? 'opacity-100' : 'opacity-0'} ${className}`}>
      {children}
    </Tag>
  )
}

/* ----------------------------------- Journey --------------------------------------------- */
/* A real roadmap: a winding road is measured from the real layout, every chapter is a stop on  */
/* it, the lime road follows your reading position and the chapter you read is the lit one.     */
/* Chapters: [place, organisation, title, story, lesson] (copy from the career journey PDF).    */

const journeyChapters = [
  ['Kerala, India', 'Ice Grills / College Venture', 'The first business instinct', 'An early attempt to build something of my own introduced me to customers, everyday decisions and the gap between an interesting idea and an operating business.', 'A venture begins when an idea meets reality.'],
  ['United Kingdom', 'MBA / Healthcare Work', 'Learning beyond the classroom', 'I moved to the UK in 2019 for my MBA and also worked in healthcare. The experience taught me responsibility, communication and the value of understanding people.', 'People come before processes.'],
  ['United Kingdom', 'Asian Supermarket / Covid Period', 'Operations, every single day', 'Work in a supermarket brought me closer to stock, suppliers, accounts, customer expectations and closing responsibilities. I began to see the discipline behind daily business.', 'Operations keep a business working.'],
  ['United Kingdom / Brighton', 'Merryhands UK / Suite Spot', 'Learning to win business', 'Healthcare services, business development and hospitality-related marketing exposed me to client relationships, commercial thinking and the work required to create demand.', 'Growth needs a dependable way to serve customers.'],
  ['Calicut, Kerala', 'Chartered Accountancy Firm', 'Reading the numbers', 'Back in Calicut, I worked in business development at a CA firm. Finance, reporting, bookkeeping, internal controls and operating processes became part of my business education.', 'Understand the business behind the sales.'],
  ['Kerala', 'Bramma Learning Solutions', 'Diagnose before you prescribe', 'Business development and consulting work broadened my exposure to business scanning, process improvement, SOPs and organisational systems.', 'Good answers begin with better questions.'],
  ['Kerala, India', 'Nkreatives / Creative Director', 'Making strategy visible', 'Creative direction brought together positioning, brand communication, campaigns, social content and delivery teams. I learned to connect expression to commercial objectives.', 'Creativity works harder with a clear purpose.'],
  ['Kerala, India', 'MoonBliss / CEO', 'Owning the decisions', 'Leading a wellness venture meant bringing brand, product, marketing, operations and growth planning together, while taking responsibility beyond recommendations.', 'Ownership turns a plan into action.'],
  ['Kerala, India', 'DayOne Venture Studio / CEO', 'Building with founders', 'Venture-studio leadership combines founder support, execution systems, marketing, performance reviews and cross-functional teams across portfolio businesses.', 'Leadership is alignment plus execution.'],
]

const unit = (n) => Math.min(1, Math.max(0, n))
const r1 = (n) => Math.round(n * 10) / 10
const ROAD_MASK = '[-webkit-mask-image:linear-gradient(to_bottom,transparent_0,#000_70px)] [mask-image:linear-gradient(to_bottom,transparent_0,#000_70px)]'
const NODE = 'absolute z-10 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#a4be2d] bg-[#153B2B] transition-[background-color,box-shadow] duration-500 data-[on=true]:bg-[#a4be2d] data-[on=true]:shadow-[0_0_0_7px_rgba(164,190,45,.18)]'

// Samples a path so a scroll position (y) can be turned into a distance along it.
function samplePath(p) {
  const len = p.getTotalLength()
  const ls = Array.from({ length: 321 }, (_, k) => (len * k) / 320)
  return { len, ls, ys: ls.map((l) => p.getPointAtLength(l).y) }
}

function lengthAtY({ len, ls, ys }, y) {
  if (y <= ys[0]) return 0
  if (y >= ys[320]) return len
  let lo = 0
  let hi = 320
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (ys[mid] <= y) lo = mid
    else hi = mid
  }
  return ls[lo] + ((y - ys[lo]) / (ys[hi] - ys[lo] || 1)) * (ls[hi] - ls[lo])
}

function JourneyHead() {
  const ref = useRef(null)
  useProgress(ref)
  const rise = (v) => ({ transform: `translate3d(0,calc((1 - var(${v})) * 105%),0)` })
  const line = 'block overflow-hidden pb-[.14em] -mb-[.14em]'
  return (
    <div ref={ref} style={{ '--h': REVEAL, '--h2': 'clamp(0, calc((var(--p,1) - .14) / .3), 1)' }}>
      <div className="grid items-end gap-x-12 gap-y-8 lg:grid-cols-12">
        <h2 id="journey-heading" className="m-0 text-[clamp(44px,7.4vw,116px)] font-extrabold leading-[.96] tracking-[-.058em] lg:col-span-7">
          <span className="sr-only">Built Along the Way.</span>
          <span aria-hidden className={line}>
            <span className="block" style={rise('--h')}>
              Built{' '}
              <span className="relative inline-block">
                Along
                <span className="absolute inset-x-0 bottom-[-.04em] h-[.045em] origin-left bg-[#a4be2d]" style={{ transform: 'scaleX(var(--h2))' }} />
              </span>
            </span>
          </span>
          <span aria-hidden className={line}><span className="block" style={rise('--h2')}>the Way.</span></span>
        </h2>
        <div className="border-white/20 lg:col-span-5 lg:border-l lg:pl-10" style={{ opacity: 'var(--h2)' }}>
          <p className="m-0 mt-4 text-[clamp(24px,2.5vw,38px)] font-semibold leading-[1.12] tracking-[-.035em]">
            <span className="block">Ideas built businesses.</span>
            <span className="block">People built me.</span>
          </p>
          <p className="mt-4 max-w-[40ch] text-[15px] leading-[1.7] text-[#b9c7b2]">I began with curiosity, learned through real work, and gradually connected people, numbers, brands, systems and execution.</p>
        </div>
      </div>
     
    </div>
  )
}

// One stop on the road. On desktop the road passes through the middle: even chapters sit on the
// right of the road (story on the left), odd chapters on the left (story on the right).
function Chapter({ c: [place, org, title, body, lesson], i }) {
  const right = i % 2 === 0
  const rise = { opacity: 'calc(.3 + var(--r,1) * .7)', transform: 'translate3d(0,calc((1 - var(--r,1)) * 20px),0)' }
  return (
    <li data-stop className={`group relative pl-[68px] lg:pl-0 ${i ? 'mt-16 lg:mt-24' : ''}`}>
      {/* invisible marker the road measures this stop from (same height as the number) */}
      <span data-anchor aria-hidden className="pointer-events-none absolute left-0 top-0 h-[clamp(54px,7.65vw,116px)] w-px" />
      <article aria-labelledby={`chapter-${i + 1}`} className="lg:grid lg:grid-cols-[36fr_28fr_36fr] lg:items-start">
        <header style={rise} className={`lg:row-start-1 ${right ? 'lg:col-start-3' : 'lg:col-start-1 lg:text-right'}`}>
          <span aria-hidden className="block bg-gradient-to-b from-[#a4be2d] to-[#a4be2d]/25 bg-clip-text text-[clamp(64px,9vw,136px)] font-extrabold leading-[.85] tracking-[-.07em] text-transparent">{String(i + 1).padStart(2, '0')}</span>
          <p className={`m-0 mt-5 flex items-center gap-1.5 text-[15px] font-semibold text-white ${right ? '' : 'lg:justify-end'}`}>
            <MapPin size={15} weight="fill" aria-hidden className="shrink-0 text-[#a4be2d]" />
            {place}
          </p>
          <p className="m-0 mt-1 text-[14px] leading-[1.4] text-white/60">{org}</p>
        </header>
        <div style={rise} className={`relative mt-7 border border-white/10 bg-white/[.04] p-6 transition-colors duration-700 group-data-[on=true]:border-[#a4be2d]/45 md:p-8 lg:row-start-1 lg:mt-0 lg:p-6 xl:p-8 ${right ? 'lg:col-start-1' : 'lg:col-start-3'}`}>
          <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[#a4be2d] transition-transform duration-[900ms] group-data-[on=true]:scale-x-100 motion-reduce:transition-none" />
          <h3 id={`chapter-${i + 1}`} className="m-0 text-[clamp(24px,2.5vw,36px)] font-bold leading-[1.08] tracking-[-.045em]">{title}</h3>
          <p className="m-0 mt-4 text-[clamp(15px,1.15vw,17px)] leading-[1.75] text-[#cdd8c6]">{body}</p>
          <blockquote className="m-0 mt-7 border-t border-white/10 pt-5">
            <span aria-hidden className="block h-7 text-[64px] font-extrabold leading-[.9] text-[#a4be2d]">“</span>
            <p className="m-0 mt-1 text-[clamp(19px,1.8vw,25px)] font-semibold leading-[1.25] tracking-[-.025em] text-white">{lesson}</p>
          </blockquote>
        </div>
      </article>
    </li>
  )
}

function Journey() {
  const road = useRef(null)
  const prog = useRef(null)
  const rider = useRef(null)
  const [geo, setGeo] = useState(null)

  // 1) Measure the real layout and build one smooth road through every stop.
  useIso(() => {
    const el = road.current
    const mq = window.matchMedia('(min-width: 1024px)')
    const measure = () => {
      const { clientWidth: w, offsetHeight: h } = el
      const wide = mq.matches
      const pad = wide ? 90 : 44
      const top = el.getBoundingClientRect().top
      const xs = wide ? [w * 0.6, w * 0.4] : [20, 20] // desktop: the road swings; mobile: a straight line
      const pts = [...el.querySelectorAll('[data-anchor]')].map((a, i) => {
        const r = a.getBoundingClientRect()
        return { x: r1(xs[i % 2]), y: r1(r.top - top + r.height / 2) }
      })
      const end = { x: wide ? w / 2 : pts[pts.length - 1].x, y: h - 10 }
      const all = [{ x: wide ? w / 2 : pts[0].x, y: -pad }, ...pts, end]
      const d = all.reduce((s, b, k) => {
        if (!k) return `M${b.x} ${b.y}`
        const a = all[k - 1]
        const m = (b.y - a.y) / 2
        return `${s} C${a.x} ${a.y + m} ${b.x} ${b.y - m} ${b.x} ${b.y}`
      }, '')
      setGeo((g) => (g && g.d === d && g.w === w && g.h === h ? g : { d, w, h, pad, wide, pts, end }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // 2) Draw the lime road and light the stops up to the reading line.
  useIso(() => {
    const el = road.current
    const p = prog.current
    if (!geo || !p) return undefined
    const s = samplePath(p)
    const mark = rider.current
    const stops = [...el.querySelectorAll('[data-stop]')]
    const nodes = [...el.querySelectorAll('[data-node]')] // every stop, then the destination
    const flag = (n, v) => { if (n.dataset.on !== v) n.dataset.on = v }
    p.style.strokeDasharray = s.len

    if (prefersReduced()) {
      p.style.strokeDashoffset = '0'
      mark.style.display = 'none'
      nodes.forEach((n) => flag(n, 'true'))
      stops.forEach((st) => { flag(st, 'true'); st.style.setProperty('--r', '1') })
      return undefined
    }

    return subscribe({
      read: (vh) => {
        const line = vh * 0.6 // the "reading line" the road is drawn up to
        const y = line - el.getBoundingClientRect().top
        const L = lengthAtY(s, y)
        const pt = p.getPointAtLength(L)
        return {
          off: (s.len - L).toFixed(1),
          pos: `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`,
          // how "in focus" each chapter is (desktop only; on mobile every chapter stays fully visible)
          r: stops.map((st) => {
            if (!geo.wide) return '1'
            const b = st.getBoundingClientRect()
            return unit((1 - Math.abs(b.top + b.height / 2 - line) / (vh * 0.6)) * 1.6).toFixed(3)
          }),
          on: [...geo.pts.map((q) => q.y < y), y >= geo.end.y].map(String),
        }
      },
      write: (v) => {
        p.style.strokeDashoffset = v.off
        mark.setAttribute('transform', v.pos)
        stops.forEach((st, i) => { st.style.setProperty('--r', v.r[i]); flag(st, v.on[i]) })
        nodes.forEach((n, i) => flag(n, v.on[i]))
      },
    })
  }, [geo])

  const edge = geo?.wide ? 34 : 20
  return (
    <section id="journey" aria-labelledby="journey-heading" className={`bg-[#153B2B] text-white ${sectionPad}`}>
      <div className={wrap}>
        <JourneyHead />
        <div ref={road} className="relative mt-14 pb-14 lg:mt-24">
          {geo && (
            <>
              <svg aria-hidden width={geo.w} height={geo.h + geo.pad} viewBox={`0 ${-geo.pad} ${geo.w} ${geo.h + geo.pad}`} style={{ top: -geo.pad }} className={`pointer-events-none absolute left-0 overflow-visible ${ROAD_MASK}`}>
                {/* the road: two kerb lines, a dark surface, a dashed centre line, then the part you have travelled */}
                <g fill="none">
                  {[['rgba(255,255,255,.22)', edge], ['#153B2B', edge - 2], ['rgba(16,19,16,.3)', edge - 2]].map(([c, w]) => <path key={c} d={geo.d} stroke={c} strokeWidth={w} />)}
                  <path d={geo.d} stroke="rgba(255,255,255,.32)" strokeWidth="1.5" strokeDasharray="7 11" />
                  <path ref={prog} d={geo.d} stroke="#a4be2d" strokeWidth="3" strokeLinecap="round" />
                </g>
                <g ref={rider} transform="translate(-999 -999)">
                  <circle r="17" fill="rgba(164,190,45,.16)" />
                  <circle r="8" fill="#a4be2d" stroke="#153B2B" strokeWidth="3" />
                </g>
              </svg>
              {geo.pts.map((q, i) => <span key={i} data-node aria-hidden className={NODE} style={{ left: q.x, top: q.y }} />)}
              <span data-node aria-hidden className={`${NODE} !size-6`} style={{ left: geo.end.x, top: geo.end.y }} />
            </>
          )}
          <ol className="m-0 list-none p-0">{journeyChapters.map((c, i) => <Chapter key={c[2]} c={c} i={i} />)}</ol>
        </div>

        <div className="pl-[68px] pt-12 lg:pl-0 lg:pt-16 lg:text-center">
          <Scrub as="h3" text="People. Operations. Numbers. Brands. Systems. Leadership." className="m-0 max-w-[20ch] text-[clamp(28px,4.4vw,68px)] font-extrabold leading-[1] tracking-[-.055em] lg:mx-auto" />
          <Fade as="p" className="mt-6 max-w-[56ch] text-[15px] leading-[1.7] text-[#b9c7b2] md:text-[17px] lg:mx-auto">
            Different places. Different responsibilities. One growing conviction: strong businesses connect clear thinking, good people, good systems and the willingness to execute.
          </Fade>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------- Page ---------------------------------------------- */

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About | Hashir Usman'
  }, [])

  return (
    <main id="main" className="overflow-x-clip">
      <Journey />
    </main>
  )
}