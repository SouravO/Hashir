/* global process */
import { createClient } from '@supabase/supabase-js'
import { getGoogleAccessToken, notifyContactInquiry } from '../server/google.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const TOPICS = new Set([
  'I want to book a strategy call',
  'I need business consulting',
  'I’ve got a startup idea',
  'I need valuation support',
  'I’m exploring funding',
  'I want to co-build',
  'Something else',
])

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' })

  const { name, email, phone, topic, message, website } = req.body || {}
  if (typeof website === 'string' && website.trim()) return res.status(200).json({ ok: true })

  const inquiry = {
    name: typeof name === 'string' ? name.trim() : '',
    email: typeof email === 'string' ? email.trim().toLowerCase() : '',
    phone: typeof phone === 'string' ? phone.trim() : '',
    topic: typeof topic === 'string' ? topic.trim() : '',
    message: typeof message === 'string' ? message.trim() : '',
  }

  if (
    inquiry.name.length < 2 || inquiry.name.length > 100 || /[\r\n]/.test(inquiry.name) ||
    inquiry.email.length > 254 || !EMAIL_RE.test(inquiry.email) ||
    inquiry.phone.length > 30 || /[\r\n]/.test(inquiry.phone) ||
    !TOPICS.has(inquiry.topic) || inquiry.message.length < 1 || inquiry.message.length > 3000
  ) return res.status(400).json({ message: 'Please check the form details and try again.' })

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) return res.status(503).json({ message: 'The contact form is not configured yet.' })

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  })

  let saved
  try {
    const { data, error } = await supabase.from('contact_inquiries').insert(inquiry).select('id').single()
    if (error) throw error
    saved = data
  } catch (error) {
    console.error('Contact inquiry save failed:', error.message)
    return res.status(500).json({ message: 'We could not save your message. Please try again.' })
  }

  try {
    const accessToken = await getGoogleAccessToken()
    await notifyContactInquiry(accessToken, inquiry)
    await supabase.from('contact_inquiries').update({ email_sent: true }).eq('id', saved.id)
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Contact inquiry email delivery failed:', error.message)
    await supabase.from('contact_inquiries').update({ delivery_note: 'Email delivery failed.' }).eq('id', saved.id)
    return res.status(503).json({ message: 'Your message was saved, but we could not send the email notification. Please email connect@hashirusman.online directly.' })
  }
}
