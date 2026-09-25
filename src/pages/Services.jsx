import { useEffect } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import ServicesSection from '../components/sections/ServicesSection'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Services.css'

const process = [
  { step: '01', title: 'Discovery',    desc: 'We start with a focused conversation to understand your business, goals, and the challenge you want to solve.' },
  { step: '02', title: 'Strategy',     desc: 'I develop a tailored strategy framework — clear, actionable, and built around your unique context.' },
  { step: '03', title: 'Build',        desc: 'We implement the plan together: brand systems, growth levers, operational processes, or investor materials.' },
  { step: '04', title: 'Iterate',      desc: 'I stay involved to refine and adapt as your business evolves. Strategy is never a one-time event.' },
]

export default function Services({ onServiceSelect, onBookCall }) {
  useScrollReveal()

  useEffect(() => {
    document.title = 'Services | Hashir Usman'
  }, [])

  return (
    <main id="main" className="services-page">

      {/* ── Page Hero ── */}
      <section className="services-hero" aria-labelledby="services-hero-title">
        <div data-reveal>
          <span className="eyebrow">What I Do</span>
          <h1 id="services-hero-title" className="services-hero-title">
            Strategy. Systems.<br />Growth.
          </h1>
          <p className="services-hero-desc">
            From venture design to investor decks — every engagement is built around execution,
            not just ideas. I work with founders and businesses to build the systems that stick.
          </p>
          <button className="btn btn-primary" onClick={onBookCall}>
            Book a Call <ArrowUpRight size={17} aria-hidden />
          </button>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <ServicesSection onSelect={onServiceSelect} compact />

      {/* ── Process ── */}
      <section className="process-section" aria-labelledby="process-heading">
        <div className="process-intro" data-reveal>
          <span className="eyebrow">How It Works</span>
          <h2 id="process-heading" className="section-heading">A simple, structured<br />process to get things done.</h2>
        </div>
        <div className="process-grid">
          {process.map(({ step, title, desc }, i) => (
            <div key={step} className="process-card" data-reveal data-delay={i + 1}>
              <span className="process-step">{step}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="services-cta" data-reveal aria-labelledby="services-cta-heading">
        <h2 id="services-cta-heading">Ready to build<br />something real?</h2>
        <p>Let's talk about what you're working on and see if we're a good fit.</p>
        <button className="btn btn-primary" onClick={onBookCall}>
          Book a Call <ArrowUpRight size={17} aria-hidden />
        </button>
      </section>

    </main>
  )
}
