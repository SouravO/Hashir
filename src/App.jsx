import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar      from './components/layout/Navbar'
import SideRail    from './components/layout/SideRail'
import SiteFooter  from './components/layout/SiteFooter'
import Dialog      from './components/ui/Dialog'
import PageLoader  from './components/ui/PageLoader'
import Home        from './pages/Home'
import About       from './pages/About'
import Services    from './pages/Services'
import Portfolio   from './pages/Portfolio'
import Ventures    from './pages/Ventures'
import Contact     from './pages/Contact'
import Insights    from './pages/Insights'
import Results     from './pages/Results'
import Process     from './pages/Process'
import './components/ui/ui.css'
import './App.css'

const portrait = '/images/hashir-portrait.webp'

export default function App() {
  const [dialog, setDialog] = useState(null)
  const location = useLocation()

  // Show loader only on first visit per session
  const [showLoader, setShowLoader] = useState(
    () => !sessionStorage.getItem('hu-loaded')
  )
  function handleLoaderDone() {
    sessionStorage.setItem('hu-loaded', '1')
    setShowLoader(false)
  }

  const openContact  = (topic) => setDialog({ type: 'contact', topic })
  const openService  = (svc)   => setDialog({ ...svc,  type: 'service' })
  const openVenture  = (v)     => setDialog({ ...v,    type: 'venture' })
  const openPortfolio= ()      => setDialog({ type: 'portfolio' })
  const openAbout    = ()      => setDialog({ type: 'about' })
  const closeDialog  = ()      => setDialog(null)

  return (
    <>
      {showLoader && <PageLoader onDone={handleLoaderDone} />}

      <a className="skip-link" href="#main">Skip to content</a>
      <SideRail />

      <div className="app-shell">
        <Navbar onBookCall={() => openContact()} />

        <div className="page-content" key={location.pathname}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  onBookCall={() => openContact()}
                  onServiceSelect={openService}
                  onVentureSelect={openVenture}
                  onViewAllVentures={openPortfolio}
                />
              }
            />
            <Route
              path="/about"
              element={<About onBookCall={() => openContact()} onContact={() => openContact()} />}
            />
            <Route
              path="/services"
              element={<Services onServiceSelect={openService} onBookCall={() => openContact()} />}
            />
            <Route
              path="/portfolio"
              element={
                <Portfolio
                  onVentureSelect={openVenture}
                  onViewAll={openPortfolio}
                  onBookCall={() => openContact()}
                />
              }
            />
            <Route
              path="/ventures"
              element={<Ventures onSelect={openVenture} onBookCall={() => openContact()} />}
            />
            <Route
              path="/contact"
              element={<Contact onBookCall={() => openContact()} />}
            />
            <Route
              path="/insights"
              element={<Insights onBookCall={() => openContact()} />}
            />
            <Route
              path="/results"
              element={<Results onBookCall={() => openContact()} />}
            />
            <Route
              path="/process"
              element={<Process onBookCall={() => openContact()} />}
            />
          </Routes>
        </div>

        <SiteFooter portraitSrc={portrait} onAboutClick={openAbout} />
      </div>

      <Dialog
        content={dialog}
        onClose={closeDialog}
        onContact={(topic) => { closeDialog(); setTimeout(() => openContact(topic), 80) }}
        onVentureSelect={openVenture}
      />
    </>
  )
}
