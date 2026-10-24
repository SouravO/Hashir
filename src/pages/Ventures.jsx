import { useEffect } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const ventures = [
  { name: 'Moonbliss', category: 'Wellness', year: '2020', mark: 'bg-[#443b68] text-[#e8dfef] text-[26px] tracking-[-.6px]', challenge: 'Build a wellness brand from the ground up.', strategy: 'Position the brand around the combination of ritual and science.', execution: 'Develop positioning, identity, digital presence, and go-to-market strategy.', results: 'A complete wellness brand. No further outcome metrics are documented in the portfolio.' },
  { name: 'Kesha', category: 'Lifestyle', year: '2021', mark: 'bg-[#f2d9d7] text-[#2a1617] text-[28px]', challenge: 'Establish a clear identity and social presence for a lifestyle label.', strategy: 'Focus the brand on self-expression, colour, and community for modern urban women.', execution: 'Shape the brand identity and social media presence.', results: 'A defined identity and social media presence. No further outcome metrics are documented in the portfolio.' },
  { name: 'sol.', category: 'Consumer Goods', year: '2021', mark: 'bg-[#133629] text-[#efd5b7] font-sans text-[52px] max-[1024px]:text-[40px] font-medium tracking-[-2px]', challenge: 'Prepare a consumer goods venture for market with a sustainability focus.', strategy: 'Build the go-to-market plan around conscious living.', execution: 'Design the go-to-market plan and brand systems.', results: 'A go-to-market plan and brand systems. No further outcome metrics are documented in the portfolio.' },
  { name: 'Bare Logic', category: 'Skincare', year: '2022', mark: 'bg-[#f0eeef] text-[#191719] text-[34px] tracking-[-1px]', challenge: 'Clarify the story of a science-backed skincare startup.', strategy: 'Develop investor narrative and brand positioning.', execution: 'Create an investor narrative and positioning for the brand.', results: 'Investor narrative and brand positioning. No further outcome metrics are documented in the portfolio.' },
  { name: 'Aii', category: 'Technology', year: '2023', mark: 'bg-[#020403] text-[#f7f7f5] font-[Arial] text-[52px] max-[1024px]:text-[40px] italic font-medium tracking-[-4px]', challenge: 'Create a business foundation for an AI-first technology company.', strategy: 'Connect the venture model, systems, and growth strategy.', execution: 'Architect the venture model, business systems, and growth strategy.', results: 'A venture model, business systems, and growth strategy. No further outcome metrics are documented in the portfolio.' },
  { name: 'Nothing Else', category: 'Creative Studio', year: '2023', mark: 'bg-[#d9d6d7] text-[#242124] text-[26px] tracking-[-.7px]', challenge: 'Give a creative studio a clear brand and content direction.', strategy: 'Emphasize minimalism and craft.', execution: 'Build the brand strategy and content ecosystem.', results: 'A brand strategy and content ecosystem. No further outcome metrics are documented in the portfolio.' },
]

const steps = ['challenge', 'strategy', 'execution', 'results']
const reveal = 'opacity-0 translate-y-5 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:opacity-100 motion-reduce:translate-y-0'
const delays = ['delay-[80ms]', 'delay-[160ms]', 'delay-[240ms]']

export default function Ventures() {
  useEffect(() => {
    document.title = 'Ventures | Hashir Usman'
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-y-5')
        entry.target.classList.add('opacity-100', 'translate-y-0')
        observer.unobserve(entry.target)
      }
    }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <main id="main" className="mx-auto max-w-[1200px] px-7 pb-[60px] max-[768px]:px-[18px]">
      <section className="py-[52px] pb-10 max-[768px]:pt-9" aria-labelledby="ventures-title"><div data-reveal className={reveal}><span className="mb-3.5 inline-block text-[11px] font-semibold tracking-[.2px] text-[#617319]">Selected Ventures</span><h1 id="ventures-title" className="mb-[22px] text-[clamp(48px,6vw,84px)] font-extrabold leading-[.96] tracking-[-.065em] text-[#809719] max-[768px]:text-[clamp(42px,11vw,62px)]">Ideas shaped<br />into ventures.</h1><p className="max-w-[500px] text-base leading-[1.65] tracking-[-.3px] text-[#3a3e36]">A selection of work across wellness, lifestyle, consumer goods, skincare, technology, and creative services.</p></div></section>

      <div className="flex flex-col gap-5">{ventures.map((venture, index) => <article key={venture.name} data-reveal className={`${reveal} ${delays[index % 3]} grid grid-cols-[300px_1fr] items-center gap-10 rounded-2xl border border-[#e7e9e2] bg-[#f8f9f6] p-9 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_#10200818] max-[1024px]:grid-cols-[220px_1fr] max-[1024px]:gap-7 max-[1024px]:p-[26px] max-[768px]:grid-cols-1 max-[768px]:gap-5 max-[768px]:p-[22px]`}>
          <div className={`grid h-[180px] place-items-center rounded-xl font-serif transition-transform duration-200 hover:scale-[1.02] hover:brightness-105 max-[1024px]:h-[150px] max-[768px]:h-[130px] ${venture.mark}`} aria-hidden>{venture.name}</div>
          <div>
            <div className="mb-3 flex items-center gap-2.5"><span className="inline-flex items-center rounded-full border border-[#d0d8b8] bg-[#eef3dc] px-3 py-1 text-[11px] font-medium text-[#4a5a18]">{venture.category}</span><span className="text-[11px] text-[#72766f]">{venture.year}</span></div>
            <h2 className="mb-3 text-[32px] font-extrabold tracking-[-1.2px] max-[768px]:text-[26px]">{venture.name}</h2>
            <p className="mb-[18px] max-w-[520px] text-[15px] leading-[1.65] text-[#72766f]">{venture.execution}</p>
            <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3.5 max-[768px]:grid-cols-1 max-[768px]:gap-3">{steps.map((step) => <div key={step} className="border-t border-[#e7e9e2] pt-3"><dt className="mb-1.5 text-[10px] font-bold uppercase tracking-[.06em] text-[#7c9318]">{step}</dt><dd className="m-0 text-xs leading-[1.55] text-[#72766f]">{venture[step]}</dd></div>)}</dl>
          </div>
        </article>)}</div>

      <section data-reveal className={`${reveal} mt-16 rounded-2xl bg-[#171a1b] px-14 py-[52px] text-center text-white max-[768px]:px-[22px] max-[768px]:py-10`}><span className="mb-3 inline-block text-[11px] font-semibold text-[#a4be2d]">Building something?</span><h2 className="mb-7 text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.06] tracking-[-2px]">Let's architect<br />your next venture.</h2><Link className="inline-flex min-h-11 items-center justify-center gap-3 rounded border border-[#a4be2d] bg-[#a4be2d] px-[22px] text-xs font-semibold text-[#1e2618] no-underline transition-colors hover:bg-[#b3cc35]" to="/contact">Start a conversation <ArrowUpRight size={17} aria-hidden /></Link></section>
    </main>
  )
}
