import { version, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

// One image for every placement. Swap this (or give a venture its own `image`) when real photos exist.
const VENTURE_IMAGE = '/image.png'
const HERO_ALT = 'Featured photograph for the Ventures page'
// React 19 reads `fetchPriority`; React 18 only passes the lowercase attribute through without a warning.
const FETCH_PRIORITY_PROP = Number.parseInt(version, 10) >= 19 ? 'fetchPriority' : 'fetchpriority'
const NO_METRICS = 'No further outcome metrics are documented in the portfolio.'

// Real portfolio data. `url` is null on purpose: add a real link and a visit button appears.
const ventures = [
  { id: 'moonbliss', name: 'Moonbliss', category: 'Wellness', year: '2020', url: null, tone: 'natural', crop: { pos: '30% 40%', zoom: 1.2 }, challenge: 'Build a wellness brand from the ground up.', strategy: 'Position the brand around the combination of ritual and science.', execution: 'Develop positioning, identity, digital presence, and go-to-market strategy.', results: 'A complete wellness brand.' },
  { id: 'kesha', name: 'Kesha', category: 'Lifestyle', year: '2021', url: null, tone: 'tint', crop: { pos: '70% 30%', zoom: 1.7 }, challenge: 'Establish a clear identity and social presence for a lifestyle label.', strategy: 'Focus the brand on self-expression, colour, and community for modern urban women.', execution: 'Shape the brand identity and social media presence.', results: 'A defined identity and social media presence.' },
  { id: 'sol', name: 'sol.', category: 'Consumer Goods', year: '2021', url: null, tone: 'muted', crop: { pos: '50% 70%', zoom: 1.5 }, challenge: 'Prepare a consumer goods venture for market with a sustainability focus.', strategy: 'Build the go-to-market plan around conscious living.', execution: 'Design the go-to-market plan and brand systems.', results: 'A go-to-market plan and brand systems.' },
  { id: 'bare-logic', name: 'Bare Logic', category: 'Skincare', year: '2022', url: null, tone: 'natural', crop: { pos: '60% 20%', zoom: 1.4 }, challenge: 'Clarify the story of a science-backed skincare startup.', strategy: 'Develop investor narrative and brand positioning.', execution: 'Create an investor narrative and positioning for the brand.', results: 'Investor narrative and brand positioning.' },
  { id: 'aii', name: 'Aii', category: 'Technology', year: '2023', url: null, tone: 'natural', crop: { pos: '50% 35%', zoom: 1.1 }, context: 'An AI-first technology company, taken on in 2023.', challenge: 'Create a business foundation for an AI-first technology company.', strategy: 'Connect the venture model, systems, and growth strategy.', execution: 'Architect the venture model, business systems, and growth strategy.', results: 'A venture model, business systems, and growth strategy.' },
  { id: 'nothing-else', name: 'Nothing Else', category: 'Creative Studio', year: '2023', url: null, tone: 'accent', crop: { pos: '40% 55%', zoom: 1.3 }, challenge: 'Give a creative studio a clear brand and content direction.', strategy: 'Emphasize minimalism and craft.', execution: 'Build the brand strategy and content ecosystem.', results: 'A brand strategy and content ecosystem.' },
]
const featured = ventures.find((v) => v.id === 'aii')
const collection = ventures.filter((v) => v.id !== featured.id)
const years = ventures.map((v) => Number(v.year))
const span = `${Math.min(...years)}\u2013${Math.max(...years)}`
const nameRow = `${ventures.map((v) => v.name).join('   \u2014   ')}   \u2014   `

// Each stage only restates decisions documented in the ventures above.
const stages = [
  { no: '01', title: 'Identify the right opportunity', text: 'Each engagement began with a specific opening: a wellness brand built from the ground up, a consumer goods venture with a sustainability focus.', refs: ['Moonbliss', 'sol.'], crop: { pos: '50% 50%', zoom: 1.05 }, tone: 'natural' },
  { no: '02', title: 'Understand the customer and the market', text: 'Kesha was shaped around self-expression, colour, and community for modern urban women. Bare Logic needed the story of a science-backed startup made clear.', refs: ['Kesha', 'Bare Logic'], crop: { pos: '50% 50%', zoom: 1.5, tx: 8, ty: -4 }, tone: 'tint' },
  { no: '03', title: 'Design the model and the positioning', text: 'Moonbliss was positioned around ritual and science, Bare Logic received an investor narrative, and Aii a connected venture model.', refs: ['Moonbliss', 'Bare Logic', 'Aii'], crop: { pos: '50% 50%', zoom: 1.7, tx: -8, ty: 6 }, tone: 'muted' },
  { no: '04', title: 'Turn decisions into execution', text: 'sol. received a go-to-market plan and brand systems, Aii business systems and a growth strategy, Nothing Else a content ecosystem.', refs: ['sol.', 'Aii', 'Nothing Else'], crop: { pos: '50% 50%', zoom: 1.3, tx: 4, ty: 8 }, tone: 'accent' },
]

const TONES = {
  natural: { img: 'saturate-[.9]', over: 'bg-[#153B2B]/10' },
  muted: { img: 'saturate-[.5] contrast-[1.05]', over: 'bg-[#101310]/20' },
  tint: { img: 'saturate-[.6] contrast-[1.05]', over: 'bg-[#153B2B]/45' },
  accent: { img: 'saturate-[.7] contrast-[1.05]', over: 'bg-[#a4be2d]/35' },
}

const ease = 'ease-[cubic-bezier(0.22,1,0.36,1)]'
const wrap = 'mx-auto max-w-[1320px] px-7 max-[768px]:px-[18px]'
const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4be2d]'
const stroke = 'text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.55)]'
const pill = 'rounded-full border px-3 py-1 text-xs font-medium'
const move = 'transition-[opacity,transform,translate,scale]'

// Scroll-scrubbed motion. Elements marked data-p get a CSS variable --p (0 to 1) that follows scroll, and
// the styles read it with calc(). Modes: top (page scroll), enter (arriving), read (passing through
// slowly), through (full pass). Without JS or with reduced motion, --p stays at its finished value.
function useScrollVars(ref) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return undefined
    const els = Array.from(root.querySelectorAll('[data-p]'))
    const clamp = (n) => Math.max(0, Math.min(1, n))
    const rest = (mode) => (mode === 'through' ? '0.5' : '1')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.style.setProperty('--p', rest(el.dataset.p)))
      return undefined
    }
    let frame = 0
    const update = () => {
      frame = 0
      const vh = window.innerHeight
      els.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < -vh || r.top > vh * 2) return
        const mode = el.dataset.p
        let p = 0.5
        if (mode === 'top') p = clamp(-r.top / (vh * 0.55))
        if (mode === 'enter') p = clamp((vh - r.top) / (vh * 0.6))
        if (mode === 'read') p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35))
        if (mode === 'through') p = clamp((vh - r.top) / (vh + r.height))
        el.style.setProperty('--p', p.toFixed(4))
      })
    }
    const request = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    return () => {
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      cancelAnimationFrame(frame)
    }
  }, [ref])
}

// One-shot trigger for the character headlines (they are never clipped, so the observer always sees them).
function useReveal(ref) {
  useEffect(() => {
    const nodes = ref.current ? Array.from(ref.current.querySelectorAll('[data-reveal]')) : []
    const show = (node) => node.setAttribute('data-in', 'true')
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(show)
      return undefined
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
        show(entry.target)
        observer.unobserve(entry.target)
      }
    }), { threshold: 0.2 })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [ref])
}

// Headline whose characters tip up from the baseline one after another.
function Chars({ as: Tag = 'div', text, delay = 0, className = '', ...rest }) {
  const words = text.split(' ')
  let n = 0
  return (
    <Tag data-reveal className={`group/ch [perspective:700px] ${className}`} {...rest}>
      <span className="sr-only">{text}</span>
      {words.map((word, w) => (
        <span key={w}>
          <span aria-hidden className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, c) => (
              <span key={c} style={{ transitionDelay: `${delay + n++ * 26}ms` }} className={`inline-block origin-[50%_100%] opacity-0 [transform:rotateX(-85deg)_translateY(35%)] ${move} duration-[900ms] ${ease} group-data-[in=true]/ch:opacity-100 group-data-[in=true]/ch:[transform:none] motion-reduce:opacity-100 motion-reduce:[transform:none] motion-reduce:transition-none`}>{ch}</span>
            ))}
          </span>
          {w < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

// Statement whose words light up as it scrolls through the reading zone.
function Scrub({ text, className = '' }) {
  const words = text.split(' ')
  return (
    <p data-p="read" className={className}>
      {words.map((word, i) => <span key={i} style={{ opacity: `clamp(.18, calc(.18 + (var(--p, 1) * ${words.length * 1.4} - ${i}) * .82), 1)` }}>{word}{' '}</span>)}
    </p>
  )
}

function Cover({ crop, tone = 'natural', on = true, priority = false, alt = '', className = '', mobileHeader = false, children }) {
  const { pos, zoom = 1, tx = 0, ty = 0 } = crop
  const priorityProps = priority ? { [FETCH_PRIORITY_PROP]: 'high' } : {}
  return (
    <div className={`${mobileHeader ? 'absolute inset-x-0 top-0 h-[210px] lg:inset-0 lg:h-auto' : 'absolute inset-0'} overflow-hidden bg-[#153B2B] ${className}`}>
      <div className={`size-full transition-transform duration-[1400ms] ${ease} motion-reduce:transition-none`} style={{ transform: `translate(${tx}%,${ty}%) scale(${zoom})` }}>
        <img
          src={VENTURE_IMAGE}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          {...priorityProps}
          decoding="async"
          draggable={false}
          onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
          style={{ objectPosition: pos }}
          className={`size-full object-cover transition-transform duration-[1800ms] ${ease} motion-reduce:transition-none ${TONES[tone].img} ${on ? 'scale-100' : 'scale-[1.12]'}`}
        />
      </div>
      <div aria-hidden className={`absolute inset-0 mix-blend-multiply ${TONES[tone].over}`} />
      {children}
    </div>
  )
}

function VentureLink({ venture, className = '' }) {
  if (!venture.url) return null
  return (
    <a href={venture.url} target="_blank" rel="noreferrer" className={`group/link inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-[#a4be2d] px-5 text-sm font-semibold text-[#101310] no-underline ${focus} ${className}`}>
      Visit {venture.name}<ArrowRight size={16} weight="light" aria-hidden className="transition-transform duration-300 motion-safe:group-hover/link:translate-x-1" />
    </a>
  )
}

// Desktop: a row of panels where the active one opens wide. Mobile: the same panels stacked.
// Hover, focus and tap all open a panel, and every panel's essentials stay readable once opened.
function Gallery() {
  const [open, setOpen] = useState(0)
  return (
    <div className="mt-8 flex flex-col gap-2 lg:h-[clamp(560px,78svh,720px)] lg:flex-row lg:gap-3">
      {collection.map((v, i) => {
        const on = i === open
        return (
          <article
            key={v.id}
            id={v.id}
            onMouseEnter={() => setOpen(i)}
            className={`relative isolate flex scroll-mt-24 flex-col justify-end overflow-hidden rounded-[28px] bg-[#101310] text-white transition-[flex-grow,min-height] duration-[800ms] ${ease} motion-reduce:transition-none lg:min-h-0 lg:basis-0 ${on ? 'min-h-[640px] lg:flex-[7]' : 'min-h-[88px] lg:flex-[1]'}`}
          >
            <Cover crop={v.crop} tone={v.tone} on={on} mobileHeader={on}>
              <div aria-hidden className={`absolute inset-0 transition-colors duration-700 ${on ? 'bg-[linear-gradient(to_top,#101310f0,#10131000_70%)]' : 'bg-[#101310]/55'}`} />
            </Cover>
            <button
              type="button"
              aria-expanded={on}
              aria-controls={`panel-${v.id}`}
              tabIndex={on ? -1 : 0}
              onClick={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              className={`absolute inset-0 z-20 flex items-center justify-between gap-3 px-5 text-left transition-opacity duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#a4be2d] lg:flex-col lg:px-0 lg:py-6 ${on ? 'pointer-events-none opacity-0' : 'opacity-100 delay-300'}`}
            >
              <span className="text-xs font-semibold tabular-nums text-[#a4be2d]">{v.year}</span>
              <span className="text-xl font-bold tracking-[-.03em] lg:rotate-180 lg:text-2xl lg:[writing-mode:vertical-rl]">{v.name}</span>
              <span aria-hidden className="grid size-8 place-items-center rounded-full border border-white/40 text-lg leading-none">+</span>
            </button>
            <div id={`panel-${v.id}`} className={`relative z-10 flex flex-col gap-4 transition-opacity duration-500 ${on ? 'visible px-5 pb-6 pt-[230px] opacity-100 delay-[250ms] sm:px-6 sm:pb-7 lg:p-9' : 'invisible max-h-0 overflow-hidden p-0 opacity-0'}`}>
              <div className="flex items-center gap-3"><span className={`${pill} border-[#a4be2d]/60 text-[#a4be2d]`}>{v.category}</span><span className="text-xs tabular-nums text-white/70">{v.year}</span></div>
              <h3 className="m-0 text-[clamp(38px,4.6vw,72px)] font-extrabold leading-[.95] tracking-[-.055em]">{v.name}</h3>
              <p className="m-0 max-w-[52ch] text-[16px] leading-[1.6] text-[#e3e9dc]">{v.challenge}</p>
              <dl className="m-0 grid gap-x-6 gap-y-3 text-[13px] leading-[1.6] text-[#cdd8c6] lg:grid-cols-3">
                {[['Approach', v.strategy], ['Delivered', v.execution], ['Outcome', `${v.results} ${NO_METRICS}`]].map(([label, text]) => (
                  <div key={label} className="border-t border-white/20 pt-3"><dt className="mb-1 text-[11px] font-bold text-[#a4be2d]">{label}</dt><dd className="m-0">{text}</dd></div>
                ))}
              </dl>
              <VentureLink venture={v} />
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default function Ventures() {
  const root = useRef(null)
  useScrollVars(root)
  useReveal(root)
  useEffect(() => { document.title = 'Ventures | Hashir Usman' }, [])

  const steps = [
    ['Context', featured.context],
    ['Challenge', featured.challenge],
    ['Strategic approach', featured.strategy],
    ['Execution', featured.execution],
    ['Outcome', `${featured.results} ${NO_METRICS}`],
  ]

  return (
    <main id="main" ref={root} className="overflow-x-clip">
      {/* 01 Hero: the image starts as an inset card and opens to full width as you scroll */}
      <section data-p="top" aria-labelledby="ventures-title" className="bg-[#101310] pb-6 text-white">
       
        <div className={`${wrap} grid items-end gap-x-10 gap-y-5 pb-8 pt-3 lg:grid-cols-12`}>
          <Chars as="h1" id="ventures-title" text="Ideas are only the beginning." delay={150} className="text-[clamp(44px,8.4vw,136px)] font-extrabold leading-[.92] tracking-[-.06em] lg:col-span-9" />
          <p className="m-0 max-w-[40ch] text-[15px] leading-[1.7] text-[#dfe6d8] lg:col-span-3">A curated set of ventures and business projects, from first brand to venture model. Each one shows the challenge, the decisions made, and what was delivered.</p>
        </div>
        <div
          style={{ marginInline: 'calc((1 - var(--p, 1)) * 4vw)', borderRadius: 'calc((1 - var(--p, 1)) * 36px)' }}
          className="relative h-[clamp(360px,64svh,680px)] overflow-hidden bg-[#153B2B]"
        >
          <div style={{ transform: 'scale(calc(1.22 - .22 * var(--p, 1)))' }} className="absolute inset-0 will-change-transform">
            <Cover crop={{ pos: '50% 30%', zoom: 1 }} tone="natural" priority alt={HERO_ALT} />
          </div>
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,#101310b3,#10131000_45%)]" />
          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-between gap-4 p-5 md:p-8">
            <span className={`${pill} border-white/40 bg-[#101310]/40 text-white`}>Selected ventures and case studies</span>
            <a href="#featured" className={`group inline-flex min-h-11 items-center gap-3 rounded-full bg-[#a4be2d] px-5 text-sm font-semibold text-[#101310] no-underline ${focus} focus-visible:outline-white`}>
              See the featured case<ArrowDown size={16} weight="light" aria-hidden className="transition-transform duration-300 motion-safe:group-hover:translate-y-1" />
            </a>
          </div>
        </div>
        <nav aria-label="Ventures index" className={`${wrap} mt-5`}>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {ventures.map((v) => (
              <li key={v.id}>
                <a href={v.id === featured.id ? '#featured' : '#collection'} className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-sm text-white/85 no-underline transition-colors hover:border-[#a4be2d] hover:text-[#a4be2d] ${focus}`}>
                  <span className="text-xs tabular-nums text-[#a4be2d]">{v.year}</span>{v.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* 02 Featured venture: oversized wordmark, a scrubbed statement and a timeline that draws itself */}
      <section id="featured" aria-labelledby="featured-title" className="scroll-mt-16 overflow-hidden bg-[#F2F3EF] py-[clamp(48px,5.5vw,88px)] text-[#101310]">
        <div className={wrap}>
          <div className="flex items-center justify-between gap-4 text-xs font-semibold text-[#617319]">
            <span>02 / Featured venture</span>
            <span className="flex gap-2"><span className={`${pill} border-[#617319]/40`}>{featured.category}</span><span className={`${pill} border-[#617319]/40`}>{featured.year}</span></span>
          </div>
          <div data-p="through" className="mt-2">
            <h2 id="featured-title" style={{ transform: 'translateX(calc((.5 - var(--p, .5)) * 18vw))' }} className="m-0 whitespace-nowrap text-[clamp(120px,25vw,400px)] font-extrabold leading-[.8] tracking-[-.08em] text-[#153B2B] will-change-transform">{featured.name}</h2>
          </div>
          <div className="mt-8 grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <div data-p="through" className="relative aspect-[4/5] overflow-hidden rounded-[28px] lg:col-span-5 lg:self-start">
              <div style={{ transform: 'translateY(calc((.5 - var(--p, .5)) * 14%))' }} className="absolute inset-x-0 -inset-y-[8%] will-change-transform">
                <Cover crop={featured.crop} tone="natural" />
              </div>
              <span className={`${pill} absolute bottom-4 left-4 border-white/40 bg-[#101310]/50 text-white`}>{featured.category}, {featured.year}</span>
            </div>
            <div className="lg:col-span-7">
              <p className="m-0 mb-3 text-xs font-semibold text-[#617319]">The challenge</p>
              <Scrub text={featured.challenge} className="m-0 text-[clamp(28px,3.4vw,52px)] font-extrabold leading-[1.05] tracking-[-.05em]" />
              <ol data-p="read" className="relative m-0 mt-10 list-none p-0 pl-9">
                <span aria-hidden className="absolute left-[6px] top-1 h-[calc(100%-8px)] w-px bg-[#101310]/15" />
                <span aria-hidden style={{ transform: 'scaleY(var(--p, 1))' }} className="absolute left-[6px] top-1 h-[calc(100%-8px)] w-px origin-top bg-[#617319]" />
                {steps.map(([label, text], i) => (
                  <li key={label} style={{ opacity: `clamp(.35, calc(.35 + var(--p, 1) * ${steps.length + 1} - ${i}), 1)` }} className="relative pb-7 last:pb-0">
                    <span aria-hidden style={{ opacity: `clamp(0, calc(var(--p, 1) * ${steps.length + 1} - ${i}), 1)` }} className="absolute -left-9 top-1 size-[13px] rounded-full bg-[#617319]" />
                    <span aria-hidden className="absolute -left-9 top-1 size-[13px] rounded-full border border-[#617319]" />
                    <h3 className="m-0 text-[15px] font-bold"><span className="mr-2 tabular-nums text-[#617319]">0{i + 1}</span>{label}</h3>
                    <p className="m-0 mt-1 max-w-[60ch] text-[15px] leading-[1.7] text-[#3a4137]">{text}</p>
                  </li>
                ))}
              </ol>
              <VentureLink venture={featured} className="mt-6" />
            </div>
          </div>
        </div>
      </section>

      {/* 03 Collection: an accordion of panels instead of a card grid */}
      <section id="collection" aria-labelledby="collection-title" className="scroll-mt-16 bg-[#153B2B] py-[clamp(44px,5vw,80px)] text-white">
        <div className={wrap}>
          <div className="grid items-end gap-x-6 gap-y-4 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="m-0 mb-3 text-xs font-semibold text-[#a4be2d]">03 / The collection</p>
              <Chars as="h2" id="collection-title" text="Each venture, its own brief." className="text-[clamp(34px,5vw,72px)] font-extrabold leading-[.98] tracking-[-.055em]" />
            </div>
            <p className="m-0 max-w-[38ch] text-[15px] leading-[1.7] text-[#b9c7b2] lg:col-span-4">Moonbliss to Nothing Else, in chronological order. Hover, focus or tap a panel to open it.</p>
          </div>
          <Gallery />
        </div>
      </section>

      {/* 04 Value: a timeline that draws itself as you scroll, with each stage tied to documented work */}
      <section id="value" aria-labelledby="value-title" className="bg-[#F2F3EF] py-[clamp(48px,5.5vw,88px)] text-[#101310]">
        <div className={wrap}>
          <div className="grid items-end gap-x-6 gap-y-4 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="m-0 mb-3 text-xs font-semibold text-[#617319]">04 / How the work creates value</p>
              <Chars as="h2" id="value-title" text="From opportunity to something that runs." className="text-[clamp(34px,5vw,72px)] font-extrabold leading-[.98] tracking-[-.055em]" />
            </div>
            <p className="m-0 max-w-[38ch] border-l-2 border-[#a4be2d] pl-4 text-[14px] leading-[1.65] text-[#4f5a4d] lg:col-span-4">The decisions below are the ones documented in the ventures above. They are not a fixed process or a promise of results.</p>
          </div>
          <ol data-p="read" className="relative m-0 mt-10 list-none p-0">
            <span aria-hidden className="absolute left-[13px] top-0 h-full w-px bg-[#101310]/15 lg:left-1/2" />
            <span aria-hidden style={{ transform: 'scaleY(var(--p, 1))' }} className="absolute left-[13px] top-0 h-full w-px origin-top bg-[#617319] lg:left-1/2" />
            {stages.map((item, i) => {
              const right = i % 2 === 1
              return (
                <li
                  key={item.no}
                  data-p="enter"
                  style={{ opacity: 'calc(.15 + var(--p, 1) * .85)', transform: 'translateY(calc((1 - var(--p, 1)) * 44px))' }}
                  className="relative grid gap-5 pb-12 pl-11 last:pb-0 lg:grid-cols-[1fr_56px_1fr] lg:items-center lg:gap-0 lg:pl-0"
                >
                  <div className={`${right ? 'lg:order-3 lg:pl-10' : 'lg:order-1 lg:pr-10'}`}>
                    <h3 className="m-0 text-[clamp(24px,2.6vw,38px)] font-bold leading-[1.08] tracking-[-.04em]">{item.title}</h3>
                    <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.7] text-[#3a4137]">{item.text}</p>
                    <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">{item.refs.map((ref) => <li key={ref} className={`${pill} border-[#101310]/20`}>{ref}</li>)}</ul>
                  </div>
                  <span aria-hidden className="absolute left-0 top-0 z-10 grid size-7 place-items-center rounded-full bg-[#153B2B] text-[11px] font-bold text-[#a4be2d] lg:static lg:order-2 lg:mx-auto lg:size-12 lg:text-sm">{item.no}</span>
                  <div className={`${right ? 'lg:order-1 lg:pr-10' : 'lg:order-3 lg:pl-10'}`}>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[24px]"><Cover crop={item.crop} tone={item.tone} /></div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      {/* 05 Closing: two rows of type drift opposite ways with scroll, around the invitation */}
      <section data-p="through" aria-labelledby="close-title" className="overflow-hidden bg-[#101310] py-[clamp(40px,4.5vw,72px)] text-white">
        <div aria-hidden style={{ transform: 'translateX(calc((.5 - var(--p, .5)) * 45vw))' }} className={`-ml-[30vw] select-none whitespace-nowrap text-[clamp(48px,9vw,140px)] font-extrabold leading-[1] tracking-[-.05em] will-change-transform ${stroke}`}>{nameRow}{nameRow}</div>
        <div className={`${wrap} grid items-center gap-x-12 gap-y-8 py-[clamp(28px,4vw,56px)] lg:grid-cols-12`}>
          <div className="lg:col-span-7">
            <p className="m-0 mb-4 text-xs font-semibold text-[#a4be2d]">05 / The next conversation</p>
            <Chars as="h2" id="close-title" text="Let’s build what comes next." className="text-[clamp(40px,6.4vw,100px)] font-extrabold leading-[.95] tracking-[-.055em]" />
            <p className="mt-6 max-w-[46ch] text-[16px] leading-[1.7] text-[#dfe6d8]">For founders, business leaders and operators exploring a new venture, shaping a business model, or working through a strategic challenge.</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link to="/contact" className={`group inline-flex min-h-14 items-center gap-4 rounded-full bg-[#a4be2d] px-7 text-[15px] font-semibold text-[#101310] no-underline transition-colors duration-300 hover:bg-white ${focus} focus-visible:outline-white`}>
                Start a conversation<ArrowRight size={20} weight="light" aria-hidden className="transition-transform duration-300 motion-safe:group-hover:translate-x-1.5" />
              </Link>
              {[['/about', 'About Hashir'], ['/', 'Back to home']].map(([to, label]) => (
                <Link key={to} to={to} className={`inline-flex min-h-11 items-center border-b border-white/40 pb-1 text-[15px] text-white no-underline transition-colors duration-300 hover:border-[#a4be2d] hover:text-[#a4be2d] ${focus}`}>{label}</Link>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] lg:col-span-5 lg:aspect-[4/5]">
            <div style={{ transform: 'translateY(calc((.5 - var(--p, .5)) * 14%))' }} className="absolute inset-x-0 -inset-y-[8%] will-change-transform">
              <Cover crop={{ pos: '40% 60%', zoom: 1.5 }} tone="tint" />
            </div>
          </div>
        </div>
        <div aria-hidden style={{ transform: 'translateX(calc((var(--p, .5) - .5) * 45vw))' }} className={`-ml-[30vw] select-none whitespace-nowrap text-[clamp(48px,9vw,140px)] font-extrabold leading-[1] tracking-[-.05em] will-change-transform ${stroke}`}>Start a conversation   —   Start a conversation   —   Start a conversation   —   Start a conversation</div>
      </section>
    </main>
  )
}
