import './SideRail.css'

export default function SideRail() {
  return (
    <aside className="side-rail" aria-label="Brand statement">
      <span className="rail-brand">Building what's next</span>
      <div className="rail-line" />
      <small>© {new Date().getFullYear()} Hashir Usman</small>
    </aside>
  )
}
