/* global process */
import { getAvailableSlots, getGoogleAccessToken } from '../server/google.js'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const formatTime = (time) => {
  const [hour, minute] = time.split(':').map(Number)
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed.' })
  if (process.env.BOOKING_ENABLED !== 'true') {
    return res.status(503).json({ message: 'Live availability is not enabled yet.' })
  }

  const date = req.query?.date
  if (typeof date !== 'string' || !DATE_RE.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    return res.status(400).json({ message: 'A valid date is required.' })
  }

  try {
    const accessToken = await getGoogleAccessToken()
    const available = await getAvailableSlots(accessToken, date)
    return res.status(200).json({
      source: 'live',
      slots: available.map(({ time, available: isAvailable }) => ({ time, label: formatTime(time), available: isAvailable })),
    })
  } catch (error) {
    console.error('Availability query failed:', error.message)
    return res.status(503).json({ message: 'Live availability could not be checked. Try again later.' })
  }
}
