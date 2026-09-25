import {
  Brain, ChatCircleText, Funnel, Megaphone, PencilRuler,
  PresentationChart, RocketLaunch, SlidersHorizontal, Strategy, UsersThree,
} from '@phosphor-icons/react'
import './ServicesSection.css'

const services = [
  { title: 'Venture Design',           desc: 'From idea to investable venture architecture.',        icon: RocketLaunch,     details: ['Clarify the opportunity and the customer it serves.', 'Shape a focused business model and value proposition.', 'Map the milestones from first idea to market.'] },
  { title: 'Brand Strategy',           desc: 'Positioning, identity & brand growth systems.',        icon: Brain,            details: ['Define your positioning and the audience that matters.', 'Build a clear brand story and messaging framework.', 'Connect your identity to a practical growth plan.'] },
  { title: 'Go-To-Market',             desc: 'Strategic GTM plans that drive traction.',              icon: Strategy,         details: ['Choose an initial audience and route to market.', 'Align your offer, pricing, and launch messaging.', 'Prioritize channels and set measurable launch milestones.'] },
  { title: 'Business Systems',         desc: 'Build scalable systems for sustainable growth.',       icon: SlidersHorizontal,details: ['Map the workflows your business depends on.', 'Clarify responsibilities, handoffs, and decision points.', 'Design repeatable systems that support your next stage.'] },
  { title: 'Organizational Transform.', desc: 'Align people, processes & performance.',             icon: UsersThree,       details: ['Identify where structure and goals need to align.', 'Define team responsibilities and a working rhythm.', 'Create a practical roadmap for organizational change.'] },
  { title: 'Marketing Strategy',       desc: 'Data-driven marketing that builds momentum.',          icon: Megaphone,        details: ['Understand the audience, market, and current channels.', 'Build a focused campaign and content direction.', 'Set useful measures to learn from each campaign.'] },
  { title: 'Investor Decks',           desc: "Pitch decks that tell your story & win trust.",       icon: PresentationChart,details: ['Shape a clear narrative around the opportunity.', 'Organize your business model, progress, and ambition.', 'Create a focused pitch with a clear investment ask.'] },
  { title: 'Lead Funnels',             desc: 'High-converting funnels that generate leads.',         icon: Funnel,           details: ['Map the journey from first visit to qualified enquiry.', 'Align your offer, landing page, and next step.', 'Define follow-ups and the signals worth measuring.'] },
  { title: 'Content Strategy',         desc: 'Content that builds brand, trust & authority.',        icon: ChatCircleText,   details: ['Choose content themes connected to your expertise.', 'Build an editorial plan for your audience and channels.', 'Create a consistent voice and publishing workflow.'] },
  { title: 'Process Design',           desc: 'Streamline operations with smart processes.',          icon: PencilRuler,      details: ['Document how work moves through your business.', 'Identify bottlenecks and simplify unnecessary steps.', 'Create clear processes your team can use and improve.'] },
]

export { services }

export default function ServicesSection({ onSelect, compact = false }) {
  return (
    <section className="services-section" id="services" aria-labelledby="services-heading">
      <div className="services-header" data-reveal>
        <div className="services-top">
          <div>
            <p className="eyebrow">What I Do</p>
            <h2 id="services-heading" className="section-heading">
              Strategy. Systems. Growth.<br />All under one roof.
            </h2>
          </div>
          <p className="services-top-desc">
            From venture design to investor decks — every engagement is built around execution, not just ideas. I work with founders and businesses to build systems that stick.
          </p>
        </div>
      </div>
      <div className={`services-grid ${compact ? 'services-grid--compact' : ''}`}>
        {services.map(({ icon: Icon, title, desc, details }, i) => (
          <button
            key={title}
            className="services-card"
            type="button"
            onClick={() => onSelect({ title, description: desc, details })}
            aria-haspopup="dialog"
            data-reveal
            data-delay={Math.min(i % 5 + 1, 5)}
          >
            <Icon className="services-icon" size={22} weight="light" aria-hidden />
            <span className="services-copy">
              <span className="services-title">{title}</span>
              <span className="services-desc">{desc}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
