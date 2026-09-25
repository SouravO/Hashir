import { useEffect } from 'react'
import { ArrowUpRight, EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react'
import ContactForm from '../components/ui/ContactForm'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Contact.css'

const faqs = [
  { q: 'How does a typical engagement start?',    a: "It starts with a 30-minute call to understand your business and goals. From there I'll propose the right approach." },
  { q: 'What industries do you work with?',       a: 'I work across consumer brands, startups, SaaS, and service businesses — the common thread is ambition.' },
  { q: 'Do you offer ongoing retainers?',         a: 'Yes. I work with clients on project basis and monthly retainers for ongoing strategy and systems support.' },
  { q: 'How long does a typical project take?',   a: 'Projects range from 2-week sprints (investor decks, GTM plans) to multi-month engagements (venture build, org transformation).' },
]

export default function Contact({ onBookCall }) {
  useScrollReveal()

  useEffect(() => {
    document.title = 'Contact | Hashir Usman'
  }, [])

  return (
    <main id="main" className="contact-page">

      {/* ── Hero ── */}
      <section className="contact-hero" aria-labelledby="contact-hero-title">
        <div data-reveal>
          <span className="eyebrow">Get in Touch</span>
          <h1 id="contact-hero-title" className="contact-hero-title">
            Let's build<br />what's next.
          </h1>
          <p className="contact-hero-desc">
            Have a venture in mind, a business ready for its next chapter, or just want to explore?
            I'd love to hear about it.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="contact-grid">

        {/* Form */}
        <div className="contact-form-wrap" data-reveal>
          <h2>Send a message</h2>
          <p>Fill out the form and I'll get back to you within 24 hours.</p>
          <ContactForm />
        </div>

        {/* Sidebar */}
        <aside className="contact-sidebar">
          <div className="contact-info" data-reveal>
            <h2>Contact info</h2>
            <div className="contact-info-items">
              <a href="tel:+917789800898" className="contact-info-item">
                <span className="contact-info-icon"><Phone size={18} weight="light" aria-hidden /></span>
                <div>
                  <span className="contact-info-label">Phone</span>
                  <span className="contact-info-value">+91 77 898 00 898</span>
                </div>
              </a>
              <a href="mailto:connect@hashirusman.online" className="contact-info-item">
                <span className="contact-info-icon"><EnvelopeSimple size={18} weight="light" aria-hidden /></span>
                <div>
                  <span className="contact-info-label">Email</span>
                  <span className="contact-info-value">connect@hashirusman.online</span>
                </div>
              </a>
              <span className="contact-info-item">
                <span className="contact-info-icon"><MapPin size={18} weight="light" aria-hidden /></span>
                <div>
                  <span className="contact-info-label">Location</span>
                  <span className="contact-info-value">Bengaluru, India</span>
                </div>
              </span>
            </div>
          </div>

          <div className="contact-book" data-reveal data-delay="2">
            <span className="eyebrow">Prefer a call?</span>
            <h3>Book a 30-min strategy session.</h3>
            <p>Let's talk about what you're building and how I can help.</p>
            <button className="btn btn-primary" onClick={onBookCall} style={{ marginTop: 16 }}>
              Book a Call <ArrowUpRight size={16} aria-hidden />
            </button>
          </div>
        </aside>
      </div>

      {/* ── FAQs ── */}
      <section className="contact-faq" aria-labelledby="faq-heading">
        <div data-reveal>
          <span className="eyebrow">FAQ</span>
          <h2 id="faq-heading" className="section-heading">Common questions.</h2>
        </div>
        <div className="faq-grid">
          {faqs.map(({ q, a }, i) => (
            <div key={q} className="faq-item" data-reveal data-delay={Math.min(i + 1, 4)}>
              <h3>{q}</h3>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
