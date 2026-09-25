import { useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import './ContactForm.css'

const email = 'connect@hashirusman.online'

export default function ContactForm({ topic = '' }) {
  const [prepared, setPrepared] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const subject = topic ? `Let's talk: ${topic}` : "Let's build what's next"
    const body = `Hi Hashir,\n\nI'm ${data.get('name')}.\nEmail: ${data.get('email')}\n\n${data.get('message')}\n\nI'd love to arrange a call. Please let me know a suitable time.\n\nThank you!`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setPrepared(true)
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <label>
          Your name
          <input autoComplete="name" name="name" placeholder="How should I call you?" required maxLength={100} />
        </label>
        <label>
          Email address
          <input autoComplete="email" type="email" name="email" placeholder="you@company.com" required maxLength={254} />
        </label>
      </div>
      <label>
        What are you working on?
        <textarea
          name="message"
          placeholder="A little about your idea, business, or next big move…"
          defaultValue={topic ? `I'd like to talk about ${topic}.` : ''}
          rows={4}
          required
          maxLength={3000}
        />
      </label>
      <button className="btn btn-primary" type="submit">
        Let's connect <ArrowUpRight size={18} aria-hidden />
      </button>
      <p className="form-note" role="status">
        {prepared
          ? 'Your email draft is ready — send it from your email app.'
          : 'This opens an email draft so we can find a good time to talk.'}
      </p>
    </form>
  )
}
