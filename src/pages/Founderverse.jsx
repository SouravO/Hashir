import { useEffect } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  Database,
  DiscordLogo,
  Eye,
  Flask,
  InstagramLogo,
  LinkedinLogo,
  Play,
  RocketLaunch,
  Sparkle,
  UsersThree,
  XLogo,
  YoutubeLogo,
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

// One image is used everywhere on this page.
const BOOK_IMAGE = '/book.png'

const C = {
  ink: '#1e2618',
  paper: '#f4f4f2',
  green: '#a4be2d',
  paleGreen: '#e5edc8',
  orange: '#ff5a1f',
  blue: '#1b4dff',
  lime: '#a4be2d',
}

const wrap = 'mx-auto w-full max-w-[1320px] px-5 sm:px-8 xl:px-10'
const display = 'font-black uppercase leading-[.9] tracking-[-.045em]'
const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4be2d]'


const pillars = [
  { title: 'Learn', text: 'From real founder stories and practical resources.', color: C.green, icon: Sparkle, fg: C.ink },
  { title: 'Build', text: 'Turn ideas into something real with the right tools.', color: C.orange, icon: Database, fg: C.orange, bare: true },
  { title: 'Connect', text: 'Meet collaborators, mentors, and your people.', color: C.blue, icon: UsersThree, fg: C.blue, bare: true },
  { title: 'Launch', text: 'Get support to ship, grow, and go further.', color: C.lime, icon: ArrowUpRight, fg: C.ink },
]

const paths = [
  { n: '01', title: 'Story Worlds', text: 'Real stories, honest lessons and the messy behind the progress.', bg: C.paleGreen, fg: C.ink, sub: '#3f4b25' },
  { n: '02', title: 'Founder Tools', text: 'Curated tools, templates and playbooks to help you build.', bg: C.paper, fg: C.ink, sub: '#55554f' },
  { n: '03', title: 'Events', text: 'Online and in-person experiences to learn, meet and create.', bg: C.blue, fg: '#fff', sub: '#d3dcff' },
  { n: '04', title: 'Community', text: 'A genuine, supportive space for builders at every stage.', bg: C.orange, fg: C.ink, sub: '#3a1708' },
]

const editions = [
  { name: 'The Founder Playbook', text: 'Frameworks for real progress.', price: '$29', bg: '#e5edc8' },
  { name: 'Idea to Launch Kit', text: 'Turn your idea into a real plan.', price: '$49', bg: '#ffe3d6' },
  { name: 'Founders Unfiltered', text: 'Real conversations. No fluff.', price: '$19', bg: '#e8e8e5' },
  { name: 'Community Member Pass', text: 'Events, spaces, perks & more.', price: '$99', bg: '#dbe4ff' },
]

const journey = [
  { title: 'Discover', text: 'Explore stories, ideas and what’s possible.', bg: C.paper, fg: C.ink, icon: Eye },
  { title: 'Test', text: 'Try things, get feedback and learn in public.', bg: C.paleGreen, fg: C.ink, icon: Flask },
  { title: 'Build', text: 'Turn your idea into a real product.', bg: C.orange, fg: C.ink, icon: Database },
  { title: 'Launch', text: 'Ship, grow and create bigger opportunities.', bg: C.paper, fg: C.ink, icon: RocketLaunch },
]

const quotes = [
  { text: 'Founderverse gave me the clarity, tools and community I needed to finally ship.', name: 'Jenna Park', role: 'First-time Founder' },
  { text: 'The events and people here are different. It actually feels like a safe place to be early.', name: 'Carlos M.', role: 'Indie Builder' },
  { text: 'It’s more than a community. It’s a momentum engine for curious people.', name: 'Alyssa Chen', role: 'Product Builder' },
]

const CSS = `
@keyframes fv-float{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-12px) rotate(1deg)}}
.fv-float{animation:fv-float 8s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.fv-float{animation:none}}
`

function Logo({ className = '' }) {
  return (
    <Link to="/" aria-label="Founderverse home" className={`inline-flex items-center justify-center no-underline ${className} ${focus}`}>
      <img src="/fv-logo.png" alt="Founderverse" className="h-[108px] w-[90px] object-contain" />
    </Link>
  )
}

function Img({ className = '', alt = '' }) {
  return (
    <img
      src={BOOK_IMAGE}
      alt={alt}
      decoding="async"
      draggable={false}
      onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}
      className={className}
    />
  )
}

function ArrowBtn({ dark = true, className = '' }) {
  return (
    <span
      aria-hidden
      className={`grid size-8 shrink-0 place-items-center rounded-full border transition-transform duration-300 group-hover:translate-x-0.5 ${dark ? 'border-[#1e2618]/70 text-[#1e2618]' : 'border-white/80 text-white'} ${className}`}
    >
      <ArrowRight size={14} weight="bold" />
    </span>
  )
}

function Ticket({ children, className = '' }) {
  return <div className={`absolute shadow-[0_20px_40px_rgba(0,0,0,.25)] ${className}`}>{children}</div>
}

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-[#f4f4f2]">
      <div className={`${wrap} grid items-center gap-10 pb-16 pt-6 lg:grid-cols-12 lg:gap-6 lg:pb-20`}>
        <div className="min-w-0 lg:col-span-6">
          <h1 id="hero-title" className={`${display} text-[clamp(52px,7.2vw,116px)]`}>
            Big ideas
            <br />
            start
            <br />
            messy.
          </h1>
          <p className="mt-6 max-w-[36ch] text-base leading-[1.45] text-[#1a1a1a] sm:text-lg">
            Founderverse is a playful world for curious builders, first-time founders, and people figuring it out in public.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to="/contact" className={`group inline-flex h-14 items-center gap-3 rounded-full bg-[#a4be2d] px-7 text-[15px] font-semibold text-[#1e2618] no-underline transition hover:bg-[#1e2618] hover:text-white ${focus}`}>
              Join the Waitlist
              <ArrowRight size={18} weight="bold" aria-hidden className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#universe" className={`group inline-flex h-14 items-center gap-3 rounded-full border-2 border-[#1e2618] bg-transparent px-7 text-[15px] font-semibold text-[#1e2618] no-underline transition hover:bg-[#1e2618] hover:text-white ${focus}`}>
              <Play size={16} weight="fill" aria-hidden />
              See the Universe
            </a>
          </div>
          <div className="mt-7 flex items-center gap-3">
            <div className="flex -space-x-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <Img key={i} className="size-10 rounded-full border-2 border-[#f4f4f2] object-cover object-[50%_70%]" />
              ))}
            </div>
            <p className="m-0 text-[13px] leading-tight text-[#333]">
              <strong className="block text-base text-black">12,000+</strong>
              builders already in orbit
            </p>
          </div>
        </div>

        {/* Collage: everything is positioned in % / cqw of one box, so it scales as a unit */}
        <div className="mx-auto w-full max-w-[680px] min-w-0 lg:col-span-6 lg:max-w-none" style={{ containerType: 'inline-size' }}>
          <div className="relative aspect-[1/1.02] w-full">
            {/* Green pass (behind the book) */}
            <div className="absolute left-[3%] top-[26%] z-0 h-[50%] w-[33%] -rotate-[5deg] rounded-[3cqw] bg-[#a4be2d] p-[3cqw] shadow-[0_20px_40px_rgba(0,0,0,.18)]">
              <span aria-hidden className="grid size-[6.5cqw] place-items-center rounded-full border-2 border-black text-black">
                <Sparkle size="55%" />
              </span>
              <p className={`${display} m-0 mt-[3cqw] text-[5.4cqw] leading-[.95]`}>
                Ideas
                <br />
                People
                <br />
                Places
              </p>
              <p className="absolute bottom-[6%] left-[10%] m-0 text-[clamp(8px,1.6cqw,12px)] font-bold uppercase leading-tight tracking-wide text-black">
                A brighter,
                <br />
                more curious
                <br />
                tomorrow.
              </p>
            </div>

            {/* Book cover */}
            <div className="fv-float absolute left-[27%] top-[3%] z-10 w-[46%]">
              <Img alt="Founderverse Book 01 cover" className="block h-auto w-full rounded-[4px] shadow-[0_30px_50px_rgba(0,0,0,.4)]" />
            </div>

            {/* Orange all-access pass (in front of the book edge) */}
            <div className="absolute right-[1%] top-[16%] z-20 h-[52%] w-[31%] rotate-[4deg] rounded-[3cqw] bg-[#ff5a1f] p-[3cqw] shadow-[0_20px_40px_rgba(0,0,0,.22)]">
              <p className="m-0 text-[clamp(7px,1.5cqw,11px)] font-black uppercase tracking-wider text-black">Founderverse</p>
              <p className={`${display} m-0 mt-[1.5cqw] text-[3.5cqw] leading-[.98]`}>
                Builders
                <br />
                Ideas
                <br />
                Community
                <br />
                Real progress.
              </p>
              <div className="absolute inset-x-[10%] bottom-[7%]">
                <p className="m-0 mb-[1cqw] text-[clamp(7px,1.5cqw,11px)] font-bold uppercase leading-tight tracking-wider text-black">
                  FV-2025
                  <br />
                  All access pass
                </p>
                <div aria-hidden className="h-[4cqw] w-full bg-[repeating-linear-gradient(90deg,#000_0_2px,transparent_2px_4px,#000_4px_5px,transparent_5px_8px)]" />
              </div>
            </div>

            {/* Lime tape */}
            <div className="absolute left-[22%] top-[66%] z-30 w-[54%] -rotate-[6deg] bg-[#a4be2d] px-[3cqw] py-[2cqw] shadow-[0_10px_24px_rgba(0,0,0,.22)]">
              <p className={`${display} m-0 text-[3.8cqw] leading-[1]`}>
                Same curious people.
                <br />
                A bigger universe.
              </p>
            </div>

            <p className="absolute bottom-[2%] right-[1%] z-30 m-0 -rotate-[8deg] font-serif text-[2.8cqw] italic leading-tight text-black">
              Good founders
              <br />
              find good people.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Pillars() {
  return (
    <section aria-label="What you can do" className="border-y border-black/10 bg-[#f4f4f2]">
      <ul className={`${wrap} m-0 grid list-none grid-cols-1 p-0 sm:grid-cols-2 lg:grid-cols-4`}>
        {pillars.map(({ title, text, color, icon: Icon, fg, bare }, i) => (
          <li key={title} className={`flex items-center gap-4 py-6 lg:px-6 ${i ? 'lg:border-l lg:border-black/10' : 'lg:pl-0'}`}>
            {bare ? (
              <Icon size={44} weight="fill" aria-hidden style={{ color: fg }} className="shrink-0" />
            ) : (
              <span className="grid size-12 shrink-0 place-items-center rounded-full" style={{ background: color, color: fg }}>
                <Icon size={24} weight={title === 'Launch' ? 'bold' : 'fill'} aria-hidden />
              </span>
            )}
            <div>
              <h2 className="m-0 text-lg font-black uppercase tracking-tight">{title}</h2>
              <p className="m-0 mt-0.5 text-[13px] leading-snug text-[#444]">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Universe() {
  return (
    <section id="universe" aria-labelledby="universe-title" className="scroll-mt-16 bg-[#1e2618] py-10 text-white sm:py-12">
      <div className={`${wrap} grid gap-8 lg:grid-cols-12`}>
        <div className="lg:col-span-3">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[.08em] text-[#a4be2d]">Inside the universe</p>
          <h2 id="universe-title" className={`${display} mt-3 text-[clamp(34px,4vw,54px)]`}>
            Different paths. Same orbit.
          </h2>
          <svg aria-hidden viewBox="0 0 80 30" className="mt-6 h-8 w-20 text-white" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M2 24c10-4 14 4 22-2s8-12 18-8 12 12 30-4M66 6l8 4-5 7" />
          </svg>
          <p className="m-0 mt-4 max-w-[28ch] text-sm leading-snug text-white/85">
            Stories, tools, events and community to help you go from curious to in motion.
          </p>
        </div>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4">
          {paths.map(({ n, title, text, bg, fg, sub }) => (
            <li key={n}>
              <a href="#featured" style={{ background: bg, color: fg }} className={`group flex h-full flex-col rounded-xl p-4 no-underline ${focus}`}>
                <span className="text-xs font-medium">{n}</span>
                <div className="mt-2 aspect-[4/3] overflow-hidden rounded-md">
                  <Img className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="m-0 mt-3 text-xl font-black tracking-tight">{title}</h3>
                <div className="mt-1 flex flex-1 items-end justify-between gap-3">
                  <p className="m-0 text-[12.5px] leading-snug" style={{ color: sub }}>{text}</p>
                  <ArrowBtn dark={fg !== '#fff'} />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Featured() {
  return (
    <section id="featured" aria-labelledby="featured-title" className="scroll-mt-16 bg-[#f4f4f2] py-10 sm:py-12">
      <div className={`${wrap} grid gap-8 lg:grid-cols-12`}>
        <div className="lg:col-span-3">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[.08em] text-[#7c9318]">Featured editions</p>
          <h2 id="featured-title" className={`${display} mt-3 text-[clamp(30px,3.4vw,44px)]`}>
            Tools, stories and more for bolder builders.
          </h2>
          <Link to="/shop" className={`group mt-6 inline-flex h-11 items-center gap-3 rounded-full border-2 border-[#1e2618] px-6 text-sm font-semibold text-[#1e2618] no-underline transition hover:bg-[#1e2618] hover:text-white ${focus}`}>
            View All
            <ArrowRight size={16} weight="bold" aria-hidden />
          </Link>
        </div>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4">
          {editions.map(({ name, text, price, bg }) => (
            <li key={name}>
              <Link to="/shop" className={`group flex h-full flex-col rounded-xl border border-black/10 bg-white p-3 text-black no-underline transition hover:-translate-y-1 hover:shadow-xl ${focus}`}>
                <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-lg" style={{ background: bg }}>
                  <Img className="h-[88%] w-auto rounded-[3px] object-cover shadow-[0_12px_20px_rgba(0,0,0,.3)]" />
                </div>
                <h3 className="m-0 mt-3 text-[15px] font-bold leading-tight">{name}</h3>
                <p className="m-0 mt-0.5 text-[12.5px] text-[#666]">{text}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-base font-extrabold">{price}</span>
                  <ArrowBtn />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Journey() {
  return (
    <section aria-labelledby="journey-title" className="bg-[#1e2618] py-8 text-white sm:py-10">
      <div className={`${wrap} grid items-center gap-6 lg:grid-cols-12`}>
        <div className="lg:col-span-3">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[.08em] text-[#a4be2d]">Your journey</p>
          <h2 id="journey-title" className={`${display} mt-3 text-[clamp(32px,3.6vw,48px)]`}>
            From curiosity to impact.
          </h2>
          <p className="m-0 mt-3 text-sm leading-snug text-white/85">Different paths. Same destination. Here’s how it works.</p>
        </div>
        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4 lg:gap-0">
          {journey.map(({ title, text, bg, fg, icon: Icon }, i) => (
            <li key={title} className="relative">
              <div
                style={{
                  background: bg,
                  color: fg,
                  WebkitMask: 'radial-gradient(circle 9px at 0 50%,transparent 98%,#000) left/51% 100% no-repeat, radial-gradient(circle 9px at 100% 50%,transparent 98%,#000) right/51% 100% no-repeat',
                  mask: 'radial-gradient(circle 9px at 0 50%,transparent 98%,#000) left/51% 100% no-repeat, radial-gradient(circle 9px at 100% 50%,transparent 98%,#000) right/51% 100% no-repeat',
                }}
                className={`flex h-full min-h-[104px] flex-col justify-center gap-2 px-6 py-4 ${i === 0 ? 'lg:rounded-l-lg' : ''}`}
              >
                <h3 className="m-0 flex items-center gap-3 text-xl font-black uppercase tracking-tight">
                  <Icon size={26} aria-hidden />
                  {title}
                </h3>
                <p className="m-0 max-w-[24ch] text-[12.5px] leading-snug opacity-80">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section aria-labelledby="proof-title" className="bg-[#f4f4f2] py-8 sm:py-10">
      <div className={`${wrap} grid items-center gap-8 lg:grid-cols-12`}>
        <div className="flex flex-wrap items-center gap-5 lg:col-span-4">
          <div>
            <p className="m-0 text-[11px] font-bold uppercase tracking-[.08em] text-[#7c9318]">Founders say it best</p>
            <h2 id="proof-title" className={`${display} mt-2 text-[clamp(30px,3.2vw,42px)]`}>
              Real people.
              <br />
              Real progress.
            </h2>
          </div>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous testimonial" className={`grid size-9 place-items-center rounded-full border border-[#1e2618]/60 bg-transparent text-[#1e2618] transition hover:bg-[#1e2618] hover:text-white ${focus}`}>
              <CaretLeft size={16} weight="bold" />
            </button>
            <button type="button" aria-label="Next testimonial" className={`grid size-9 place-items-center rounded-full border border-[#1e2618]/60 bg-transparent text-[#1e2618] transition hover:bg-[#1e2618] hover:text-white ${focus}`}>
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </div>
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3 lg:col-span-8">
          {quotes.map(({ text, name, role }) => (
            <li key={name}>
              <blockquote className="m-0 text-[15px] font-medium leading-snug text-[#111]">“{text}”</blockquote>
              <div className="mt-4 flex items-center gap-3">
                <Img className="size-10 rounded-full object-cover" />
                <p className="m-0 text-xs leading-tight text-[#555]">
                  <strong className="block text-[13px] text-black">{name}</strong>
                  {role}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Footer() {
  const socials = [
    { label: 'X', icon: XLogo },
    { label: 'Instagram', icon: InstagramLogo },
    { label: 'YouTube', icon: YoutubeLogo },
    { label: 'LinkedIn', icon: LinkedinLogo },
    { label: 'Discord', icon: DiscordLogo },
  ]
  return (
    <footer className="bg-[#1e2618] py-8 text-white">
      <div className={`${wrap} grid items-center gap-8 lg:grid-cols-12`}>
        <div className="flex items-center gap-4 lg:col-span-3">
          <Logo />
          <p className="m-0 text-sm leading-tight text-white/90">
            A more curious
            <br />
            tomorrow.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs lg:col-span-2">
          {['About', 'Community', 'Stories', 'Resources', 'Programs', 'Shop'].map((l) => (
            <Link key={l} to={`/${l.toLowerCase()}`} className={`text-white/90 no-underline hover:text-[#a4be2d] ${focus}`}>{l}</Link>
          ))}
        </nav>
        <form onSubmit={(e) => e.preventDefault()} className="lg:col-span-4 lg:border-l lg:border-white/20 lg:pl-8">
          <label htmlFor="fv-email" className="mb-2 block text-xs font-semibold">Join the mission.</label>
          <div className="flex h-11 items-center rounded-full border border-white/50 pl-5 pr-1">
            <input id="fv-email" type="email" placeholder="your@email.com" className="min-w-0 flex-1 border-0 bg-transparent text-sm text-white outline-none placeholder:text-white/70" />
            <button type="submit" aria-label="Subscribe" className="grid size-9 place-items-center rounded-full bg-white text-[#1e2618] transition hover:bg-[#a4be2d]">
              <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        </form>
        <div className="flex flex-col gap-3 lg:col-span-3 lg:items-end">
          <ul className="m-0 flex list-none gap-4 p-0">
            {socials.map(({ label, icon: Icon }) => (
              <li key={label}>
                <a href="#" aria-label={label} className={`text-white no-underline hover:text-[#a4be2d] ${focus}`}>
                  <Icon size={20} weight="fill" />
                </a>
              </li>
            ))}
          </ul>
          <p className="m-0 text-[10px] text-white/70">Good founders find good people. © 2025 Founderverse.</p>
        </div>
      </div>
    </footer>
  )
}

export default function Founderverse() {
  useEffect(() => { document.title = 'Founderverse | Hashir Usman' }, [])

  return (
    <main id="main" className="overflow-x-clip bg-[#f4f4f2] text-black">
      <style>{CSS}</style>

      <header className="bg-[#f4f4f2]">
        <div className={`${wrap} flex items-center justify-between gap-6 pb-4 pt-14`}>
          <Logo />
        </div>
      </header>

      <Hero />
      <Pillars />
      <Universe />
      <Featured />
      <Journey />
      <Testimonials />
      <Footer />
    </main>
  )
}
