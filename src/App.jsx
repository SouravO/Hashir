import { useLayoutEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Ventures from './pages/Ventures'
import Contact from './pages/Contact'
import Founderverse from './pages/Founderverse'
import Admin from './pages/Admin'
import Privacy from './pages/Privacy'
import Opportunities from './pages/Opportunities'
import CreativePortfolio from './pages/CreativePortfolio'

function ScrollToRouteTarget() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()

  useLayoutEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) lenis?.scrollTo(target, { immediate: true })
      return
    }
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname, hash, lenis])

  return null
}

export default function App() {
  const { pathname } = useLocation()

  return (
    <ReactLenis root options={{ autoRaf: true, lerp: 0.12, smoothWheel: true }}>
      <div className="flex min-h-dvh flex-col bg-[#f8f9f6]">
        <ScrollToRouteTarget />
        {pathname !== '/creative-portfolio' && <Navbar />}
        <div key={pathname} className="flex-1 animate-page-enter motion-reduce:animate-none">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/ventures" element={<Ventures />} />
            <Route path="/founderverse" element={<Founderverse />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/creative-portfolio" element={<CreativePortfolio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/portfolio" element={<Navigate to="/ventures" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </ReactLenis>
  )
}
