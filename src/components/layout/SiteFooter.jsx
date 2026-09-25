import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight, EnvelopeSimple, InstagramLogo, LinkedinLogo,
  MapPin, Phone, XLogo, YoutubeLogo,
} from '@phosphor-icons/react'
import './SiteFooter.css'

const email = 'connect@hashirusman.online'

export default function SiteFooter({ portraitSrc, onAboutClick }) {
  const [emailVal, setEmailVal] = useState('')
  const [msg, setMsg] = useState('')

  function handleSubscribe(e) {
    e.preventDefault()
    const subject = encodeURIComponent('Keep me updated')
    const body = encodeURIComponent(
      `Hi Hashir,\n\nI'd like to receive your updates on strategy, growth, and ventures.\n\nMy email: ${emailVal}\n`
    )
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
    setMsg('Send the draft in your email app to subscribe.')
  }

  return (
    <footer className="site-footer" id="contact" aria-label="About and contact Hashir">
      <div className="footer-inner">
        {/* Portrait */}
        <div className="footer-portrait-wrap" aria-hidden>
          <img
            className="footer-portrait"
            src={portraitSrc}
            srcSet="/images/hashir-portrait-small.webp 480w, /images/hashir-portrait-medium.webp 800w"
            sizes="260px"
            width="1120" height="1400"
            alt=""
            loading="lazy"
          />
        </div>

        {/* About */}
        <div className="footer-about" id="about">
          <h2>About Hashir</h2>
          <p>
            I partner with founders, startups, and businesses to design what's next.
            With 5+ years of experience across strategy, brand, systems, and growth,
            I turn ideas into scalable, investable, and impactful ventures.
          </p>
          <button className="footer-about-link" type="button" onClick={onAboutClick}>
            More about me <ArrowUpRight size={15} aria-hidden />
          </button>
        </div>

        {/* Contact */}
        <address className="footer-contact">
          <a href="tel:+917789800898">
            <Phone size={16} weight="light" aria-hidden />
            <span>+91 77 898 00 898</span>
          </a>
          <a href={`mailto:${email}`}>
            <EnvelopeSimple size={16} weight="light" aria-hidden />
            <span>{email}</span>
          </a>
          <span className="footer-location">
            <MapPin size={16} weight="light" aria-hidden />
            <span>Bengaluru, India</span>
          </span>
        </address>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h2>Let's build what's next.</h2>
          <p>Insights on strategy, growth &amp; ventures.<br />Straight to your inbox.</p>
          <form onSubmit={handleSubscribe} className="footer-nl-form">
            <label className="visually-hidden" htmlFor="nl-email">Your email address</label>
            <input
              id="nl-email"
              type="email"
              placeholder="Enter your email"
              value={emailVal}
              onChange={(e) => setEmailVal(e.target.value)}
              required
              autoComplete="email"
            />
            <button type="submit">Subscribe <ArrowUpRight size={12} aria-hidden /></button>
          </form>
          {msg && <p className="footer-nl-msg" role="status">{msg}</p>}
          <div className="footer-socials" aria-label="Social profiles">
            <span role="img" aria-label="LinkedIn (coming soon)" title="LinkedIn – coming soon"><LinkedinLogo size={15} weight="fill" /></span>
            <span role="img" aria-label="X (coming soon)" title="X – coming soon"><XLogo size={14} /></span>
            <span role="img" aria-label="Instagram (coming soon)" title="Instagram – coming soon"><InstagramLogo size={14} /></span>
            <span role="img" aria-label="YouTube (coming soon)" title="YouTube – coming soon"><YoutubeLogo size={15} weight="fill" /></span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bar">
        <span>© {new Date().getFullYear()} Hashir Usman. All rights reserved.</span>
        <nav className="footer-bar-nav" aria-label="Footer links">
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  )
}
