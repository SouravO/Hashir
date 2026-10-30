/* global process */
import { createClient } from '@supabase/supabase-js'
import { createMeetInvite, getGoogleAccessToken, notifyCustomer } from '../server/google.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' })

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
  if (typeof appointmentId !== 'string' || !UUID_RE.test(appointmentId)) {
    return res.status(400).json({ message: 'A valid appointment is required.' })
  }

  const db = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } })
  const { data, error } = await db
    .from('appointments')
    .update({ status: 'confirmed' })
    .eq('id', appointmentId)
    .eq('status', 'pending')
    .select('id,status,name,email,appointment_date,appointment_time,timezone,duration_minutes,google_event_id,meeting_url')
    .maybeSingle()

  if (error) {
    console.error('Appointment approval failed:', error.message)
    return res.status(500).json({ message: 'The request could not be approved.' })
  }
  if (!data) return res.status(409).json({ message: 'This request is no longer pending.' })

  const deliveryNotes = []
  const calendarEnabled = process.env.MEET_INVITES_ENABLED === 'true'
  let accessToken = null
  let calendarInvite = null
  let customerNotified = false
  try {
    accessToken = await getGoogleAccessToken()
  } catch (notificationError) {
    console.error('Google authorization failed:', notificationError.message)
    deliveryNotes.push('Google authorization failed; calendar invite and customer email could not be sent.')
  }

  if (accessToken && calendarEnabled) {
    try {
      calendarInvite = await createMeetInvite(accessToken, data)
    } catch (calendarError) {
      console.error('Calendar invite failed:', calendarError.message)
      deliveryNotes.push('Request approved, but the calendar invite could not be created. Check Google Calendar API access and OAuth scopes.')
    }
  } else if (!calendarEnabled) {
    deliveryNotes.push('Request approved and email confirmation sent; calendar invitations are disabled.')
  }

  if (calendarEnabled && !calendarInvite) {
    const { error: rollbackError } = await db
      .from('appointments')
      .update({ status: 'pending' })
      .eq('id', appointmentId)
      .eq('status', 'confirmed')
    if (rollbackError) console.error('Approval rollback failed:', rollbackError.message)
    return res.status(503).json({ message: 'Could not create the Google Calendar invitation. The request remains pending; check Calendar API access and OAuth scopes.' })
  }

  if (accessToken) {
    try {
      await notifyCustomer(accessToken, data, 'confirmed', calendarInvite?.meetingUrl, Boolean(calendarInvite?.inviteSent))
      customerNotified = true
    } catch (notificationError) {
      console.error('Approval email failed:', notificationError.message)
      deliveryNotes.push(`Request approved, but the customer confirmation email could not be sent: ${notificationError.message}`)
    }
  }
  if (calendarEnabled && !calendarInvite && !deliveryNotes.some((note) => note.includes('calendar invite'))) {
    deliveryNotes.push('Calendar invitation was not sent.')
  }
  const deliveryNote = deliveryNotes.join(' ') || 'Calendar invite and approval email sent to the customer.'

  const { error: notificationUpdateError } = await db
    .from('appointments')
    .update({
      google_event_id: calendarInvite?.eventId || null,
      meeting_url: calendarInvite?.meetingUrl || null,
      client_invite_sent: Boolean(calendarInvite?.inviteSent),
      customer_notified: customerNotified,
      delivery_note: deliveryNote,
    })
    .eq('id', appointmentId)
  if (notificationUpdateError) console.error('Approval email status could not be saved:', notificationUpdateError.message)

  return res.status(200).json({
    ok: true,
    status: data.status,
    customerNotified,
    deliveryNote,
    clientInviteSent: Boolean(calendarInvite?.inviteSent),
    meetingUrl: calendarInvite?.meetingUrl || null,
  })
}
