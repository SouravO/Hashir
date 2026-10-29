/* global process */
import { createClient } from '@supabase/supabase-js'
import { BOOKING_SLOTS, getAvailableSlots, getGoogleAccessToken, isAllowedBookingSlot } from '../server/google.js'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const formatTime = (time) => {
  const [hour, minute] = time.split(':').map(Number)
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed.' })
  if (process.env.BOOKING_ENABLED !== 'true') {
    return res.status(503).json({ message: 'Booking requests are not enabled yet.' })
  }

  const date = req.query?.date
  const parsedDate = typeof date === 'string' && DATE_RE.test(date) ? new Date(`${date}T00:00:00.000Z`) : null
  if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    return res.status(400).json({ message: 'A valid date is required.' })
  }

  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return res.status(503).json({ message: 'The appointment database is not configured yet.' })

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  })

  try {
    let slots
    let source = 'website'
    if (process.env.VITE_LIVE_AVAILABILITY_ENABLED === 'true') {
      const accessToken = await getGoogleAccessToken()
      slots = await getAvailableSlots(accessToken, date)
      source = 'live'
    } else {
      slots = BOOKING_SLOTS.map((time) => ({ time, available: isAllowedBookingSlot(date, time) }))
    }

    const { data: booked, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', date)
      .in('status', ['pending', 'confirmed'])
    if (error) throw new Error('Booked slots could not be checked.')

    const bookedTimes = new Set((booked || []).map((appointment) => appointment.appointment_time))
    return res.status(200).json({
      source,
      slots: slots.map(({ time, available }) => ({
        time,
        label: formatTime(time),
        available: available && !bookedTimes.has(time),
      })),
    })
  } catch (error) {
    console.error('Availability query failed:', error.message)
    return res.status(503).json({ message: 'Availability could not be checked. Try again later.' })
  }
}
