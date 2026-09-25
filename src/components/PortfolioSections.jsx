import { useState } from 'react'
import {
  ArrowUpRight,
  Brain,
  ChatCircleText,
  EnvelopeSimple,
  Funnel,
  InstagramLogo,
  LinkedinLogo,
  MapPin,
  Megaphone,
  PencilRuler,
  Phone,
  PresentationChart,
  RocketLaunch,
  SlidersHorizontal,
  Strategy,
  UsersThree,
  XLogo,
  YoutubeLogo,
} from '@phosphor-icons/react'
import './PortfolioSections.css'

const services = [
  {
    title: 'Venture Design',
    description: 'From idea to investable venture architecture.',
    icon: RocketLaunch,
    details: ['Clarify the opportunity and the customer it serves.', 'Shape a focused business model and value proposition.', 'Map the milestones from first idea to market.'],
  },
  {
    title: 'Brand Strategy',
    description: 'Positioning, identity & brand growth systems.',
    icon: Brain,
    details: ['Define your positioning and the audience that matters.', 'Build a clear brand story and messaging framework.', 'Connect your identity to a practical growth plan.'],
  },
  {
    title: 'Go-To-Market',
    description: 'Strategic GTM plans that drive traction.',
    icon: Strategy,
    details: ['Choose an initial audience and route to market.', 'Align your offer, pricing, and launch messaging.', 'Prioritize channels and set measurable launch milestones.'],
  },
  {
    title: 'Business Systems',
    description: 'Build scalable systems for sustainable growth.',
    icon: SlidersHorizontal,
    details: ['Map the workflows your business depends on.', 'Clarify responsibilities, handoffs, and decision points.', 'Design repeatable systems that support your next stage.'],
  },
  {
    title: 'Organizational Transformation',
    description: 'Align people, processes & performance.',
    icon: UsersThree,
    details: ['Identify where structure and goals need to align.', 'Define team responsibilities and a working rhythm.', 'Create a practical roadmap for organizational change.'],
  },
  {
    title: 'Marketing Strategy',
    description: 'Data-driven marketing that builds momentum.',
    icon: Megaphone,
    details: ['Understand the audience, market, and current channels.', 'Build a focused campaign and content direction.', 'Set useful measures to learn from each campaign.'],
  },
  {
    title: 'Investor Decks',
    description: 'Pitch decks that tell your story & win trust.',
    icon: PresentationChart,
    details: ['Shape a clear narrative around the opportunity.', 'Organize your business model, progress, and ambition.', 'Create a focused pitch with a clear investment ask.'],
  },
  {
    title: 'Lead Funnels',
    description: 'High-converting funnels that generate leads.',
    icon: Funnel,
    details: ['Map the journey from first visit to qualified enquiry.', 'Align your offer, landing page, and next step.', 'Define follow-ups and the signals worth measuring.'],
  },
  {
    title: 'Content Strategy',
    description: 'Content that builds brand, trust & authority.',
    icon: ChatCircleText,
    details: ['Choose content themes connected to your expertise.', 'Build an editorial plan for your audience and channels.', 'Create a consistent voice and publishing workflow.'],
  },
  {
    title: 'Process Design',
    description: 'Streamline operations with smart processes.',
    icon: PencilRuler,
    details: ['Document how work moves through your business.', 'Identify bottlenecks and simplify unnecessary steps.', 'Create clear processes your team can use and improve.'],
  },
]

const ventures = [
  { name: 'Moonbliss', className: 'moonbliss' },
  { name: 'Kesha', className: 'kesha' },
  { name: 'sol.', className: 'sol' },
  { name: 'Bare Logic', className: 'bare-logic' },
  { name: 'Aii', className: 'aii' },
  { name: 'Nothing Else', className: 'nothing-else' },
]

export function Services({ onSelect }) {
  return (
    <section className="services-section" id="services" aria-labelledby="services-heading">
      <div className="services-intro">
        <p className="services-eyebrow">What I Do</p>
        <h2 id="services-heading">Strategy. Systems. Growth.<br />All under one roof.</h2>
      </div>
      <div className="services-grid">
        {services.map(({ icon: Icon, ...service }) => (
          <button
            className="services-card"
            type="button"
            key={service.title}
            onClick={() => onSelect(service)}
            aria-haspopup="dialog"
          >
            <Icon className="services-icon" size={23} weight="light" aria-hidden="true" />
            <span className="services-copy">
              <span className="services-title">{service.title}</span>
              <span className="services-description">{service.description}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

function VentureWordmark({ name, className }) {
  if (className === 'bare-logic') return <span>Bare<br />Logic</span>
  if (className === 'nothing-else') return <span>Nothing<br />Else</span>
  if (className === 'sol') return <span>sol<span className="venture-sol-period">.</span></span>
  if (className === 'aii') return <span>A<span className="venture-aii-letters">ii</span></span>
  return <span>{name}</span>
}

export function Ventures({ onSelect, onViewAll }) {
  return (
    <section className="venture-section" id="ventures" aria-labelledby="venture-heading">
      <div className="venture-intro">
        <p className="venture-eyebrow">Featured Ventures</p>
        <h2 id="venture-heading">Brands. Built with<br />purpose &amp; passion.</h2>
        <button type="button" className="venture-all" onClick={onViewAll}>
          View all ventures <ArrowUpRight size={15} aria-hidden="true" />
        </button>
      </div>
      <div className="venture-grid">
        {ventures.map((venture) => (
          <button
            type="button"
            className={`venture-wordmark venture-${venture.className}`}
            onClick={() => onSelect(venture)}
            aria-label={`View ${venture.name}`}
            key={venture.name}
          >
            <VentureWordmark {...venture} />
          </button>
        ))}
      </div>
    </section>
  )
}

export function Footer({ portraitSrc, onAboutClick }) {
  const [email, setEmail] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState('')

  function requestUpdates(event) {
    event.preventDefault()
    const subject = encodeURIComponent('Keep me updated')
    const body = encodeURIComponent(`Hi Hashir,\n\nI'd like to receive your updates on strategy, growth, and ventures.\n\nMy email: ${email}\n`)
    window.location.href = `mailto:connect@hashirusman.online?subject=${subject}&body=${body}`
    setNewsletterMessage('Send the email draft to request updates.')
  }

  return (
    <footer className="footer-section" id="contact" aria-label="About and contact Hashir">
      <div className="footer-portrait-wrap" aria-hidden="true">
        <img className="footer-portrait" src={portraitSrc} srcSet="/images/hashir-portrait-small.webp 480w, /images/hashir-portrait-medium.webp 800w" sizes="270px" width="1120" height="1400" alt="" loading="lazy" />
      </div>
      <div className="footer-about" id="about">
        <h2>About Hashir</h2>
        <p>I partner with founders, startups, and businesses to design what’s next. With 5+ years of experience across strategy, brand, systems, and growth, I turn ideas into scalable, investable, and impactful ventures.</p>
        <button className="footer-about-link" type="button" onClick={onAboutClick}>
          More about me <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </div>
      <address className="footer-contact">
        <a href="tel:+917789800898"><Phone size={18} weight="light" aria-hidden="true" /><span>+91 77 898 00 898</span></a>
        <a href="mailto:connect@hashirusman.online"><EnvelopeSimple size={18} weight="light" aria-hidden="true" /><span>connect@hashirusman.online</span></a>
        <span className="footer-location"><MapPin size={18} weight="light" aria-hidden="true" /><span>Bengaluru, India</span></span>
      </address>
      <div className="footer-newsletter">
        <h2>Let’s build what’s next.</h2>
        <p>Insights on strategy, growth &amp; ventures.<br />Straight to your inbox.</p>
        <form onSubmit={requestUpdates} className="footer-newsletter-form">
          <label className="footer-visually-hidden" htmlFor="newsletter-email">Your email address</label>
          <input id="newsletter-email" name="email" type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          <button type="submit">Subscribe <ArrowUpRight size={13} aria-hidden="true" /></button>
        </form>
        {newsletterMessage && <p className="footer-newsletter-message" role="status">{newsletterMessage}</p>}
        <div className="footer-socials" aria-label="Social profiles">
          <span role="img" aria-label="LinkedIn profile coming soon" title="LinkedIn profile coming soon"><LinkedinLogo size={17} weight="fill" aria-hidden="true" /></span>
          <span role="img" aria-label="X profile coming soon" title="X profile coming soon"><XLogo size={16} aria-hidden="true" /></span>
          <span role="img" aria-label="Instagram profile coming soon" title="Instagram profile coming soon"><InstagramLogo size={16} aria-hidden="true" /></span>
          <span role="img" aria-label="YouTube profile coming soon" title="YouTube profile coming soon"><YoutubeLogo size={16} weight="fill" aria-hidden="true" /></span>
        </div>
      </div>
    </footer>
  )
}
