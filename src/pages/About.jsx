import { version, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Plus } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

/* -------------------------------------------------------------------------------------------
   ABOUT PAGE (rebuilt)
   One continuous scroll story:
   01 Hero  ->  02 Story (pinned, scroll-driven)  ->  03 Principles (sticky image swap)
   ->  04 Where we start (accordion + image)  ->  05 Closing

   Palette is unchanged: ink #101310 · forest #153B2B · lime #a4be2d · paper #F2F3EF · olive #617319
   NOTE: the pinned sections use `position: sticky`, so no parent of <About /> may set
   overflow: hidden / auto (overflow-x: clip, used below on <main>, is fine).
------------------------------------------------------------------------------------------- */

// Image files (all in /public). Each placement is a crop: `pos` = focal point, `zoom` = magnification.
const IMAGE_ALT = 'Featured photograph for the About page'
const FETCH_PRIORITY_PROP = Number.parseInt(version, 10) >= 19 ? 'fetchPriority' : 'fetchpriority'

const CROPS = {
  hero: { pos: '50% 25%', zoom: 1 },
  heroInset: { pos: '50% 22%', zoom: 1.6 },
  story: { pos: '50% 40%', zoom: 1.1 },
  storyInset: { pos: '50% 20%', zoom: 1.5 },
  closing: { pos: '50% 40%', zoom: 1.15 },
}

const TONES = {
  natural: { img: 'saturate-[.9]', over: 'bg-[#153B2B]/10 mix-blend-multiply' },
  muted: { img: 'saturate-[.5] contrast-[1.05]', over: 'bg-[#101310]/20 mix-blend-multiply' },
  tint: { img: 'saturate-[.6] contrast-[1.05]', over: 'bg-[#153B2B]/40 mix-blend-multiply' },
  accent: { img: 'saturate-[.7] contrast-[1.05]', over: 'bg-[#a4be2d]/30 mix-blend-multiply' },
}

const ease = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const wrap = 'mx-auto w-full max-w-[1320px] px-[18px] md:px-7'
const section = 'py-[clamp(64px,9vw,140px)]'
const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4be2d]'
const stroke = 'text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.8)]'

const tags = ['Venture building', 'Business consulting', 'Valuation readiness', 'Funding & investor prep', 'Founder mentoring']
const storyWords = ['Big', 'ideas', 'are', 'fun.', 'Making', 'them', 'work', 'is', 'my', 'thing.']
const thread = ['Unclear', 'Clear', 'Plan', 'Real', 'Better']
const connected = ['Brand positioning', 'Customer segments', 'Product offering', 'Pricing & channels', 'Sales & conversion']

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
    list: connected,
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

/* ----------------------------------------------------------------------------------------- */
/* Hooks                                                                                      */
/* ----------------------------------------------------------------------------------------- */

// Fires once when an element enters the viewport.
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) {
      setOn(true)
      return undefined
    }
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

// Writes scroll progress (0..1) into a CSS variable on the element. Everything scroll-driven reads it.
//   pass: 0 when the element enters the viewport, 1 when it leaves
//   pin : 0 when its top reaches the viewport top, 1 when its bottom reaches the viewport bottom (sticky sections)
//   out : 0 at the top of the page, 1 once the element has scrolled away (hero)
function useProgress(ref, mode = 'pass', name = '--p') {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty(name, mode === 'pin' ? '1' : mode === 'out' ? '0' : '.5')
      return undefined
    }
    let raf = 0
    const calc = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const raw =
        mode === 'pin' ? -r.top / Math.max(1, r.height - vh)
        : mode === 'out' ? -r.top / Math.max(1, r.height)
        : (vh - r.top) / (vh + r.height)
      el.style.setProperty(name, Math.min(1, Math.max(0, raw)).toFixed(4))
    }
    const request = () => { if (!raf) raf = requestAnimationFrame(calc) }
    calc()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    return () => {
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      cancelAnimationFrame(raf)
    }
  }, [ref, mode, name])
}

/* ----------------------------------------------------------------------------------------- */
/* Building blocks                                                                            */
/* ----------------------------------------------------------------------------------------- */

// Soft fade + rise, used for supporting copy only.
function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, on] = useInView(0.12)
  return (
    <Tag
      ref={ref}
      data-in={on}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`translate-y-5 opacity-0 transition-[opacity,transform,translate] duration-[900ms] ${ease} data-[in=true]:translate-y-0 data-[in=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

// Headline whose lines slide up out of a mask.
function Lines({ as: Tag = 'div', lines, delay = 0, step = 130, className = '', ...rest }) {
  const [ref, on] = useInView(0.2)
  return (
    <Tag ref={ref} data-in={on} className={`group/l block ${className}`} {...rest}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[.1em] block overflow-hidden pb-[.1em]">
          <span
            style={{ transitionDelay: `${delay + i * step}ms` }}
            className={`block translate-y-[115%] transition-transform duration-[1100ms] ${ease} group-data-[in=true]/l:translate-y-0 motion-reduce:translate-y-0 motion-reduce:transition-none`}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}

function Chapter({ no, label, dark = false, className = '' }) {
  return (
    <Reveal className={`flex items-center gap-3 text-xs font-semibold ${dark ? 'text-[#a4be2d]' : 'text-[#617319]'} ${className}`}>
      <span className="tabular-nums">{no}</span>
      <span aria-hidden className="h-px w-8 bg-current opacity-60" />
      <span>{label}</span>
    </Reveal>
  )
}

// A cropped photograph that fills its positioned parent.
function Pic({ src, crop, tone = 'natural', alt = '', priority = false, className = '' }) {
  const extra = priority ? { [FETCH_PRIORITY_PROP]: 'high' } : {}
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
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

// Parallax container: the photo inside drifts slowly against the scroll. Pass `relative` or `absolute` in className.
function Frame({ className = '', speed = 8, children }) {
  const ref = useRef(null)
  useProgress(ref, 'pass')
  return (
    <div ref={ref} className={`overflow-hidden bg-[#153B2B] ${className}`}>
      <div
        className="absolute inset-x-0 -inset-y-[10%] will-change-transform"
        style={{ transform: `translate3d(0,calc((var(--p,.5) - .5) * -${speed}%),0)` }}
      >
        {children}
      </div>
    </div>
  )
}

function Button({ to, children }) {
  return (
    <Link
      to={to}
      className={`group relative flex min-h-14 items-center justify-between gap-4 overflow-hidden border border-[#a4be2d] bg-[#a4be2d] px-6 text-[15px] font-semibold text-[#101310] no-underline ${focus} focus-visible:outline-white`}
    >
      <span aria-hidden className={`absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ${ease} group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none`} />
      <span className="relative">{children}</span>
      <ArrowRight size={20} weight="light" aria-hidden className="relative transition-transform duration-300 motion-safe:group-hover:translate-x-1.5" />
    </Link>
  )
}

/* ----------------------------------------------------------------------------------------- */
/* 01 · Hero                                                                                  */
/* ----------------------------------------------------------------------------------------- */

function Hero() {
  const ref = useRef(null)
  useProgress(ref, 'out')
  return (
    <section ref={ref} aria-labelledby="about-title" className="relative isolate min-h-svh overflow-hidden bg-[#101310] text-white">
      {/* Photo: slow zoom + drift as the page scrolls away */}
      <div className="absolute inset-0 -z-10" style={{ transform: 'translate3d(0,calc(var(--p,0) * 14%),0) scale(calc(1.04 + var(--p,0) * .1))' }}>
        <Pic src="/abouthero.png" crop={CROPS.hero} tone="natural" alt={IMAGE_ALT} priority />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#101310f2_0%,#101310a6_48%,#10131033_100%),linear-gradient(to_top,#101310_0%,#10131000_45%)]" />

      {/* The one orchestrated moment: a forest-green curtain lifts off the photo on load */}
      <div aria-hidden className="about-curtain pointer-events-none absolute inset-0 z-[5] origin-top bg-[#153B2B]" />

      <div
        className={`${wrap} relative z-10 flex min-h-svh flex-col justify-end pb-[calc(64px+clamp(32px,5vw,72px))] pt-28`}
        style={{ transform: 'translate3d(0,calc(var(--p,0) * -9vh),0)', opacity: 'calc(1 - var(--p,0) * 1.6)' }}
      >
        <div aria-hidden className="pointer-events-none absolute right-[18px] top-28 hidden w-[22%] max-w-[300px] md:right-7 lg:block">
          <div className="relative">
            <span className="absolute inset-0 translate-x-3 translate-y-3 border border-[#a4be2d]" />
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#153B2B]">
              <Pic src="/abouthero1.png" crop={CROPS.heroInset} tone="muted" />
            </div>
          </div>
        </div>

        <Chapter no="01" label="About" dark />
        <Lines
          as="h1"
          id="about-title"
          delay={650}
          lines={['Need a second brain?', 'Or someone to help', 'build the whole thing?']}
          className="mt-5 text-[clamp(26px,7.2vw,116px)] font-extrabold leading-[.95] tracking-[-.055em]"
        />
        <div className="mt-8 flex flex-col gap-6 lg:mt-12 lg:flex-row lg:items-end lg:justify-between">
          <Reveal as="p" delay={1150} className="max-w-[46ch] text-[15px] leading-[1.7] text-[#dfe6d8] md:text-[17px]">
            Some problems need one good conversation. Others need research, planning, systems, execution and a little time.
          </Reveal>
          <Reveal delay={1300}>
            <a href="#story" className={`group inline-flex min-h-11 items-center gap-4 text-sm font-medium text-white no-underline ${focus}`}>
              <span className="relative block h-12 w-px overflow-hidden bg-white/30">
                <span aria-hidden className="about-cue absolute inset-x-0 top-0 h-1/2 bg-[#a4be2d]" />
              </span>
              Scroll to read
              <ArrowDown size={18} weight="light" aria-hidden className="text-[#a4be2d]" />
            </a>
          </Reveal>
        </div>
      </div>

      {/* What I do: a slow ticker, the only looping motion on the page */}
      <div className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-t border-white/20 bg-[#101310]/85 backdrop-blur-sm">
        <div className="about-marquee flex w-max">
          {[...tags, ...tags].map((tag, i) => (
            <span key={i} aria-hidden={i >= tags.length || undefined} className="flex shrink-0 items-center gap-8 py-5 pl-8 text-xs font-medium text-white/80 md:text-sm">
              {tag}
              <span aria-hidden className="size-1.5 bg-[#a4be2d]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------------------- */
/* 02 · Story: pinned. Scrolling reveals the statement word by word, opens the photo and      */
/*      lights up the five-step thread.                                                        */
/* ----------------------------------------------------------------------------------------- */

function Story() {
  const ref = useRef(null)
  useProgress(ref, 'pin')
  return (
    <section id="story" ref={ref} aria-labelledby="story-heading" className="relative h-[260svh] bg-[#F2F3EF] text-[#101310] lg:h-[300svh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className={`${wrap} grid gap-5 pt-16 lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:pt-0`}>
          {/* Photo opens up as you scroll */}
          <div className="relative order-first h-[24svh] lg:order-last lg:col-span-5 lg:h-[68svh]">
            <span aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 border border-[#617319]" />
            <div className="absolute inset-0 bg-[#153B2B]" style={{ clipPath: 'inset(max(0%, calc(16% - var(--p,1) * 36%)))' }}>
              <div className="absolute inset-0" style={{ transform: 'scale(max(1, calc(1.3 - var(--p,1) * .6)))' }}>
                <Pic src="/abt3.png" crop={CROPS.story} tone="natural" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Chapter no="02" label="The human behind HU." />
            <h2 id="story-heading" className="mt-4 text-[clamp(28px,5.4vw,88px)] font-extrabold leading-[1.02] tracking-[-.05em]">
              {storyWords.map((word, i) => (
                <span key={i} style={{ opacity: `clamp(.14, calc((var(--p,1) - ${(i * 0.05).toFixed(2)}) * 12 + .14), 1)` }}>
                  {word}{' '}
                </span>
              ))}
            </h2>

            {/* Unclear -> Better */}
            <div className="mt-6 lg:mt-12">
              <div className="relative h-[3px] bg-[#101310]/15">
                <span className="absolute inset-0 origin-left bg-[#a4be2d]" style={{ transform: 'scaleX(clamp(0, calc((var(--p,1) - .45) / .5), 1))' }} />
              </div>
              <ol className="m-0 mt-3 grid list-none grid-cols-5 gap-2 p-0">
                {thread.map((step, i) => (
                  <li
                    key={step}
                    style={{ opacity: `clamp(.3, calc((var(--p,1) - ${(0.45 + i * 0.12).toFixed(2)}) * 20 + .3), 1)` }}
                    className="text-[11px] font-semibold md:text-sm"
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section aria-label="A little about me" className={`bg-[#F2F3EF] pb-[clamp(72px,10vw,160px)] pt-4 text-[#101310]`}>
      <div className={`${wrap} grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-x-16`}>
        <Reveal className="relative lg:col-span-5">
          <span aria-hidden className="absolute inset-0 -translate-x-3 translate-y-3 border border-[#617319]" />
          <Frame className="relative aspect-[4/5] w-full" speed={10}>
            <Pic src="/abt3.1.png" crop={CROPS.storyInset} tone="tint" />
          </Frame>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal as="p" className="text-xs font-semibold text-[#617319]">A little about me</Reveal>
          <div className="mt-5 space-y-6 text-[clamp(18px,1.7vw,26px)] leading-[1.6] tracking-[-.01em] text-[#2a312a]">
            <Reveal as="p" delay={100}>
              My work has taken me through different industries, business stages, and plenty of interesting challenges, across strategy, branding, marketing, operations, and startup development.
            </Reveal>
            <Reveal as="p" delay={180}>
              Some days it’s strategy. Some days it’s marketing. Some days it’s figuring out why a business is making sales but not enough money. And some days we’re building something completely new.
            </Reveal>
          </div>
          <Reveal delay={260} className="mt-9 max-w-[560px] bg-[#a4be2d] p-6 md:p-7">
            <p className="text-sm font-bold">The part I enjoy</p>
            <p className="mt-2 text-[15px] leading-[1.65]">Where an unclear situation starts to make sense, an idea becomes a plan, and a plan becomes something real.</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------------------- */
/* 03 · Principles: the photo stays pinned and swaps as each belief scrolls to centre          */
/* ----------------------------------------------------------------------------------------- */

function Principles() {
  const [active, setActive] = useState(0)
  const items = useRef([])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.dataset.i)) }),
      { rootMargin: '-50% 0px -50% 0px' },
    )
    items.current.forEach((node) => node && io.observe(node))
    return () => io.disconnect()
  }, [])

  return (
    <section id="principles" aria-labelledby="principles-heading" className="bg-[#101310] text-white">
      <div className={`${wrap} ${section} pb-0 lg:pb-0`}>
        <Chapter no="03" label="Principles" dark />
        <Lines
          as="h2"
          id="principles-heading"
          lines={['What I believe', 'about building.']}
          className="mt-4 text-[clamp(36px,6.4vw,100px)] font-extrabold leading-[.98] tracking-[-.055em]"
        />
      </div>

      <div className={`${wrap} pb-[clamp(48px,7vw,110px)] lg:grid lg:grid-cols-12 lg:gap-x-16`}>
        {/* Pinned photo (desktop) */}
        <div aria-hidden className="hidden lg:col-span-6 lg:block">
          <div className="sticky top-0 flex h-svh items-center">
            <div className="relative h-[72svh] w-full">
              <span className="absolute inset-0 translate-x-3 translate-y-3 border border-[#a4be2d]" />
              <div className="absolute inset-0 overflow-hidden bg-[#153B2B]">
                {principles.map((p, i) => (
                  <div key={p.image} className={`absolute inset-0 transition-[opacity,transform] duration-[1100ms] ${ease} ${i === active ? 'scale-100 opacity-100' : 'scale-[1.12] opacity-0'}`}>
                    <Pic src={p.image} crop={p.crop} tone={p.tone} />
                  </div>
                ))}
                <div className="absolute inset-0 bg-[linear-gradient(to_top,#101310b3,#10131000_55%)]" />
                <div className="absolute bottom-0 left-6 grid">
                  {principles.map((p, i) => (
                    <span key={p.image} className={`col-start-1 row-start-1 text-[clamp(90px,10vw,170px)] font-extrabold leading-[.8] tracking-[-.06em] transition-[opacity,transform] duration-700 ${ease} ${stroke} ${i === active ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                      0{i + 1}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Beliefs */}
        <div className="lg:col-span-6">
          {principles.map((p, i) => (
            <article
              key={p.image}
              ref={(node) => { items.current[i] = node }}
              data-i={i}
              data-on={i === active}
              aria-labelledby={`principle-${i}`}
              className={`flex flex-col justify-center gap-6 pt-12 transition-opacity duration-700 lg:min-h-svh lg:py-24 lg:data-[on=false]:opacity-25`}
            >
              <div className="relative aspect-[16/10] w-full lg:hidden">
                <Frame className="absolute inset-0" speed={8}>
                  <Pic src={p.image} crop={p.crop} tone={p.tone} />
                </Frame>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold tabular-nums text-[#a4be2d]">
                <span>0{i + 1}</span>
                <span aria-hidden className="h-px w-10 bg-[#a4be2d]/60" />
                <span>of 03</span>
              </div>
              <Lines as="h3" id={`principle-${i}`} lines={p.title} className="text-[clamp(30px,3.8vw,56px)] font-bold leading-[1.04] tracking-[-.045em]" />
              <Reveal as="p" delay={150} className="max-w-[46ch] text-[16px] leading-[1.75] text-[#cdd8c6]">{p.body}</Reveal>
              {p.list && (
                <ul className="m-0 grid max-w-[520px] list-none grid-cols-2 gap-x-6 p-0 text-[13px] text-[#b9c7b2]">
                  {p.list.map((item) => (
                    <li key={item} className="flex items-center gap-2 border-t border-white/15 py-2.5 last:col-span-2">
                      <span aria-hidden className="h-px w-3 bg-[#a4be2d]" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------------------- */
/* 04 · Where we start: an accordion that drives the photograph                               */
/* ----------------------------------------------------------------------------------------- */

function Start() {
  const [active, setActive] = useState(0)
  return (
    <section id="thinking" aria-labelledby="thinking-heading" className={`bg-[#153B2B] text-white ${section}`}>
      <div className={wrap}>
        <div className="grid items-end gap-x-10 gap-y-5 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Chapter no="04" label="Where we start" dark />
            <Lines
              as="h2"
              id="thinking-heading"
              lines={['Got something on your mind?', "I've probably got a few questions."]}
              className="mt-4 text-[clamp(32px,5.6vw,88px)] font-extrabold leading-[.98] tracking-[-.055em]"
            />
          </div>
          <Reveal as="p" delay={200} className="max-w-[36ch] text-[15px] leading-[1.7] text-[#b9c7b2] lg:col-span-4">
            An idea, a business challenge, or something that needs a fresh pair of eyes. Here’s where we can start.
          </Reveal>
        </div>

        <div className="mt-10 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-x-14">
          <Reveal className="relative order-first lg:col-span-6">
            <span aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 border border-[#a4be2d]" />
            <div aria-hidden className="relative aspect-[4/3] w-full overflow-hidden bg-[#101310] lg:aspect-auto lg:h-full lg:min-h-[520px]">
              {lenses.map((lens, i) => (
                <div key={lens.id} className={`absolute inset-0 transition-[opacity,transform] duration-[1100ms] ${ease} ${i === active ? 'scale-100 opacity-100' : 'scale-[1.12] opacity-0'}`}>
                  <Pic src={lens.image} crop={lens.crop} tone={lens.tone} />
                </div>
              ))}
              <div className="absolute inset-0 bg-[linear-gradient(to_top,#101310b3,#10131000_55%)]" />
              <div className="absolute right-4 top-2 grid">
                {lenses.map((lens, i) => (
                  <span key={lens.id} className={`col-start-1 row-start-1 text-[clamp(70px,9vw,150px)] font-extrabold leading-[.9] tracking-[-.06em] transition-[opacity,transform] duration-700 ${ease} ${stroke} ${i === active ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}>
                    0{i + 1}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-6">
            <ul className="m-0 list-none border-t border-white/20 p-0">
              {lenses.map((lens, i) => {
                const on = i === active
                return (
                  <li key={lens.id} className="relative border-b border-white/20">
                    <span aria-hidden className={`absolute left-0 top-0 h-full w-[3px] origin-top bg-[#a4be2d] transition-transform duration-500 ${ease} ${on ? 'scale-y-100' : 'scale-y-0'}`} />
                    <h3 className="m-0">
                      <button
                        type="button"
                        aria-expanded={on}
                        aria-controls={`lens-${lens.id}`}
                        onClick={() => setActive(i)}
                        className={`flex min-h-[76px] w-full items-center gap-4 pl-6 pr-2 text-left transition-colors duration-300 ${on ? 'text-white' : 'text-white/55 hover:text-white'} ${focus} focus-visible:outline-offset-[-3px]`}
                      >
                        <span className={`w-7 shrink-0 text-sm font-bold tabular-nums ${on ? 'text-[#a4be2d]' : 'text-white/40'}`}>0{i + 1}</span>
                        <span className="flex-1 text-[clamp(19px,2vw,28px)] font-bold leading-[1.1] tracking-[-.035em]">{lens.title}</span>
                        <Plus size={20} weight="light" aria-hidden className={`shrink-0 text-[#a4be2d] transition-transform duration-500 ${ease} ${on ? 'rotate-45' : ''}`} />
                      </button>
                    </h3>
                    <div id={`lens-${lens.id}`} className={`grid transition-[grid-template-rows] duration-500 ${ease} ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className={`overflow-hidden transition-[visibility] duration-0 ${on ? 'visible' : 'invisible delay-500'}`}>
                        <div className="pb-7 pl-[68px] pr-4">
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
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------------------- */
/* 05 · Closing                                                                               */
/* ----------------------------------------------------------------------------------------- */

function Closing() {
  return (
    <section aria-labelledby="closing-heading" className="relative isolate flex min-h-[clamp(620px,100svh,960px)] items-end overflow-hidden bg-[#101310] text-white">
      <Frame className="absolute inset-0 -z-10" speed={12}>
        <Pic src="/closingbg.png" crop={CROPS.closing} tone="muted" />
      </Frame>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#101310ee_0%,#101310a6_50%,#153b2b59_100%),linear-gradient(to_top,#101310_0%,#10131000_50%)]" />

      <div className={`${wrap} pb-[clamp(40px,6vw,88px)] pt-[clamp(96px,12vw,180px)]`}>
        <Chapter no="05" label="Closing" dark />
        <Lines
          as="h2"
          id="closing-heading"
          step={160}
          lines={['Build with clarity.', <span key="s" className="text-[#a4be2d]">Scale with intention.</span>]}
          className="mt-6 text-[clamp(34px,8vw,128px)] font-extrabold leading-[.95] tracking-[-.058em]"
        />
        <div className="mt-10 grid items-end gap-8 lg:grid-cols-12 lg:gap-x-12">
          <Reveal as="p" className="max-w-[46ch] text-[16px] leading-[1.7] text-[#dfe6d8] md:text-[18px] lg:col-span-6">
            Good things usually start with a conversation. An idea, a business problem, or just a question you can’t quite figure out. I’m listening.
          </Reveal>
          <Reveal delay={150} className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:col-span-6 lg:justify-end">
            <div className="min-w-[220px] flex-1 lg:max-w-[320px]">
              <Button to="/contact">Start with a call</Button>
            </div>
            <Link
              to="/ventures"
              className={`group inline-flex min-h-11 items-center gap-2 border-b border-white/40 pb-1 text-[15px] text-white no-underline transition-colors duration-300 hover:border-[#a4be2d] hover:text-[#a4be2d] ${focus}`}
            >
              See my work
              <ArrowRight size={16} weight="light" aria-hidden className="transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-white/25 pt-4 text-xs text-white/70">
          <span>Hashir Usman · Startup Architect, Venture Builder, Business Consultant</span>
          <span>Bengaluru, India</span>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------------------------------- */

export default function AboutPage() {
  const root = useRef(null)
  useProgress(root, 'pin', '--sp')

  useEffect(() => {
    document.title = 'About | Hashir Usman'
  }, [])

  return (
    <main id="main" ref={root} className="overflow-x-clip">
      <style>{`
        @keyframes about-marquee { to { transform: translateX(-50%); } }
        @keyframes about-curtain { to { transform: scaleY(0); } }
        @keyframes about-cue { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
        .about-marquee { animation: about-marquee 38s linear infinite; }
        .about-marquee:hover { animation-play-state: paused; }
        .about-curtain { animation: about-curtain 1.3s cubic-bezier(.77,0,.18,1) .1s forwards; }
        .about-cue { animation: about-cue 1.8s cubic-bezier(.77,0,.18,1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .about-marquee, .about-cue { animation: none; }
          .about-curtain { display: none; }
        }
      `}</style>

      {/* Reading progress */}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] motion-reduce:hidden">
        <span className="block h-full origin-left bg-[#a4be2d]" style={{ transform: 'scaleX(var(--sp,0))' }} />
      </div>

      <Hero />
      <Story />
      <About />
      <Principles />
      <Start />
      <Closing />
    </main>
  )
}