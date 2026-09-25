import { useEffect } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Ventures.css'

const ventures = [
  { name: 'Moonbliss',    cls: 'moonbliss',    category: 'Wellness',         year: '2020', desc: 'A complete wellness brand built from the ground up — positioning, identity, digital presence, and go-to-market strategy. Moonbliss combines ritual and science to bring calm to the everyday.' },
  { name: 'Kesha',        cls: 'kesha',        category: 'Lifestyle',         year: '2021', desc: 'Brand identity and social media presence crafted for a lifestyle label targeting modern urban women. Kesha is built on self-expression, colour, and community.' },
  { name: 'sol.',         cls: 'sol',          category: 'Consumer Goods',    year: '2021', desc: 'Go-to-market plan and brand systems designed for a consumer goods venture with a deep focus on sustainability and conscious living.' },
  { name: 'Bare Logic',   cls: 'bare-logic',   category: 'Skincare',          year: '2022', desc: 'Investor narrative and brand positioning developed for a science-backed skincare startup. Bare Logic strips away the noise and delivers what your skin actually needs.' },
  { name: 'Aii',          cls: 'aii',          category: 'Technology',        year: '2023', desc: 'Venture architecture, business systems, and growth strategy built for an AI-first technology company. Aii is where intelligence meets real-world application.' },
  { name: 'Nothing Else', cls: 'nothing-else', category: 'Creative Studio',   year: '2023', desc: 'Brand strategy and content ecosystem for a creative studio focused on minimalism and craft. Nothing Else is deliberate, quiet, and intentional.' },
]

function Wordmark({ name, cls }) {
  if (cls === 'bare-logic')   return <span>Bare<br />Logic</span>
  if (cls === 'nothing-else') return <span>Nothing<br />Else</span>
  if (cls === 'sol')          return <span>sol<span className="sol-period">.</span></span>
  if (cls === 'aii')          return <span>A<span className="aii-letters">ii</span></span>
  return <span>{name}</span>
}

export default function Ventures({ onSelect, onBookCall }) {
  useScrollReveal()

  useEffect(() => {
    document.title = 'Ventures | Hashir Usman'
  }, [])

  return (
    <main id="main" className="ventures-page">

      {/* ── Hero ── */}
      <section className="ventures-hero" aria-labelledby="ventures-hero-title">
        <div data-reveal>
          <span className="eyebrow">Featured Ventures</span>
          <h1 id="ventures-hero-title" className="ventures-hero-title">
            Brands. Built with<br />purpose &amp; passion.
          </h1>
          <p className="ventures-hero-desc">
            Six ventures across wellness, lifestyle, technology, and consumer goods.
            Each one built with strategy, systems, and soul.
          </p>
        </div>
      </section>

      {/* ── Venture Cards ── */}
      <div className="ventures-list" role="list">
        {ventures.map((v, i) => (
          <article
            key={v.name}
            role="listitem"
            className={`venture-entry venture-entry--${i % 2 === 0 ? 'left' : 'right'}`}
            data-reveal
            data-delay={1}
          >
            <button
              className={`venture-entry-logo venture-bg-${v.cls}`}
              onClick={() => onSelect(v)}
              aria-label={`View ${v.name}`}
            >
              <Wordmark {...v} />
            </button>
            <div className="venture-entry-body">
              <div className="venture-entry-meta">
                <span className="pill">{v.category}</span>
                <span className="venture-entry-year">{v.year}</span>
              </div>
              <h2>{v.name}</h2>
              <p>{v.desc}</p>
              <button className="btn btn-sm" onClick={() => onSelect(v)} style={{ marginTop: 20 }}>
                Learn more <ArrowUpRight size={14} aria-hidden />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* ── CTA ── */}
      <section className="ventures-cta" data-reveal aria-labelledby="ventures-cta-heading">
        <span className="eyebrow">Want to be next?</span>
        <h2 id="ventures-cta-heading">Let's architect<br />your venture.</h2>
        <button className="btn btn-primary" onClick={onBookCall}>
          Book a Call <ArrowUpRight size={17} aria-hidden />
        </button>
      </section>

    </main>
  )
}
