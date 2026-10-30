import { getGoogleAccessToken, notifyOpportunityApplication } from '../server/google.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const OPPORTUNITIES = new Set(['We’re Hiring', 'Internship', 'Become a Co-Founder'])

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' })

  const { name, email, role, linkedin, message, website } = req.body || {}
  if (typeof website === 'string' && website.trim()) return res.status(200).json({ ok: true })

  const application = {
    name: typeof name === 'string' ? name.trim() : '',
    email: typeof email === 'string' ? email.trim().toLowerCase() : '',
    role: typeof role === 'string' ? role.trim() : '',
    linkedin: typeof linkedin === 'string' ? linkedin.trim() : '',
    message: typeof message === 'string' ? message.trim() : '',
  }

  if (
    application.name.length < 2 || application.name.length > 100 || /[\r\n]/.test(application.name) ||
    application.email.length > 254 || !EMAIL_RE.test(application.email) ||
    !OPPORTUNITIES.has(application.role) ||
    application.linkedin.length > 500 ||
    application.message.length < 10 || application.message.length > 3000
  ) return res.status(400).json({ message: 'Please check the application details and try again.' })

  try {
    const accessToken = await getGoogleAccessToken()
    await notifyOpportunityApplication(accessToken, application)
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Opportunity application delivery failed:', error.message)
    return res.status(503).json({ message: 'We could not send your application right now. Please email the team directly.' })
  }
}
