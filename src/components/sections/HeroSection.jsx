import { ArrowDown, ArrowUpRight } from '@phosphor-icons/react'
import './HeroSection.css'

const portrait = '/images/hashir-portrait.webp'
const metrics = [
  ['20+', 'Social Media Profiles', 'Designed & Managed'],
  ['30+', 'Venture & Business', 'Transformations'],
  ['5+',  'Domains of',          'Experience'],
  ['20+', 'Business & Startup',  'Plans Delivered'],
]

export default function HeroSection({ onBookCall }) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      {/* Copy */}
      <div className="hero-copy">
        <div className="hero-intro">
          <span>Hashir Usman</span>
          <p>Venture Architect <b>·</b> Business Consultant</p>
        </div>
        <h1 id="hero-title">
          Hello.<br />I'm Hashir.
        </h1>
        <p className="hero-desc">
          I build ventures through strategy,<br />
          systems, brand, and execution.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onBookCall}>
            Book a Call <ArrowUpRight size={18} aria-hidden />
          </button>
          <a className="btn btn-outline" href="/portfolio">
            View Portfolio <ArrowUpRight size={18} aria-hidden />
          </a>
        </div>
        <a className="scroll-cue" href="#services">
          Scroll down <ArrowDown size={17} aria-hidden />
        </a>
      </div>

      {/* Visual */}
      <div className="hero-visual" aria-hidden>
        <div className="portrait-backdrop" />
        <img
          className="hero-portrait"
          src={portrait}
          srcSet="/images/hashir-portrait-small.webp 480w, /images/hashir-portrait-medium.webp 800w, /images/hashir-portrait.webp 1120w"
          sizes="(max-width:767px) 94vw, 52vw"
          width="1120" height="1400"
          alt=""
          fetchPriority="high"
        />
      </div>

      {/* Metrics */}
      <div className="metrics" aria-label="Experience in numbers">
        {metrics.map(([num, l1, l2]) => (
          <div className="metric" key={l1}>
            <strong>{num}</strong>
            <p>{l1}<br />{l2}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
