import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChartLineUp, Compass, FacebookLogo, Gear, InstagramLogo, LinkedinLogo, SquaresFour, WhatsappLogo, X, YoutubeLogo } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { brandImage, brands } from '../data/brands'

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
const positioningWords = styledWords(statement)

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
const rise = (on, d = 0, y = 16) => ({ opacity: on ? 1 : 0, transform: on ? 'none' : `translateY(${y}px)`, transition: `opacity 480ms ${EASE} ${d}ms, transform 480ms ${EASE} ${d}ms` })
const wrap = 'mx-auto w-full max-w-[1280px] px-5 sm:px-7'
const eyebrow = 'mb-5 flex items-center gap-3 text-[13px] font-semibold text-[#617319] before:h-px before:w-8 before:bg-[#7c9318]'
const h2cls = 'text-[clamp(34px,5vw,66px)] font-extrabold leading-[1.02] tracking-[-.045em]'
const dotted = '[background-image:radial-gradient(#d5e48145_.8px,transparent_1px)] [background-size:12px_12px]'
const heroSocials = [
  { label: 'Facebook', href: 'https://www.facebook.com/', Icon: FacebookLogo },
  { label: 'Instagram', href: 'https://www.instagram.com/hashir_usman__?psln=Zmg0YnZyM29sdWsx', Icon: InstagramLogo },
  { label: 'YouTube', href: 'https://www.youtube.com/', Icon: YoutubeLogo },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', Icon: LinkedinLogo },
  { label: 'WhatsApp', href: 'https://www.whatsapp.com/', Icon: WhatsappLogo },
]

function useInView(margin = '0px 0px 280px 0px') {
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
          <span className="block" style={{ transform: go ? 'none' : 'translateY(110%)', transition: `transform 520ms ${EASE} ${delay + i * 55}ms` }}>{line}</span>
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
      const k = Math.min(1, (t - t0) / 700)
      setN(Math.round(to * (1 - (1 - k) ** 3)))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [seen, to])
  return <span ref={ref}>{n}{suffix}</span>
}

const Arrow = () => <ArrowUpRight size={18} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

/* ---------- Framework: four stages ----------
   Desktop (lg and up): a single row of four cards hanging from a horizontal progress line that fills lime as you scroll.
   Tablet and phone: the same four cards stacked and centered, each sliding in from the left, right, left, right as it scrolls into view.
   Reduced-motion visitors get everything in place straight away. */
function StageReveal({ from, className = '', children }) {
  const [ref, seen] = useInView('0px 0px -12% 0px')
  const off = from === 'left' ? '-56px' : '56px'
  return (
    <li ref={ref} className={className} style={{ opacity: seen ? 1 : 0, transform: seen ? 'none' : `translateX(${off})`, transition: `opacity 700ms ${EASE}, transform 700ms ${EASE}` }}>
      {children}
    </li>
  )
}

function StageCard({ name, desc, out, reached }) {
  return (
    <div className={`flex flex-1 flex-col rounded-[22px] border bg-gradient-to-br from-white via-white to-[#f1f5e8] p-6 text-[#171a17] transition-[border-color,box-shadow] duration-500 sm:p-7 ${reached ? 'border-[#a4be2d] shadow-[0_20px_50px_rgba(0,0,0,.22)]' : 'border-[#cdd9b2] shadow-[0_16px_44px_rgba(0,0,0,.12)]'}`}>
      <span aria-hidden className="mb-5 block h-1 w-10 rounded-full bg-[#a4be2d]" />
      <h3 className="m-0 text-[clamp(28px,7.5vw,38px)] font-extrabold leading-[1.05] tracking-[-.04em] lg:text-[clamp(26px,2.3vw,34px)]">{name}</h3>
      <p className="mb-0 mt-3 text-[15px] leading-[1.6] text-[#4a4f47]">{desc}</p>
      <div className="mt-auto pt-6">
        <p className="m-0 rounded-xl bg-[#eaf0d3] px-4 py-3 text-[13.5px] font-semibold leading-[1.5] text-[#4f5f10]">{out}</p>
      </div>
    </div>
  )
}

function Framework() {
  const [roadRef, p] = useScrollProgress()
  const step = p * (stages.length - 1)

  return (
    <section id="framework" className="relative isolate overflow-hidden bg-[#173b2b] pb-24 pt-8 text-[#f8f9f6] sm:pb-28 sm:pt-16" aria-labelledby="framework-title">
      <span aria-hidden className="pointer-events-none absolute -right-20 -top-20 -z-10 size-64 rounded-full bg-[#1c4833] sm:size-96 lg:-right-24 lg:-top-24 lg:size-[26rem]" />
      <span aria-hidden className="pointer-events-none absolute -right-40 -top-40 -z-10 hidden size-[40rem] rounded-full border border-[#a4be2d]/10 sm:block" />
      <div className={wrap}>
        <header className="mb-12 max-w-3xl sm:mb-16">
          <Reveal className="mb-5 flex items-center gap-3 text-[13px] font-semibold text-[#d6e88a] before:h-px before:w-8 before:bg-[#a4be2d]">From idea to actual business</Reveal>
          <Heading id="framework-title" lines={['That idea in your head?', 'Give it somewhere to go.']} className={h2cls} />
        </header>

        {/* tablet + phone: alternating cards that slide in from the sides */}
        <ol className="m-0 flex list-none flex-col gap-5 p-0 lg:hidden">
          {stages.map(([name, desc, out], i) => (
            <StageReveal key={name} from={i % 2 === 0 ? 'left' : 'right'} className="mx-auto flex w-full flex-col md:max-w-[560px]">
              <StageCard name={name} desc={desc} out={out} reached />
            </StageReveal>
          ))}
        </ol>

        {/* desktop: four cards on a progress line */}
        <ol ref={roadRef} className="relative m-0 hidden list-none grid-cols-4 gap-5 p-0 lg:grid">
          {stages.map(([name, desc, out], i) => {
            const reached = step >= i
            const fill = Math.min(1, Math.max(0, step - i))
            const last = i === stages.length - 1
            return (
              <li key={name} className="relative flex flex-col pt-9">
                {!last && (
                  <span aria-hidden className="absolute left-0 top-0 h-px w-[calc(100%+1.25rem)] bg-white/20">
                    <span className="block h-full w-full origin-left bg-[#a4be2d] transition-transform duration-300 ease-out motion-reduce:transition-none" style={{ transform: `scaleX(${fill})` }} />
                  </span>
                )}
                <span aria-hidden className={`absolute left-0 top-0 block size-[11px] -translate-y-1/2 rounded-full border transition-colors duration-300 ${reached ? 'border-[#a4be2d] bg-[#a4be2d]' : 'border-white/30 bg-[#173b2b]'}`} />
                <StageCard name={name} desc={desc} out={out} reached={reached} />
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* ---------- Ventures showcase: a continuous arc carousel ---------- */
const logoVentures = [
  'dayone', 'heydossa', 'suite-spot', 'popsi', 'no-two', 'nothing-else', 'car-broker', 'zaati',
  'ezkaa', 'moonbliss', 'house-of-bliss', 'de-coff', 'ai-designers', 'bare-logic', 'celebrations',
  'beyond-the-business', 'curry-bag', 'the-grid-store', 'hungry-potato', 'hosther', 'sol', 'nk-reactives', 'hyzo',
]
const logoById = new Map(brands.map((brand) => [brand.id, brand]))
const VENTURES = logoVentures.map((id) => ({ id, brand: logoById.get(id) })).filter((v) => v.brand)
function MobileVentureCarousel() {
  const carouselRef = useRef(null)

  useEffect(() => {
    const rail = carouselRef.current
    if (!rail) return undefined
    let rafId
    let previousTime
    let visible = false
    const cards = Array.from(rail.querySelectorAll('[data-arc-card]'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const shapeArc = () => {
      const railBox = rail.getBoundingClientRect()
      const center = railBox.left + railBox.width / 2
      const radius = railBox.width / 2
      const positions = cards.map((card) => {
        const box = card.getBoundingClientRect()
        const ratio = Math.max(-1, Math.min(1, (box.left + box.width / 2 - center) / (radius + box.width / 2)))
        return { card, ratio }
      })
      positions.forEach(({ card, ratio }) => {
        const depth = ratio * ratio
        card.style.transform = `translate3d(0,${-22 + depth * 64}px,0) scale(${1 - Math.abs(ratio) * 0.1}) rotate(${ratio * 4}deg)`
        card.style.zIndex = String(10 - Math.round(Math.abs(ratio) * 10))
      })
    }
    const wrap = () => {
      const loopStart = rail.querySelector('[data-venture-loop]')
      const loopPoint = loopStart && loopStart.offsetLeft - Number.parseFloat(window.getComputedStyle(rail).paddingLeft || '0')
      if (loopPoint && rail.scrollLeft >= loopPoint) rail.scrollLeft -= loopPoint
    }
    shapeArc()
    if (reducedMotion.matches) {
      window.addEventListener('resize', shapeArc)
      return () => window.removeEventListener('resize', shapeArc)
    }
    const tick = (time) => {
      if (!visible) return
      if (previousTime !== undefined) {
        rail.scrollLeft += Math.min(time - previousTime, 40) * 0.035
        wrap()
        shapeArc()
      }
      previousTime = time
      rafId = window.requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) {
        previousTime = undefined
        rafId = window.requestAnimationFrame(tick)
      } else {
        window.cancelAnimationFrame(rafId)
      }
    }, { rootMargin: '100px' })
    observer.observe(rail)
    return () => {
      window.cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={carouselRef} role="region" aria-label="Venture brands" aria-roledescription="carousel" className="relative flex h-[clamp(260px,38vw,420px)] w-full touch-pan-y overflow-hidden">
      {[0, 1].map((copy) => (
        <div key={copy} data-venture-loop={copy === 1 ? '' : undefined} className="relative flex h-full w-max shrink-0 items-center gap-[clamp(16px,3vw,40px)] pr-[clamp(16px,3vw,40px)]" aria-hidden={copy === 1}>
          {VENTURES.map(({ id, brand }, index) => (
            <Link
              key={`${id}-${copy}`}
              to={`/ventures#brand-${id}`}
              tabIndex={copy === 1 ? -1 : undefined}
              data-arc-card
              className="group relative flex w-[clamp(150px,22vw,270px)] shrink-0 flex-col items-center gap-2 text-center text-white no-underline will-change-transform"
              aria-label={`View ${brand.name}`}
            >
              <span className="block aspect-square w-full overflow-hidden group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-[#a4be2d]">
                <img src={brandImage(brand.file)} alt="" loading="eager" decoding="async" fetchPriority={index < 3 ? 'high' : 'auto'} className="block size-full object-cover" />
              </span>
              <span className="text-sm font-semibold tracking-tight sm:text-base">{brand.name}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}

function Portfolio() {
  return (
    <section id="brands" aria-labelledby="brands-title" className="relative isolate overflow-hidden bg-[#0d0f10] py-[clamp(24px,4svh,56px)]">
      <span aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: 'radial-gradient(900px circle at 50% 38%, rgba(164,190,45,.09), transparent 65%)' }} />
      <span aria-hidden className={`pointer-events-none absolute inset-0 -z-10 opacity-40 ${dotted}`} style={{ WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, #000, transparent 100%)', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, #000, transparent 100%)' }} />

      <div className="w-full max-w-none px-0">
        <h2 id="brands-title" className="mb-[clamp(24px,3svh,36px)] text-center text-[clamp(30px,4.5vw,54px)] font-extrabold leading-[1.05] tracking-[-.055em] text-white">
          Brands <span className="text-[#a4be2d]">I’ve helped build</span>
        </h2>

        <MobileVentureCarousel />

        <div className="mt-8 flex justify-center">
          <Link to="/ventures#collection" className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 text-[13px] font-semibold text-[#171a1b] no-underline transition-colors duration-300 hover:bg-[#a4be2d] active:scale-[.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4be2d]">See all ventures <Arrow /></Link>
        </div>

        <ul className="sr-only">
          {VENTURES.map((v) => <li key={v.id}><Link to={`/ventures#brand-${v.id}`}>{v.brand.name}</Link></li>)}
        </ul>
      </div>
    </section>
  )
}

/* ---------- Core expertise cards ----------
   Four compact panels in a checkerboard of warm white and deep green (the green ties into the Framework section below).
   Each panel: a round icon beside the copy (stacked on phones), a soft lime circle tucked into the top-right corner,
   a hairline above the tags, and a very small lift on hover. */
const EXPERTISE_ICONS = [SquaresFour, Compass, ChartLineUp, Gear]

function TechCard({ e, i }) {
  const Icon = EXPERTISE_ICONS[i]
  const dark = i === 1 || i === 2
  return (
    <article
      className={`group relative isolate flex h-full flex-col gap-5 overflow-hidden rounded-[20px] border p-6 transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:flex-row sm:gap-6 sm:p-7 ${dark ? 'border-[#2c5642] bg-gradient-to-br from-[#1b4733] to-[#122f22] text-white shadow-[0_18px_40px_-26px_rgba(16,40,28,.7)] hover:shadow-[0_24px_48px_-26px_rgba(16,40,28,.8)]' : 'border-[#d9e0c6] bg-gradient-to-br from-white via-white to-[#f1f5e6] text-[#171a17] shadow-[0_18px_40px_-28px_rgba(40,52,20,.35)] hover:shadow-[0_24px_48px_-28px_rgba(40,52,20,.45)]'}`}
    >
      <span aria-hidden className={`pointer-events-none absolute -right-10 -top-10 -z-10 size-32 rounded-full transition-transform duration-700 ease-out group-hover:scale-125 motion-reduce:transition-none sm:size-36 ${dark ? 'bg-[#a4be2d]/10' : 'bg-[#a4be2d]/20'}`} />

      <span className={`grid size-12 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${dark ? 'border-[#a4be2d]/45 text-[#c8e24a] group-hover:bg-[#a4be2d] group-hover:text-[#173b2b]' : 'border-[#173b2b]/20 text-[#173b2b] group-hover:bg-[#173b2b] group-hover:text-[#c8e24a]'}`}>
        <Icon size={24} weight="light" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-[clamp(22px,2vw,28px)] font-bold leading-[1.1] tracking-[-.03em]">{e.title}</h3>
        <p className={`mt-2 max-w-[44ch] text-[15px] leading-[1.6] ${dark ? 'text-[#bccbb9]' : 'text-[#4a4f47]'}`}>{e.desc}</p>
        <ul className={`mt-4 flex flex-wrap gap-1.5 border-t pt-4 text-[11.5px] ${dark ? 'border-white/15' : 'border-[#d9e0c6]'}`}>
          {e.tags.map((tag) => <li key={tag} className={`rounded-full border px-3 py-1 ${dark ? 'border-white/20 text-[#dbe5d3]' : 'border-[#cdd7b4] bg-white/60 text-[#3a4136]'}`}>{tag}</li>)}
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

function Positioning() {
  const [statRef, progress] = useScrollProgress()

  return (
    <section id="positioning" aria-labelledby="positioning-title" className="relative isolate overflow-x-clip bg-[#171a1b] py-28 text-[#f8f9f6] sm:py-40">
      <div className={`${wrap} relative z-10 grid gap-10 lg:grid-cols-12`}>
        <div className="relative z-10 lg:col-span-3">
          <h3 className="lg:sticky lg:top-24 m-0 max-w-[12ch] text-[clamp(24px,2.5vw,36px)] font-bold leading-[1.05] tracking-[-.04em] text-white">
            A clearer way to <span className="text-[#a4be2d]">build.</span>
          </h3>
        </div>
        <div ref={statRef} className="relative z-10 lg:col-span-9">
          <h2 id="positioning-title" className="text-[clamp(30px,4.8vw,68px)] font-bold leading-[1.1] tracking-[-.04em]">
            {positioningWords.map(([word, hot], i) => <span key={i} style={{ color: i / positioningWords.length < progress ? (hot ? '#a4be2d' : '#f8f9f6') : '#5d6558', transition: 'color 220ms ease' }}>{word} </span>)}
          </h2>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [ready, setReady] = useState(calm)
  const [heroInView, setHeroInView] = useState(false)
  const [showStartupPopup, setShowStartupPopup] = useState(false)
  useEffect(() => {
    document.title = 'Hashir Usman | Startup Architect, Venture Builder & Business Consultant'
    const frame = requestAnimationFrame(() => setReady(true))
    return () => {
      cancelAnimationFrame(frame)
    }
  }, [])
  useEffect(() => {
    const hero = document.getElementById('home')
    if (!hero) return undefined
    if (!('IntersectionObserver' in window)) {
      setHeroInView(true)
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => setHeroInView(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!heroInView) return undefined
    let dismissed = false
    try { dismissed = window.sessionStorage.getItem('founderverse-promo-dismissed-static-v3') === '1' } catch { /* Storage may be unavailable. */ }
    if (dismissed) return undefined
    const popupTimer = window.setTimeout(() => setShowStartupPopup(true), 2000)
    return () => window.clearTimeout(popupTimer)
  }, [heroInView])
  const dismissStartupPopup = () => {
    try { window.sessionStorage.setItem('founderverse-promo-dismissed-static-v3', '1') } catch { /* Dismiss for this page view if Storage is unavailable. */ }
    setShowStartupPopup(false)
  }
  const line = (d) => ({ strokeDashoffset: ready ? 0 : 1, transition: `stroke-dashoffset 850ms ${EASE} ${d}ms` })

  return (
    <>
    <main id="main" className="overflow-x-clip font-sans text-[#171a17]">
      {/* 1. Hero */}
      <section id="home" aria-labelledby="hero-title" className="relative flex min-h-[calc(100svh-72px)] flex-col max-[768px]:min-h-[calc(100svh-64px)]">
        <div className="mx-auto flex w-full max-w-[1720px] flex-1 flex-col px-5 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-8 lg:px-12 lg:pt-12 xl:px-16 2xl:px-20">
          <div className="grid flex-1 items-center gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            <div className="contents lg:col-span-7 lg:block">
              <div style={rise(ready)}>
                <h1 id="hero-title" className="text-[clamp(56px,7.2vw,120px)] font-extrabold leading-[.92] tracking-[-.065em]">Hashir Usman</h1>
              </div>
              <Heading tag="h2" on={ready} delay={40} className="mt-5 text-[clamp(38px,4.3vw,68px)] font-extrabold leading-[1.04] tracking-[-.055em] sm:mt-6" lines={['Is your business growing?', <span className="text-[#7c9318]">Or just getting busier?</span>]} />
              <div className="order-1 mt-7 max-w-[600px] lg:order-none sm:mt-8" style={rise(ready, 100)}>
                <h3 className="m-0 text-xl font-bold leading-[1.3] tracking-[-.02em] text-[#65751b] sm:text-[22px]">Startup architect. Venture builder. Business consultant.</h3>
                <p className="m-0 mt-3 text-base leading-[1.6] text-[#2f332e] sm:text-lg xl:text-xl">I help people start businesses, fix what’s not working, and build systems that make growth a little less chaotic.</p>
              </div>
              <div className="order-3 mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 lg:order-none" style={rise(ready, 160)}>
                <Link to="/contact" className="group inline-flex min-h-12 items-center gap-3 rounded border-[1.5px] border-[#a4be2d] bg-[#a4be2d] px-6 text-[13px] font-semibold text-[#1e2618] transition-colors duration-300 hover:border-[#b3cc35] hover:bg-[#b3cc35] active:scale-[.97]">Book a Strategy Call <Arrow /></Link>
                <Link to="/ventures" className="group inline-flex min-h-12 items-center gap-3 rounded border-[1.5px] border-[#a4aaa0] px-6 text-[13px] font-semibold transition-colors duration-300 hover:border-[#171a1b] hover:bg-[#171a1b] hover:text-white active:scale-[.97]">See My Work <Arrow /></Link>
              </div>
            </div>
            <div className="order-2 lg:order-none lg:col-span-5">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] lg:ml-auto lg:max-h-[min(72svh,820px)] lg:max-w-none" style={{ clipPath: ready ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)', transition: `clip-path 650ms ${EASE} 80ms` }}>
                <div className={`absolute inset-0 left-[10%] top-[8%] rounded-tl-[20px] bg-[#adca2d] ${dotted}`} aria-hidden />
                <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" fill="none" stroke="#171a1b" aria-hidden>
                  <g strokeOpacity=".22">{[100, 200, 300].map((x) => <path key={x} d={`M${x} 0V500`} />)}{[120, 230, 340, 450].map((y) => <path key={y} d={`M0 ${y}H400`} />)}</g>
                  <path d="M0 450H100V340H200V230H300V120H400" pathLength="1" strokeDasharray="1" strokeWidth="2" style={line(80)} />
                  {[[100, 340], [200, 230], [300, 120]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" fill="#f8f9f6" strokeWidth="1.5" style={{ opacity: ready ? 1 : 0, transition: `opacity 350ms ease ${120 + i * 80}ms` }} />)}
                  <path d="M12 36V12H36M364 12H388V36" strokeOpacity=".7" />
                </svg>
                <img className="absolute inset-0 h-full w-full max-w-none object-cover object-top" src="/images/hashir-portrait.webp" srcSet="/images/hashir-portrait-small.webp 480w, /images/hashir-portrait-medium.webp 800w, /images/hashir-portrait.webp 1120w" sizes="(max-width:1023px) 94vw, 40vw" width="1120" height="1400" alt="Portrait of Hashir Usman" fetchPriority="high" />
              </div>
              <nav aria-label="Social media profiles" className="relative z-20 mx-auto mt-4 flex w-fit max-w-full items-center gap-2.5 sm:gap-4 lg:ml-auto lg:mr-0">
                {heroSocials.map(({ label, href, Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-[#8da320]/70 bg-[#a4be2d]/75 text-[#17271c] shadow-[0_4px_12px_#10200818] backdrop-blur-sm transition-[transform,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#153B2B] hover:text-[#d7ea72] hover:shadow-[0_7px_18px_#10200825] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#153B2B] sm:size-12">
                    <Icon size={21} aria-hidden />
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Positioning statement: words light up as you scroll */}
      <Positioning />

      {/* 3. Core expertise */}
      <section id="services" aria-labelledby="expertise-heading" className="bg-[#f2f3ef] pb-10 pt-20 sm:pb-14 sm:pt-28">
        <div className={wrap}>
          <header className="mb-12 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Reveal className={eyebrow}>The bigger picture</Reveal>
              <Heading id="expertise-heading" lines={['Four things I spend a lot', 'of time thinking about.']} className={h2cls} />
            </div>
            <Reveal delay={200} className="lg:col-span-4"><p className="max-w-[380px] text-[15px] leading-[1.65] text-[#72766f]">From that first crazy idea to a business that’s ready for its next big move.</p></Reveal>
          </header>
          <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
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
    {showStartupPopup && heroInView && createPortal(
      <aside aria-label="Founderverse promotion" className="fixed bottom-[calc(12px_+_env(safe-area-inset-bottom))] left-1/2 z-[110] h-[220px] w-[min(370px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-[18px] border border-white/15 bg-[#10382D] p-3 text-white shadow-[0_18px_46px_rgba(7,24,17,.48)] animate-startup-popup sm:bottom-6 sm:left-auto sm:right-6 sm:h-[220px] sm:w-[370px] sm:translate-x-0 lg:h-[235px] lg:w-[400px]">
        <button type="button" onClick={dismissStartupPopup} aria-label="Close Founderverse promotion" className="absolute right-2 top-2 z-10 inline-flex size-7 items-center justify-center rounded-full border border-white/15 bg-white/[.06] text-white/75 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4D638]"><X size={15} aria-hidden /></button>
        <div className="flex h-full flex-col">
          <p className="m-0 min-h-3 pr-8 text-[10px] font-bold uppercase tracking-[.2em] text-[#C4D638] sm:text-[11px]">FOUNDERVERSE</p>
          <div className="mt-1.5 flex min-h-0 flex-1 items-center gap-2.5 sm:gap-3">
            <div className="h-[108px] w-[70px] shrink-0 overflow-hidden rounded-[6px] border border-[#F7F7F2]/55 bg-[#f5f1e5] shadow-[0_7px_18px_rgba(0,0,0,.35)] max-[380px]:h-[100px] max-[380px]:w-[65px]">
              <img src="/book.png" alt="Understanding Your Customer, an illustrated Founderverse book" className="size-full object-cover" />
            </div>
            <div className="min-w-0 flex-1 self-center">
              <h2 className="m-0 line-clamp-3 text-[17px] font-bold leading-[1.07] tracking-[-.035em] text-white sm:text-[19px] lg:text-[20px]">Don't just build an idea. Build something people need.</h2>
              <p className="m-0 mt-1.5 line-clamp-3 text-[12px] leading-[1.35] text-[#D5DFD8] sm:text-[13px]">Illustrated business books to help aspiring founders understand customers and take smarter next steps.</p>
            </div>
          </div>
          <Link to="/founderverse" onClick={dismissStartupPopup} className="group mt-2 flex h-[39px] shrink-0 items-center justify-between rounded-[8px] bg-[#C4D638] px-3.5 text-[13px] font-bold text-[#10251b] no-underline shadow-[inset_0_1px_0_rgba(255,255,255,.55)] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#d4e66a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-[14px]">
            Explore Founderverse ↗
          </Link>
        </div>
      </aside>,
      document.body,
    )}
    </>
  )
}
