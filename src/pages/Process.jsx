import { useEffect, useState } from 'react'
import { ArrowUpRight, MagnifyingGlass, Compass, Wrench, ArrowsClockwise, CheckCircle } from '@phosphor-icons/react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Process.css'

const phases = [
  {
    step: '01',
    icon: MagnifyingGlass,
    title: 'Discovery',
    subtitle: '1–2 focused sessions',
    color: '#a4be2d',
    desc: 'We start by getting under the hood. I ask the hard questions about your business model, competitive landscape, team dynamics, and where the real friction is. Most clients find this phase alone clarifying.',
    deliverables: ['Business audit', 'Problem definition', 'Opportunity mapping', 'Engagement scope'],
  },
  {
    step: '02',
    icon: Compass,
    title: 'Strategy',
    subtitle: '1–2 weeks',
    color: '#2d8fbe',
    desc: 'This is where the thinking happens. I develop a tailored strategy framework — clear, actionable, and built for your specific context. No templates. No copy-paste frameworks. Everything is made for you.',
    deliverables: ['Strategic framework', 'Positioning doc', 'Roadmap', 'Priority matrix'],
  },
  {
    step: '03',
    icon: Wrench,
    title: 'Build',
    subtitle: '2–8 weeks',
    color: '#be5f2d',
    desc: 'We implement the plan together. Whether that\'s brand systems, investor materials, operational playbooks, or growth levers — I stay involved throughout. Not just pointing, but building.',
    deliverables: ['Brand system / deck / playbook', 'Content & creative direction', 'Systems setup', 'Team alignment'],
  },
  {
    step: '04',
    icon: ArrowsClockwise,
    title: 'Iterate',
    subtitle: 'Ongoing',
    color: '#6c2dbe',
    desc: 'Strategy is never a one-time event. I stay involved to refine and adapt as your business evolves. Market shifts. Teams change. Priorities move. I move with you.',
    deliverables: ['Monthly reviews', 'Course corrections', 'New opportunity capture', 'Retainer option'],
  },
]

const faqs = [
  { q: 'How long does a typical engagement last?', a: 'Project engagements typically run 4–12 weeks depending on scope. Many clients continue on a monthly retainer after the initial project.' },
  { q: 'Do you work remotely or in-person?', a: 'Primarily remote with video calls. For Bengaluru-based clients, I\'m available for in-person sessions when it adds value.' },
  { q: 'What happens if my needs change mid-project?', a: 'It\'s expected. I build flexibility into every engagement. We adjust scope collaboratively — no rigid contracts that punish you for evolving.' },
  { q: 'How do you charge?', a: 'Project-based pricing for defined deliverables. Monthly retainers for ongoing work. Discussed transparently on the first call.' },
  { q: 'Can you work with early-stage founders?', a: 'Yes — and I love it. Early-stage is where good strategy has the highest leverage. I work with pre-revenue founders through to Series A.' },
]

function PhaseCard({ phase, index }) {
  const [open, setOpen] = useState(false)
  const Icon = phase.icon

  return (
    <div
      className={`phase-card ${open ? 'phase-card--open' : ''}`}
      data-reveal
      data-delay={Math.min(index + 1, 4)}
    >
      <div className="phase-card-top" onClick={() => setOpen(o => !o)}>
        <div className="phase-icon-wrap" style={{ background: `${phase.color}18`, color: phase.color }}>
          <Icon size={24} weight="light" aria-hidden />
        </div>
        <div className="phase-header">
          <span className="phase-step" style={{ color: phase.color }}>{phase.step}</span>
          <div>
            <h3 className="phase-title">{phase.title}</h3>
            <span className="phase-subtitle">{phase.subtitle}</span>
          </div>
        </div>
        <div className={`phase-chevron ${open ? 'phase-chevron--open' : ''}`} aria-hidden>
          <ArrowUpRight size={18} />
        </div>
      </div>
      {open && (
        <div className="phase-card-body">
          <p>{phase.desc}</p>
          <div className="phase-deliverables">
            <span className="eyebrow" style={{ marginBottom: 10, display: 'block' }}>What you get</span>
            <ul>
              {phase.deliverables.map(d => (
                <li key={d}>
                  <CheckCircle size={15} weight="fill" aria-hidden style={{ color: phase.color }} />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-accordion ${open ? 'faq-accordion--open' : ''}`} data-reveal data-delay={Math.min(index + 1, 4)}>
      <button
        className="faq-question"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        {q}
        <span className={`faq-icon ${open ? 'faq-icon--open' : ''}`} aria-hidden>+</span>
      </button>
      {open && <p className="faq-answer">{a}</p>}
    </div>
  )
}

export default function Process({ onBookCall }) {
  useScrollReveal()

  useEffect(() => {
    document.title = 'Process | Hashir Usman'
  }, [])

  return (
    <main id="main" className="process-page">

      {/* ── Hero ── */}
      <section className="process-hero" aria-labelledby="process-hero-title">
        <div data-reveal>
          <span className="eyebrow">How I Work</span>
          <h1 id="process-hero-title" className="process-hero-title">
            From conversation<br />to transformation.
          </h1>
          <p className="process-hero-desc">
            A clear, structured approach — built so you always know where we are,
            what comes next, and why it matters.
          </p>
          <button className="btn btn-primary" onClick={onBookCall}>
            Start the process <ArrowUpRight size={17} aria-hidden />
          </button>
        </div>
      </section>

      {/* ── Phases ── */}
      <section className="process-phases" aria-labelledby="phases-heading">
        <div className="process-phases-intro" data-reveal>
          <span className="eyebrow">The Framework</span>
          <h2 id="phases-heading" className="section-heading">
            Four phases.<br />One outcome: yours.
          </h2>
        </div>
        <div className="phases-list">
          {phases.map((phase, i) => (
            <PhaseCard key={phase.step} phase={phase} index={i} />
          ))}
        </div>
      </section>

      {/* ── Principles ── */}
      <section className="process-principles" aria-labelledby="principles-heading">
        <div data-reveal>
          <span className="eyebrow">Non-negotiables</span>
          <h2 id="principles-heading" className="section-heading">
            What you can always<br />expect from me.
          </h2>
        </div>
        <div className="principles-grid">
          {[
            { title: 'Radical Clarity', desc: 'I\'ll always tell you exactly where things stand — no jargon, no spin, no vague "we\'re making progress."' },
            { title: 'Zero Templates', desc: 'Every strategy is built for your specific context. I don\'t re-skin the same deck or re-use the same framework.' },
            { title: 'Execution Focus', desc: 'Every deliverable is built to be used, not filed away. If it doesn\'t help you act, it doesn\'t make the cut.' },
            { title: 'Respect for Time', desc: 'Meetings have agendas. Deliverables have deadlines. Your time is the resource I protect most.' },
          ].map(({ title, desc }, i) => (
            <div key={title} className="principle-card" data-reveal data-delay={i + 1}>
              <div className="principle-number">{String(i + 1).padStart(2, '0')}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="process-faq" aria-labelledby="process-faq-heading">
        <div data-reveal>
          <span className="eyebrow">Questions</span>
          <h2 id="process-faq-heading" className="section-heading">Common questions.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((item, i) => (
            <FaqItem key={item.q} {...item} index={i} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="process-cta" data-reveal aria-labelledby="process-cta-heading">
        <span className="eyebrow">Let's Begin</span>
        <h2 id="process-cta-heading">Ready to start<br />your process?</h2>
        <p>Book a free 30-minute strategy call. No pitch, no pressure — just a real conversation about what you're building.</p>
        <button className="btn btn-primary" onClick={onBookCall}>
          Book a Call <ArrowUpRight size={17} aria-hidden />
        </button>
      </section>

    </main>
  )
}
