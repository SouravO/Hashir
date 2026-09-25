import { ArrowUpRight } from '@phosphor-icons/react'
import './VenturesSection.css'

/* Venture data — duplicated for seamless loop */
const ventures = [
  { name: 'Moonbliss',    cls: 'moonbliss',    label: 'Moonbliss' },
  { name: 'Kesha',        cls: 'kesha',        label: 'Kesha' },
  { name: 'sol.',         cls: 'sol',          label: null },      /* custom render */
  { name: 'Bare Logic',   cls: 'bare-logic',   label: null },      /* two lines */
  { name: 'Aii',          cls: 'aii',          label: null },      /* dot */
  { name: 'Nothing Else', cls: 'nothing-else', label: null },      /* two lines */
]

function VentureLabel({ cls, name }) {
  if (cls === 'sol')  return <><span className="sol-word">sol</span><span className="sol-period">.</span></>
  if (cls === 'bare-logic')   return <span>Bare<br />Logic</span>
  if (cls === 'nothing-else') return <span>Nothing<br />Else</span>
  if (cls === 'aii')  return <><span className="aii-letters">Aii</span></>
  return <span>{name}</span>
}

export default function VenturesSection({ onSelect, onViewAll }) {
  return (
    <section className="ventures-strip" aria-labelledby="ventures-strip-heading">

      {/* ── Left intro ── */}
      <div className="ventures-strip-intro">
        <p className="venture-eyebrow">FEATURED VENTURES</p>
        <h2 id="ventures-strip-heading">
          Brands. Built with<br />purpose &amp; passion.
        </h2>
        <button className="ventures-all" onClick={onViewAll}>
          View all ventures <ArrowUpRight size={12} aria-hidden />
        </button>
      </div>

      {/* ── Scrolling marquee ── */}
      <div className="ventures-marquee-wrap" aria-hidden>
        <div className="ventures-marquee">
          {/* Render twice for seamless infinite loop */}
          {[...ventures, ...ventures].map((v, i) => (
            <button
              key={`${v.cls}-${i}`}
              className={`venture-tile venture-tile--${v.cls}`}
              onClick={() => onSelect?.(v)}
              tabIndex={i < ventures.length ? 0 : -1}
              aria-label={i < ventures.length ? `View ${v.name}` : undefined}
            >
              <VentureLabel {...v} />
            </button>
          ))}
        </div>
      </div>

    </section>
  )
}
