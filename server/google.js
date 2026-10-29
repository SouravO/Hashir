/* global process, Buffer */
const OWNER_EMAIL = 'hashirusman120@gmail.com'
export const BOOKING_TIMEZONE = 'Asia/Kolkata'
export const BOOKING_SLOTS = ['10:00', '11:30', '14:00', '15:30', '16:00', '17:00']
export const BOOKING_WINDOW_DAYS = 7
export const MIN_NOTICE_MINUTES = 120

export async function getGoogleAccessToken() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) throw new Error('Google OAuth is not configured.')
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || !data?.access_token) throw new Error('Google authorization could not be refreshed.')
  return data.access_token
}

export function isAllowedBookingSlot(date, time, now = Date.now()) {
  if (!BOOKING_SLOTS.includes(time) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const parsed = new Date(`${date}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return false
  const start = new Date(`${date}T${time}:00+05:30`).getTime()
  return start >= now + MIN_NOTICE_MINUTES * 60_000 && start <= now + BOOKING_WINDOW_DAYS * 24 * 60 * 60_000
}

const localDateTime = (date, time) => `${date}T${time}:00+05:30`

const endLocalDateTime = (date, time, durationMinutes) => {
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const end = new Date(Date.UTC(year, month - 1, day, hour, minute + durationMinutes))
  const endDate = `${end.getUTCFullYear()}-${String(end.getUTCMonth() + 1).padStart(2, '0')}-${String(end.getUTCDate()).padStart(2, '0')}`
  const endTime = `${String(end.getUTCHours()).padStart(2, '0')}:${String(end.getUTCMinutes()).padStart(2, '0')}`
  return localDateTime(endDate, endTime)
}

export async function getAvailableSlots(accessToken, date) {
  const queryStart = localDateTime(date, '00:00')
  const nextDay = new Date(`${date}T00:00:00.000Z`)
  nextDay.setUTCDate(nextDay.getUTCDate() + 1)
  const queryEndDate = nextDay.toISOString().slice(0, 10)
  const response = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timeMin: queryStart,
      timeMax: localDateTime(queryEndDate, '00:00'),
      timeZone: BOOKING_TIMEZONE,
      items: [{ id: 'primary' }],
    }),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok || data?.calendars?.primary?.errors?.length) throw new Error('Google Calendar availability could not be checked.')
  const busy = data?.calendars?.primary?.busy || []
  return BOOKING_SLOTS.map((time) => {
    const start = new Date(localDateTime(date, time)).getTime()
    const end = start + 30 * 60_000
    const isBusy = busy.some((interval) => new Date(interval.start).getTime() < end && new Date(interval.end).getTime() > start)
    return { time, available: isAllowedBookingSlot(date, time) && !isBusy }
  })
}

const readCalendarEvent = async (accessToken, eventId) => {
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) return null
  return response.json()
}

export async function createMeetInvite(accessToken, appointment) {
  const eventId = `b${appointment.id.replaceAll('-', '')}`
  const conferenceRequestId = appointment.id.replaceAll('-', '')
  const event = {
    id: eventId,
    summary: `Consultation with ${appointment.name}`,
    description: 'Your consultation has been approved. Join using this Google Meet link.',
    start: { dateTime: localDateTime(appointment.appointment_date, appointment.appointment_time), timeZone: appointment.timezone },
    end: { dateTime: endLocalDateTime(appointment.appointment_date, appointment.appointment_time, appointment.duration_minutes), timeZone: appointment.timezone },
    attendees: [{ email: appointment.email }],
    conferenceData: {
      createRequest: {
        requestId: conferenceRequestId,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  }
  const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events')
  url.searchParams.set('conferenceDataVersion', '1')
  url.searchParams.set('sendUpdates', 'all')

  let calendarEvent
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  })
  if (response.status === 409) {
    calendarEvent = await readCalendarEvent(accessToken, eventId)
  } else {
    calendarEvent = await response.json().catch(() => null)
    if (!response.ok) throw new Error('Google Calendar could not create the event.')
  }
  if (!calendarEvent) throw new Error('Google Calendar event could not be retrieved.')

  let meetingUrl = calendarEvent.hangoutLink || calendarEvent.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === 'video')?.uri || null
  for (let attempt = 0; !meetingUrl && attempt < 3; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 700))
    const refreshed = await readCalendarEvent(accessToken, eventId)
    if (!refreshed) continue
    meetingUrl = refreshed.hangoutLink || refreshed.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === 'video')?.uri || null
  }
  return { eventId, meetingUrl, inviteSent: true }
}

const base64Url = (value) => Buffer.from(value).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

async function sendGmail(accessToken, recipient, subject, body) {
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`
  const raw = [
    `To: ${recipient}`,
    `From: ${OWNER_EMAIL}`,
    `Reply-To: ${OWNER_EMAIL}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 8bit',
    '',
    body,
  ].join('\r\n')
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: base64Url(raw) }),
  })
  if (!response.ok) throw new Error('The email could not be sent.')
}

export async function notifyOwner(accessToken, appointment, meetingUrl, inviteSent) {
  const subject = `New consultation request from ${appointment.name}`
  const body = [
    'A consultation request was submitted.',
    '',
    `Name: ${appointment.name}`,
    `Email: ${appointment.email}`,
    `Requested date: ${appointment.appointment_date}`,
    `Requested time: ${appointment.appointment_time} (${appointment.timezone})`,
    `Duration: ${appointment.duration_minutes} minutes`,
    `Availability source: ${appointment.availability_source}`,
    `Client calendar invitation: ${inviteSent ? 'sent' : 'not sent (the owner must approve this request first)'}`,
    `Google Meet: ${meetingUrl || 'not created'}`,
    '',
    'This is a request pending admin confirmation. Review it at /admin.',
    appointment.message ? `\nNote: ${appointment.message}` : '',
  ].filter(Boolean).join('\r\n')
  await sendGmail(accessToken, OWNER_EMAIL, subject, body)
}

export async function notifyCustomer(accessToken, appointment, status) {
  const approved = status === 'confirmed'
  const subject = approved ? 'Your appointment request was approved' : 'Your appointment request was cancelled'
  const body = [
    `Hi ${appointment.name},`,
    '',
    approved
      ? 'Your appointment request has been approved.'
      : 'Your appointment request has been cancelled by the admin.',
    '',
    `Date: ${appointment.appointment_date}`,
    `Time: ${appointment.appointment_time} (${appointment.timezone})`,
    `Duration: ${appointment.duration_minutes} minutes`,
    '',
    approved
      ? 'We look forward to speaking with you. Reply to this email if you have any questions.'
      : 'Please reply to this email if you would like to request another time.',
  ].join('\r\n')
  await sendGmail(accessToken, appointment.email, subject, body)
}
