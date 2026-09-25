import { useEffect } from 'react'
import { ArrowUpRight, MapPin, Trophy, Briefcase, Users } from '@phosphor-icons/react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './About.css'

const portrait = '/images/hashir-portrait.webp'

const timeline = [
  { year: '2019', title: 'Started the journey', desc: 'Began working with early-stage startups on brand strategy and go-to-market planning.' },
  { year: '2020', title: 'First venture launch', desc: 'Co-architected Moonbliss — a wellness brand built from the ground up with strategy and systems.' },
  { year: '2021', title: 'Expanded to 3 domains', desc: 'Extended expertise into organizational transformation and business systems design.' },
  { year: '2022', title: 'Investor deck mastery', desc: 'Delivered 10+ investor-ready pitch decks across consumer, SaaS, and services verticals.' },
  { year: '2023', title: 'Portfolio scales to 6 ventures', desc: 'Built and supported six distinct brand ventures spanning beauty, wellness, and tech.' },
  { year: '2024', title: 'Business consulting practice', desc: 'Formalized practice serving growth-stage businesses alongside founders and leadership teams.' },
]

const values = [
  { icon: Trophy,   title: 'Clarity over complexity', desc: 'I simplify the hard stuff — strategy, systems, and brand — so you can focus on building.' },
  { icon: Briefcase,title: 'Execution-first',          desc: 'Every engagement results in a plan you can actually act on, not just ideas.' },
  { icon: Users,    title: 'Partnership mindset',      desc: 'I work alongside you, not above you. Your success is the only measure of mine.' },
]

export default function About({ onBookCall, onContact }) {
  useScrollReveal()

  useEffect(() => {
    document.title = 'About | Hashir Usman'
  }, [])

  return (
    <main id="main" className="about-page">
      {/* ── Hero ── */}
      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="about-hero-copy" data-reveal>
          <span className="eyebrow">Meet Hashir</span>
          <h1 id="about-hero-title">A partner in<br />your next chapter.</h1>
          <p>
            I'm Hashir Usman — a venture architect and business consultant based in Bengaluru, India.
            I partner with founders, startups, and businesses to design what's next.
          </p>
          <div className="about-hero-meta">
            <span><MapPin size={15} weight="light" aria-hidden /> Bengaluru, India</span>
            <span>5+ Years Experience</span>
          </div>
          <div className="about-hero-actions">
            <button className="btn btn-primary" onClick={onBookCall}>
              Book a Call <ArrowUpRight size={17} aria-hidden />
            </button>
            <button className="btn" onClick={() => onContact()}>
              Get in Touch <ArrowUpRight size={17} aria-hidden />
            </button>
          </div>
        </div>
        <div className="about-hero-visual" aria-hidden>
          <div className="about-portrait-bg" />
          <img
            src={portrait}
            srcSet="/images/hashir-portrait-small.webp 480w, /images/hashir-portrait-medium.webp 800w, /images/hashir-portrait.webp 1120w"
            sizes="(max-width:767px) 90vw, 42vw"
            width="1120" height="1400"
            alt=""
            fetchPriority="high"
            className="about-portrait"
          />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="about-stats" aria-label="Achievements">
        {[
          ['20+', 'Social Media Profiles Designed & Managed'],
          ['30+', 'Venture & Business Transformations'],
          ['5+',  'Domains of Experience'],
          ['20+', 'Business & Startup Plans Delivered'],
        ].map(([num, label]) => (
          <div key={label} className="about-stat" data-reveal>
            <strong>{num}</strong>
            <p>{label}</p>
          </div>
        ))}
      </section>

      {/* ── Story ── */}
      <section className="about-story" aria-labelledby="story-heading">
        <div className="about-story-copy" data-reveal>
          <span className="eyebrow">The Story</span>
          <h2 id="story-heading" className="section-heading">Building what's next,<br />one venture at a time.</h2>
          <p>
            With 5+ years across strategy, brand, systems, and growth, I've worked with founders at the earliest stages
            and helped established businesses find their next chapter. My work sits at the intersection of ideas and execution
            — turning ambition into something investable, scalable, and real.
          </p>
          <p>
            I don't just consult — I architect. Every engagement is a partnership, and every plan is built to be acted on.
          </p>
        </div>
        <div className="about-timeline" role="list">
          {timeline.map((item, i) => (
            <div key={item.year} className="timeline-item" role="listitem" data-reveal data-delay={Math.min(i + 1, 5)}>
              <span className="timeline-year">{item.year}</span>
              <div className="timeline-body">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section className="about-values" aria-labelledby="values-heading">
        <div data-reveal>
          <span className="eyebrow">How I Work</span>
          <h2 id="values-heading" className="section-heading">Principles that<br />guide every engagement.</h2>
        </div>
        <div className="values-grid">
          {values.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="value-card" data-reveal data-delay={i + 1}>
              <div className="value-icon"><Icon size={26} weight="light" aria-hidden /></div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta" data-reveal aria-labelledby="cta-heading">
        <span className="eyebrow">Ready to start?</span>
        <h2 id="cta-heading">Let's build<br />what's next.</h2>
        <p>Whether you're a founder with an idea or a business ready for its next chapter — I'd love to hear about it.</p>
        <button className="btn btn-primary" onClick={onBookCall}>
          Book a Call <ArrowUpRight size={17} aria-hidden />
        </button>
      </section>
    </main>
  )
}
