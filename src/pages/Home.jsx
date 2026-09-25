import { useEffect } from 'react'
import HeroSection     from '../components/sections/HeroSection'
import ServicesSection  from '../components/sections/ServicesSection'
import VenturesSection  from '../components/sections/VenturesSection'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Home.css'

export default function Home({ onBookCall, onServiceSelect, onVentureSelect, onViewAllVentures }) {
  useScrollReveal()

  useEffect(() => {
    document.title = 'Hashir Usman | Venture Architect & Business Consultant'
  }, [])

  return (
    <main id="main" className="home-page">

      {/* Full-viewport hero — only this is visible on load */}
      <HeroSection onBookCall={onBookCall} />

      {/* Sections revealed on scroll */}
      <div className="home-sections">

        <div className="home-section-block">
          <ServicesSection onSelect={onServiceSelect} />
        </div>

        <div className="home-section-block">
          <VenturesSection onSelect={onVentureSelect} onViewAll={onViewAllVentures} />
        </div>

      </div>
    </main>
  )
}
