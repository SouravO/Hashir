/* global process */
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import bookConsultation from './api/book-consultation.js'
import availability from './api/availability.js'
import approveAppointment from './api/approve-appointment.js'
import cancelAppointment from './api/cancel-appointment.js'
import submitOpportunity from './api/submit-opportunity.js'
import retryAppointmentEmails from './api/retry-appointment-emails.js'

const localApiHandlers = {
  '/api/book-consultation': bookConsultation,
  '/api/availability': availability,
  '/api/approve-appointment': approveAppointment,
  '/api/cancel-appointment': cancelAppointment,
  '/api/submit-opportunity': submitOpportunity,
  '/api/retry-appointment-emails': retryAppointmentEmails,
}

function localApi() {
  return {
    name: 'local-booking-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', 'http://localhost')
        const handler = localApiHandlers[url.pathname]
        if (!handler) return next()

        req.query = Object.fromEntries(url.searchParams.entries())
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          try {
            let rawBody = ''
            for await (const chunk of req) {
              rawBody += chunk
              if (rawBody.length > 1_000_000) throw new Error('Request body is too large.')
            }
            req.body = rawBody ? JSON.parse(rawBody) : {}
          } catch {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'Request body must be valid JSON.' }))
            return
          }
        }

        let statusCode = 200
        const response = {
          status(code) { statusCode = code; return this },
          json(data) {
            if (res.writableEnded) return this
            res.statusCode = statusCode
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return this
          },
        }

        try {
          await handler(req, response)
          if (!res.writableEnded) res.end()
        } catch (error) {
          console.error(`Local API error (${url.pathname}):`, error)
          if (!res.writableEnded) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'The local API encountered an error.' }))
          }
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const name of ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'BOOKING_ENABLED', 'VITE_LIVE_AVAILABILITY_ENABLED', 'MEET_INVITES_ENABLED', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN']) {
    if (process.env[name] === undefined && env[name]) process.env[name] = env[name]
  }

  return {
    plugins: [react(), tailwindcss(), localApi()],
  }
})
