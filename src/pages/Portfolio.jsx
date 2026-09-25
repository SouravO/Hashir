import { useEffect } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import VenturesSection from '../components/sections/VenturesSection'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Portfolio.css'

const caseStudies = [
  {
    name: 'Moonbliss',
    category: 'Wellness Brand',
    desc: 'Built a complete wellness brand from the ground up — positioning, identity, digital presence, and go-to-market strategy.',
    tags: ['Brand Strategy', 'Go-To-Market', 'Content'],
    cls: 'moonbliss',
  },
  {
    name: 'Kesha',
    category: 'Lifestyle Brand',
    desc: 'Shaped the brand identity and social media presence for a lifestyle label targeting modern urban women.',
    tags: ['Brand Identity', 'Social Media', 'Marketing'],
    cls: 'kesha',
  },
  {
    name: 'sol.',
    category: 'Consumer Brand',
    desc: 'Designed the go-to-market plan and brand systems for a consumer goods venture with a focus on sustainability.',
    tags: ['Venture Design', 'GTM', 'Brand'],
    cls: 'sol',
  },
  {
    name: 'Bare Logic',
    category: 'Skincare Brand',
    desc: 'Crafted the investor narrative and brand positioning for a science-backed skincare startup.',
    tags: ['Investor Deck', 'Brand Strategy', 'Positioning'],
    cls: 'bare-logic',
  },
  {
    name: 'Aii',
    category: 'Tech Venture',
    desc: 'Architected the venture model, business systems, and growth strategy for an AI-first technology company.',
    tags: ['Venture Design', 'Business Systems', 'Growth'],
    cls: 'aii',
  },
  {
    name: 'Nothing Else',
    category: 'Creative Studio',
    desc: 'Built the brand strategy and content ecosystem for a creative studio focused on minimalism and craft.',
    tags: ['Content Strategy', 'Brand', 'Process Design'],
    cls: 'nothing-else',
  },
]

function CaseStudyCard({ name, category, desc, tags, cls, onSelect }) {
  return (
    <article
      className={`case-card case-${cls}`}
      data-reveal
    >
      <div className="case-card-brand" aria-hidden>
        <span className={`case-wordmark venture-${cls}`}>{name}</span>
      </div>
      <div className="case-card-body">
        <span className="eyebrow">{category}</span>
        <h3>{name}</h3>
        <p>{desc}</p>
        <div className="case-tags">
          {tags.map((t) => <span key={t} className="pill">{t}</span>)}
        </div>
        <button className="btn btn-sm" onClick={() => onSelect({ name, cls })} style={{ marginTop: 16 }}>
          View Details <ArrowUpRight size={14} aria-hidden />
        </button>
      </div>
    </article>
  )
}

export default function Portfolio({ onVentureSelect, onViewAll, onBookCall }) {
  useScrollReveal()

  useEffect(() => {
    document.title = 'Portfolio | Hashir Usman'
  }, [])

  return (
    <main id="main" className="portfolio-page">

      {/* ── Hero ── */}
      <section className="portfolio-hero" aria-labelledby="portfolio-hero-title">
        <div data-reveal>
          <span className="eyebrow">The Portfolio</span>
          <h1 id="portfolio-hero-title" className="portfolio-hero-title">
            Purpose meets<br />possibility.
          </h1>
          <p className="portfolio-hero-desc">
            Six ventures. Each built with intention — from strategy and brand to systems and growth.
            This is what it looks like when ideas meet execution.
          </p>
        </div>
      </section>

      {/* ── Ventures Strip ── */}
      <VenturesSection onSelect={onVentureSelect} onViewAll={onViewAll} />

      {/* ── Case Studies ── */}
      <section className="case-studies" aria-labelledby="case-studies-heading">
        <div className="case-studies-intro" data-reveal>
          <span className="eyebrow">Case Studies</span>
          <h2 id="case-studies-heading" className="section-heading">Behind the brand.</h2>
        </div>
        <div className="case-studies-grid">
          {caseStudies.map((cs) => (
            <CaseStudyCard key={cs.name} {...cs} onSelect={onVentureSelect} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="portfolio-cta" data-reveal aria-labelledby="portfolio-cta-heading">
        <span className="eyebrow">Want results like these?</span>
        <h2 id="portfolio-cta-heading">Let's build<br />your next venture.</h2>
        <button className="btn btn-primary" onClick={onBookCall}>
          Book a Call <ArrowUpRight size={17} aria-hidden />
        </button>
      </section>

    </main>
  )
}
