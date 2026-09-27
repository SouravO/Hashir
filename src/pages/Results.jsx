import { useEffect } from 'react'
import { ArrowUpRight, Star, Quotes } from '@phosphor-icons/react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Results.css'

const testimonials = [
  {
    id: 1,
    name: 'Priya Nair',
    role: 'Founder, Moonbliss',
    quote: 'Hashir didn\'t just build us a brand — he built us a business. The clarity he brought to our positioning and go-to-market was transformational. Six months after launch, we had 10,000+ followers and our first wholesale deal.',
    rating: 5,
    outcome: '10k+ followers in 6 months',
    category: 'Brand & GTM',
    featured: true,
  },
  {
    id: 2,
    name: 'Aditya Sharma',
    role: 'CEO, Aii Technologies',
    quote: 'We were a tech team that couldn\'t articulate our value. Hashir shaped our entire venture strategy and investor narrative. We closed our seed round within 3 months of working with him.',
    rating: 5,
    outcome: 'Seed round closed in 3 months',
    category: 'Venture Design',
    featured: true,
  },
  {
    id: 3,
    name: 'Meera Krishnan',
    role: 'Co-founder, Bare Logic',
    quote: 'The investor deck Hashir created for us was the best we\'d ever seen. Every slide had a purpose, every claim was backed by data. We walked into rooms with confidence we never had before.',
    rating: 5,
    outcome: '4 VC meetings in first month',
    category: 'Investor Deck',
    featured: false,
  },
  {
    id: 4,
    name: 'Rohan Mehta',
    role: 'Director, Kesha',
    quote: 'Hashir understood our brand before we did. He found the thread that tied everything together — our voice, our aesthetic, our audience. Our social engagement tripled within 90 days.',
    rating: 5,
    outcome: '3x social engagement',
    category: 'Brand Strategy',
    featured: false,
  },
  {
    id: 5,
    name: 'Sanya Gupta',
    role: 'Founder, sol.',
    quote: 'Working with Hashir felt like having a co-founder who actually knows what they\'re doing. He built our entire operational playbook from scratch. We scaled from 0 to ₹40L ARR in under a year.',
    rating: 5,
    outcome: '₹40L ARR in under a year',
    category: 'Business Systems',
    featured: false,
  },
  {
    id: 6,
    name: 'Kiran Bose',
    role: 'MD, Heritage Hospitality Group',
    quote: 'We brought Hashir in for an organizational transformation. His ability to see what was broken and design better systems — without disrupting daily operations — was remarkable.',
    rating: 5,
    outcome: '40% ops efficiency gain',
    category: 'Org Transformation',
    featured: false,
  },
]

const resultStats = [
  { num: '30+', label: 'Clients Transformed' },
  { num: '₹2Cr+', label: 'Revenue Generated for Clients' },
  { num: '5★', label: 'Average Rating' },
  { num: '100%', label: 'Repeat & Referral Rate' },
]

function StarRating({ rating }) {
  return (
    <div className="star-rating" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} weight={i < rating ? 'fill' : 'regular'} aria-hidden />
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial, large = false }) {
  return (
    <article className={`testimonial-card ${large ? 'testimonial-card--large' : ''}`} data-reveal>
      <div className="testimonial-quote-icon" aria-hidden>
        <Quotes size={large ? 36 : 28} weight="fill" />
      </div>
      <StarRating rating={testimonial.rating} />
      <blockquote className="testimonial-quote">
        "{testimonial.quote}"
      </blockquote>
      <div className="testimonial-footer">
        <div className="testimonial-author">
          <div className="testimonial-avatar" aria-hidden>
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <strong>{testimonial.name}</strong>
            <span>{testimonial.role}</span>
          </div>
        </div>
        <div className="testimonial-outcome">
          <span className="outcome-pill">{testimonial.outcome}</span>
        </div>
      </div>
      <div className="testimonial-category">
        <span className="pill">{testimonial.category}</span>
      </div>
    </article>
  )
}

export default function Results({ onBookCall }) {
  useScrollReveal()

  useEffect(() => {
    document.title = 'Results | Hashir Usman'
  }, [])

  const featured = testimonials.filter(t => t.featured)
  const rest = testimonials.filter(t => !t.featured)

  return (
    <main id="main" className="results-page">

      {/* ── Hero ── */}
      <section className="results-hero" aria-labelledby="results-hero-title">
        <div data-reveal>
          <span className="eyebrow">Client Results</span>
          <h1 id="results-hero-title" className="results-hero-title">
            Real businesses.<br />Real results.
          </h1>
          <p className="results-hero-desc">
            Every engagement is measured by one thing — outcomes.
            Here's what founders and businesses have achieved through our work together.
          </p>
          <button className="btn btn-primary" onClick={onBookCall}>
            Be the next case study <ArrowUpRight size={17} aria-hidden />
          </button>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="results-stats" aria-label="Results at a glance">
        {resultStats.map(({ num, label }) => (
          <div key={label} className="result-stat" data-reveal>
            <strong>{num}</strong>
            <p>{label}</p>
          </div>
        ))}
      </section>

      {/* ── Featured Testimonials ── */}
      <section className="featured-testimonials" aria-label="Featured testimonials">
        <div className="section-intro" data-reveal>
          <span className="eyebrow">In Their Own Words</span>
          <h2 className="section-heading">What clients say.</h2>
        </div>
        <div className="featured-grid">
          {featured.map(t => (
            <TestimonialCard key={t.id} testimonial={t} large />
          ))}
        </div>
      </section>

      {/* ── All Testimonials ── */}
      <section className="all-testimonials" aria-label="All testimonials">
        <div className="testimonials-grid">
          {rest.map(t => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="results-cta" data-reveal aria-labelledby="results-cta-heading">
        <span className="eyebrow">Your Turn</span>
        <h2 id="results-cta-heading">Ready to create<br />your own results?</h2>
        <p>Let's talk about what you're building — and how to make it exceptional.</p>
        <button className="btn btn-primary" onClick={onBookCall}>
          Book a Call <ArrowUpRight size={17} aria-hidden />
        </button>
      </section>

    </main>
  )
}
