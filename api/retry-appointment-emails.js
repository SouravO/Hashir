/* global process */
import { createClient } from '@supabase/supabase-js'
import { getGoogleAccessToken, notifyCustomer, notifyOwner } from '../server/google.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const FIELDS = 'id,status,name,email,appointment_date,appointment_time,timezone,duration_minutes,message,availability_source,meeting_url,client_invite_sent,owner_notified,customer_notified'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' })

  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  const url = process.env.SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !anonKey || !serviceKey) return res.status(503).json({ message: 'The email retry service is not configured.' })
  if (!token) return res.status(401).json({ message: 'Please sign in as an admin.' })

  const authClient = createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } })
  const { data: authData, error: authError } = await authClient.auth.getUser(token)
  if (authError || authData.user?.app_metadata?.role !== 'admin') return res.status(403).json({ message: 'Admin access is required.' })

  const appointmentId = req.body?.appointmentId
  if (typeof appointmentId !== 'string' || !UUID_RE.test(appointmentId)) {
    return res.status(400).json({ message: 'A valid appointment is required.' })
  }

  const db = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } })
  const { data: appointment, error: lookupError } = await db
    .from('appointments')
    .select(FIELDS)
    .eq('id', appointmentId)
    .maybeSingle()
  if (lookupError) return res.status(500).json({ message: 'The appointment could not be loaded.' })
  if (!appointment) return res.status(404).json({ message: 'Appointment not found.' })
  if (appointment.status === 'cancelled') return res.status(409).json({ message: 'Cancelled appointments cannot receive confirmation emails.' })

  let accessToken
  try {
    accessToken = await getGoogleAccessToken()
  } catch (error) {
    console.error('Google authorization failed during email retry:', error.message)
    return res.status(503).json({ message: 'Google authorization failed. Check the server-side Google OAuth credentials.' })
  }

  let ownerNotified = Boolean(appointment.owner_notified)
  let customerNotified = Boolean(appointment.customer_notified)
  const errors = []

  if (!ownerNotified) {
    try {
      await notifyOwner(accessToken, appointment, appointment.meeting_url, appointment.client_invite_sent)
      ownerNotified = true
    } catch (error) {
      console.error('Admin email retry failed:', error.message)
      errors.push(`Admin email: ${error.message}`)
    }
  }

  if (appointment.status === 'confirmed' && !customerNotified) {
    try {
      await notifyCustomer(accessToken, appointment, 'confirmed', appointment.meeting_url, appointment.client_invite_sent)
      customerNotified = true
    } catch (error) {
      console.error('Customer email retry failed:', error.message)
      errors.push(`Customer email: ${error.message}`)
    }
  }

  const deliveryNote = errors.join(' ') || 'Email notifications sent successfully.'
  const { error: updateError } = await db
    .from('appointments')
    .update({ owner_notified: ownerNotified, customer_notified: customerNotified, delivery_note: errors.length ? deliveryNote : null })
    .eq('id', appointmentId)
  if (updateError) console.error('Email retry status could not be saved:', updateError.message)

  return res.status(errors.length ? 502 : 200).json({
    ok: errors.length === 0,
    ownerNotified,
    customerNotified,
    deliveryNote,
  })
}
