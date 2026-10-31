import { useCallback, useEffect, useState } from 'react'
import { ArrowClockwise, CalendarBlank, Check, SignOut } from '@phosphor-icons/react'
import { supabase, supabaseConfigured } from '../lib/supabase'

const dateLabel = (value) => new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeZone: 'UTC',
}).format(new Date(`${value}T12:00:00.000Z`))

const timeLabel = (value) => {
  const [hour, minute] = value.split(':').map(Number)
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`
}

const createdLabel = (value) => new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Kolkata',
}).format(new Date(value))

const statusStyle = {
  pending: 'border-amber-300 bg-amber-50 text-amber-900',
  confirmed: 'border-[#a4be2d] bg-[#eef4d8] text-[#34420f]',
  cancelled: 'border-[#e5b5ab] bg-[#fbefec] text-[#8a2b1d]',
}

export default function Admin() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(supabaseConfigured)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState('')
  const [approvingId, setApprovingId] = useState('')
  const [retryingId, setRetryingId] = useState('')
  const [deletingId, setDeletingId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Admin | Hashir Usman'
    if (!supabase) return undefined

    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession)
        setAuthLoading(false)
        setError('')
      }
    })
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return
      if (sessionError) setError('Could not check your admin session. Please reload and try again.')
      setSession(data.session)
      setAuthLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const isAdmin = session?.user?.app_metadata?.role === 'admin'

  const loadAppointments = useCallback(async () => {
    if (!supabase || !isAdmin) return
    setLoading(true)
    setError('')
    const { data, error: queryError } = await supabase
      .from('appointments')
      .select('id,name,email,appointment_date,appointment_time,timezone,duration_minutes,message,availability_source,status,meeting_url,client_invite_sent,owner_notified,customer_notified,delivery_note,created_at')
      .order('created_at', { ascending: false })
    if (queryError) {
      setError('Could not load appointments. Check the Supabase schema and admin role policies.')
      setAppointments([])
    } else {
      setAppointments(data || [])
    }
    setLoading(false)
  }, [isAdmin])

  // Refresh the admin list when Supabase Auth grants the admin role.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadAppointments() }, [loadAppointments])

  const signIn = async (event) => {
    event.preventDefault()
    if (!supabase) return
    setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (signInError) setError('Sign-in failed. Check your email and password.')
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setAppointments([])
    setPassword('')
  }

  const approveAppointment = async (appointment) => {
    if (!supabase || !isAdmin) return
    setApprovingId(appointment.id)
    setError('')
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !currentSession?.access_token) throw new Error('Your admin session expired. Sign in again.')
      const response = await fetch('/api/approve-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${currentSession.access_token}` },
        body: JSON.stringify({ appointmentId: appointment.id }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.message || 'Could not approve this request.')
      setAppointments((items) => items.map((item) => item.id === appointment.id
        ? { ...item, status: 'confirmed', meeting_url: result.meetingUrl || null, client_invite_sent: result.clientInviteSent, customer_notified: result.customerNotified, delivery_note: result.deliveryNote }
        : item))
    } catch (approvalError) {
      setError(approvalError.message || 'Could not approve this request.')
    } finally {
      setApprovingId('')
    }
  }

  const cancelAppointment = async (appointment) => {
    if (!supabase || !isAdmin) return
    setUpdatingId(appointment.id)
    setError('')
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !currentSession?.access_token) throw new Error('Your admin session expired. Sign in again.')
      const response = await fetch('/api/cancel-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${currentSession.access_token}` },
        body: JSON.stringify({ appointmentId: appointment.id }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.message || 'Could not cancel this request.')
      setAppointments((items) => items.map((item) => item.id === appointment.id
        ? { ...item, status: 'cancelled', ...(result.calendarEventRemoved ? { meeting_url: null, client_invite_sent: false } : {}), customer_notified: result.customerNotified, delivery_note: result.deliveryNote }
        : item))
    } catch (cancelError) {
      setError(cancelError.message || 'Could not cancel this request.')
    } finally {
      setUpdatingId('')
    }
  }

  const retryAppointmentEmails = async (appointment) => {
    if (!supabase || !isAdmin) return
    setRetryingId(appointment.id)
    setError('')
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !currentSession?.access_token) throw new Error('Your admin session expired. Sign in again.')
      const response = await fetch('/api/retry-appointment-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${currentSession.access_token}` },
        body: JSON.stringify({ appointmentId: appointment.id }),
      })
      const result = await response.json().catch(() => ({}))
      if (typeof result.ownerNotified === 'boolean' || typeof result.customerNotified === 'boolean') {
        setAppointments((items) => items.map((item) => item.id === appointment.id
          ? { ...item, owner_notified: result.ownerNotified ?? item.owner_notified, customer_notified: result.customerNotified ?? item.customer_notified, delivery_note: result.deliveryNote || null }
          : item))
      }
      if (!response.ok) throw new Error(result.deliveryNote || result.message || 'Email retry failed.')
    } catch (retryError) {
      setError(retryError.message || 'Email retry failed.')
    } finally {
      setRetryingId('')
    }
  }

  const deleteCancelledAppointment = async (appointment) => {
    if (!supabase || !isAdmin || appointment.status !== 'cancelled') return
    const confirmed = window.confirm(`Permanently delete the cancelled appointment for ${appointment.name}? This cannot be undone.`)
    if (!confirmed) return
    setDeletingId(appointment.id)
    setError('')
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !currentSession?.access_token) throw new Error('Your admin session expired. Sign in again.')
      const response = await fetch('/api/delete-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${currentSession.access_token}` },
        body: JSON.stringify({ appointmentId: appointment.id }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.message || 'Could not delete this appointment.')
      setAppointments((items) => items.filter((item) => item.id !== appointment.id))
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete this appointment.')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <main id="main" className="min-h-[70vh] bg-[#f2f3ef] px-5 py-10 text-[#171a17] sm:px-8 sm:py-14">
      <div className="mx-auto w-full max-w-[1120px]">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#617319]">Private workspace</p>
            <h1 className="m-0 text-[clamp(34px,5vw,58px)] font-extrabold leading-none tracking-[-.055em]">Appointment requests</h1>
            <p className="mb-0 mt-3 max-w-[60ch] text-sm leading-6 text-[#62695e]">Review requested times. A request stays pending until you confirm it with the client.</p>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button type="button" onClick={loadAppointments} disabled={loading} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d4dbc8] bg-white px-4 text-sm font-semibold transition-colors hover:bg-[#f8f9f6] disabled:opacity-60">
                <ArrowClockwise size={17} aria-hidden /> Refresh
              </button>
              <button type="button" onClick={signOut} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#153b2b] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#101310]">
                <SignOut size={17} aria-hidden /> Sign out
              </button>
            </div>
          )}
        </header>

        {!supabaseConfigured ? (
          <section className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-sm leading-6 text-amber-950">
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to the app environment, then restart the site to enable admin sign-in.
          </section>
        ) : authLoading ? (
          <p role="status" className="rounded-2xl border border-[#d4dbc8] bg-white p-6 text-sm text-[#62695e]">Checking admin session…</p>
        ) : !session ? (
          <section className="mx-auto max-w-[440px] rounded-2xl border border-[#e2e6dc] bg-white p-6 shadow-[0_20px_50px_-36px_#18220d70] sm:p-8">
            <h2 className="m-0 text-2xl font-bold tracking-[-.04em]">Admin sign in</h2>
            <p className="mb-6 mt-2 text-sm leading-6 text-[#62695e]">Use the admin account created in Supabase Authentication.</p>
            <form onSubmit={signIn} className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold">Email
                <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 rounded-xl border border-[#d4dbc8] px-4 font-normal outline-none focus-visible:ring-2 focus-visible:ring-[#a4be2d]" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">Password
                <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 rounded-xl border border-[#d4dbc8] px-4 font-normal outline-none focus-visible:ring-2 focus-visible:ring-[#a4be2d]" />
              </label>
              {error && <p role="alert" className="m-0 text-sm text-[#a63a28]">{error}</p>}
              <button type="submit" className="mt-1 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#a4be2d] px-5 text-sm font-bold text-[#171a17] transition-colors hover:bg-[#b3cc35]">Sign in</button>
            </form>
          </section>
        ) : !isAdmin ? (
          <section className="rounded-2xl border border-[#e5b5ab] bg-[#fbefec] p-6 text-sm leading-6 text-[#8a2b1d]">
            This account does not have the admin role. Set <code>app_metadata.role</code> to <code>admin</code> for the authorized user in Supabase, then sign out and sign in again.
            <button type="button" onClick={signOut} className="ml-3 font-bold underline">Sign out</button>
          </section>
        ) : (
          <section aria-label="Appointment requests" className="overflow-hidden rounded-2xl border border-[#e2e6dc] bg-white shadow-[0_20px_50px_-36px_#18220d70]">
            <div className="flex items-center justify-between gap-4 border-b border-[#edf0e7] px-5 py-4 sm:px-6">
              <p className="m-0 text-sm font-semibold">{appointments.length} {appointments.length === 1 ? 'request' : 'requests'}</p>
              <span className="text-xs text-[#62695e]">Signed in as {session.user.email}</span>
            </div>
            {error && <p role="alert" className="m-0 border-b border-[#e5b5ab] bg-[#fbefec] px-5 py-3 text-sm text-[#8a2b1d] sm:px-6">{error}</p>}
            {loading ? (
              <p role="status" className="m-0 p-8 text-center text-sm text-[#62695e]">Loading appointment requests…</p>
            ) : appointments.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <CalendarBlank size={34} aria-hidden className="mx-auto text-[#7c9318]" />
                <h2 className="mb-1 mt-3 text-lg font-bold">No appointment requests yet</h2>
                <p className="m-0 text-sm text-[#62695e]">New submissions will appear here after Supabase is configured.</p>
              </div>
            ) : (
              <ul className="m-0 grid list-none divide-y divide-[#edf0e7] p-0">
                {appointments.map((appointment) => (
                  <li key={appointment.id} className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="m-0 text-lg font-bold">{appointment.name}</h2>
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[.06em] ${statusStyle[appointment.status] || statusStyle.pending}`}>{appointment.status}</span>
                        {appointment.availability_source === 'website' && <span className="rounded-full border border-[#d4dbc8] bg-[#f8f9f6] px-2.5 py-1 text-[11px] font-semibold text-[#62695e]">Website slot</span>}
                      </div>
                      <a href={`mailto:${appointment.email}`} className="mt-1 inline-block break-all text-sm text-[#526313] underline">{appointment.email}</a>
                      <p className="mb-0 mt-3 text-sm font-semibold text-[#153b2b]">{dateLabel(appointment.appointment_date)} · {timeLabel(appointment.appointment_time)} ({appointment.timezone}) · {appointment.duration_minutes} min</p>
                      {appointment.message && <p className="mb-0 mt-3 whitespace-pre-wrap text-sm leading-6 text-[#4c5448]">{appointment.message}</p>}
                      {appointment.meeting_url && <a href={appointment.meeting_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-[#526313] underline">Open Google Meet</a>}
                      <p className="mb-0 mt-3 text-xs text-[#62695e]">Admin email: {appointment.owner_notified ? 'sent' : 'not sent'} · Calendar invite: {appointment.client_invite_sent ? 'sent' : 'not sent'} · Customer email: {appointment.customer_notified ? 'sent' : 'not sent'}</p>
                      {appointment.delivery_note && <p className="mb-0 mt-2 text-xs leading-5 text-[#8a2b1d]">{appointment.delivery_note}</p>}
                      <p className="mb-0 mt-3 text-xs text-[#7a8074]">Received {createdLabel(appointment.created_at)}</p>
                    </div>
                    <div className="grid gap-2 lg:w-52">
                      {appointment.status === 'pending' && (
                        <button type="button" onClick={() => approveAppointment(appointment)} disabled={approvingId === appointment.id} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#a4be2d] px-4 text-sm font-bold text-[#171a17] transition-colors hover:bg-[#b3cc35] disabled:opacity-60">
                          {approvingId === appointment.id ? 'Approving…' : 'Approve request'}
                        </button>
                      )}
                      {appointment.status !== 'cancelled' && (
                        <button type="button" onClick={() => cancelAppointment(appointment)} disabled={updatingId === appointment.id} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#e5b5ab] px-4 text-sm font-semibold text-[#8a2b1d] transition-colors hover:bg-[#fbefec] disabled:opacity-60">
                          {updatingId === appointment.id ? 'Saving…' : appointment.status === 'pending' ? 'Reject request' : 'Cancel appointment'}
                        </button>
                      )}
                      {appointment.status !== 'cancelled' && (!appointment.owner_notified || (appointment.status === 'confirmed' && !appointment.customer_notified)) && (
                        <button type="button" onClick={() => retryAppointmentEmails(appointment)} disabled={retryingId === appointment.id} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#d4dbc8] bg-white px-4 text-sm font-semibold text-[#34420f] transition-colors hover:bg-[#f1f5e7] disabled:opacity-60">
                          {retryingId === appointment.id ? 'Retrying email…' : 'Retry failed email(s)'}
                        </button>
                      )}
                      {appointment.status === 'cancelled' && (
                        <button type="button" onClick={() => deleteCancelledAppointment(appointment)} disabled={deletingId === appointment.id} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#e5b5ab] bg-white px-4 text-sm font-semibold text-[#8a2b1d] transition-colors hover:bg-[#fbefec] disabled:opacity-60">
                          {deletingId === appointment.id ? 'Deleting…' : 'Delete permanently'}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center gap-2 border-t border-[#edf0e7] bg-[#f8f9f6] px-5 py-3 text-xs text-[#62695e] sm:px-6">
              <Check size={15} aria-hidden /> Pending and approved requests reserve their slot. Cancelling a request makes it available again.
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
