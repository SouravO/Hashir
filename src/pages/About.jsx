import { version, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowRight, MapPin, Plus } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

/* -------------------------------------------------------------------------------------------
   ABOUT PAGE · one signature motion per section

   Hero        window opens on the photo · letters flip up one by one · focus-pull on the rest
   Story       scroll-scrubbed: words light up as you read, photo mask opens, thread line fills
   Journey     a road you travel by scrolling: the line draws as you read, every chapter is a stop
   Principles  3D tilt: photos swing in from depth, copy slides in from the sides (scrubbed)
   Experience  stacking cards: each card slides over the last, which shrinks and dims behind it
   Start       headline "types" itself in lime · photos change with a slanted wipe
   Closing     kinetic type: the two lines drift in opposite directions and lock in as you arrive

   No pinned scenes, so nothing ever feels stuck. All scroll-linked motion runs through ONE
   shared requestAnimationFrame loop (reads first, writes second) to avoid layout thrash.

   Palette (unchanged): ink #101310 · forest #153B2B · lime #a4be2d · paper #F2F3EF · olive #617319
   Sticky cards need that no parent of <AboutPage /> sets overflow: hidden / auto
   (overflow-x: clip, used on <main>, is fine).
------------------------------------------------------------------------------------------- */

const IMAGE_ALT = 'Featured photograph for the About page'
const FETCH_PRIORITY_PROP = Number.parseInt(version, 10) >= 19 ? 'fetchPriority' : 'fetchpriority'

const TONES = {
  natural: { img: 'saturate-[.9]', over: 'bg-[#153B2B]/10 mix-blend-multiply' },
  muted: { img: 'saturate-[.5] contrast-[1.05]', over: 'bg-[#101310]/20 mix-blend-multiply' },
  tint: { img: 'saturate-[.6] contrast-[1.05]', over: 'bg-[#153B2B]/40 mix-blend-multiply' },
  accent: { img: 'saturate-[.7] contrast-[1.05]', over: 'bg-[#a4be2d]/30 mix-blend-multiply' },
}

const ease = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const wrap = 'mx-auto w-full max-w-[1320px] px-[18px] md:px-7'
const sectionPad = 'py-[clamp(56px,7vw,112px)]'
const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4be2d]'

const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect
const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---------------------------------- Content ---------------------------------------------- */

const thread = ['Unclear', 'Clear', 'Plan', 'Real', 'Better']

const principles = [
  {
    title: ['Good questions come', 'before good strategies.'],
    body: 'Before anything is repositioned, redesigned, or funded, it helps to understand the idea, the customer, the market, and what is actually going on in the business. Then the strategy has something real to stand on.',
    image: '/abt6.png?rev=3',
    crop: { pos: '50% 35%', zoom: 1.1 },
    tone: 'natural',
  },
  {
    title: ['Great branding needs', 'a good business underneath.'],
    body: 'Positioning, marketing, and identity work best when the product, the offer, and the customer experience already make sense.',
    image: '/abt4.png?rev=2',
    crop: { pos: '50% 20%', zoom: 1.8 },
    tone: 'tint',
  },
  {
    title: ['A plan only matters', 'when someone can execute it.'],
    body: 'And growth is much nicer when the systems can handle it. SOPs, roles, reporting, and workflows keep a business running as it gets bigger.',
    image: '/abt5.png?rev=3',
    crop: { pos: '50% 50%', zoom: 1.4 },
    tone: 'muted',
  },
]

// `detail` is optional: add a short line per card (years, sectors, outcomes) and it renders automatically.
const experience = [
  { title: 'Venture building', detail: '', image: '/closing.png', crop: { pos: '50% 30%', zoom: 1.2 }, tone: 'natural', card: 'bg-[#153B2B] text-white' },
  { title: 'Business consulting', detail: '', image: '/abouthero1.png', crop: { pos: '50% 25%', zoom: 1.3 }, tone: 'muted', card: 'bg-[#101310] text-white' },
  { title: 'Valuation readiness', detail: '', image: '/abouthero.png', crop: { pos: '70% 30%', zoom: 1.5 }, tone: 'natural', card: 'bg-[#a4be2d] text-[#101310]' },
  { title: 'Funding & investor prep', detail: '', image: '/abt3.1.png', crop: { pos: '50% 30%', zoom: 1.3 }, tone: 'tint', card: 'bg-[#153B2B] text-white' },
  { title: 'Founder mentoring', detail: '', image: '/abt3.png', crop: { pos: '30% 40%', zoom: 1.5 }, tone: 'muted', card: 'bg-[#101310] text-white' },
]

const lenses = [
  {
    id: 'ideas',
    image: '/slide1.png',
    title: 'Startup Idea Strategy Call',
    question: "Let's talk ideas",
    detail: "Got an idea you can't stop thinking about? Let's figure out what makes sense and what to test next.",
    crop: { pos: '50% 25%', zoom: 1 },
    tone: 'natural',
  },
  {
    id: 'business',
    image: '/slide2.png',
    title: 'Business Strategy Consultation',
    question: 'Help me figure it out',
    detail: "Something not working the way you expected? Let's find the gaps and figure out the next move.",
    crop: { pos: '30% 30%', zoom: 1.5 },
    tone: 'muted',
  },
  {
    id: 'growth',
    image: '/slide3.png',
    title: 'Brand & Growth Strategy',
    question: "Let's talk growth",
    detail: "Good product. Not enough traction? Let's get the positioning, marketing and growth direction right.",
    crop: { pos: '70% 60%', zoom: 1.7 },
    tone: 'tint',
  },
  {
    id: 'systems',
    image: '/slide4.png',
    title: 'Business Systems & Scaling',
    question: 'Fix the chaos',
    detail: "Business growing faster than your systems? Let's get people, processes, and operations working together.",
    crop: { pos: '50% 15%', zoom: 1.3 },
    tone: 'accent',
  },
]

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

// Writes scroll progress (0..1) into a CSS variable on the element.
//   pass: 0 as the element enters the viewport, 1 as it leaves (0.5 = centred)
//   pin : 0 when its top reaches the viewport top, 1 when its bottom reaches the viewport bottom
//   out : 0 at the top of the page, 1 once the element has scrolled away
function useProgress(ref, mode = 'pass', name = '--p') {
  useIso(() => {
    const el = ref.current
    if (!el) return undefined
    if (prefersReduced()) {
      el.style.setProperty(name, mode === 'pin' ? '1' : mode === 'out' ? '0' : '.5')
      return undefined
    }
    let last = ''
    return subscribe({
      read: (vh) => {
        const r = el.getBoundingClientRect()
        const raw =
          mode === 'pin' ? -r.top / Math.max(1, r.height - vh)
          : mode === 'out' ? -r.top / Math.max(1, r.height)
          : (vh - r.top) / (vh + r.height)
        return Math.min(1, Math.max(0, raw)).toFixed(3)
      },
      write: (v) => {
        if (v !== last) {
          last = v
          el.style.setProperty(name, v)
        }
      },
    })
  }, [ref, mode, name])
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

/* ------------------------------- Building blocks ----------------------------------------- */

// A cropped photograph that fills its positioned parent.
function Pic({ src, crop, tone = 'natural', alt = '', priority = false }) {
  const extra = priority ? { [FETCH_PRIORITY_PROP]: 'high' } : {}
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        {...extra}
        decoding="async"
        draggable={false}
        onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
        style={{ objectPosition: crop.pos, transform: `scale(${crop.zoom})`, transformOrigin: crop.pos }}
        className={`size-full object-cover ${TONES[tone].img}`}
      />
      <div aria-hidden className={`absolute inset-0 ${TONES[tone].over}`} />
    </div>
  )
}

// Parallax container (closing photo). Pass `relative` or `absolute` in className.
function Frame({ className = '', speed = 8, children }) {
  const ref = useRef(null)
  useProgress(ref, 'pass')
  return (
    <div ref={ref} className={`overflow-hidden bg-[#153B2B] ${className}`}>
      <div className="absolute inset-x-0 -inset-y-[10%] will-change-transform" style={{ transform: `translate3d(0,calc((var(--p,.5) - .5) * -${speed}%),0)` }}>
        {children}
      </div>
    </div>
  )
}

// HERO · every letter flips up out of the baseline.
function FlipLines({ as: Tag = 'h1', lines, delay = 0, className = '', ...rest }) {
  const [ref, on] = useInView(0.1)
  let n = 0
  return (
    <Tag ref={ref} className={className} {...rest}>
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className="block [perspective:700px]">
          {line.split(' ').map((word, wi) => (
            <span key={wi}>
              <span className="inline-block whitespace-nowrap">
                {[...word].map((ch, ci) => (
                  <span
                    key={ci}
                    style={{ transitionDelay: `${delay + n++ * 32}ms`, transform: on ? 'none' : 'translateY(70%) rotateX(-80deg)', opacity: on ? 1 : 0 }}
                    className={`inline-block origin-bottom transition-[transform,opacity] duration-[900ms] ${ease} motion-reduce:transition-none`}
                  >
                    {ch}
                  </span>
                ))}
              </span>{' '}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}

// START · the headline types itself: each letter lands in lime and settles to white.
function TypedLines({ as: Tag = 'h2', lines, className = '', ...rest }) {
  const [ref, on] = useInView(0.2)
  let n = 0
  return (
    <Tag ref={ref} className={className} {...rest}>
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((line, li) => (
        <span key={li} aria-hidden="true" className="block">
          {line.split(' ').map((word, wi) => (
            <span key={wi}>
              <span className="inline-block whitespace-nowrap">
                {[...word].map((ch, ci) => (
                  <span
                    key={ci}
                    style={{ transitionDelay: `${n++ * 26}ms`, opacity: on ? 1 : 0, color: on ? 'inherit' : '#a4be2d' }}
                    className="transition-[opacity,color] duration-500 motion-reduce:transition-none"
                  >
                    {ch}
                  </span>
                ))}
              </span>{' '}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}

// STORY · words are dim until you scroll them into the reading zone.
function Scrub({ as: Tag = 'p', text, className = '', ...rest }) {
  const ref = useRef(null)
  useProgress(ref, 'pass')
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

// EXPERIENCE · a left-to-right wipe, once.
function Fade({ as: Tag = 'div', delay = 0, className = '', children }) {
  const [ref, on] = useInView(0.15)
  return (
    <Tag ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-opacity duration-[1200ms] motion-reduce:transition-none ${on ? 'opacity-100' : 'opacity-0'} ${className}`}>
      {children}
    </Tag>
  )
}

// CLOSING · the button leans toward the pointer (mouse only).
function Button({ to, children }) {
  const ref = useRef(null)
  const move = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) / r.width
    const y = (e.clientY - (r.top + r.height / 2)) / r.height
    ref.current.style.transform = `translate3d(${(x * 16).toFixed(1)}px,${(y * 10).toFixed(1)}px,0)`
  }
  const leave = () => { if (ref.current) ref.current.style.transform = '' }
  return (
    <div className="-m-3 p-3" onPointerMove={move} onPointerLeave={leave}>
      <Link
        ref={ref}
        to={to}
        className={`group relative flex min-h-14 items-center justify-between gap-4 overflow-hidden border border-[#a4be2d] bg-[#a4be2d] px-6 text-[15px] font-semibold text-[#101310] no-underline transition-transform duration-300 ${focus} focus-visible:outline-white`}
      >
        <span aria-hidden className={`absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ${ease} group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none`} />
        <span className="relative">{children}</span>
        <ArrowRight size={20} weight="light" aria-hidden className="relative transition-transform duration-300 motion-safe:group-hover:translate-x-1.5" />
      </Link>
    </div>
  )
}

/* -------------------------------------- Hero --------------------------------------------- */

function Hero() {
  const ref = useRef(null)
  useProgress(ref, 'out')
  return (
    <section ref={ref} aria-labelledby="about-title" className="relative isolate min-h-[calc(100svh-80px)] overflow-hidden bg-[#101310] text-white max-[768px]:min-h-[calc(100svh-64px)]">
      {/* The window opens: the photo grows out of the centre of the dark screen */}
      <div className="about-window absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{ transform: 'translate3d(0,calc(var(--p,0) * 14%),0) scale(calc(1.04 + var(--p,0) * .1))' }}>
          <Pic src="/abouthero.png" crop={{ pos: '50% 25%', zoom: 1 }} tone="natural" alt={IMAGE_ALT} priority />
        </div>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,#101310f2_0%,#101310a6_48%,#10131033_100%),linear-gradient(to_top,#101310_0%,#10131000_45%)]" />
      </div>

      <div
        className={`${wrap} relative z-10 flex min-h-[calc(100svh-80px)] flex-col justify-end pb-[clamp(28px,5vw,64px)] pt-20 max-[768px]:min-h-[calc(100svh-64px)] max-[768px]:pb-8 max-[768px]:pt-16`}
        style={{ transform: 'translate3d(0,calc(var(--p,0) * -9vh),0)', opacity: 'calc(1 - var(--p,0) * 1.6)' }}
      >
        <FlipLines
          id="about-title"
          delay={500}
          lines={['Need a second brain?', 'Or someone to help', 'build the whole thing?']}
          className="text-[clamp(24px,5.4vw,86px)] font-extrabold leading-[.98] tracking-[-.055em]"
        />
        <div className="mt-5">
          <p className="about-focus max-w-[46ch] text-[15px] leading-[1.65] text-[#dfe6d8] md:text-[17px]" style={{ animationDelay: '1.5s' }}>
            Some problems need one good conversation. Others need research, planning, systems, execution and a little time.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------- Story --------------------------------------------- */
/* Everything here is driven by scroll position: words, the photo mask and the thread line.    */

function MaskPhoto({ className = '' }) {
  const ref = useRef(null)
  useProgress(ref, 'pass')
  return (
    <div ref={ref} className={`relative ${className}`}>
      <span aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 border border-[#617319]" />
      <div className="absolute inset-0 bg-[#153B2B]" style={{ clipPath: 'inset(max(0%, calc(24% - var(--p,.5) * 52%)) max(0%, calc(30% - var(--p,.5) * 66%)))' }}>
        <div className="absolute inset-0" style={{ transform: 'scale(max(1, calc(1.35 - var(--p,.5) * .75)))' }}>
          <Pic src="/abt3.png" crop={{ pos: '50% 40%', zoom: 1.1 }} tone="natural" />
        </div>
      </div>
    </div>
  )
}

function Thread() {
  const ref = useRef(null)
  useProgress(ref, 'pass')
  return (
    <div ref={ref} className="mt-8 lg:mt-10">
      <div className="relative h-[3px] bg-[#101310]/15">
        <span className="absolute inset-0 origin-left bg-[#a4be2d]" style={{ transform: 'scaleX(clamp(0, calc((var(--p,1) - .28) / .2), 1))' }} />
      </div>
      <ol className="m-0 mt-3 grid list-none grid-cols-5 gap-2 p-0">
        {thread.map((step, i) => (
          <li key={step} style={{ opacity: `clamp(.25, calc((var(--p,1) - ${(0.28 + i * 0.04).toFixed(2)}) * 22 + .25), 1)` }} className="text-[12px] font-semibold md:text-sm">
            {step}
          </li>
        ))}
      </ol>
    </div>
  )
}

function Story() {
  return (
    <section id="story" aria-labelledby="story-heading" className={`bg-[#F2F3EF] text-[#101310] ${sectionPad}`}>
      <div className={wrap}>
        <Scrub as="h2" id="story-heading" text="Big ideas are fun. Making them work is my thing." className="text-[clamp(34px,7vw,116px)] font-extrabold leading-[1] tracking-[-.055em]" />

        <div className="mt-12 grid gap-x-16 gap-y-12 lg:mt-20 lg:grid-cols-12">
          <MaskPhoto className="aspect-[4/5] w-full lg:col-span-5" />
          <div className="flex flex-col justify-center lg:col-span-7">
            <Scrub text="Some days it’s strategy. Some days it’s marketing. Some days it’s figuring out why a business is making sales but not enough money. And some days we’re building something completely new." className="text-[clamp(20px,2.4vw,36px)] font-semibold leading-[1.3] tracking-[-.03em]" />
            <div className="mt-12 lg:mt-16">
              <Scrub as="h3" text="The part I enjoy" className="m-0 text-[clamp(26px,3.2vw,48px)] font-extrabold leading-[1] tracking-[-.05em]" />
              <Scrub text="Where an unclear situation starts to make sense, an idea becomes a plan, and a plan becomes something real." className="mt-4 max-w-[40ch] text-[clamp(16px,1.4vw,21px)] leading-[1.6] text-[#2a312a]" />
              <Thread />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- Principles ------------------------------------------- */
/* 3D tilt: the photo swings in from depth while the copy slides in from the side.             */

const REVEAL = 'clamp(0, calc((var(--p,1) - .08) / .3), 1)'

function PrincipleRow({ p, flip }) {
  const ref = useRef(null)
  useProgress(ref, 'pass')
  const dir = flip ? -1 : 1
  return (
    <article ref={ref} aria-labelledby={`pr-${p.image}`} style={{ '--r': REVEAL }} className="grid items-center gap-x-16 gap-y-8 lg:grid-cols-12">
      <div className={`lg:col-span-7 ${flip ? 'lg:order-last' : ''}`} style={{ perspective: '1200px' }}>
        <div
          className="relative aspect-[4/3] w-full will-change-transform lg:aspect-[16/11]"
          style={{ transform: `translate3d(0,calc((1 - var(--r)) * 48px),0) rotateY(calc((1 - var(--r)) * ${-18 * dir}deg)) scale(calc(.94 + var(--r) * .06))`, transformOrigin: dir > 0 ? '0% 50%' : '100% 50%' }}
        >
          <span aria-hidden className={`absolute inset-0 border border-[#a4be2d] ${flip ? '-translate-x-3' : 'translate-x-3'} translate-y-3`} />
          <div className="absolute inset-0 overflow-hidden bg-[#153B2B]">
            <Pic src={p.image} crop={p.crop} tone={p.tone} />
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <span aria-hidden className="block h-px w-full origin-left bg-[#a4be2d]" style={{ transform: 'scaleX(var(--r))' }} />
        <h3 id={`pr-${p.image}`} className="m-0 mt-6 text-[clamp(24px,2.9vw,46px)] font-bold leading-[1.05] tracking-[-.045em]">
          {p.title.map((line, i) => (
            <span key={line} className="block" style={{ opacity: 'var(--r)', transform: `translate3d(calc((1 - var(--r)) * ${(i % 2 ? -1 : 1) * -dir * 64}px),0,0)` }}>
              {line}
            </span>
          ))}
        </h3>
        <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.75] text-[#cdd8c6] md:text-[16px]" style={{ opacity: 'clamp(0, calc((var(--r) - .4) * 1.8), 1)' }}>
          {p.body}
        </p>
      </div>
    </article>
  )
}

function Principles() {
  const head = useRef(null)
  useProgress(head, 'pass')
  const A = 'clamp(0, calc((.45 - var(--p,1)) / .3), 1)'
  return (
    <section id="principles" aria-labelledby="principles-heading" className={`bg-[#101310] text-white ${sectionPad}`}>
      <div className={wrap}>
        <div ref={head} className="grid items-end gap-x-12 gap-y-5 lg:grid-cols-12">
          <h2 id="principles-heading" className="m-0 text-[clamp(36px,6.4vw,100px)] font-extrabold leading-[.98] tracking-[-.055em] lg:col-span-8">
            {['What I believe', 'about building.'].map((line, i) => (
              <span key={line} className="block" style={{ opacity: `calc(1 - ${A})`, transform: `translate3d(calc(${A} * ${i ? 14 : -14}vw),0,0)` }}>
                {line}
              </span>
            ))}
          </h2>
          <p className="max-w-[34ch] text-[15px] leading-[1.7] text-[#b9c7b2] lg:col-span-4" style={{ opacity: `calc(1 - ${A})` }}>
            Simple beliefs that shape how I work with founders and businesses.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-16 lg:mt-24 lg:gap-24">
          {principles.map((p, i) => (
            <PrincipleRow key={p.image} p={p} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------- Journey --------------------------------------------- */
/* A road you travel by scrolling. The lime line follows your reading position, a marker rides  */
/* its tip, and every stop lights up as you reach it. Cards zig-zag and overlap so the whole    */
/* route stays short. All copy comes from the "Built Along the Way" career journey PDF.         */

const journeyChapters = [
  {
    place: 'Kerala, India',
    org: 'Ice Grills / College Venture',
    title: 'The first business instinct',
    body: 'An early attempt to build something of my own introduced me to customers, everyday decisions and the gap between an interesting idea and an operating business.',
    lesson: 'A venture begins when an idea meets reality.',
  },
  {
    place: 'United Kingdom',
    org: 'MBA / Healthcare Work',
    title: 'Learning beyond the classroom',
    body: 'I moved to the UK in 2019 for my MBA and also worked in healthcare. The experience taught me responsibility, communication and the value of understanding people.',
    lesson: 'People come before processes.',
  },
  {
    place: 'United Kingdom',
    org: 'Asian Supermarket / Covid Period',
    title: 'Operations, every single day',
    body: 'Work in a supermarket brought me closer to stock, suppliers, accounts, customer expectations and closing responsibilities. I began to see the discipline behind daily business.',
    lesson: 'Operations keep a business working.',
  },
  {
    place: 'United Kingdom / Brighton',
    org: 'Merryhands UK / Suite Spot',
    title: 'Learning to win business',
    body: 'Healthcare services, business development and hospitality-related marketing exposed me to client relationships, commercial thinking and the work required to create demand.',
    lesson: 'Growth needs a dependable way to serve customers.',
  },
  {
    place: 'Calicut, Kerala',
    org: 'Chartered Accountancy Firm',
    title: 'Reading the numbers',
    body: 'Back in Calicut, I worked in business development at a CA firm. Finance, reporting, bookkeeping, internal controls and operating processes became part of my business education.',
    lesson: 'Understand the business behind the sales.',
  },
  {
    place: ' Kerala',
    org: 'Bramma Learning Solutions',
    title: 'Diagnose before you prescribe',
    body: 'Business development and consulting work broadened my exposure to business scanning, process improvement, SOPs and organisational systems.',
    lesson: 'Good answers begin with better questions.',
  },
  {
    place: 'Kerala, India',
    org: 'Nkreatives / Creative Director',
    title: 'Making strategy visible',
    body: 'Creative direction brought together positioning, brand communication, campaigns, social content and delivery teams. I learned to connect expression to commercial objectives.',
    lesson: 'Creativity works harder with a clear purpose.',
  },
  {
    place: 'Kerala, India',
    org: 'Moon Bliss / CEO',
    title: 'Owning the decisions',
    body: 'Leading a wellness venture meant bringing brand, product, marketing, operations and growth planning together, while taking responsibility beyond recommendations.',
    lesson: 'Ownership turns a plan into action.',
  },
  {
    place: 'Kerala, India',
    org: 'DayOne Venture Studio / Interim CEO',
    title: 'Building with founders',
    body: 'Venture-studio leadership combines founder support, execution systems, marketing, performance reviews and cross-functional teams across portfolio businesses.',
    lesson: 'Leadership is alignment plus execution.',
  },
]

const unit = (n) => Math.min(1, Math.max(0, n))
function JourneyHead() {
  const ref = useRef(null)
  useProgress(ref, 'pass')
  const rise = (v) => ({ transform: `translate3d(0,calc((1 - var(${v})) * 105%),0)` })
  const line = 'block overflow-hidden pb-[.14em] -mb-[.14em]'
  return (
    <div ref={ref} style={{ '--h': REVEAL, '--h2': 'clamp(0, calc((var(--p,1) - .14) / .3), 1)' }}>
      <div className="grid items-end gap-x-12 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="journey-heading" className="m-0 text-[clamp(44px,7.4vw,116px)] font-extrabold leading-[.96] tracking-[-.058em]">
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
            <span aria-hidden className={line}>
              <span className="block" style={rise('--h2')}>the Way.</span>
            </span>
          </h2>
        </div>

        <div className="border-white/20 lg:col-span-5 lg:border-l lg:pl-10" style={{ opacity: 'var(--h2)' }}>
          <p className="m-0 mt-4 text-[clamp(24px,2.5vw,38px)] font-semibold leading-[1.12] tracking-[-.035em]">
            <span className="block">Ideas built businesses.</span>
            <span className="block">People built me.</span>
          </p>
          <p className="mt-4 max-w-[40ch] text-[15px] leading-[1.7] text-[#b9c7b2]">
            I began with curiosity, learned through real work, and gradually connected people, numbers, brands, systems and execution.
          </p>
        </div>
      </div>

      <div className="mt-10 grid items-baseline gap-x-12 gap-y-3 border-t border-white/20 pt-7 lg:mt-14 lg:grid-cols-12" style={{ opacity: 'var(--h2)' }}>
        <h3 className="m-0 text-[clamp(24px,3vw,44px)] font-bold leading-[1.05] tracking-[-.045em] lg:col-span-5">Not a straight line.</h3>
        <p className="m-0 max-w-[58ch] text-[15px] leading-[1.7] text-[#b9c7b2] md:text-[16px] lg:col-span-7">
          A sequence of experiments and responsibilities that changed how I understand business. Each chapter below carries a place, an experience and a lesson.
        </p>
      </div>
    </div>
  )
}

function Chapter({ c, i }) {
  const left = i % 2 === 0
  return (
    <li data-stop className={`group relative pl-10 lg:flex lg:pl-0 ${left ? 'lg:justify-start' : 'lg:justify-end'} ${i ? 'mt-8 lg:mt-10' : ''}`}>
      {/* stop on the road */}
      <span
        aria-hidden
        className={`absolute left-[7px] top-[30px] z-10 size-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#a4be2d] bg-[#153B2B] transition-[background-color,box-shadow] duration-500 group-data-[on=true]:bg-[#a4be2d] group-data-[on=true]:shadow-[0_0_0_6px_rgba(164,190,45,.22)] lg:left-1/2`}
      />
      {/* short spur from the stop to its card */}
      <span
        aria-hidden
        className={`absolute left-[7px] top-[30px] h-px w-[33px] origin-left bg-[#a4be2d]/60 lg:w-14 ${left ? 'lg:left-auto lg:right-1/2 lg:origin-left' : 'lg:left-1/2 lg:origin-right'}`}
        style={{ transform: 'scaleX(var(--r,1))' }}
      />

      <article
        aria-labelledby={`chapter-${i + 1}`}
        className={`relative w-full border border-white/10 bg-[#101310]/35 p-4 transition-colors duration-700 group-data-[on=true]:border-[#a4be2d]/50 md:p-5 lg:w-[calc(50%-3.5rem)] motion-reduce:transform-none motion-reduce:opacity-100`}
        style={{
          '--dx': left ? 'clamp(-180px, -12vw, -48px)' : 'clamp(48px, 12vw, 180px)',
          opacity: 'var(--r,1)',
          transform: 'translate3d(calc((1 - var(--r,1)) * var(--dx)), calc((1 - var(--r,1)) * 24px), 0)',
        }}
      >
        <div className="flex items-end justify-between gap-4">
          <span
            aria-hidden
            className="text-[clamp(34px,3.4vw,50px)] font-extrabold leading-[.8] tracking-[-.06em] text-transparent transition-colors duration-700 [-webkit-text-stroke:1px_#a4be2d] group-data-[on=true]:text-[#a4be2d]"
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="flex items-center gap-1.5 pb-0.5 text-right text-[11px] font-semibold uppercase tracking-[.16em] text-[#a4be2d]">
            <MapPin size={14} weight="fill" aria-hidden className="shrink-0" />
            {c.place}
          </span>
        </div>

        <h3 id={`chapter-${i + 1}`} className="m-0 mt-4 text-[clamp(20px,2vw,28px)] font-bold leading-[1.08] tracking-[-.04em]">
          {c.title}
        </h3>
        <p className="m-0 mt-1.5 text-[10.5px] font-semibold uppercase tracking-[.14em] text-white/60">{c.org}</p>
        <p className="m-0 mt-2.5 text-[14px] leading-[1.6] text-[#b9c7b2]">{c.body}</p>

        <div className="mt-3.5 border-l-2 border-[#a4be2d] pl-3.5">
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[.2em] text-[#a4be2d]">The lesson</p>
          <p className="m-0 mt-0.5 text-[16px] font-medium leading-[1.3] text-[#e3e9dc]">{c.lesson}</p>
        </div>
      </article>
    </li>
  )
}

function Journey() {
  const road = useRef(null)

  useIso(() => {
    const el = road.current
    if (!el) return undefined
    const stops = Array.from(el.querySelectorAll('[data-stop]'))

    if (prefersReduced()) {
      el.style.setProperty('--fill', '100%')
      el.dataset.done = 'true'
      stops.forEach((s) => { s.dataset.on = 'true' })
      return undefined
    }

    let lastFill = -1
    let lastDone = ''
    const lastR = stops.map(() => '')
    const lastOn = stops.map(() => '')

    return subscribe({
      read: (vh) => {
        const line = vh * 0.6 // the "reading line" the road is drawn up to
        const box = el.getBoundingClientRect()
        return {
          fill: Math.round(unit((line - box.top) / Math.max(1, box.height)) * box.height),
          done: line - box.top >= box.height ? 'true' : 'false',
          stops: stops.map((s) => {
            const top = s.getBoundingClientRect().top
            return { r: unit((vh * 0.94 - top) / (vh * 0.2)).toFixed(3), on: top + 30 < line ? 'true' : 'false' }
          }),
        }
      },
      write: (v) => {
        if (v.fill !== lastFill) {
          lastFill = v.fill
          el.style.setProperty('--fill', `${v.fill}px`)
        }
        if (v.done !== lastDone) {
          lastDone = v.done
          el.dataset.done = v.done
        }
        stops.forEach((s, i) => {
          const { r, on } = v.stops[i]
          if (r !== lastR[i]) {
            lastR[i] = r
            s.style.setProperty('--r', r)
          }
          if (on !== lastOn[i]) {
            lastOn[i] = on
            s.dataset.on = on
          }
        })
      },
    })
  }, [])

  return (
    <section id="journey" aria-labelledby="journey-heading" className={`bg-[#153B2B] text-white ${sectionPad}`}>
      <div className={wrap}>
        <JourneyHead />

        {/* The road */}
        <div ref={road} className="group/road relative mt-12 pb-12 lg:mt-14" style={{ '--fill': '0px' }}>
          <span
            aria-hidden
            className="absolute bottom-0 left-[7px] top-0 w-[2px] -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,.28)_0_7px,transparent_7px_15px)] lg:left-1/2"
          />
          <span
            aria-hidden
            className="absolute left-[7px] top-0 w-[3px] -translate-x-1/2 bg-[#a4be2d] shadow-[0_0_14px_rgba(164,190,45,.55)] lg:left-1/2"
            style={{ height: 'var(--fill)' }}
          />
          {/* the traveller */}
          <span
            aria-hidden
            className="absolute left-[7px] top-0 z-20 size-5 motion-reduce:hidden lg:left-1/2"
            style={{ transform: 'translate3d(-50%,calc(var(--fill) - 50%),0)' }}
          >
            <span className="absolute inset-0 rounded-full bg-[#a4be2d]/60 motion-safe:animate-ping" />
            <span className="absolute inset-[3px] rounded-full border-[3px] border-[#153B2B] bg-[#a4be2d]" />
          </span>
          {/* the destination */}
          <span
            aria-hidden
            className="absolute bottom-0 left-[7px] z-10 size-6 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-[#a4be2d] bg-[#153B2B] transition-[background-color,box-shadow] duration-500 group-data-[done=true]/road:bg-[#a4be2d] group-data-[done=true]/road:shadow-[0_0_0_8px_rgba(164,190,45,.22)] lg:left-1/2"
          />

          <ol className="relative m-0 list-none p-0">
            {journeyChapters.map((c, i) => (
              <Chapter key={c.title} c={c} i={i} />
            ))}
          </ol>
        </div>

        {/* Arrival */}
        <div className="pl-10 pt-10 lg:pl-0 lg:pt-14 lg:text-center">
          <Scrub
            as="h3"
            text="People. Operations. Numbers. Brands. Systems. Leadership."
            className="m-0 text-[clamp(28px,4.4vw,68px)] font-extrabold leading-[1] tracking-[-.055em] lg:mx-auto lg:max-w-[20ch]"
          />
          <Fade as="p" className="mt-6 max-w-[56ch] text-[15px] leading-[1.7] text-[#b9c7b2] md:text-[17px] lg:mx-auto">
            Different places. Different responsibilities. One growing conviction: strong businesses connect clear thinking, good people, good systems and the willingness to execute.
          </Fade>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- Experience ------------------------------------------- */
/* Cards stack: each slides over the previous one, which shrinks and dims behind it.           */

function Card({ item, i }) {
  const [ref, on] = useInView(0.2)
  return (
    <li className="sticky mb-4 last:mb-0 md:mb-6" style={{ top: `calc(var(--experience-stack-top) + ${i * 0.75}rem)` }}>
      <article
        ref={ref}
        className={`relative grid overflow-hidden lg:h-[min(64svh,540px)] lg:grid-cols-12 ${item.card}`}
        style={{ transform: 'scale(calc(1 - var(--c,0) * .05))', transformOrigin: '50% 0%' }}
      >
        <div className="relative aspect-[16/9] overflow-hidden lg:order-last lg:col-span-6 lg:aspect-auto">
          <div className={`absolute inset-0 transition-transform duration-[1800ms] ${ease} motion-reduce:transition-none ${on ? 'scale-100' : 'scale-[1.25]'}`}>
            <Pic src={item.image} crop={item.crop} tone={item.tone} />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-5 p-6 md:p-10 lg:col-span-6 lg:p-14">
          <span aria-hidden className={`h-px bg-current opacity-40 transition-[width] duration-[1200ms] ${ease} motion-reduce:transition-none ${on ? 'w-24' : 'w-0'}`} />
          <h3
            style={{ transitionDelay: '250ms' }}
            className={`m-0 text-[clamp(28px,4.2vw,64px)] font-bold leading-[1.02] tracking-[-.045em] transition-[opacity,transform,translate] duration-[1000ms] ${ease} motion-reduce:transition-none ${on ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'}`}
          >
            {item.title}
          </h3>
          {item.detail ? <p className="m-0 max-w-[40ch] text-[15px] leading-[1.65] opacity-80">{item.detail}</p> : null}
        </div>
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-[#101310]" style={{ opacity: 'calc(var(--c,0) * .5)' }} />
      </article>
    </li>
  )
}

function Experience() {
  const list = useRef(null)
  const section = useRef(null)
  const stickyHeader = useRef(null)

  useIso(() => {
    const root = section.current
    const header = stickyHeader.current
    if (!root || !header) return undefined
    const syncOffset = () => root.style.setProperty('--experience-stack-top', `${Math.ceil(header.getBoundingClientRect().height + 32)}px`)
    syncOffset()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(syncOffset)
    observer?.observe(header)
    window.addEventListener('resize', syncOffset)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', syncOffset)
    }
  }, [])

  useIso(() => {
    const ol = list.current
    if (!ol || prefersReduced()) return undefined
    const items = Array.from(ol.children)
    const last = items.map(() => '')
    return subscribe({
      read: () =>
        items.map((li, i) => {
          const next = items[i + 1]
          if (!next) return '0.000'
          const bottom = li.getBoundingClientRect().bottom
          const nextTop = next.getBoundingClientRect().top
          const stuck = parseFloat(getComputedStyle(next).top) || 80
          return Math.min(1, Math.max(0, (bottom - nextTop) / Math.max(1, bottom - stuck))).toFixed(3)
        }),
      write: (values) =>
        items.forEach((li, i) => {
          if (values[i] !== last[i]) {
            last[i] = values[i]
            li.style.setProperty('--c', values[i])
          }
        }),
    })
  }, [])

  return (
    <section ref={section} id="experience" aria-labelledby="experience-heading" className="[--experience-stack-top:14rem] bg-[#F2F3EF] pb-[clamp(48px,6vw,88px)] pt-[clamp(32px,4vw,64px)] text-[#101310]">
      <div className={wrap}>
        <div ref={stickyHeader} className="sticky top-4 z-30 -mx-[18px] grid items-end gap-x-12 gap-y-5 border-b border-[#101310]/10 bg-[#F2F3EF]/95 px-[18px] pb-5 pt-3 backdrop-blur-md md:-mx-7 md:px-7 lg:grid-cols-12">
          <h2 id="experience-heading" className="m-0 text-[clamp(40px,7vw,112px)] font-extrabold leading-[.95] tracking-[-.055em] lg:col-span-6">
            Experience
          </h2>
          <p className="m-0 max-w-[52ch] text-[clamp(16px,1.4vw,20px)] leading-[1.65] text-[#3a4137] lg:col-span-6">
            My work has taken me through different industries, business stages, and plenty of interesting challenges, across strategy, branding, marketing, operations, and startup development.
          </p>
        </div>
        <ol ref={list} className="m-0 mt-6 list-none p-0 lg:mt-8">
          {experience.map((item, i) => (
            <Card key={item.title} item={item} i={i} />
          ))}
        </ol>
      </div>
    </section>
  )
}

/* -------------------------------------- Start -------------------------------------------- */
/* The headline types itself; each photo change is a slanted wipe over the previous one.       */

const WIPE_HIDDEN = '[clip-path:polygon(0_0,0_0,-25%_100%,-25%_100%)]'
const WIPE_SHOWN = '[clip-path:polygon(0_0,125%_0,100%_100%,-25%_100%)]'

function Start() {
  const [state, setState] = useState({ active: 0, prev: -1 })
  const select = (i) => setState((s) => (i === s.active ? s : { active: i, prev: s.active }))
  return (
    <section id="thinking" aria-labelledby="thinking-heading" className={`bg-[#153B2B] text-white ${sectionPad}`}>
      <div className={wrap}>
        <div className="grid items-end gap-x-12 gap-y-5 lg:grid-cols-12">
          <TypedLines
            id="thinking-heading"
            lines={['Got something on your mind?', "I've probably got a few questions."]}
            className="text-[clamp(32px,5.6vw,88px)] font-extrabold leading-[.98] tracking-[-.055em] lg:col-span-8"
          />
          <Fade as="p" delay={900} className="max-w-[36ch] text-[15px] leading-[1.7] text-[#b9c7b2] lg:col-span-4">
            An idea, a business challenge, or something that needs a fresh pair of eyes. Here’s where we can start.
          </Fade>
        </div>

        <div className="mt-8 grid gap-8 lg:mt-14 lg:grid-cols-12 lg:gap-x-16">
          <div className="relative order-first flex flex-col lg:col-span-6">
            <span aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 border border-[#a4be2d]" />
            <div aria-hidden className="relative aspect-[4/3] w-full overflow-hidden bg-[#101310] lg:aspect-auto lg:min-h-[500px] lg:flex-1">
              {lenses.map((lens, i) => {
                const role = i === state.active ? 'in' : i === state.prev ? 'under' : 'off'
                return (
                  <div
                    key={lens.id}
                    className={`absolute inset-0 ${role === 'in' ? `z-20 ${WIPE_SHOWN} transition-[clip-path] duration-[1100ms] ease-[cubic-bezier(0.77,0,0.18,1)] motion-reduce:transition-none` : role === 'under' ? `z-10 ${WIPE_SHOWN}` : `z-0 ${WIPE_HIDDEN}`}`}
                  >
                    <div className={`absolute inset-0 ${role === 'in' ? `scale-100 transition-transform duration-[1600ms] ${ease} motion-reduce:transition-none` : role === 'under' ? 'scale-100' : 'scale-[1.15]'}`}>
                      <Pic src={lens.image} crop={lens.crop} tone={lens.tone} />
                    </div>
                  </div>
                )
              })}
              <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(to_top,#101310a6,#10131000_50%)]" />
            </div>
          </div>

          <ul className="m-0 list-none self-start border-t border-white/20 p-0 lg:col-span-6">
            {lenses.map((lens, i) => {
              const on = i === state.active
              return (
                <li key={lens.id} className="relative border-b border-white/20">
                  <span aria-hidden className={`absolute left-0 top-0 h-full w-[3px] origin-top bg-[#a4be2d] transition-transform duration-500 ${ease} motion-reduce:transition-none ${on ? 'scale-y-100' : 'scale-y-0'}`} />
                  <h3 className="m-0">
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={`lens-${lens.id}`}
                      onClick={() => select(i)}
                      className={`flex min-h-[76px] w-full items-center gap-4 pl-6 pr-2 text-left transition-colors duration-300 ${on ? 'text-white' : 'text-white/55 hover:text-white'} ${focus} focus-visible:outline-offset-[-3px]`}
                    >
                      <span className="flex-1 text-[clamp(19px,2vw,28px)] font-bold leading-[1.1] tracking-[-.035em]">{lens.title}</span>
                      <Plus size={20} weight="light" aria-hidden className={`shrink-0 text-[#a4be2d] transition-transform duration-500 ${ease} motion-reduce:transition-none ${on ? 'rotate-45' : ''}`} />
                    </button>
                  </h3>
                  <div id={`lens-${lens.id}`} className={`grid transition-[grid-template-rows] duration-500 ${ease} motion-reduce:transition-none ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className={`overflow-hidden transition-[visibility] duration-0 ${on ? 'visible' : 'invisible delay-500'}`}>
                      <div className="pb-7 pl-6 pr-4">
                        <p className="border-l-2 border-[#a4be2d] pl-4 text-[17px] font-medium leading-[1.45] text-[#e3e9dc]">{lens.question}</p>
                        <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.75] text-[#b9c7b2]">{lens.detail}</p>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------- Closing ------------------------------------------- */
/* Kinetic type: the lines start offset in opposite directions and lock together on arrival.   */

function Closing() {
  const ref = useRef(null)
  useProgress(ref, 'pass')
  const settle = 'calc((var(--p,.5) - .5) * 16vw)'
  return (
    <section ref={ref} aria-labelledby="closing-heading" className="relative isolate flex min-h-[clamp(620px,100svh,960px)] items-end overflow-hidden bg-[#101310] text-white">
      <Frame className="absolute inset-0 -z-10" speed={12}>
        <Pic src="/closingbg.png" crop={{ pos: '50% 40%', zoom: 1.15 }} tone="muted" />
      </Frame>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#101310ee_0%,#101310a6_50%,#153b2b59_100%),linear-gradient(to_top,#101310_0%,#10131000_50%)]" />

      <div className={`${wrap} pb-[clamp(40px,6vw,88px)] pt-[clamp(96px,12vw,180px)]`}>
        <h2 id="closing-heading" className="m-0 text-[clamp(30px,7vw,112px)] font-extrabold leading-[.98] tracking-[-.058em]">
          <span className="block will-change-transform" style={{ transform: `translate3d(calc(${settle} * -1),0,0)` }}>Build with clarity.</span>
          <span className="block text-[#a4be2d] will-change-transform" style={{ transform: `translate3d(${settle},0,0)` }}>Scale with intention.</span>
        </h2>
        <div className="mt-10 grid items-end gap-8 lg:grid-cols-12 lg:gap-x-12" style={{ opacity: 'clamp(0, calc((var(--p,1) - .12) * 5), 1)' }}>
          <p className="m-0 max-w-[46ch] text-[16px] leading-[1.7] text-[#dfe6d8] md:text-[18px] lg:col-span-6">
            Good things usually start with a conversation. An idea, a business problem, or just a question you can’t quite figure out. I’m listening.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-6 lg:justify-end">
            <div className="min-w-[220px] flex-1 lg:max-w-[320px]">
              <Button to="/contact">Start With a Call</Button>
            </div>
            <Link
              to="/ventures"
              className={`group inline-flex min-h-11 items-center gap-2 border-b border-white/40 pb-1 text-[15px] text-white no-underline transition-colors duration-300 hover:border-[#a4be2d] hover:text-[#a4be2d] ${focus}`}
            >
              See My Work
              <ArrowRight size={16} weight="light" aria-hidden className="transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-white/25 pt-4 text-xs text-white/70">
          <span>Hashir Usman, Startup Architect • Venture Builder • Business Consultant</span>
          <span>Bengaluru, India</span>
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
