import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Ventures from './pages/Ventures'
import Contact from './pages/Contact'

export default function App() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-dvh flex-col bg-[#f8f9f6]">
      <Navbar />
      <div key={pathname} className="flex-1 animate-page-enter motion-reduce:animate-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ventures" element={<Ventures />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portfolio" element={<Navigate to="/ventures" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
