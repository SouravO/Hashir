import './MarqueeTicker.css'

const items = [
  '🚀 Venture Design',
  '✦ Brand Strategy',
  '📊 Investor Decks',
  '⚙️ Business Systems',
  '📈 Go-To-Market',
  '🏗️ Org Transformation',
  '💡 Growth Strategy',
  '🎨 Brand Identity',
  '🤝 Partnerships',
  '📐 Operational Design',
]

export default function MarqueeTicker() {
  const doubled = [...items, ...items]

  return (
    <div className="marquee-ticker" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
