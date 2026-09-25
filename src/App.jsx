import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, ArrowRight, Check, EnvelopeSimple, List, MapPin, X } from '@phosphor-icons/react'
import { Services, Ventures, Footer } from './components/PortfolioSections'
import './App.css'

const portrait = '/images/hashir-portrait.webp'
const email = 'connect@hashirusman.online'
const ventures = ['Moonbliss', 'Kesha', 'sol.', 'Bare Logic', 'Aii', 'Nothing Else']
const metrics = [
  ['20+', 'Social Media Profiles', 'Designed & Managed'],
  ['30+', 'Venture & Business', 'Transformations'],
  ['5+', 'Domains of', 'Experience'],
  ['20+', 'Business & Startup', 'Plans Delivered'],
]

function ContactForm({ topic = '' }) {
  const [prepared, setPrepared] = useState(false)
  function handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = topic ? `Let's talk: ${topic}` : 'Let’s build what’s next'
    const body = `Hi Hashir,\n\nI'm ${data.get('name')}.\nEmail: ${data.get('email')}\n\n${data.get('message')}\n\nI'd love to arrange a call. Please let me know a suitable time.\n\nThank you!`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setPrepared(true)
  }
  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Your name<input autoComplete="name" name="name" placeholder="How should I call you?" required maxLength={100} /></label>
        <label>Email address<input autoComplete="email" type="email" name="email" placeholder="you@company.com" required maxLength={254} /></label>
      </div>
      <label>What are you working on?<textarea name="message" placeholder="A little about your idea, business, or next big move…" defaultValue={topic ? `I'd like to talk about ${topic}.` : ''} rows={4} required maxLength={3000} /></label>
      <button className="button button-primary" type="submit">Let’s connect <ArrowUpRight size={19} /></button>
      <p className="form-note" role="status">{prepared ? 'Your email draft is ready. Send it in your email app to request a call.' : 'Opens an email draft so we can find a good time to talk.'}</p>
    </form>
  )
}

function DetailDialog({ content, onClose, onContact, onVentureSelect }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!content) return
    const dialog = ref.current
    const previousFocus = document.activeElement
    dialog.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [content])
  if (!content) return null
  return (
    <dialog ref={ref} className="detail-dialog" aria-labelledby="dialog-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="dialog-inner">
        <button className="dialog-close icon-button" onClick={onClose} aria-label="Close dialog"><X size={22} /></button>
        {content.type === 'contact' && <>
          <span className="dialog-eyebrow">A conversation is a good start.</span>
          <h2 id="dialog-title">Let’s build<br />what’s next.</h2>
          <p>Have a venture in mind or a business ready for its next chapter? I’d love to hear about it.</p>
          <ContactForm key={content.topic || 'contact'} topic={content.topic} />
        </>}
        {content.type === 'service' && <>
          <span className="dialog-eyebrow">Strategy. Systems. Growth.</span>
          <h2 id="dialog-title">{content.title}</h2>
          <p>{content.description}</p>
          <ul className="detail-list">{content.details?.map(detail => <li key={detail}><Check size={19} weight="bold" />{detail}</li>)}</ul>
          <button className="button button-primary" onClick={() => onContact(content.title)}>Book a Call <ArrowUpRight size={18} /></button>
        </>}
        {content.type === 'venture' && <>
          <span className="dialog-eyebrow">Featured venture</span>
          <h2 id="dialog-title">{content.name}</h2>
          <p>Brands built with purpose and passion. Discover the strategy, systems, and thinking behind {content.name}.</p>
          <p className="venture-dialog-note">For a closer look at this venture and my involvement, let’s start a conversation.</p>
          <button className="button button-primary" onClick={() => onContact(content.name)}>Discuss this venture <ArrowUpRight size={18} /></button>
        </>}
        {content.type === 'portfolio' && <>
          <span className="dialog-eyebrow">The venture portfolio</span>
          <h2 id="dialog-title">Purpose meets<br />possibility.</h2>
          <p>A collection of brands built with purpose and passion.</p>
          <div className="portfolio-list">{ventures.map((name, i) => <button key={name} onClick={() => onVentureSelect({ name })}><span className="portfolio-index">0{i + 1}</span><span>{name}</span><ArrowUpRight size={22} /></button>)}</div>
        </>}
        {content.type === 'about' && <>
          <span className="dialog-eyebrow">Meet Hashir</span>
          <h2 id="dialog-title">A partner in<br />your next chapter.</h2>
          <p>I’m Hashir Usman, a venture architect and business consultant based in Bengaluru, India.</p>
          <p>I partner with founders, startups, and businesses to design what’s next. With 5+ years of experience across strategy, brand, systems, and growth, I turn ideas into scalable, investable, and impactful ventures.</p>
          <div className="about-dialog-line"><MapPin size={19} /> Bengaluru, India <span>Strategy to execution.</span></div>
          <button className="button button-primary" onClick={() => onContact()}>Book a Call <ArrowUpRight size={18} /></button>
        </>}
        <a className="dialog-email" href={`mailto:${email}`}><EnvelopeSimple size={17} />{email}<ArrowRight size={16} /></a>
      </div>
    </dialog>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialog, setDialog] = useState(null)
  const menuRef = useRef(null)
  const menuButton = useRef(null)
  const openContact = (topic) => { setMenuOpen(false); setDialog({ type: 'contact', topic }) }
  const openVenture = (venture) => setDialog({ ...venture, type: 'venture' })

  useEffect(() => {
    if (!menuOpen) return
    menuRef.current?.querySelector('a')?.focus()
    const handleKey = (event) => {
      if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus() }
    }
    const handleOutside = (event) => {
      if (!menuRef.current?.contains(event.target) && !menuButton.current?.contains(event.target)) setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('pointerdown', handleOutside)
    return () => { document.removeEventListener('keydown', handleKey); document.removeEventListener('pointerdown', handleOutside) }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <aside className="side-rail" aria-label="Brand statement"><span>Building what’s next</span><div className="rail-line" /><small>© {new Date().getFullYear()} Hashir Usman</small></aside>
      <div className="site-shell">
        <header className="site-header">
          <a href="#home" className="wordmark" aria-label="HU. Hashir Usman home">HU.</a>
          <nav ref={menuRef} id="main-navigation" className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#portfolio" onClick={closeMenu}>Portfolio</a>
            <a href="#services" onClick={closeMenu}>Services</a>
            <a href="#ventures" onClick={closeMenu}>Ventures</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
          </nav>
          <div className="header-actions"><span className="header-location"><MapPin size={16} weight="light" />Bengaluru, India</span><button className="button button-primary header-book" onClick={() => openContact()}>Book a Call <ArrowUpRight size={17} /></button><button ref={menuButton} className="menu-toggle icon-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={25} /> : <List size={25} />}</button></div>
        </header>
        <main id="main">
          <section className="hero" id="home" aria-labelledby="hero-title">
            <div className="hero-copy">
              <div className="hero-intro"><span>Hashir Usman</span><p>Venture Architect <b>·</b> Business Consultant</p></div>
              <h1 id="hero-title">Hello.<br />I’m Hashir.</h1>
              <p className="hero-description">I build ventures through strategy,<br />systems, brand, and execution.</p>
              <div className="hero-actions"><button className="button button-primary" onClick={() => openContact()}>Book a Call <ArrowUpRight size={19} /></button><a className="button button-outline" href="#portfolio">View Portfolio <ArrowUpRight size={19} /></a></div>
              <a className="scroll-cue" href="#services">Scroll down <ArrowDown size={19} /></a>
            </div>
            <div className="hero-visual" aria-hidden="true"><div className="portrait-backdrop" /><img className="hero-portrait" src={portrait} srcSet="/images/hashir-portrait-small.webp 480w, /images/hashir-portrait-medium.webp 800w, /images/hashir-portrait.webp 1120w" sizes="(max-width: 767px) 94vw, 52vw" width="1120" height="1400" alt="" fetchPriority="high" /></div>
            <div className="metrics" aria-label="Experience in numbers">{metrics.map(([number, line1, line2]) => <div className="metric" key={line1}><strong>{number}</strong><p>{line1}<br />{line2}</p></div>)}</div>
          </section>
          <Services onSelect={(service) => setDialog({ ...service, type: 'service' })} />
          <div id="portfolio" className="portfolio-anchor"><Ventures onSelect={openVenture} onViewAll={() => setDialog({ type: 'portfolio' })} /></div>
        </main>
        <Footer portraitSrc={portrait} onAboutClick={() => setDialog({ type: 'about' })} />
      </div>
      <DetailDialog content={dialog} onClose={() => setDialog(null)} onContact={openContact} onVentureSelect={openVenture} />
    </>
  )
}
export default App
