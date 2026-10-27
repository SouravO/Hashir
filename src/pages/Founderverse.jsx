import { useEffect } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const wrap = 'mx-auto w-full max-w-[1320px] px-5 sm:px-8 xl:px-10'
const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a4be2d]'

const ideas = [
  { no: '01', title: 'Find the signal', text: 'Start with the opportunity, the people it serves, and the problem worth solving.' },
  { no: '02', title: 'Build the structure', text: 'Turn the idea into a clear model, a distinctive position, and a plan people can act on.' },
  { no: '03', title: 'Move with intent', text: 'Connect strategy to the systems and decisions that carry a venture forward.' },
]

export default function Founderverse() {
  useEffect(() => { document.title = 'Founderverse | Hashir Usman' }, [])

  return (
    <main id="main" className="overflow-hidden bg-[#f8f9f6] text-[#171a17]">
      <section className="relative isolate overflow-hidden bg-[#101310] py-16 text-white sm:py-24 lg:py-32" aria-labelledby="founderverse-title">
        <div aria-hidden className="absolute -right-28 -top-36 -z-10 size-[min(75vw,900px)] rounded-full border border-[#a4be2d]/25 sm:-right-20 sm:-top-64">
          <div className="absolute inset-[12%] rounded-full border border-[#a4be2d]/20" />
          <div className="absolute inset-[26%] rounded-full border border-[#a4be2d]/15" />
          <span className="absolute left-[22%] top-[43%] size-3 rounded-full bg-[#a4be2d] shadow-[0_0_35px_12px_#a4be2d40]" />
        </div>
        <div className={wrap}>
          <p className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.18em] text-[#a4be2d] before:h-px before:w-8 before:bg-[#a4be2d]">A world for what’s next</p>
          <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <h1 id="founderverse-title" className="max-w-[11ch] text-[clamp(56px,10vw,144px)] font-extrabold leading-[.86] tracking-[-.075em]">Founder<span className="text-[#a4be2d]">verse</span></h1>
            </div>
            <div className="pb-2 lg:col-span-4">
              <p className="max-w-[42ch] text-base leading-[1.8] text-[#d0d6cc] sm:text-lg">For people turning ambitious ideas into real ventures. Find clarity, shape the work, and build what comes next with intention.</p>
              <a href="#approach" className={`mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#a4be2d] px-6 text-sm font-semibold text-[#101310] no-underline transition-colors hover:bg-white ${focus}`}>Explore the approach<ArrowDown size={17} aria-hidden /></a>
            </div>
          </div>
          <div aria-hidden className="mt-14 h-px bg-white/15 sm:mt-20" />
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-[#aeb8a8] sm:text-sm"><span>Ideas need more than inspiration.</span><span>They need a way forward.</span></div>
        </div>
      </section>

      <section id="approach" aria-labelledby="approach-title" className="scroll-mt-20 py-16 sm:py-24 lg:py-32">
        <div className={wrap}>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[.16em] text-[#617319]">The Founderverse mindset</p>
              <h2 id="approach-title" className="max-w-[11ch] text-[clamp(40px,6vw,78px)] font-extrabold leading-[.94] tracking-[-.06em]">Make the next move matter.</h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
              <p className="max-w-[58ch] text-lg leading-[1.8] text-[#4a4f47]">Building a venture can feel like a hundred competing decisions. Founderverse brings the focus back to what matters: the opportunity, the people, and the choices that turn a promising idea into something built to last.</p>
            </div>
          </div>

          <div className="mt-14 grid border-y border-[#d9ddd1] sm:mt-20 lg:grid-cols-3 lg:divide-x lg:divide-[#d9ddd1]">
            {ideas.map((item) => (
              <article key={item.no} className="py-8 first:pt-8 last:pb-8 sm:py-10 lg:px-8 lg:first:pl-0 lg:last:pr-0">
                <span className="text-xs font-bold tabular-nums text-[#7c9318]">{item.no}</span>
                <h3 className="mt-8 text-2xl font-bold tracking-[-.04em] sm:text-3xl">{item.title}</h3>
                <p className="mt-3 max-w-[38ch] text-[15px] leading-[1.75] text-[#596054]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="founderverse-cta" className="bg-[#e9eddf] py-16 sm:py-24">
        <div className={`${wrap} grid items-end gap-8 lg:grid-cols-12`}>
          <div className="lg:col-span-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[.16em] text-[#617319]">Your idea, in motion</p>
            <h2 id="founderverse-cta" className="max-w-[13ch] text-[clamp(38px,6vw,76px)] font-extrabold leading-[.95] tracking-[-.06em]">The next chapter starts with a conversation.</h2>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 lg:col-span-4 lg:justify-end">
            <Link to="/contact" className={`group inline-flex min-h-14 items-center gap-3 rounded-full bg-[#a4be2d] px-6 text-sm font-semibold text-[#101310] no-underline transition-colors hover:bg-white ${focus}`}>Start a conversation<ArrowRight size={18} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" /></Link>
            <Link to="/ventures" className={`inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#30372c] no-underline hover:text-[#617319] ${focus}`}>See the ventures<ArrowUpRight size={16} aria-hidden /></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
