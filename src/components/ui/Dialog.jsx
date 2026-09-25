import { useEffect, useRef } from 'react'
import { ArrowRight, ArrowUpRight, Check, EnvelopeSimple, MapPin, X } from '@phosphor-icons/react'
import ContactForm from './ContactForm'
import './Dialog.css'

const email = 'connect@hashirusman.online'
const ventures = ['Moonbliss', 'Kesha', 'sol.', 'Bare Logic', 'Aii', 'Nothing Else']

export default function Dialog({ content, onClose, onContact, onVentureSelect }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!content) return
    const dialog = ref.current
    const prev = document.activeElement
    dialog.showModal()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = prevOverflow
      prev?.focus()
    }
  }, [content])

  if (!content) return null

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="dialog-title"
      onCancel={onClose}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-inner">
        <button className="modal-close icon-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {content.type === 'contact' && (
          <>
            <span className="modal-eyebrow">A conversation is a good start.</span>
            <h2 id="dialog-title">Let's build<br />what's next.</h2>
            <p>Have a venture in mind or a business ready for its next chapter? I'd love to hear about it.</p>
            <ContactForm key={content.topic || 'contact'} topic={content.topic} />
          </>
        )}

        {content.type === 'service' && (
          <>
            <span className="modal-eyebrow">Strategy. Systems. Growth.</span>
            <h2 id="dialog-title">{content.title}</h2>
            <p>{content.description}</p>
            <ul className="modal-list">
              {content.details?.map((d) => (
                <li key={d}><Check size={17} weight="bold" aria-hidden />{d}</li>
              ))}
            </ul>
            <button className="btn btn-primary" onClick={() => onContact(content.title)}>
              Book a Call <ArrowUpRight size={17} aria-hidden />
            </button>
          </>
        )}

        {content.type === 'venture' && (
          <>
            <span className="modal-eyebrow">Featured venture</span>
            <h2 id="dialog-title">{content.name}</h2>
            <p>Brands built with purpose and passion. Discover the strategy, systems, and thinking behind {content.name}.</p>
            <p className="modal-note">For a closer look and my involvement, let's start a conversation.</p>
            <button className="btn btn-primary" onClick={() => onContact(content.name)}>
              Discuss this venture <ArrowUpRight size={17} aria-hidden />
            </button>
          </>
        )}

        {content.type === 'portfolio' && (
          <>
            <span className="modal-eyebrow">The venture portfolio</span>
            <h2 id="dialog-title">Purpose meets<br />possibility.</h2>
            <p>A collection of brands built with purpose and passion.</p>
            <div className="modal-portfolio-list">
              {ventures.map((name, i) => (
                <button key={name} onClick={() => onVentureSelect({ name })}>
                  <span className="portfolio-idx">0{i + 1}</span>
                  <span>{name}</span>
                  <ArrowUpRight size={20} />
                </button>
              ))}
            </div>
          </>
        )}

        {content.type === 'about' && (
          <>
            <span className="modal-eyebrow">Meet Hashir</span>
            <h2 id="dialog-title">A partner in<br />your next chapter.</h2>
            <p>I'm Hashir Usman, a venture architect and business consultant based in Bengaluru, India.</p>
            <p>I partner with founders, startups, and businesses to design what's next. With 5+ years of experience across strategy, brand, systems, and growth, I turn ideas into scalable, investable, and impactful ventures.</p>
            <div className="modal-about-meta">
              <MapPin size={16} aria-hidden /> Bengaluru, India
              <span>Strategy to execution.</span>
            </div>
            <button className="btn btn-primary" onClick={() => onContact()}>
              Book a Call <ArrowUpRight size={17} aria-hidden />
            </button>
          </>
        )}

        <a className="modal-email" href={`mailto:${email}`}>
          <EnvelopeSimple size={15} aria-hidden />
          {email}
          <ArrowRight size={14} style={{ marginLeft: 'auto' }} aria-hidden />
        </a>
      </div>
    </dialog>
  )
}
