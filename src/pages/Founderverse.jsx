import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const HERO_IMAGE = '/founderverse.png'
const BOOK_IMAGE = '/book.png'
// Set launched to true when Book 01 goes on sale, and point href at the real preview or checkout link.
const BOOK = { launched: false, href: '/contact' }
const ctaLabel = BOOK.launched ? 'Get Book 01' : 'Sneak a Peek'

const topics = ['Ideas', 'Customers', 'Products', 'Pricing', 'Marketing', 'Sales', 'Decisions']
const steps = ['Follow the story.', 'Understand the thinking.', 'Maybe avoid a mistake or two.']

const ease = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const wrap = 'mx-auto w-full max-w-[1320px] px-5 sm:px-8 xl:px-10'
const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4be2d]'
const stroke = 'text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.55)]'

// Tailwind v3 animates `transform`; v4 uses the standalone `translate` and `scale` properties. Listing all keeps both working.
const move = 'transition-[opacity,transform,translate,scale]'
const rise = `opacity-100 translate-y-0 ${move} duration-[900ms] ${ease} data-[ready=true]:opacity-0 data-[ready=true]:translate-y-6 data-[in=true]:opacity-100 data-[in=true]:translate-y-0 motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none`

const CSS = `
@keyframes fv-float{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-16px) rotate(1.5deg)}}
@keyframes fv-slide{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}
@keyframes fv-pulse{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
.fv-float{animation:fv-float 8s ease-in-out infinite}
.fv-track{animation:fv-slide 55s linear infinite;will-change:transform}
.fv-glow{animation:fv-pulse 6s ease-in-out infinite}
.fv-row:hover .fv-track{animation-play-state:paused}
@media (prefers-reduced-motion:reduce){.fv-float,.fv-track,.fv-glow{animation:none}.fv-row{overflow-x:auto}.fv-dup{display:none}}
@media (prefers-reduced-motion:reduce){[data-reveal][data-ready=true]{opacity:1!important;translate:none!important}}
`

function useReveal(ref) {
  useEffect(() => {
    const nodes = ref.current ? Array.from(ref.current.querySelectorAll('[data-reveal]')) : []
    const show = (node) => {
      node.setAttribute('data-in', 'true')
      node.removeAttribute('data-ready')
    }
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(show)
      return undefined
    }
    nodes.forEach((node) => node.setAttribute('data-ready', 'true'))
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
          show(entry.target)
          observer.unobserve(entry.target)
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    nodes.forEach((node) => observer.observe(node))
    const fallback = window.setTimeout(() => nodes.forEach(show), 1800)
    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [ref])
}

// Slow drift on the hero background as the page scrolls.
function useDrift(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      const y = Math.min(window.scrollY, window.innerHeight * 1.2)
      el.style.transform = `translate3d(0,${y * 0.18}px,0) scale(1.1)`
    }
    const request = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', request, { passive: true })
    return () => {
      window.removeEventListener('scroll', request)
      cancelAnimationFrame(frame)
    }
  }, [ref])
}

function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  return (
    <Tag data-reveal style={delay ? { transitionDelay: `${delay}ms` } : undefined} className={`${rise} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

// Masked line reveal: each line slides up from behind its own clip.
function Lines({ as: Tag = 'div', lines, delay = 0, step = 130, className = '', ...rest }) {
  return (
    <Tag data-reveal className={`group/lines block ${className}`} {...rest}>
      {lines.map((line, index) => (
        <span key={index} className="-my-[.08em] block overflow-hidden py-[.08em]">
          <span
            style={{ transitionDelay: `${delay + index * step}ms` }}
          className={`block translate-y-0 transition-transform duration-[1100ms] ${ease} group-data-[ready=true]/lines:translate-y-[110%] group-data-[in=true]/lines:translate-y-0 motion-reduce:translate-y-0 motion-reduce:transition-none`}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}

function Cta({ className = '' }) {
  const body = (
    <>
      {ctaLabel}
      <ArrowUpRight size={18} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </>
  )
  const cls = `group inline-flex min-h-14 items-center gap-3 rounded-full border border-[#a4be2d] bg-[#a4be2d] px-7 text-[15px] font-semibold text-[#101310] no-underline transition-[transform,background-color,border-color] duration-300 hover:scale-[1.03] hover:border-white hover:bg-white active:scale-[.98] ${focus} focus-visible:outline-white ${className}`
  return BOOK.href.startsWith('/')
    ? <Link to={BOOK.href} className={cls}>{body}</Link>
    : <a href={BOOK.href} className={cls}>{body}</a>
}

// The book cover floats and tilts toward the pointer.
function BookCover({ className = '' }) {
  const box = useRef(null)
  const tilt = (event) => {
    const el = box.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--ry', `${((event.clientX - r.left) / r.width - 0.5) * 18}deg`)
    el.style.setProperty('--rx', `${-((event.clientY - r.top) / r.height - 0.5) * 14}deg`)
  }
  const rest = () => {
    box.current?.style.setProperty('--ry', '0deg')
    box.current?.style.setProperty('--rx', '0deg')
  }
  return (
    <div className={`fv-float ${className}`}>
      <div onPointerMove={tilt} onPointerLeave={rest} className="relative [perspective:1100px]">
        <div ref={box} className="relative transition-transform duration-300 ease-out [transform-style:preserve-3d] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]">
          <img
            src={BOOK_IMAGE}
            alt="Founderverse Book 01 cover"
            decoding="async"
            draggable={false}
            onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
            style={{ filter: 'drop-shadow(0 34px 38px rgba(0,0,0,.55))' }}
            className="block h-auto w-full rounded-[6px]"
          />
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[7%] rounded-l-[6px] bg-gradient-to-r from-black/40 via-white/10 to-transparent" />
          <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[6px] bg-[linear-gradient(115deg,rgba(255,255,255,.22),transparent_38%)]" />
        </div>
      </div>
    </div>
  )
}

export default function Founderverse() {
  const root = useRef(null)
  const drift = useRef(null)
  useReveal(root)
  useDrift(drift)
  useEffect(() => { document.title = 'Founderverse | Hashir Usman' }, [])

  return (
    <main id="main" ref={root} className="overflow-x-clip bg-[#101310] text-white">
      <style>{CSS}</style>

      {/* Hero: full-bleed background image, headline and the book cover */}
      <section aria-labelledby="founderverse-title" className="relative isolate flex min-h-[min(100svh,1000px)] flex-col overflow-hidden bg-[#101310]">
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div ref={drift} style={{ transform: 'scale(1.1)' }} className="absolute inset-0 will-change-transform">
            <img src={HERO_IMAGE} alt="" decoding="async" draggable={false} onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} className="size-full object-cover saturate-[.85]" />
          </div>
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#101310_0%,#101310e6_34%,#10131066_100%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-[linear-gradient(to_top,#101310,#10131000)]" />
        <div aria-hidden className="fv-glow absolute -right-24 top-1/4 -z-10 size-[min(70vw,640px)] rounded-full bg-[#a4be2d]/20 blur-3xl" />

        <div className={`${wrap} relative flex flex-1 flex-col justify-center gap-12 pb-20 pt-28 sm:pt-32 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10`}>
          <div className="lg:col-span-7">
            <Reveal className="mb-6 flex items-center gap-3 text-[13px] font-semibold text-[#a4be2d]">
              <span aria-hidden className="relative grid size-2.5 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#a4be2d]/60 motion-reduce:animate-none" />
                <span className="relative size-2 rounded-full bg-[#a4be2d]" />
              </span>
              Something I’m cooking
            </Reveal>
            <Lines
              as="h1"
              id="founderverse-title"
              lines={['Business lessons.', <span key="a" className="text-[#a4be2d]">Without the boring textbook energy.</span>]}
              delay={150}
              step={160}
              className="text-[clamp(42px,6.6vw,108px)] font-extrabold leading-[.94] tracking-[-.065em]"
            />
            <Reveal as="p" delay={600} className="mt-7 max-w-[52ch] text-base leading-[1.75] text-[#dfe6d8] sm:text-lg">
              Meet Founderverse. An illustrated learning series that follows fictional founders navigating ideas, customers, products, pricing, marketing, sales, and the decisions behind building a business.
            </Reveal>
            <Reveal as="ul" delay={700} className="m-0 mt-5 flex list-none flex-col gap-1.5 p-0 text-base font-semibold text-white sm:flex-row sm:flex-wrap sm:gap-x-6">
              {steps.map((line) => (
                <li key={line} className="flex items-center gap-2.5">
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-[#a4be2d]" />
                  {line}
                </li>
              ))}
            </Reveal>
            <Reveal delay={820} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Cta />
              <a href="#book" className={`group inline-flex min-h-11 items-center gap-3 text-sm font-medium text-white no-underline ${focus}`}>
                <span className="relative block h-10 w-px overflow-hidden bg-white/30">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-[#a4be2d] transition-transform duration-500 group-hover:translate-y-full motion-reduce:transition-none" />
                </span>
                Scroll
                <ArrowDown size={16} aria-hidden className="text-[#a4be2d] transition-transform duration-300 motion-safe:group-hover:translate-y-1" />
              </a>
            </Reveal>
          </div>

          <Reveal delay={400} className="relative mx-auto w-full max-w-[300px] sm:max-w-[340px] lg:col-span-5 lg:max-w-[400px] lg:justify-self-center">
            <div aria-hidden className="absolute -inset-8 rounded-full border border-[#a4be2d]/30" />
            <div aria-hidden className="absolute -inset-16 rounded-full border border-[#a4be2d]/15" />
            <BookCover className="relative" />
            <span className="absolute -right-3 -top-3 rounded-full bg-[#a4be2d] px-4 py-2 text-xs font-bold text-[#101310] shadow-[0_10px_30px_#00000066] sm:-right-6">Book 01</span>
            <span className="absolute -bottom-3 -left-3 rounded-full border border-white/30 bg-[#101310]/80 px-4 py-2 text-xs font-medium text-white backdrop-blur sm:-left-8">Illustrated learning series</span>
          </Reveal>
        </div>
      </section>

      {/* Ticker: the topics the founders work through */}
      <section aria-label="Topics in the series" className="overflow-hidden border-y border-white/15 bg-[#101310] py-5 sm:py-7">
        <div className="fv-row overflow-hidden">
          <ul className="fv-track m-0 flex w-max list-none items-center p-0">
            {[...topics, ...topics, ...topics, ...topics].map((topic, i) => (
              <li key={`${topic}-${i}`} aria-hidden={i >= topics.length || undefined} className={`flex items-center ${i >= topics.length ? 'fv-dup' : ''}`}>
                <span className={`px-6 text-[clamp(40px,7vw,104px)] font-extrabold leading-none tracking-[-.05em] sm:px-10 ${i % 2 ? stroke : 'text-white'}`}>{topic}</span>
                <span aria-hidden className="size-3 shrink-0 rounded-full bg-[#a4be2d] sm:size-4" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured: Founderverse, Book 01 */}
      <section id="book" aria-labelledby="book-title" className="relative isolate scroll-mt-16 overflow-hidden bg-[#101310] py-20 sm:py-28 lg:py-32">
        <div aria-hidden className="fv-glow absolute left-[-10%] top-1/2 -z-10 size-[min(90vw,720px)] -translate-y-1/2 rounded-full bg-[#a4be2d]/15 blur-3xl" />
        <div aria-hidden className="absolute inset-0 -z-10 [background-image:radial-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]" />
        <div className={`${wrap} grid items-center gap-x-14 gap-y-14 lg:grid-cols-12`}>
          <Reveal className="relative mx-auto w-full max-w-[300px] sm:max-w-[360px] lg:col-span-5 lg:max-w-[420px]">
            <div aria-hidden className="absolute -inset-6 rounded-[36px] border border-[#a4be2d]/40 sm:-inset-8" />
            <BookCover className="relative" />
          </Reveal>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal className="mb-5 flex items-center gap-3 text-[13px] font-semibold text-[#a4be2d] before:h-px before:w-8 before:bg-[#a4be2d]">Featured</Reveal>
            <Lines as="h2" id="book-title" lines={['Founderverse', <span key="b" className="text-[#a4be2d]">Book 01</span>]} delay={100} step={150} className="text-[clamp(44px,7.4vw,116px)] font-extrabold leading-[.92] tracking-[-.065em]" />
            <Reveal delay={400} className="mt-9 border-t border-white/20 pt-6">
              <p className="m-0 text-xs font-semibold uppercase tracking-[.14em] text-[#b9c7b2]">Proposed price</p>
              <p className="m-0 mt-2 flex flex-wrap items-end gap-x-5 gap-y-2">
                <span className="text-[clamp(44px,6vw,80px)] font-extrabold leading-none tracking-[-.05em] text-white">₹499</span>
                <span className="pb-1.5 text-sm text-[#b9c7b2]">Subject to launch confirmation.</span>
              </p>
            </Reveal>
            <Reveal delay={550} className="mt-8">
              <Cta />
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  )
}
