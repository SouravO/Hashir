import { useLayoutEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
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

function ScrollToRouteTarget() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) {
      window.scrollTo(0, 0)
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' })
      return
    }
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname, hash])

  return null
}

export default function App() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-dvh flex-col bg-[#f8f9f6]">
      <ScrollToRouteTarget />
      <Navbar />
      <div key={pathname} className="flex-1 animate-page-enter motion-reduce:animate-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ventures" element={<Ventures />} />
          <Route path="/founderverse" element={<Founderverse />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/portfolio" element={<Navigate to="/ventures" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
