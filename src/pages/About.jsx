import { version, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

// Single source image (public/image.png). Each placement is a crop: `pos` is the focal point
// (object-position and zoom origin), `zoom` magnifies around it. Tune these to reframe any placement.
const IMAGE_SRC = '/image.png'
// Describe the actual photograph here; every other placement is decorative and uses an empty alt.
const IMAGE_ALT = 'Featured photograph for the About page'

// React 19 reads `fetchPriority`; React 18 only passes the lowercase attribute through without a warning.
const FETCH_PRIORITY_PROP = Number.parseInt(version, 10) >= 19 ? 'fetchPriority' : 'fetchpriority'

const CROPS = {
  hero: { pos: '50% 25%', zoom: 1 },
  heroInset: { pos: '50% 22%', zoom: 2 },
  storyMain: { pos: '50% 40%', zoom: 1.15 },
  storyInset: { pos: '50% 20%', zoom: 1.8 },
  principleOne: { pos: '50% 35%', zoom: 1.1 },
  principleTwo: { pos: '50% 20%', zoom: 2.2 },
  principleThree: { pos: '50% 50%', zoom: 1.6 },
  closing: { pos: '50% 40%', zoom: 1.25 },
  closingInset: { pos: '50% 20%', zoom: 1.7 },
}

// Image treatments. Colour is kept in the photograph; overlays only tint it.
const TONES = {
  natural: { img: 'saturate-[.9]', over: 'bg-[#153B2B]/10 mix-blend-multiply' },
  muted: { img: 'saturate-[.5] contrast-[1.05]', over: 'bg-[#101310]/20 mix-blend-multiply' },
  tint: { img: 'saturate-[.6] contrast-[1.05]', over: 'bg-[#153B2B]/45 mix-blend-multiply' },
  accent: { img: 'saturate-[.7] contrast-[1.05]', over: 'bg-[#a4be2d]/35 mix-blend-multiply' },
}

const ease = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const easeClip = 'ease-[cubic-bezier(0.77,0,0.18,1)]'
const wrap = 'mx-auto max-w-[1320px] px-7 max-[768px]:px-[18px]'
const heroH = 'lg:min-h-[clamp(640px,100svh,900px)]'
const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4be2d]'
const focusIn = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#a4be2d]'
const strokeLight = 'text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.85)]'

// Tailwind v3 animates `transform`; v4 moves and scales with the standalone `translate` / `scale`
// properties. Listing all of them keeps the reveals animating on either version.
const move = 'transition-[opacity,transform,translate,scale]'
const base = `opacity-0 ${move} duration-[900ms] ${ease} data-[in=true]:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none`
const reveals = {
  y: `${base} translate-y-4 data-[in=true]:translate-y-0 motion-reduce:translate-y-0`,
  x: `${base} -translate-x-3 data-[in=true]:translate-x-0 motion-reduce:translate-x-0`,
  xr: `${base} translate-x-4 data-[in=true]:translate-x-0 motion-reduce:translate-x-0`,
  zoom: `${base} scale-[.94] data-[in=true]:scale-100 motion-reduce:scale-100`,
}

const clipFrom = {
  none: '[clip-path:inset(0)]',
  bottom: '[clip-path:inset(100%_0_0_0)]',
  top: '[clip-path:inset(0_0_100%_0)]',
  left: '[clip-path:inset(0_100%_0_0)]',
  right: '[clip-path:inset(0_0_0_100%)]',
}

const tags = ['Venture building', 'Business consulting', 'Valuation readiness', 'Funding & investor prep', 'Founder mentoring']
const thread = ['Unclear', 'Clear', 'Plan', 'Real', 'Better']
const connected = ['Brand positioning', 'Customer segments', 'Product offering', 'Pricing & channels', 'Sales & conversion']

const lenses = [
  {
    id: 'assumption',
    image: '/slide1.png',
    no: '01',
    title: 'Startup Idea Strategy Call',
    question: "Let's talk ideas",
    detail: "Got an idea you can't stop thinking about? Let's figure out what makes sense and what to test next.",
    caption: '01 / Ideas',
    crop: { pos: '50% 25%', zoom: 1 },
    tone: 'natural',
    clip: '[clip-path:inset(0_0_0_0)]',
  },
  {
    id: 'customer',
    image: '/slide2.png',
    no: '02',
    title: 'Business Strategy Consultation',
    question: 'Help me figure it out',
    detail: "Something not working the way you expected? Let's find the gaps and figure out the next move.",
    caption: '02 / Business',
    crop: { pos: '30% 30%', zoom: 1.7 },
    tone: 'muted',
    clip: '[clip-path:inset(6%_0_0_10%)]',
  },
  {
    id: 'logic',
    image: '/slide3.png',
    no: '03',
    title: 'Brand & Growth Strategy',
    question: "Let's talk growth",
    detail: "Good product. Not enough traction? Let's get the positioning, marketing and growth direction right.",
    caption: '03 / Growth',
    crop: { pos: '70% 60%', zoom: 2 },
    tone: 'tint',
    clip: '[clip-path:inset(0_12%_8%_0)]',
  },
  {
    id: 'next',
    image: '/slide4.png',
    no: '04',
    title: 'Business Systems & Scaling',
    question: 'Fix the chaos',
    detail: "Business growing faster than your systems? Let's get people, processes, and operations working together.",
    caption: '04 / Systems',
    crop: { pos: '50% 15%', zoom: 1.4 },
    tone: 'accent',
    clip: '[clip-path:inset(8%_5%_0_5%)]',
  },
]

function useReveal(ref) {
  useEffect(() => {
    const nodes = ref.current ? Array.from(ref.current.querySelectorAll('[data-reveal]')) : []
    const show = (node) => node.setAttribute('data-in', 'true')

    // No observer support: show everything immediately so no content stays hidden.
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(show)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        // Also reveal anything already scrolled past (reload mid-page, hash jumps).
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          show(entry.target)
          observer.unobserve(entry.target)
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    nodes.forEach((node) => observer.observe(node))
    // Keep content visible if an observer callback is delayed or suppressed (for
    // example during restored scroll positions or page transitions).
    const fallback = window.setTimeout(() => nodes.forEach(show), 1600)
    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [ref])
}

function useParallax(ref) {
  useEffect(() => {
    const root = ref.current
    if (!root || !('IntersectionObserver' in window)) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const compact = window.matchMedia('(max-width: 767px)')
    // Observe each layer's frame (not the oversized layer) so visibility matches what the viewer sees.
    const layers = new Map()
    root.querySelectorAll('[data-parallax]').forEach((layer) => layers.set(layer.parentElement, layer))
    const live = new Set()
    let frame = 0

    const update = () => {
      frame = 0
      const half = window.innerHeight / 2
      live.forEach((box) => {
        const layer = layers.get(box)
        const rect = box.getBoundingClientRect()
        const speed = parseFloat(layer.dataset.parallax) * (compact.matches ? 0.5 : 1)
        // The layer overhangs its frame by 12% top and bottom, so this limit never exposes a gap.
        const limit = rect.height * 0.12
        const shift = (half - (rect.top + rect.height / 2)) * speed
        layer.style.setProperty('--py', `${Math.max(-limit, Math.min(limit, shift))}px`)
      })
    }
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? live.add(entry.target) : live.delete(entry.target)))
      request()
    }, { rootMargin: '10% 0px' })

    layers.forEach((layer, box) => observer.observe(box))
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      cancelAnimationFrame(frame)
    }
  }, [ref])
}

function Reveal({ as: Tag = 'div', delay = 0, v = 'y', className = '', children, ...rest }) {
  return (
    <Tag data-reveal style={delay ? { transitionDelay: `${delay}ms` } : undefined} className={`${reveals[v]} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

function Lines({ as: Tag = 'div', lines, delay = 0, step = 140, className = '', ...rest }) {
  return (
    <Tag data-reveal className={`group/lines block ${className}`} {...rest}>
      {lines.map((line, index) => (
        <span key={index} className="-my-[.08em] block overflow-hidden py-[.08em]">
          <span
            style={{ transitionDelay: `${delay + index * step}ms` }}
            className={`block translate-y-[110%] transition-transform duration-[1100ms] ${ease} group-data-[in=true]/lines:translate-y-0 motion-reduce:translate-y-0 motion-reduce:transition-none`}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}

function Hl({ children }) {
  return (
    <span className="relative inline-block px-[.12em]">
      <span aria-hidden className={`absolute inset-0 origin-left scale-x-0 bg-[#a4be2d] transition-transform duration-[1000ms] delay-[700ms] ${easeClip} group-data-[in=true]/lines:scale-x-100 motion-reduce:scale-x-100 motion-reduce:transition-none`} />
      <span className="relative">{children}</span>
    </span>
  )
}

function Rule({ delay = 0, className = '', tone = 'bg-[#101310]/20', vertical = false }) {
  return (
    <span
      aria-hidden
      data-reveal
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`block transition-transform duration-[1200ms] ${ease} motion-reduce:scale-100 motion-reduce:transition-none ${vertical ? 'h-full w-px origin-top scale-y-0 data-[in=true]:scale-y-100' : 'h-px w-full origin-left scale-x-0 data-[in=true]:scale-x-100'} ${tone} ${className}`}
    />
  )
}

function Chapter({ no, label, dark = false }) {
  return (
    <Reveal v="x" className={`flex items-center gap-3 text-xs font-semibold ${dark ? 'text-[#a4be2d]' : 'text-[#617319]'}`}>
      <span className="tabular-nums">{no}</span>
      <span aria-hidden className="h-px w-8 bg-current opacity-60" />
      <span>{label}</span>
    </Reveal>
  )
}

function ClipFrame({ from = 'bottom', delay = 0, duration = 1400, bg = 'bg-[linear-gradient(135deg,#153B2B,#101310)]', className = '', children }) {
  return (
    <div
      data-reveal
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }}
      className={`isolate overflow-hidden ${bg} transition-[clip-path] ${easeClip} ${clipFrom[from]} data-[in=true]:[clip-path:inset(0)] motion-reduce:[clip-path:inset(0)] motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  )
}

function Img({ src = IMAGE_SRC, crop, tone = 'natural', alt = '', priority = false, delay = 0, duration = 2400, className = '' }) {
  const priorityProps = priority ? { [FETCH_PRIORITY_PROP]: 'high' } : {}
  return (
    <div className="size-full" style={{ transform: `scale(${crop.zoom})`, transformOrigin: crop.pos }}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        {...priorityProps}
        decoding="async"
        draggable={false}
        onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
        style={{ objectPosition: crop.pos, transitionDelay: delay ? `${delay}ms` : undefined, transitionDuration: `${duration}ms` }}
        className={`size-full object-cover ${TONES[tone].img} ${className}`}
      />
    </div>
  )
}

function Photo({ src = IMAGE_SRC, crop, tone = 'natural', from = 'bottom', delay = 0, duration = 1400, imageDuration = 2400, parallax = 0, priority = false, hover = false, alt = '', className = '', children }) {
  return (
    <ClipFrame from={from} delay={delay} duration={duration} className={`group/ph ${className}`}>
      <div
        data-parallax={parallax || undefined}
        className={parallax ? 'absolute inset-x-0 inset-y-[-12%] will-change-transform [transform:translate3d(0,var(--py,0px),0)]' : 'absolute inset-0'}
      >
        <div className={`size-full ${hover ? `transition-transform duration-[1400ms] ${ease} motion-safe:group-hover/ph:scale-[1.06]` : ''}`}>
          <Img
            src={src}
            crop={crop}
            tone={tone}
            alt={alt}
            priority={priority}
            delay={delay}
            duration={imageDuration}
            className={`scale-[1.2] transition-transform duration-[2400ms] ${ease} group-data-[in=true]/ph:scale-100 motion-reduce:scale-100 motion-reduce:transition-none`}
          />
        </div>
      </div>
      <div aria-hidden className={`pointer-events-none absolute inset-0 ${TONES[tone].over}`} />
      {children}
    </ClipFrame>
  )
}

function LinkBlock({ to, children }) {
  return (
    <Link
      to={to}
      className={`group relative flex min-h-14 items-center justify-between gap-4 overflow-hidden border border-[#a4be2d] bg-[#a4be2d] px-6 text-[15px] font-semibold text-[#101310] no-underline ${focus} focus-visible:outline-white`}
    >
      <span aria-hidden className={`absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ${easeClip} group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none`} />
      <span className="relative">{children}</span>
      <ArrowRight size={20} weight="light" aria-hidden className="relative transition-transform duration-300 motion-safe:group-hover:translate-x-1.5 motion-safe:group-focus-visible:translate-x-1.5" />
    </Link>
  )
}

function Thinking() {
  const [active, setActive] = useState(0)
  const tabs = useRef([])

  const onKeyDown = (event) => {
    const steps = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
    let next = null
    if (event.key in steps) next = (active + steps[event.key] + lenses.length) % lenses.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = lenses.length - 1
    if (next === null) return
    event.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <div className="mt-7 grid gap-x-8 gap-y-6 lg:grid-cols-12">
      <div className="relative lg:col-span-5 lg:col-start-8 lg:row-start-1">
        {/* Tab buttons are direct children of the tablist; the entrance animation lives on each button. */}
        <div role="tablist" aria-orientation="vertical" aria-label="Four ways to start a conversation" onKeyDown={onKeyDown} className="relative">
          <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-white/20" />
          <span aria-hidden style={{ transform: `scaleY(${(active + 1) / lenses.length})` }} className={`absolute left-0 top-0 h-full w-[3px] origin-top bg-[#a4be2d] transition-transform duration-700 ${ease} motion-reduce:transition-none`} />
          {lenses.map((lens, index) => {
            const on = index === active
            return (
              <button
                key={lens.id}
                ref={(node) => { tabs.current[index] = node }}
                type="button"
                role="tab"
                id={`think-tab-${lens.id}`}
                aria-selected={on}
                aria-controls={`think-panel-${lens.id}`}
                tabIndex={on ? 0 : -1}
                data-reveal
                style={{ transitionDelay: `${index * 70}ms` }}
                onClick={() => setActive(index)}
                className={`group/tab block w-full border-b border-white/15 text-left ${reveals.xr} ${focusIn}`}
              >
                <span className={`flex min-h-[72px] items-center gap-4 pl-6 pr-2 transition-[transform,translate,color] duration-500 ${ease} motion-reduce:transition-none ${on ? 'translate-x-2 text-white' : 'text-white/55 group-hover/tab:text-white motion-safe:group-hover/tab:translate-x-1'}`}>
                  <span className={`w-7 shrink-0 text-sm font-bold tabular-nums transition-colors duration-500 ${on ? 'text-[#a4be2d]' : 'text-white/40'}`}>{lens.no}</span>
                  <span className="flex-1 text-[clamp(19px,2vw,28px)] font-bold leading-[1.1] tracking-[-.035em]">{lens.title}</span>
                  <ArrowRight size={20} weight="light" aria-hidden className={`shrink-0 transition-[transform,translate,opacity] duration-500 ${ease} motion-reduce:transition-none ${on ? 'translate-x-0 text-[#a4be2d] opacity-100' : '-translate-x-2 opacity-0'}`} />
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Image first on small screens, so the question list sits next to its explanation. */}
      <div className="relative order-first flex flex-col lg:order-none lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1">
        <div className="relative lg:min-h-[420px] lg:flex-1">
          <Reveal aria-hidden v="zoom" delay={300} className="absolute inset-0">
            <span className={`absolute inset-0 border border-[#a4be2d] transition-transform duration-700 ${ease} motion-reduce:transition-none ${active % 2 ? '-translate-x-3 translate-y-3' : 'translate-x-3 translate-y-3'}`} />
          </Reveal>
          <ClipFrame from="top" duration={1500} bg="bg-[#101310]" className="relative aspect-[4/3] w-full lg:absolute lg:inset-0 lg:aspect-auto">
            {lenses.map((lens, index) => {
              const on = index === active
              return (
                <div
                  key={lens.id}
                  aria-hidden="true"
                  className={`absolute inset-0 transition-[opacity,clip-path] duration-[1100ms] ${easeClip} motion-reduce:transition-none ${on ? `z-10 opacity-100 ${lens.clip}` : 'z-0 opacity-0 [clip-path:inset(0_0_0_100%)]'}`}
                >
                  <Img
                    src={lens.image}
                    crop={lens.crop}
                    tone={lens.tone}
                    className={`transition-transform duration-[2400ms] ${ease} motion-reduce:transition-none ${on ? 'scale-100' : 'scale-[1.14]'}`}
                  />
                  <div aria-hidden className={`absolute inset-0 ${TONES[lens.tone].over}`} />
                </div>
              )
            })}
            <div aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(to_top,#101310cc,#10131000_50%)]" />
            <div aria-hidden className="pointer-events-none absolute right-4 top-2 z-20 grid">
              {lenses.map((lens, index) => (
                <span key={lens.id} className={`col-start-1 row-start-1 text-[clamp(80px,12vw,180px)] font-extrabold leading-[.9] tracking-[-.06em] ${move} duration-700 ${ease} motion-reduce:transition-none ${strokeLight} ${index === active ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'}`}>{lens.no}</span>
              ))}
            </div>
            <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 z-20 grid p-5 text-white">
              {lenses.map((lens, index) => (
                <p key={lens.id} className={`col-start-1 row-start-1 text-sm font-medium ${move} duration-700 ${ease} motion-reduce:transition-none ${index === active ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>{lens.caption}</p>
              ))}
            </div>
          </ClipFrame>
        </div>
        <div aria-hidden className="mt-6 flex items-center gap-4">
          <span className="w-16 text-sm font-bold tabular-nums text-white">0{active + 1} / 04</span>
          <div className="flex flex-1 gap-2">
            {lenses.map((lens, index) => (
              <span key={lens.id} className="relative h-[3px] flex-1 overflow-hidden bg-white/20">
                <span className={`absolute inset-0 origin-left bg-[#a4be2d] transition-transform duration-700 ${ease} motion-reduce:transition-none ${index <= active ? 'scale-x-100' : 'scale-x-0'}`} />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative grid bg-[#101310] p-6 lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:p-8">
        {lenses.map((lens, index) => {
          const on = index === active
          const step = (ms) => ({ transitionDelay: on ? `${ms}ms` : '0ms' })
          return (
            <div
              key={lens.id}
              role="tabpanel"
              id={`think-panel-${lens.id}`}
              aria-labelledby={`think-tab-${lens.id}`}
              tabIndex={on ? 0 : undefined}
              // The outgoing panel stays visible just long enough to fade out, then drops out of the accessibility tree.
              className={`col-start-1 row-start-1 transition-[visibility] duration-0 motion-reduce:transition-none ${focusIn} ${on ? 'visible' : 'invisible delay-[700ms]'}`}
            >
              <p style={step(80)} className={`text-xs font-semibold text-[#a4be2d] ${move} duration-700 ${ease} motion-reduce:transition-none ${on ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>Starting point {lens.no}</p>
              <h3 style={step(160)} className={`mt-3 text-[clamp(26px,3vw,42px)] font-bold leading-[1.05] tracking-[-.045em] text-white ${move} duration-700 ${ease} motion-reduce:transition-none ${on ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>{lens.title}</h3>
              <p style={step(240)} className={`mt-4 border-l-2 border-[#a4be2d] pl-4 text-[17px] font-medium leading-[1.45] text-[#e3e9dc] ${move} duration-700 ${ease} motion-reduce:transition-none ${on ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>{lens.question}</p>
              <p style={step(320)} className={`mt-4 text-[15px] leading-[1.75] text-[#b9c7b2] ${move} duration-700 ${ease} motion-reduce:transition-none ${on ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>{lens.detail}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function About() {
  const root = useRef(null)
  useReveal(root)
  useParallax(root)

  useEffect(() => {
    document.title = 'About | Hashir Usman'
  }, [])

  return (
    <main id="main" ref={root} className="overflow-x-clip">
      <section aria-labelledby="about-title" className={`relative isolate overflow-hidden bg-[#101310] text-white lg:grid lg:grid-cols-12 ${heroH}`}>
        <div className={`relative min-h-[64svh] lg:col-span-8 ${heroH}`}>
          <Photo src="/abouthero.png" crop={CROPS.hero} tone="natural" from="left" duration={650} imageDuration={900} parallax={0.16} priority alt={IMAGE_ALT} className="absolute inset-0" />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,#101310_0%,#101310b3_30%,#10131000_65%)]" />
          {/* On desktop the frame stops above the tag bar so its border never disappears underneath it. */}
          <Reveal aria-hidden v="zoom" delay={800} className="absolute inset-4 md:inset-6 lg:bottom-[76px]">
            <span className="absolute inset-0 border border-white/25" />
          </Reveal>
          <Reveal v="x" delay={500} className="absolute left-[34px] top-28 z-10 flex items-center gap-3 text-xs font-medium text-white/85 max-[768px]:left-[26px] max-[768px]:top-24">
            <span className="tabular-nums text-[#a4be2d]">01</span>
            <span aria-hidden className="h-px w-10 bg-white/50" />
            <span>About</span>
          </Reveal>
          <Reveal aria-hidden delay={900} className="absolute bottom-28 left-3 hidden text-[11px] font-medium tracking-[.28em] text-white/60 [writing-mode:vertical-rl] lg:block">
            <span className="rotate-180 inline-block">Architect, builder, consultant</span>
          </Reveal>
        </div>

        <div className="relative z-20 -mt-[22vw] px-[18px] pb-8 lg:absolute lg:bottom-[92px] lg:left-0 lg:mt-0 lg:w-[74%] lg:px-[34px] lg:pb-0">
          <Lines
            as="h1"
            id="about-title"
            lines={['Need a second brain?', 'Or someone to help', 'build the whole thing?']}
            delay={250}
            step={140}
            className="text-[clamp(38px,4.8vw,92px)] font-extrabold leading-[.92] tracking-[-.06em]"
          />
        </div>

        <aside className="relative flex flex-col gap-6 bg-[#153B2B] px-[18px] pb-8 pt-8 lg:col-span-4 lg:justify-between lg:px-7 lg:pb-[92px] lg:pt-28">
          <div className="relative w-[72%] max-w-[340px] self-end lg:w-[88%]">
            <Reveal aria-hidden v="zoom" delay={900} className="absolute inset-0">
              <span className="absolute inset-0 translate-x-3 translate-y-3 border border-[#a4be2d]" />
            </Reveal>
            <Photo src="/abouthero1.png" crop={CROPS.heroInset} tone="muted" from="right" delay={120} duration={650} imageDuration={900} className="relative aspect-[4/5] w-full" />
          </div>
          <div className="flex flex-col gap-6">
            <Reveal as="p" delay={700} className="max-w-[40ch] text-[15px] leading-[1.7] text-[#dfe6d8]">
              Some problems need one good conversation. Others need research, planning, systems, execution and a little time.
            </Reveal>
            <Reveal delay={850}>
              <a href="#story" className={`group inline-flex min-h-11 items-center gap-4 text-sm font-medium text-white no-underline ${focus}`}>
                <span className="relative block h-12 w-px overflow-hidden bg-white/30">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-[#a4be2d] transition-transform duration-500 group-hover:translate-y-full motion-reduce:transition-none" />
                </span>
                Scroll to read
                <ArrowDown size={18} weight="light" aria-hidden className="text-[#a4be2d] transition-transform duration-300 motion-safe:group-hover:translate-y-1 motion-safe:group-focus-visible:translate-y-1" />
              </a>
            </Reveal>
          </div>
        </aside>

        <ul className="relative z-30 m-0 grid list-none grid-cols-2 border-t border-white/20 bg-[#101310] p-0 text-xs text-white/80 sm:grid-cols-5 lg:absolute lg:inset-x-0 lg:bottom-0 lg:col-span-12">
          {tags.map((tag, index) => (
            <Reveal as="li" key={tag} delay={800 + index * 70} className="flex items-center gap-2 border-b border-r border-white/15 px-4 py-4 last:border-r-0 max-sm:last:col-span-2 lg:border-b-0">
              <span className="tabular-nums text-[#a4be2d]">0{index + 1}</span>
              {tag}
            </Reveal>
          ))}
        </ul>
      </section>

      <section id="story" aria-labelledby="story-heading" className="relative bg-[#F2F3EF] py-[clamp(48px,5.5vw,84px)]">
        <div className={wrap}>
          <div className="grid grid-cols-12 items-end gap-x-6 gap-y-5">
            <div className="col-span-12 lg:col-span-9">
              <Chapter no="02" label="The human behind HU." />
              <Lines
                as="h2"
                id="story-heading"
                lines={['Big ideas are fun.', <Hl key="h">Making them work</Hl>, 'is my thing.']}
                delay={100}
                className="mt-4 text-[clamp(34px,5.4vw,82px)] font-extrabold leading-[.98] tracking-[-.055em] text-[#101310]"
              />
            </div>
            <Reveal as="p" delay={300} className="col-span-12 max-w-[30ch] border-l-2 border-[#a4be2d] pl-4 text-[13px] leading-[1.65] text-[#4f5a4d] lg:col-span-3">
              Different problems. Same curiosity.
            </Reveal>
          </div>

          <div className="mt-9 grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="relative col-span-12 lg:col-span-7">
              {/* On desktop the frame stretches to the height of the text column, so there is no empty area beneath it. */}
              <ClipFrame from="bottom" duration={1300} bg="bg-[#153B2B]" className="relative flex flex-col lg:h-full">
                <div className="relative m-3 mb-0 aspect-[4/3] md:m-4 md:mb-0 lg:aspect-auto lg:min-h-[340px] lg:flex-1">
                  <Photo src="/abt3.png" crop={CROPS.storyMain} tone="natural" from="left" delay={150} duration={1500} parallax={0.1} hover className="absolute inset-0" />
                </div>
                <ol className="m-0 grid list-none grid-cols-5 p-0 text-white">
                  {thread.map((step, index) => (
                    <Reveal as="li" key={step} delay={500 + index * 70} className="border-r border-t border-white/20 px-2 py-3 last:border-r-0 md:px-4">
                      <span className="block text-[11px] font-bold tabular-nums text-[#a4be2d]">0{index + 1}</span>
                      <span className="mt-1 block text-[11px] leading-[1.3] md:text-[13px]">{step}</span>
                    </Reveal>
                  ))}
                </ol>
              </ClipFrame>
              <div className="absolute -left-2 -top-7 z-10 w-[30%] md:-left-6">
                <Reveal aria-hidden v="zoom" delay={900} className="absolute inset-0">
                  <span className="absolute inset-0 -translate-x-2 translate-y-2 border border-[#a4be2d]" />
                </Reveal>
                <Photo src="/abt3.1.png" crop={CROPS.storyInset} tone="tint" from="top" delay={450} duration={1200} parallax={0.14} className="relative aspect-[3/4] w-full" />
              </div>
            </div>

            <div className="relative z-10 col-span-12 lg:col-span-5 lg:-ml-16 lg:mt-12">
              <ClipFrame from="right" delay={200} duration={1200} bg="bg-[#101310]" className="relative">
                <div className="p-6 text-white md:p-9">
                  <Reveal as="p" delay={350} className="text-xs font-semibold text-[#a4be2d]">A little about me</Reveal>
                  <div className="mt-4 space-y-5 text-[16px] leading-[1.75] text-[#cdd8c6]">
                    <Reveal as="p" delay={450}>
                      My work has taken me through different industries, business stages, and plenty of interesting challenges, across strategy, branding, marketing, operations, and startup development.
                    </Reveal>
                    <Reveal as="p" delay={560}>
                      Some days it’s strategy. Some days it’s marketing. Some days it’s figuring out why a business is making sales but not enough money. And some days we’re building something completely new.
                    </Reveal>
                  </div>
                  <Rule delay={700} tone="bg-[#a4be2d]" className="mt-7" />
                </div>
              </ClipFrame>
              <Reveal v="zoom" delay={700} className="relative z-10 -mt-3 ml-6 border border-[#101310] bg-[#a4be2d] p-5 text-[#101310] lg:ml-14">
                <p className="text-sm font-bold">The part I enjoy</p>
                <p className="mt-2 text-[14px] leading-[1.65]">Where an unclear situation starts to make sense, an idea becomes a plan, and a plan becomes something real.</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section id="principles" aria-labelledby="principles-heading" className="bg-[#101310] py-[clamp(44px,5vw,76px)] text-white">
        <div className={wrap}>
          <div className="grid grid-cols-12 items-end gap-x-6 gap-y-5">
            <div className="col-span-12 lg:col-span-8">
              <Chapter no="03" label="Principles" dark />
              <Lines
                as="h2"
                id="principles-heading"
                lines={['What I believe', 'about building.']}
                delay={100}
                className="mt-4 text-[clamp(36px,6vw,92px)] font-extrabold leading-[.98] tracking-[-.055em]"
              />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <div aria-hidden className="flex items-center gap-3 text-xs font-bold tabular-nums text-[#a4be2d]">
                <span>01</span>
                <Rule delay={200} tone="bg-white/30" className="flex-1" />
                <span>02</span>
                <Rule delay={400} tone="bg-white/30" className="flex-1" />
                <span>03</span>
              </div>
              <Reveal as="p" delay={250} className="mt-4 max-w-[34ch] text-[15px] leading-[1.7] text-[#b9c7b2]">
                Simple beliefs that shape how I work with founders and businesses.
              </Reveal>
            </div>
          </div>

          <article aria-labelledby="principle-one" className="mt-7 grid gap-3 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Photo src="/abt6.png?rev=3" crop={CROPS.principleOne} tone="natural" from="left" duration={1500} parallax={0.1} hover className="relative aspect-[16/10] w-full">
                <Reveal aria-hidden v="x" delay={500} className="absolute bottom-0 left-5 z-10">
                  <span className={`block text-[clamp(110px,17vw,260px)] font-extrabold leading-[.78] tracking-[-.06em] ${strokeLight}`}>01</span>
                </Reveal>
              </Photo>
            </div>
            <ClipFrame from="right" delay={200} duration={1200} bg="bg-[#153B2B]" className="relative lg:col-span-5">
              <div className="flex h-full flex-col justify-between gap-8 p-6 md:p-9">
                <div>
                  <Rule delay={400} tone="bg-[#a4be2d]" />
                  <Lines as="h3" id="principle-one" lines={['Good questions come', 'before good strategies.']} delay={400} className="mt-6 text-[clamp(30px,3.6vw,52px)] font-bold leading-[1.02] tracking-[-.045em]" />
                </div>
                <Reveal as="p" delay={600} className="max-w-[44ch] text-[15px] leading-[1.75] text-[#cdd8c6]">
                  Before anything is repositioned, redesigned, or funded, it helps to understand the idea, the customer, the market, and what is actually going on in the business. Then the strategy has something real to stand on.
                </Reveal>
              </div>
            </ClipFrame>
          </article>

          <div className="mt-3 grid gap-3 lg:grid-cols-12">
            <ClipFrame from="bottom" duration={1200} bg="bg-[#F2F3EF]" className="relative text-[#101310] lg:col-span-5">
              <article aria-labelledby="principle-two" className="flex h-full flex-col">
                <div className="relative h-[clamp(150px,15vw,210px)] shrink-0">
                  <Photo src="/abt4.png?rev=2" crop={CROPS.principleTwo} tone="tint" from="left" delay={300} duration={1300} parallax={0.1} hover className="absolute inset-0">
                    <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,#101310a6,#10131000_70%)]" />
                    <Reveal aria-hidden v="x" delay={600} className="absolute bottom-0 left-5 z-10">
                      <span className={`block text-[clamp(72px,8vw,112px)] font-extrabold leading-[.78] tracking-[-.06em] ${strokeLight}`}>02</span>
                    </Reveal>
                  </Photo>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <Lines as="h3" id="principle-two" lines={['Great branding needs', 'a good business underneath.']} delay={450} className="text-[clamp(28px,3vw,42px)] font-bold leading-[1.04] tracking-[-.045em]" />
                  <Reveal as="p" delay={600} className="mt-4 max-w-[44ch] text-[15px] leading-[1.7] text-[#3a4137]">
                    Positioning, marketing, and identity work best when the product, the offer, and the customer experience already make sense.
                  </Reveal>
                  <ul className="m-0 mt-5 grid list-none grid-cols-2 gap-x-4 gap-y-2 p-0 text-[13px] text-[#4f5a4d]">
                    {connected.map((item, index) => (
                      <Reveal as="li" key={item} delay={700 + index * 60} className="flex items-center gap-2 border-t border-[#101310]/15 pt-2 last:col-span-2">
                        <span aria-hidden className="h-px w-3 bg-[#617319]" />
                        {item}
                      </Reveal>
                    ))}
                  </ul>
                </div>
              </article>
            </ClipFrame>

            <article aria-labelledby="principle-three" className="lg:col-span-7">
              <Photo src="/abt5.png?rev=3" crop={CROPS.principleThree} tone="muted" from="right" delay={150} duration={1600} parallax={0.12} hover className="relative h-full min-h-[380px] w-full">
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,#101310e6,#10131000_65%)]" />
                <Reveal aria-hidden v="x" delay={500} className="absolute right-5 top-3 z-10">
                  <span className={`block text-[clamp(90px,12vw,190px)] font-extrabold leading-[.9] tracking-[-.06em] ${strokeLight}`}>03</span>
                </Reveal>
                <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-9">
                  <Rule delay={600} tone="bg-[#a4be2d]" />
                  <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <Lines as="h3" id="principle-three" lines={['A plan only matters', 'when someone can', 'execute it.']} delay={600} className="text-[clamp(30px,3.6vw,52px)] font-bold leading-[1.02] tracking-[-.045em]" />
                    <Reveal as="p" delay={800} className="max-w-[38ch] text-[15px] leading-[1.7] text-[#e3e9dc]">
                      And growth is much nicer when the systems can handle it. SOPs, roles, reporting, and workflows keep a business running as it gets bigger.
                    </Reveal>
                  </div>
                </div>
              </Photo>
            </article>
          </div>
        </div>
      </section>

      <section id="thinking" aria-labelledby="thinking-heading" className="bg-[#153B2B] py-[clamp(44px,5vw,76px)] text-white">
        <div className={wrap}>
          <div className="grid grid-cols-12 items-end gap-x-6 gap-y-5">
            <div className="col-span-12 lg:col-span-8">
              <Chapter no="04" label="Where we start" dark />
              <Lines
                as="h2"
                id="thinking-heading"
                lines={['Got something on your mind?', "I've probably got a few questions."]}
                delay={100}
                className="mt-4 text-[clamp(36px,6vw,92px)] font-extrabold leading-[.98] tracking-[-.055em]"
              />
            </div>
            <Reveal as="p" delay={300} className="col-span-12 max-w-[34ch] text-[15px] leading-[1.7] text-[#b9c7b2] lg:col-span-4">
              An idea, a business challenge, or something that needs a fresh pair of eyes. Here's where we can start.
            </Reveal>
          </div>
          <Thinking />
        </div>
      </section>

      <section aria-labelledby="closing-heading" className="relative isolate flex min-h-[clamp(560px,84svh,820px)] items-end overflow-hidden bg-[#101310] text-white">
        <Photo src="/closingbg.png" crop={CROPS.closing} tone="muted" from="top" duration={2000} parallax={0.14} className="absolute inset-0" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,#101310e6_0%,#101310a6_45%,#153b2b4d_100%)]" />
        <Reveal aria-hidden v="zoom" delay={900} className="absolute inset-4 md:inset-6">
          <span className="absolute inset-0 border border-white/20" />
        </Reveal>
        <div className={`${wrap} relative z-10 grid w-full grid-cols-12 items-end gap-x-8 gap-y-10 pb-[clamp(40px,5vw,72px)] pt-[clamp(80px,10vw,140px)]`}>
          <div className="col-span-12 lg:col-span-7">
            <Chapter no="05" label="Closing" dark />
            <Lines
              as="h2"
              id="closing-heading"
              lines={['Build with clarity.', <span key="p" className="text-[#a4be2d]">Scale with intention.</span>]}
              delay={150}
              step={160}
              className="mt-6 text-[clamp(40px,6.4vw,104px)] font-extrabold leading-[.95] tracking-[-.055em]"
            />
            <Rule delay={500} tone="bg-white/30" className="mt-8" />
            <Reveal delay={650} className="mt-4 flex justify-between gap-4 text-xs text-white/70">
              <span>Hashir Usman, Startup Architect • Venture Builder • Business Consultant</span>
              <span className="hidden sm:inline">Bengaluru, India</span>
            </Reveal>
          </div>

          <ClipFrame from="right" delay={350} duration={1300} bg="bg-[#101310]/90" className="relative col-span-12 border border-[#a4be2d]/40 lg:col-span-5">
            <div className="p-6 md:p-8">
              <Photo src="/closing.png" crop={CROPS.closingInset} tone="accent" from="left" delay={650} duration={1200} className="relative aspect-[16/7] w-full" />
              <Reveal as="p" delay={800} className="mt-6 text-[16px] leading-[1.7] text-[#dfe6d8]">
                Good things usually start with a conversation. An idea, a business problem, or just a question you can’t quite figure out. I’m listening.
              </Reveal>
              <Reveal delay={950} className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="min-w-[200px] flex-1">
                  <LinkBlock to="/contact">Start With a Call</LinkBlock>
                </div>
                <Link
                  to="/ventures"
                  className={`group inline-flex min-h-11 items-center gap-2 border-b border-white/40 pb-1 text-[15px] text-white no-underline transition-colors duration-300 hover:border-[#a4be2d] hover:text-[#a4be2d] focus-visible:border-[#a4be2d] ${focus}`}
                >
                  See My Work
                  <ArrowRight size={16} weight="light" aria-hidden className="transition-transform duration-300 motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1" />
                </Link>
              </Reveal>
            </div>
          </ClipFrame>
        </div>
      </section>
    </main>
  )
}
