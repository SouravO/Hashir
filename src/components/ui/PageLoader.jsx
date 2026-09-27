import { useEffect, useRef, useState } from 'react'
import './PageLoader.css'

export default function PageLoader({ onDone }) {
  const [phase, setPhase] = useState('in')  // 'in' | 'hold' | 'out' | 'gone'
  const doneRef = useRef(false)

  useEffect(() => {
    // in → hold
    const t1 = setTimeout(() => setPhase('hold'), 600)
    // hold → out
    const t2 = setTimeout(() => setPhase('out'), 1800)
    // out → gone (unmount)
    const t3 = setTimeout(() => {
      setPhase('gone')
      if (!doneRef.current) { doneRef.current = true; onDone?.() }
    }, 2500)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  if (phase === 'gone') return null

  return (
    <div className={`page-loader page-loader--${phase}`} role="status" aria-label="Loading">
      {/* background panel */}
      <div className="loader-panel" />

      {/* wordmark */}
      <div className="loader-wordmark" aria-hidden>
        <span className="loader-hu">HU</span>
        <span className="loader-dot">.</span>
      </div>

      {/* tagline */}
      <p className="loader-tagline" aria-hidden>
        Venture Architect&nbsp;&nbsp;·&nbsp;&nbsp;Business Consultant
      </p>

      {/* progress bar */}
      <div className="loader-bar-wrap" aria-hidden>
        <div className="loader-bar" />
      </div>
    </div>
  )
}
