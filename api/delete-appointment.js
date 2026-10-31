/* global process */
import { createClient } from '@supabase/supabase-js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' })

  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  const url = process.env.SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !anonKey || !serviceKey) return res.status(503).json({ message: 'The appointment deletion service is not configured.' })
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
    .delete()
    .eq('id', appointmentId)
    .eq('status', 'cancelled')
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('Cancelled appointment deletion failed:', error.message)
    return res.status(500).json({ message: 'The cancelled appointment could not be deleted.' })
  }
  if (!data) return res.status(409).json({ message: 'Only cancelled appointments can be permanently deleted.' })

  return res.status(200).json({ ok: true, id: data.id })
}
