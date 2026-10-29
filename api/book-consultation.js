/* global process */
import { createClient } from '@supabase/supabase-js'
import {
  BOOKING_TIMEZONE,
  getAvailableSlots,
  getGoogleAccessToken,
  isAllowedBookingSlot,
  notifyOwner,
} from '../server/google.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d$/
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const REQUEST_FIELDS = 'id,request_id,name,email,appointment_date,appointment_time,timezone,duration_minutes,message,availability_source,status,google_event_id,meeting_url,client_invite_sent,owner_notified,delivery_note,created_at'

class SlotTakenError extends Error {}

async function getOrCreateRequest(supabase, values) {
  const { data: existing, error: lookupError } = await supabase
    .from('appointments')
    .select(REQUEST_FIELDS)
    .eq('request_id', values.request_id)
    .maybeSingle()
  if (lookupError) throw new Error('The appointment request could not be checked.')
  if (existing) return existing

  const { data, error } = await supabase
    .from('appointments')
    .insert(values)
    .select(REQUEST_FIELDS)
    .single()
  if (!error) return data

  if (error.code === '23505') {
    const { data: duplicate, error: duplicateError } = await supabase
      .from('appointments')
      .select(REQUEST_FIELDS)
      .eq('request_id', values.request_id)
      .maybeSingle()
    if (!duplicateError && duplicate) return duplicate
    throw new SlotTakenError('That time was just booked. Please choose another slot.')
  }
  throw new Error('The appointment request could not be saved.')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' })
  if (process.env.BOOKING_ENABLED !== 'true') return res.status(503).json({ message: 'Booking requests are not enabled yet.' })

  const { requestId, name, email, date, time, timezone, durationMinutes, message, availabilitySource } = req.body || {}
  const cleanName = typeof name === 'string' ? name.trim() : ''
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
  const cleanMessage = typeof message === 'string' ? message.trim() : ''
  const parsedDate = typeof date === 'string' && DATE_RE.test(date) ? new Date(`${date}T00:00:00.000Z`) : null
  const validDate = parsedDate && !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === date
  const validTimezone = timezone === BOOKING_TIMEZONE

  if (
    typeof requestId !== 'string' || !UUID_RE.test(requestId) ||
    cleanName.length < 2 || cleanName.length > 100 || /[\r\n]/.test(cleanName) ||
    cleanEmail.length > 254 || !EMAIL_RE.test(cleanEmail) ||
    !validDate || typeof time !== 'string' || !TIME_RE.test(time) ||
    !validTimezone || durationMinutes !== 30 ||
    cleanMessage.length > 1000 || !['website', 'live'].includes(availabilitySource) ||
    !isAllowedBookingSlot(date, time)
  ) {
    return res.status(400).json({ message: 'Please check the appointment details and try again.' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) return res.status(503).json({ message: 'The appointment database is not configured yet.' })

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  })
  let appointment
  try {
    const { data, error } = await supabase.from('appointments').select(REQUEST_FIELDS).eq('request_id', requestId.toLowerCase()).maybeSingle()
    if (error) throw error
    appointment = data
  } catch (error) {
    console.error('Appointment lookup failed:', error.message)
    return res.status(500).json({ message: 'We could not check your request. Please try again.' })
  }

  if (!appointment) {
    const { data: occupied, error } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', date)
      .eq('appointment_time', time)
      .in('status', ['pending', 'confirmed'])
      .maybeSingle()
    if (error) return res.status(500).json({ message: 'We could not check that time. Please try again.' })
    if (occupied) return res.status(409).json({ message: 'That time is already booked. Please choose another slot.' })
  }

  let accessToken
  if (!appointment && availabilitySource === 'live') {
    if (process.env.MEET_INVITES_ENABLED !== 'true') {
      return res.status(503).json({ message: 'Live appointment booking is not enabled yet.' })
    }
    if (!isAllowedBookingSlot(date, time)) {
      return res.status(400).json({ message: 'Please choose an available weekday and time within the booking window.' })
    }
    try {
      accessToken = await getGoogleAccessToken()
      const slots = await getAvailableSlots(accessToken, date)
      if (!slots.find((slot) => slot.time === time)?.available) {
        return res.status(409).json({ message: 'That time is no longer available. Choose another slot.' })
      }
    } catch (error) {
      console.error('Live availability check failed:', error.message)
      return res.status(503).json({ message: 'Live availability could not be checked. No appointment was saved.' })
    }
  }

  try {
    appointment ||= await getOrCreateRequest(supabase, {
      request_id: requestId.toLowerCase(),
      name: cleanName,
      email: cleanEmail,
      appointment_date: date,
      appointment_time: time,
      timezone,
      duration_minutes: durationMinutes,
      message: cleanMessage || null,
      availability_source: availabilitySource,
      status: 'pending',
    })
  } catch (error) {
    if (error instanceof SlotTakenError) return res.status(409).json({ message: error.message })
    console.error('Appointment save failed:', error.message)
    return res.status(500).json({ message: 'We could not save your request. Please try again.' })
  }

  const meetingUrl = appointment.meeting_url
  const clientInviteSent = Boolean(appointment.client_invite_sent)
  let ownerNotified = Boolean(appointment.owner_notified)
  const deliveryNotes = []
  if (!accessToken && !ownerNotified) {
    try {
      accessToken = await getGoogleAccessToken()
    } catch (error) {
      console.error('Google authorization failed:', error.message)
      deliveryNotes.push('Google mail/calendar authorization is not configured; delivery could not be completed.')
    }
  }

  if (accessToken && !ownerNotified) {
    try {
      await notifyOwner(accessToken, appointment, null, false)
      ownerNotified = true
      const { error } = await supabase.from('appointments').update({ owner_notified: true }).eq('id', appointment.id)
      if (error) deliveryNotes.push('The owner email was sent, but its delivery status could not be saved.')
    } catch (error) {
      console.error('Owner notification failed:', error.message)
      deliveryNotes.push('The request was saved, but the owner notification could not be sent.')
    }
  }

  deliveryNotes.push('Pending owner approval. No calendar invitation has been sent yet.')

  if (deliveryNotes.length) {
    await supabase.from('appointments').update({ delivery_note: deliveryNotes.join(' ') }).eq('id', appointment.id)
  } else {
    await supabase.from('appointments').update({ delivery_note: null }).eq('id', appointment.id)
  }

  return res.status(201).json({
    ok: true,
    appointmentId: appointment.id,
    meetingUrl,
    clientInviteSent,
    ownerNotified,
    deliveryNote: deliveryNotes.join(' ') || null,
  })
}
