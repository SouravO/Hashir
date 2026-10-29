import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, CaretLeft, CaretRight, CheckCircle, CircleNotch, X as CloseIcon } from '@phosphor-icons/react'

/* ---------- Consultation booking modal ----------
   Opens from any element marked `data-booking-trigger` (the "Let's cook ↗" CTA) without leaving the page.
   Website slot availability and requests are handled by the server API; Google Calendar availability is optional.

   INTEGRATION POINTS for the real calendar (search for "INTEGRATION POINT"):
     1. loadSlots()      -> replace with a call to a backend route that reads real free/busy data.
     2. isDateOpen()     -> replace with a month-level availability map from the same backend route.
     3. submitBooking()  -> keep POSTing to /api/book-consultation, or point BOOKING.endpoint at the route that
                            reserves the slot (e.g. Google Calendar events.insert from a server, using a service
                            account or OAuth token kept in server-side env vars, never in VITE_ variables).
   Google Calendar creates the unique Meet event and sends the client invite; Gmail API sends the owner notification. */

const BOOKING = {
  timezone: 'Asia/Kolkata', /* INTEGRATION POINT: set to the owner's calendar timezone */
  durationMin: 30,
  disabled: import.meta.env.VITE_BOOKING_ENABLED !== 'true',
  endpoint: '/api/book-consultation',
  windowDays: 7, /* rolling booking window */
  minNoticeMin: 120, /* same-day slots closer than this are hidden */
  timeoutMs: 15000,
}

/* Website schedule. Pending and approved Supabase requests reserve these slots. */
const BOOKING_SCHEDULE = {
  note: 'Times are shown in India Standard Time. Requests are confirmed after admin approval.',
  openWeekdays: [0, 1, 2, 3, 4, 5, 6], /* All days; 0 = Sunday */
  blockedDates: [], /* e.g. ['2026-12-25'] */
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Dates travel as 'YYYY-MM-DD' strings in BOOKING.timezone. UTC is used only as a neutral calendar for the arithmetic. */
const pad2 = (n) => String(n).padStart(2, '0')
const toKey = (y, m, d) => `${y}-${pad2(m + 1)}-${pad2(d)}`
const parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return { y, m: m - 1, d } }
const keyWeekday = (k) => { const { y, m, d } = parseKey(k); return new Date(Date.UTC(y, m, d)).getUTCDay() }
const addDaysKey = (k, n) => { const { y, m, d } = parseKey(k); const t = new Date(Date.UTC(y, m, d + n)); return toKey(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()) }
const fmtDate = (k) => { const { y, m, d } = parseKey(k); return `${DAYS_SHORT[keyWeekday(k)]}, ${d} ${MONTHS[m].slice(0, 3)} ${y}` }
const fmtTime = (t) => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${pad2(m)} ${h < 12 ? 'AM' : 'PM'}` }
const zoneNow = (tz) => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date())
  const get = (type) => Number(parts.find((p) => p.type === type).value)
  return { key: toKey(get('year'), get('month') - 1, get('day')), minutes: (get('hour') % 24) * 60 + get('minute') }
}
const ZONE_NAME = (() => {
  try { return new Intl.DateTimeFormat('en-IN', { timeZone: BOOKING.timezone, timeZoneName: 'long' }).formatToParts(new Date()).find((p) => p.type === 'timeZoneName')?.value || BOOKING.timezone } catch { return BOOKING.timezone }
})()

/* Day-level schedule: weekdays inside the booking window. */
function isDateOpen(key, now) {
  if (key < now.key || key > addDaysKey(now.key, BOOKING.windowDays)) return false
  if (BOOKING_SCHEDULE.blockedDates.includes(key)) return false
  return BOOKING_SCHEDULE.openWeekdays.includes(keyWeekday(key))
}

/* Slot availability always comes from the server so pending and approved requests stay reserved. */
async function loadSlots(key) {
  const response = await fetch(`/api/availability?date=${encodeURIComponent(key)}`)
  const data = await response.json().catch(() => null)
  if (!response.ok || !['website', 'live'].includes(data?.source) || !Array.isArray(data?.slots)) {
    throw new Error(data?.message || 'Availability is not available.')
  }
  return data
}

/* INTEGRATION POINT 3: submit the request. Resolves { ok: true } only when the backend confirms it received the request. */
async function submitBooking(payload) {
  if (BOOKING.disabled) {
    return { ok: false, kind: 'unavailable' }
  }
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), BOOKING.timeoutMs)
  try {
    const res = await fetch(BOOKING.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ctl.signal })
    let data = null
    try { data = await res.json() } catch { data = null }
    if (res.ok && data?.ok) return { ok: true, data }
    if ((res.status === 400 || res.status === 409) && data?.message) return { ok: false, kind: 'invalid', message: data.message }
    if (res.status >= 500 && data?.message) return { ok: false, kind: 'server', message: data.message }
    return { ok: false, kind: 'unavailable' } /* 404, 405, or a non-JSON reply: the endpoint is not there */
  } catch {
    return { ok: false, kind: 'unavailable' } /* offline, blocked, or timed out */
  } finally {
    clearTimeout(timer)
  }
}

const BK_FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
const bkField = 'h-14 w-full rounded-xl border bg-white px-5 text-base text-[#101310] placeholder:text-[#72766f] transition-colors duration-200 focus-visible:border-[#153B2B]'
const bkErr = 'mt-2 text-[13px] font-medium text-[#a63a28]'
const bkNav = 'grid size-11 place-items-center rounded-full text-[#153B2B] transition-colors duration-200 hover:bg-[#153B2B]/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent'

export default function BookingDialog({ onClose, triggerRef }) {
  const [entered, setEntered] = useState(false)
  const [now] = useState(() => zoneNow(BOOKING.timezone))
  const [view, setView] = useState(() => { const { y, m } = parseKey(zoneNow(BOOKING.timezone).key); return { y, m } })
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [avail, setAvail] = useState({ key: '', status: 'idle', slots: [], source: 'website' })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ state: 'idle' })
  const panelRef = useRef(null)
  const dateRef = useRef(null)
  const timeRef = useRef(null)
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const requestIdRef = useRef(null)
  const doneRef = useRef(null)
  const submittingRef = useRef(false)
  const aliveRef = useRef(true)

  const submitting = status.state === 'submitting'
  const shown = entered
  const todayKey = now.key
  const { y: ty, m: tm } = parseKey(todayKey)

  /* mount: fade/slide in, lock page scroll, focus the dialog; unmount: restore scroll and return focus to the opener */
  useEffect(() => {
    aliveRef.current = true
    const raf = requestAnimationFrame(() => setEntered(true))
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus({ preventScroll: true })
    return () => {
      aliveRef.current = false
      cancelAnimationFrame(raf)
      document.body.style.overflow = prevOverflow
      /* read at close time on purpose: we want the opener that is current when the dialog goes away */
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const t = triggerRef.current
      if (t && t.isConnected) t.focus({ preventScroll: true })
    }
  }, [triggerRef])

  /* Escape closes (unless a request is in flight); Tab is kept inside the dialog */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (!submittingRef.current) { e.preventDefault(); onClose() }
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const nodes = [...panelRef.current.querySelectorAll(BK_FOCUSABLE)].filter((n) => n.getClientRects().length > 0)
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement
      const inside = panelRef.current.contains(active)
      if (e.shiftKey && (!inside || active === first || active === panelRef.current)) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && (!inside || active === last)) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  /* load the slots for the chosen date; a stale response is ignored if the date changes meanwhile */
  useEffect(() => {
    if (!date) return undefined
    let live = true
    loadSlots(date)
      .then((r) => { if (live) setAvail({ key: date, status: 'ready', slots: r.slots, source: r.source }) })
      .catch(() => { if (live) setAvail({ key: date, status: 'error', slots: [], source: 'website' }) })
    return () => { live = false }
  }, [date])

  useEffect(() => { if (status.state === 'success') doneRef.current?.focus() }, [status.state])

  /* calendar grid: Monday-first, leading days from the previous month are shown muted, trailing cells stay empty */
  const cells = useMemo(() => {
    const lead = (new Date(Date.UTC(view.y, view.m, 1)).getUTCDay() + 6) % 7
    const dim = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate()
    const total = Math.ceil((lead + dim) / 7) * 7
    return Array.from({ length: total }, (_, i) => {
      const t = new Date(Date.UTC(view.y, view.m, 1 - lead + i))
      return { key: toKey(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()), day: t.getUTCDate(), inMonth: t.getUTCMonth() === view.m, leading: i < lead }
    })
  }, [view])

  const canPrev = view.y * 12 + view.m > ty * 12 + tm
  const nextFirst = toKey(view.m === 11 ? view.y + 1 : view.y, (view.m + 1) % 12, 1)
  const canNext = nextFirst <= addDaysKey(todayKey, BOOKING.windowDays)
  const shift = (n) => setView((v) => { const t = new Date(Date.UTC(v.y, v.m + n, 1)); return { y: t.getUTCFullYear(), m: t.getUTCMonth() } })

  const loadingSlots = Boolean(date) && avail.key !== date
  const slots = avail.key === date ? avail.slots : []
  const websiteSlots = avail.source === 'website'

  const pickDate = (key) => {
    requestIdRef.current = null
    setDate(key)
    setTime('')
    setErrors((e) => ({ ...e, date: undefined, time: undefined }))
    setStatus((s) => (s.state === 'error' ? { state: 'idle' } : s))
  }
  const pickTime = (t) => { requestIdRef.current = null; setTime(t); setErrors((e) => ({ ...e, time: undefined })) }

  const validate = () => {
    const e = {}
    if (!date) e.date = 'Pick a date to continue.'
    if (!time) e.time = date ? 'Pick a time slot.' : 'Pick a date first, then choose a time.'
    else if (!slots.find((s) => s.time === time)?.available) e.time = 'That time is no longer available. Pick another one.'
    if (!name.trim()) e.name = 'Please enter your name.'
    if (!email.trim()) e.email = 'Please enter your email address.'
    else if (!EMAIL_RE.test(email.trim())) e.email = 'That email address doesn’t look right.'
    return e
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (submittingRef.current) return
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      const target = e.date ? dateRef : e.time ? timeRef : e.name ? nameRef : emailRef
      target.current?.scrollIntoView?.({ block: 'center', behavior: calm() ? 'auto' : 'smooth' })
      if (target === nameRef || target === emailRef) target.current?.focus({ preventScroll: true })
      return
    }
    submittingRef.current = true
    setStatus({ state: 'submitting' })
    requestIdRef.current ||= crypto.randomUUID()
    const payload = {
      requestId: requestIdRef.current,
      name: name.trim(),
      email: email.trim(),
      date, /* YYYY-MM-DD */
      time, /* 24-hour local time for database storage */
      timezone: BOOKING.timezone,
      durationMinutes: BOOKING.durationMin,
      availabilitySource: avail.source,
      /* The existing endpoint already prints `message`, so the owner email carries the context without any backend change. */
      message: `Requested through the website. Availability source: ${avail.source}. This is a request and requires admin confirmation.`,
    }
    const result = await submitBooking(payload)
    submittingRef.current = false
    if (!aliveRef.current) return
    setStatus(result.ok ? { state: 'success', data: result.data } : { state: 'error', kind: result.kind, message: result.message })
  }

  const closeFromUi = () => { if (!submittingRef.current) onClose() }

  const errorCopy = status.state === 'error' && (status.kind === 'unavailable'
    ? ['Booking is unavailable', 'The booking service could not be reached. No appointment was created. Your selection is still in place.']
    : status.kind === 'invalid'
      ? ['Check your details', status.message]
      : ['We couldn’t send your request', `${status.message || 'Something went wrong on our side.'} Nothing was confirmed.`])

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div aria-hidden onClick={closeFromUi} className={`absolute inset-0 bg-[#101310]/65 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${shown ? 'opacity-100' : 'opacity-0'}`} />
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center sm:items-center sm:p-6">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="bk-title"
          aria-describedby="bk-sub"
          tabIndex={-1}
          className={`pointer-events-auto flex w-full flex-col overflow-hidden bg-[#F2F3EF] text-[#101310] shadow-[0_40px_100px_-30px_rgba(0,0,0,.6)] outline-none transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none max-h-[calc(100dvh_-_env(safe-area-inset-top)_-_0.5rem)] max-sm:rounded-t-3xl sm:max-h-[min(92dvh,900px)] sm:max-w-[640px] sm:rounded-[28px] ${shown ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-6 scale-[.98] opacity-0'}`}
        >
          <header className="relative shrink-0 bg-[#153B2B] px-6 pb-7 pt-6 sm:px-8">
            <p className="m-0 pr-12 text-[13px] font-semibold uppercase tracking-[.12em] text-[#A4BE2D]">Let’s make moves</p>
            <h2 id="bk-title" className="m-0 mt-2 text-[clamp(26px,4vw,34px)] font-bold leading-[1.1] tracking-[-.03em] text-white">Got something in mind?</h2>
            <p id="bk-sub" className="m-0 mt-2 text-base text-[#F2F3EF]/85 sm:text-[17px]">Pick a date, find a time, and let’s talk.</p>
            <button type="button" onClick={closeFromUi} aria-label="Close booking dialog" aria-disabled={submitting || undefined} className="absolute right-3 top-3 grid size-11 place-items-center rounded-full text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-[#A4BE2D] aria-disabled:opacity-40">
              <CloseIcon size={22} aria-hidden />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:px-8 sm:pb-8">
            {status.state === 'success' ? (
              <div className="py-6 text-center">
                <CheckCircle weight="fill" size={60} aria-hidden className="mx-auto text-[#A4BE2D]" />
                <h3 ref={doneRef} tabIndex={-1} className="m-0 mt-5 text-[28px] font-bold tracking-[-.03em] text-[#153B2B] outline-none">Request submitted</h3>
                <p className="mx-auto mt-3 max-w-[420px] text-base leading-[1.6] text-[#3d433b]">Thanks, {name.trim().split(/\s+/)[0]}. Your request is saved for admin review. This is not a confirmed appointment.</p>
                <dl className="mx-auto mt-6 grid max-w-[420px] gap-px overflow-hidden rounded-2xl border border-[#d0d5c6] bg-[#d0d5c6] text-left">
                  {[['Date', fmtDate(date)], ['Time', `${fmtTime(time)} · ${ZONE_NAME}`], ['Length', `${BOOKING.durationMin} minutes`]].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 bg-white px-5 py-3.5">
                      <dt className="text-sm text-[#72766f]">{k}</dt>
                      <dd className="m-0 text-right text-[15px] font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mx-auto mt-6 max-w-[420px] text-[15px] leading-[1.6] text-[#3d433b]">Your request is pending admin approval. No calendar invitation was sent.</p>
                <p className="mx-auto mt-2 max-w-[420px] text-[13px] leading-[1.55] text-[#72766f]">
                  {status.data?.ownerNotified ? 'The request notification was emailed to hashirusman120@gmail.com.' : 'The request was saved, but the owner notification email was not sent.'}
                </p>
                <button type="button" onClick={onClose} className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-[#153B2B] px-8 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#101310] active:scale-[.98]">Close</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-8">
                <section ref={dateRef} aria-labelledby="bk-h-date" className="scroll-mt-4">
                  <h3 id="bk-h-date" className="m-0 mb-4 text-[19px] font-bold tracking-[-.02em]">01 — Pick your date</h3>
                  <div className="rounded-2xl border border-[#d0d5c6] bg-[#f6f7f3] px-3 pb-4 pt-3 sm:px-4">
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month" className={bkNav}><CaretLeft size={20} aria-hidden /></button>
                      <p aria-live="polite" className="m-0 text-[19px] font-semibold text-[#153B2B]">{MONTHS[view.m]} {view.y}</p>
                      <button type="button" onClick={() => shift(1)} disabled={!canNext} aria-label="Next month" className={bkNav}><CaretRight size={20} aria-hidden /></button>
                    </div>
                    <div aria-hidden className="mt-3 grid grid-cols-7 text-center text-sm font-medium text-[#72766f]">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i} className="py-2">{d}</span>)}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1">
                      {cells.map((c) => {
                        if (!c.inMonth) return c.leading ? <span key={c.key} aria-hidden className="grid h-11 place-items-center text-[17px] text-[#c2c6bb]">{c.day}</span> : <span key={c.key} aria-hidden />
                        const past = c.key < todayKey
                        const isOpen = isDateOpen(c.key, now)
                        const sel = c.key === date
                        const isToday = c.key === todayKey
                        const tone = sel
                          ? 'bg-[#A4BE2D] font-bold text-[#101310]'
                          : isOpen
                            ? 'text-[#101310] hover:bg-[#A4BE2D]/25'
                            : past
                              ? 'text-[#c2c6bb]'
                              : 'text-[#9a9f92] line-through decoration-[#9a9f92]/60'
                        return (
                          <button
                            key={c.key}
                            type="button"
                            disabled={!isOpen}
                            aria-pressed={sel}
                            aria-current={isToday ? 'date' : undefined}
                            aria-label={`${fmtDate(c.key)}${isToday ? ', today' : ''}${isOpen ? '' : past ? ', past date' : ', unavailable'}`}
                            onClick={() => pickDate(c.key)}
                            className={`relative mx-auto grid h-11 w-full max-w-[88px] place-items-center rounded-lg text-[17px] transition-colors duration-200 disabled:cursor-not-allowed ${isToday && !sel ? 'ring-1 ring-inset ring-[#153B2B]/45' : ''} ${tone}`}
                          >
                            {c.day}
                            {isToday && <span aria-hidden className="absolute bottom-1 size-1 rounded-full bg-[#153B2B]" />}
                          </button>
                        )
                      })}
                    </div>
                    <p className="m-0 mt-4 px-1 text-[13px] leading-[1.5] text-[#72766f]">{BOOKING_SCHEDULE.note}</p>
                  </div>
                  {errors.date && <p id="bk-err-date" role="alert" className={bkErr}>{errors.date}</p>}
                </section>

                <section ref={timeRef} aria-labelledby="bk-h-time" className="scroll-mt-4">
                  <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 id="bk-h-time" className="m-0 text-[19px] font-bold tracking-[-.02em]">02 — Pick your time</h3>
                    {websiteSlots && <span className="rounded-full border border-[#7c9318]/50 bg-[#A4BE2D]/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[.08em] text-[#4d5c0f]">Website slots</span>}
                  </div>
                  {!date ? (
                    <p className="m-0 rounded-xl border border-dashed border-[#c4c9b9] px-5 py-6 text-center text-[15px] text-[#72766f]">Choose a date above to see times.</p>
                  ) : loadingSlots ? (
                    <p role="status" className="m-0 rounded-xl border border-dashed border-[#c4c9b9] px-5 py-6 text-center text-[15px] text-[#72766f]">Checking times…</p>
                  ) : avail.status === 'error' ? (
                    <p role="alert" className="m-0 rounded-xl border border-dashed border-[#e5b5ab] px-5 py-6 text-center text-[15px] text-[#a63a28]">Couldn’t load times for this date. Try another date.</p>
                  ) : slots.every((s) => !s.available) ? (
                    <p className="m-0 rounded-xl border border-dashed border-[#c4c9b9] px-5 py-6 text-center text-[15px] text-[#72766f]">No times left on this day. Try another date.</p>
                  ) : (
                    <div role="group" aria-label={`Available times on ${fmtDate(date)}`} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {slots.map((s) => {
                        const sel = s.time === time
                        return (
                          <button
                            key={s.time}
                            type="button"
                            disabled={!s.available}
                            aria-pressed={sel}
                            aria-label={s.available ? s.label : `${s.label}, unavailable`}
                            onClick={() => pickTime(s.time)}
                            className={`h-[58px] rounded-xl border text-[17px] transition-colors duration-200 disabled:cursor-not-allowed ${sel ? 'border-[#153B2B] bg-[#153B2B] font-semibold text-white' : s.available ? 'border-[#d0d5c6] bg-white hover:border-[#153B2B]/60' : 'border-[#e1e4db] bg-[#e9ebe4]/60 text-[#a6ab9d] line-through'}`}
                          >
                            {s.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  {date && <p className="m-0 mt-3 text-[13px] text-[#72766f]">Times shown in {ZONE_NAME} ({BOOKING.timezone}). {BOOKING.durationMin}-minute call.</p>}
                  {errors.time && <p id="bk-err-time" role="alert" className={bkErr}>{errors.time}</p>}
                </section>

                <section aria-labelledby="bk-h-you">
                  <h3 id="bk-h-you" className="m-0 mb-4 text-[19px] font-bold tracking-[-.02em]">03 — Your details</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="bk-name" className="sr-only">Full name</label>
                      <input ref={nameRef} id="bk-name" name="name" type="text" autoComplete="name" maxLength={100} placeholder="Your name" value={name} disabled={submitting} required aria-required="true" aria-invalid={errors.name ? 'true' : undefined} aria-describedby={errors.name ? 'bk-err-name' : undefined} onChange={(e) => { requestIdRef.current = null; setName(e.target.value); setErrors((x) => ({ ...x, name: undefined })) }} className={`${bkField} ${errors.name ? 'border-[#c0432d]' : 'border-[#d0d5c6]'}`} />
                      {errors.name && <p id="bk-err-name" role="alert" className={bkErr}>{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="bk-email" className="sr-only">Email address</label>
                      <input ref={emailRef} id="bk-email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={254} placeholder="Email address" value={email} disabled={submitting} required aria-required="true" aria-invalid={errors.email ? 'true' : undefined} aria-describedby={errors.email ? 'bk-err-email' : undefined} onChange={(e) => { requestIdRef.current = null; setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined })) }} className={`${bkField} ${errors.email ? 'border-[#c0432d]' : 'border-[#d0d5c6]'}`} />
                      {errors.email && <p id="bk-err-email" role="alert" className={bkErr}>{errors.email}</p>}
                    </div>
                  </div>
                </section>

                <div>
                  {date && time && <p aria-live="polite" className="m-0 mb-3 text-center text-sm text-[#3d433b]">{BOOKING.durationMin}-minute consultation · {fmtDate(date)} · {fmtTime(time)}</p>}
                  {BOOKING.disabled && (
                    <div role="status" className="mb-3 rounded-xl border border-[#e5b5ab] bg-[#fbefec] px-5 py-4">
                      <p className="m-0 text-[15px] font-semibold text-[#8a2b1d]">Booking is not connected yet</p>
                      <p className="m-0 mt-1 text-sm leading-[1.55] text-[#8a2b1d]/90">These slots are examples. Connect the server booking settings and redeploy to accept requests.</p>
                    </div>
                  )}
                  {errorCopy && (
                    <div role="alert" className="mb-3 rounded-xl border border-[#e5b5ab] bg-[#fbefec] px-5 py-4">
                      <p className="m-0 text-[15px] font-semibold text-[#8a2b1d]">{errorCopy[0]}</p>
                      <p className="m-0 mt-1 text-sm leading-[1.55] text-[#8a2b1d]/90">{errorCopy[1]}</p>
                    </div>
                  )}
                  <button type="submit" disabled={submitting || BOOKING.disabled} aria-busy={submitting || undefined} className="group inline-flex h-16 w-full items-center justify-center gap-3 rounded-xl bg-[#A4BE2D] text-lg font-bold text-[#101310] transition-[transform,background-color] duration-200 hover:bg-[#b3cc35] active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-[#A4BE2D]">
                    {submitting ? (<><CircleNotch size={20} aria-hidden className="animate-spin motion-reduce:animate-none" />Saving request…</>) : BOOKING.disabled ? <>Booking unavailable</> : (<>Send request <ArrowUpRight size={18} weight="bold" aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></>)}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
