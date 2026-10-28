/* global process */
import { createClient } from '@supabase/supabase-js'
import { createMeetInvite, getAvailableSlots, getGoogleAccessToken, isAllowedBookingSlot } from '../server/google.js'

const FIELDS = 'id,name,email,appointment_date,appointment_time,timezone,duration_minutes,availability_source,status,google_event_id,meeting_url,client_invite_sent'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' })
  if (process.env.MEET_INVITES_ENABLED !== 'true') return res.status(503).json({ message: 'Calendar invitations are not enabled yet.' })

  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  const url = process.env.SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !anonKey || !serviceKey) return res.status(503).json({ message: 'The admin approval service is not configured.' })
  if (!token) return res.status(401).json({ message: 'Please sign in as an admin.' })

  const authClient = createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } })
  const { data: authData, error: authError } = await authClient.auth.getUser(token)
  if (authError || authData.user?.app_metadata?.role !== 'admin') return res.status(403).json({ message: 'Admin access is required.' })

  const appointmentId = req.body?.appointmentId
  if (typeof appointmentId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(appointmentId)) {
    return res.status(400).json({ message: 'A valid appointment is required.' })
  }
  const db = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } })
  const { data: appointment, error: lookupError } = await db.from('appointments').select(FIELDS).eq('id', appointmentId).maybeSingle()
  if (lookupError) return res.status(500).json({ message: 'Could not load this appointment.' })
  if (!appointment) return res.status(404).json({ message: 'Appointment not found.' })
  if (appointment.status === 'confirmed' && appointment.meeting_url) {
    return res.status(200).json({ ok: true, alreadyApproved: true, meetingUrl: appointment.meeting_url, clientInviteSent: appointment.client_invite_sent })
  }
  if (appointment.status !== 'pending') return res.status(409).json({ message: 'Only pending requests can be approved.' })
  if (appointment.availability_source !== 'live') return res.status(409).json({ message: 'This request used demo availability and cannot be confirmed as a real appointment.' })
  if (!isAllowedBookingSlot(appointment.appointment_date, appointment.appointment_time)) {
    return res.status(409).json({ message: 'The requested time has passed or is outside the booking window. Cancel it and ask the client to choose another time.' })
  }

  try {
    const accessToken = await getGoogleAccessToken()
    const slots = await getAvailableSlots(accessToken, appointment.appointment_date)
    if (!slots.find((slot) => slot.time === appointment.appointment_time)?.available) {
      return res.status(409).json({ message: 'This time is no longer available. The request remains pending; contact the client to choose another time.' })
    }
    const invitation = await createMeetInvite(accessToken, appointment)
    if (!invitation.meetingUrl || !invitation.inviteSent) throw new Error('Google Calendar did not confirm the attendee invitation.')
    const { error: updateError } = await db.from('appointments').update({
      status: 'confirmed',
      google_event_id: invitation.eventId,
      meeting_url: invitation.meetingUrl,
      client_invite_sent: true,
      delivery_note: null,
    }).eq('id', appointment.id).eq('status', 'pending')
    if (updateError) throw new Error('The confirmed appointment could not be saved.')
    return res.status(200).json({ ok: true, meetingUrl: invitation.meetingUrl, clientInviteSent: true })
  } catch (error) {
    console.error('Appointment approval failed:', error.message)
    return res.status(502).json({ message: 'Google Calendar could not complete the invitation. The request remains pending; retry approval after checking Calendar.' })
  }
}
