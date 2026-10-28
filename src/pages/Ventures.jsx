import { version, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight } from '@phosphor-icons/react'
import { Link, useLocation } from 'react-router-dom'
import { brands, brandImage, groups } from '../data/brands'

// One image for every placement. Swap this (or give a venture its own `image`) when real photos exist.
const VENTURE_IMAGE = '/image.png'
const HERO_ALT = 'Featured photograph for the Ventures page'
// React 19 reads `fetchPriority`; React 18 only passes the lowercase attribute through without a warning.
const FETCH_PRIORITY_PROP = Number.parseInt(version, 10) >= 19 ? 'fetchPriority' : 'fetchpriority'
const NO_METRICS = 'No outcome metrics are published for this project.'

// The featured build. The full collection lives in src/data/brands.js.
const featured = { id: 'dayone', name: 'Dayone Venture Studio', category: 'Venture Building', url: null, crop: { pos: '50% 35%', zoom: 1.1 }, statement: 'Building startups, founders, and the systems behind them.', context: 'A startup studio where my work spans venture strategy, founder development, operational systems, and business execution.', role: 'Venture Leadership, Strategy, and Operations.' }
const nameRow = `${brands.map((b) => b.name).join('   \u2014   ')}   \u2014   `

// Each stage only points to projects documented in the collection above.
const stages = [
  { no: '01', title: 'Start from scratch', text: 'Some projects began as ideas: a coffee business concept, a used-car marketplace, and a networking concept for founders and venture capital professionals.', refs: ['DE COFF', 'CarBroker', 'START-X'], image: '/ven1.png', crop: { pos: '50% 50%', zoom: 1.05 }, tone: 'natural' },
  { no: '02', title: 'Find the right direction', text: 'Others needed a clear identity and positioning: a women-focused hostel brand, a premium fashion identity, and a hostel discovery platform.', refs: ['Hosther Hostels', 'Ezkaa', 'Oxtel'], image: '/ven2.png', crop: { pos: '50% 50%', zoom: 1.5, tx: 8, ty: -4 }, tone: 'tint' },
  { no: '03', title: 'Build the venture', text: 'Some needed venture structure: Moonbliss across strategy, positioning, brand, and go-to-market, NO TWO across architecture and product strategy, and Dayone across strategy and operations.', refs: ['Moonbliss', 'NO TWO', 'Dayone Venture Studio'], image: '/ven3.png', crop: { pos: '50% 50%', zoom: 1.7, tx: -8, ty: 6 }, tone: 'muted' },
  { no: '04', title: 'Make it run', text: 'The operation behind the brand: kitchen and dish SOPs for Zaati, operational SOPs and menu engineering for Hungry Potato, and scaling, valuation, and AI planning for Hand Revolution.', refs: ['Zaati', 'Hungry Potato', 'Hand Revolution'], image: '/ven4.png', crop: { pos: '50% 50%', zoom: 1.3, tx: 4, ty: 8 }, tone: 'accent' },
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
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

function Cover({ crop, tone = 'natural', on = true, priority = false, alt = '', image = VENTURE_IMAGE, className = '', mobileHeader = false, children }) {
  const { pos, zoom = 1, tx = 0, ty = 0 } = crop
  const priorityProps = priority ? { [FETCH_PRIORITY_PROP]: 'high' } : {}
  return (
    <div className={`${mobileHeader ? 'absolute inset-x-0 top-0 h-[210px] lg:inset-0 lg:h-auto' : 'absolute inset-0'} overflow-hidden bg-[#153B2B] ${className}`}>
      <div className={`size-full transition-transform duration-[1400ms] ${ease} motion-reduce:transition-none`} style={{ transform: `translate(${tx}%,${ty}%) scale(${zoom})` }}>
        <img
          src={image}
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
      Explore the Build<ArrowRight size={16} weight="light" aria-hidden className="transition-transform duration-300 motion-safe:group-hover/link:translate-x-1" />
    </a>
  )
}

// Brand artwork from /public/ventures with a text fallback, so a missing file never shows a broken-image icon.
function BrandArt({ b, alt = '', className = '', imgClass = '' }) {
  const [bad, setBad] = useState(false)
  return (
    <div className={`relative overflow-hidden bg-[#f2f3ef] ${className}`}>
      {bad
        ? <span className="absolute inset-0 grid place-items-center p-2 text-center text-xs font-bold text-[#171a1b]/60">{b.name}</span>
        : <img src={brandImage(b.file)} alt={alt} loading="lazy" decoding="async" draggable={false} onError={() => setBad(true)} className={`absolute inset-0 size-full object-cover ${imgClass}`} />}
    </div>
  )
}

// The whole portfolio in one place: compact logos in each row and one expandable text panel per project.
// Works on every screen size, and #brand-<id> links open a project directly.
function Directory() {
  const { hash } = useLocation()
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState(brands[0].id)
  const timer = useRef(0)
  const list = filter === 'All' ? brands : brands.filter((b) => b.group === filter)
  const sectorChips = ['All', ...groups]

  const reveal = (id, delay, force) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const el = document.getElementById(`brand-${id}`)
      if (!el) return
      const top = el.getBoundingClientRect().top
      if (force || top < 72 || top > window.innerHeight * 0.55) el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })
    }, delay)
  }
  const toggle = (id) => {
    const next = open === id ? null : id
    setOpen(next)
    if (next) reveal(id, reduced() ? 0 : 640, false)
  }
  const pick = (g) => {
    setFilter(g)
    setOpen((g === 'All' ? brands : brands.filter((b) => b.group === g))[0].id)
  }

  useEffect(() => {
    if (!hash.startsWith('#brand-')) return
    const id = hash.slice('#brand-'.length)
    if (brands.some((b) => b.id === id)) { setFilter('All'); setOpen(id); reveal(id, 700, true) }
  }, [hash])
  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <>
      {/* Sector filters */}
      <div role="group" aria-label="Filter projects by sector" className="mt-10 flex flex-wrap gap-2">
        {sectorChips.map((g) => {
          const count = g === 'All' ? brands.length : brands.filter((b) => b.group === g).length
          const on = filter === g
          return (
            <button key={g} type="button" aria-pressed={on} onClick={() => pick(g)} className={`${pill} inline-flex min-h-10 items-center gap-2 px-4 text-sm transition-colors duration-300 ${on ? 'border-[#a4be2d] bg-[#a4be2d] text-[#101310]' : 'border-white/25 text-white/80 hover:border-[#a4be2d] hover:text-[#a4be2d]'} ${focus}`}>
              {g}<span className={`text-xs tabular-nums ${on ? 'text-[#101310]/70' : 'text-[#a4be2d]'}`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* One row per project, the open one shows what it is and the scope */}
      <ul className="m-0 mt-8 list-none border-b border-white/15 p-0">
        {list.map((b) => {
          const on = open === b.id
          const no = String(brands.indexOf(b) + 1).padStart(2, '0')
          return (
            <li key={b.id}>
              <article id={`brand-${b.id}`} className="scroll-mt-24 border-t border-white/15">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`tab-${b.id}`}
                    aria-expanded={on}
                    aria-controls={`panel-${b.id}`}
                    onClick={() => toggle(b.id)}
                    className={`group/row flex w-full items-center gap-4 py-4 text-left sm:gap-6 sm:py-5 ${focus}`}
                  >
                    <BrandArt b={b} className="size-14 shrink-0 rounded-xl sm:size-[72px]" imgClass={`transition-transform duration-700 ${ease} group-hover/row:scale-110`} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold tabular-nums text-[#a4be2d]">{no}<span className="font-medium text-white/60"> · {b.category}</span></span>
                      <span className={`mt-1 block truncate text-[clamp(24px,3.6vw,48px)] font-extrabold leading-[1.05] tracking-[-.045em] transition-colors duration-300 ${on ? 'text-[#a4be2d]' : 'text-white group-hover/row:text-[#a4be2d]'}`}>{b.name}</span>
                    </span>
                    <span aria-hidden className={`grid size-9 shrink-0 place-items-center rounded-full border text-lg leading-none transition-[transform,background-color,border-color,color] duration-500 ${on ? 'rotate-45 border-[#a4be2d] bg-[#a4be2d] text-[#101310]' : 'border-white/40 text-white'}`}>+</span>
                  </button>
                </h3>
                <div id={`panel-${b.id}`} role="region" aria-labelledby={`tab-${b.id}`} className={`grid transition-[grid-template-rows] duration-[600ms] ${ease} motion-reduce:transition-none ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className={`min-h-0 overflow-hidden transition-[opacity,visibility] duration-500 motion-reduce:transition-none ${on ? 'visible opacity-100 delay-150' : 'invisible opacity-0'}`}>
                    <div className="grid gap-6 pb-8 pt-2 lg:grid-cols-12 lg:gap-10 lg:pb-12">
                      <div className="lg:col-span-4">
                        <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-4 text-[13px] leading-[1.5] text-[#cdd8c6]">
                          {[['Sector', b.group], ['Category', b.category]].map(([label, text]) => (
                            <div key={label}><dt className="mb-0.5 text-[11px] font-bold uppercase tracking-[.08em] text-[#a4be2d]">{label}</dt><dd className="m-0">{text}</dd></div>
                          ))}
                        </dl>
                      </div>
                      <div className="lg:col-span-8">
                        <p className="m-0 max-w-[56ch] text-[clamp(18px,1.8vw,24px)] leading-[1.45] text-white">{b.short}</p>
                        <p className="m-0 mt-6 text-[11px] font-bold uppercase tracking-[.08em] text-[#a4be2d]">Scope</p>
                        <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
                          {b.scope.map((s) => <li key={s} className={`${pill} border-white/25 text-white/80`}>{s}</li>)}
                        </ul>
                        <VentureLink venture={b} className="mt-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default function Ventures() {
  const root = useRef(null)
  const { hash } = useLocation()
  useScrollVars(root)
  useReveal(root)
  useEffect(() => { document.title = 'Startups & Businesses | Hashir Usman' }, [])
  // Section links such as /ventures#collection (brand links are handled inside Directory).
  useEffect(() => {
    if (!hash || hash.startsWith('#brand-')) return undefined
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
    return () => cancelAnimationFrame(frame)
  }, [hash])

  const steps = [
    ['The venture', featured.context],
    ['My role', featured.role],
    ['Outcome', NO_METRICS],
  ]

  return (
    <main id="main" ref={root} className="overflow-x-clip">
      {/* 01 Hero: the image starts as an inset card and opens to full width as you scroll */}
      <section data-p="top" aria-labelledby="ventures-title" className="bg-[#101310] pb-6 text-white">
       
        <div className={`${wrap} grid items-end gap-x-10 gap-y-5 pb-8 pt-6 lg:grid-cols-12`}>
          <Chars as="h1" id="ventures-title" text="A few things I’ve had my hands in." delay={150} className="max-w-[13ch] text-[clamp(42px,6.2vw,104px)] font-extrabold leading-[.98] tracking-[-.055em] lg:col-span-8" />
          <p className="m-0 max-w-[38ch] pb-2 text-[15px] leading-[1.7] text-[#dfe6d8] lg:col-span-4">Some started from scratch. Some needed a new direction. Others needed better operations, sales systems, or room to grow.</p>
        </div>
        <div
          style={{ marginInline: 'calc((1 - var(--p, 1)) * 4vw)', borderRadius: 'calc((1 - var(--p, 1)) * 36px)' }}
          className="relative h-[clamp(360px,64svh,680px)] overflow-hidden bg-[#153B2B]"
        >
          <div style={{ transform: 'scale(calc(1.22 - .22 * var(--p, 1)))' }} className="absolute inset-0 will-change-transform">
            <Cover crop={{ pos: '50% 30%', zoom: 1 }} tone="natural" priority alt={HERO_ALT} image="/ventureshero.png" />
          </div>
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,#101310b3,#10131000_45%)]" />
          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-end justify-between gap-4 p-5 md:p-8">
            <span className={`${pill} border-white/40 bg-[#101310]/40 text-white`}>Startups & businesses</span>
            <a href="#featured" className={`group inline-flex min-h-11 items-center gap-3 rounded-full bg-[#a4be2d] px-5 text-sm font-semibold text-[#101310] no-underline ${focus} focus-visible:outline-white`}>
              Explore the Build<ArrowDown size={16} weight="light" aria-hidden className="transition-transform duration-300 motion-safe:group-hover:translate-y-1" />
            </a>
          </div>
        </div>
        <nav aria-label="Ventures index" className={`${wrap} mt-5`}>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {[['#featured', `Featured build: ${featured.name}`, ''], ['#collection', `All ${brands.length} startups & businesses`, ''], ['#value', 'How the work creates value', '']].map(([href, label, meta]) => (
              <li key={href}>
                <a href={href} className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-sm text-white/85 no-underline transition-colors hover:border-[#a4be2d] hover:text-[#a4be2d] ${focus}`}>
                  {meta ? <span className="text-xs tabular-nums text-[#a4be2d]">{meta}</span> : null}{label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* 02 Featured venture: a scrubbed statement and a timeline that draws itself */}
      <section id="featured" aria-labelledby="featured-title" className="scroll-mt-16 overflow-hidden bg-[#F2F3EF] py-[clamp(48px,5.5vw,88px)] text-[#101310]">
        <div className={wrap}>
          <div className="flex items-center justify-between gap-4 text-xs font-semibold text-[#617319]">
            <span>02 / Featured build</span>
            <span className="flex gap-2"><span className={`${pill} border-[#617319]/40`}>{featured.category}</span></span>
          </div>
          <h2 id="featured-title" className="sr-only">{featured.name} featured build</h2>
          <div className="mt-8 grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <div data-p="through" className="relative aspect-[4/5] overflow-hidden rounded-[28px] lg:col-span-5 lg:self-start">
              <div style={{ transform: 'translateY(calc((.5 - var(--p, .5)) * 14%))' }} className="absolute inset-x-0 -inset-y-[8%] will-change-transform">
                <Cover crop={featured.crop} tone="natural" image="/ventures1.png" />
              </div>
              <span className={`${pill} absolute bottom-4 left-4 border-white/40 bg-[#101310]/50 text-white`}>{featured.name}</span>
            </div>
            <div className="lg:col-span-7">
              <p className="m-0 mb-3 text-xs font-semibold text-[#617319]">{featured.name}</p>
              <Scrub text={featured.statement} className="m-0 text-[clamp(28px,3.4vw,52px)] font-extrabold leading-[1.05] tracking-[-.05em]" />
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

      {/* 03 Collection: every project, with sector filters and an expandable row per project */}
      <section id="collection" aria-labelledby="collection-title" className="scroll-mt-16 bg-[#153B2B] py-[clamp(44px,5vw,80px)] text-white">
        <div className={wrap}>
          <div className="grid items-end gap-x-6 gap-y-4 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="m-0 mb-3 text-xs font-semibold text-[#a4be2d]">03 / The collection</p>
              <Chars as="h2" id="collection-title" text="Here’s a little look around." className="text-[clamp(34px,5vw,72px)] font-extrabold leading-[.98] tracking-[-.055em]" />
            </div>
              <p className="m-0 max-w-[38ch] text-[15px] leading-[1.7] text-[#b9c7b2] lg:col-span-4">{brands.length} startups and businesses. Filter by sector or open a row to see what I worked on.</p>
          </div>
          <Directory />
        </div>
      </section>

      {/* 04 Value: a timeline that draws itself as you scroll, with each stage tied to documented work */}
      <section id="value" aria-labelledby="value-title" className="scroll-mt-16 bg-[#F2F3EF] py-[clamp(48px,5.5vw,88px)] text-[#101310]">
        <div className={wrap}>
          <div className="grid items-end gap-x-6 gap-y-4 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="m-0 mb-3 text-xs font-semibold text-[#617319]">04 / How the work creates value</p>
              <Chars as="h2" id="value-title" text="From opportunity to something that runs." className="text-[clamp(34px,5vw,72px)] font-extrabold leading-[.98] tracking-[-.055em]" />
            </div>
            <p className="m-0 max-w-[38ch] border-l-2 border-[#a4be2d] pl-4 text-[14px] leading-[1.65] text-[#4f5a4d] lg:col-span-4">Each stage points to projects in the collection above. It is not a fixed process or a promise of results.</p>
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
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[24px]"><Cover crop={item.crop} tone={item.tone} image={item.image} /></div>
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
            <Chars as="h2" id="close-title" text="Let’s put that brain to work." className="text-[clamp(40px,6.4vw,100px)] font-extrabold leading-[.95] tracking-[-.055em]" />
            <p className="mt-6 max-w-[46ch] text-[16px] leading-[1.7] text-[#dfe6d8]">A focused one-to-one conversation about your idea, your business, or the thing that’s keeping you stuck. No complicated process. Just a proper conversation about what matters.</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link to="/contact" className={`group inline-flex min-h-14 items-center gap-4 rounded-full bg-[#a4be2d] px-7 text-[15px] font-semibold text-[#101310] no-underline transition-colors duration-300 hover:bg-white ${focus} focus-visible:outline-white`}>
                Book Some Thinking Time<ArrowRight size={20} weight="light" aria-hidden className="transition-transform duration-300 motion-safe:group-hover:translate-x-1.5" />
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
        <div aria-hidden style={{ transform: 'translateX(calc((var(--p, .5) - .5) * 45vw))' }} className={`-ml-[30vw] select-none whitespace-nowrap text-[clamp(48px,9vw,140px)] font-extrabold leading-[1] tracking-[-.05em] will-change-transform ${stroke}`}>Book Some Thinking Time   —   Book Some Thinking Time   —   Book Some Thinking Time   —   Book Some Thinking Time</div>
      </section>
    </main>
  )
}
