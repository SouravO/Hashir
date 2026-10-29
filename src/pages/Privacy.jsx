import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Information you provide',
    body: 'When you request a consultation, we collect the name and email address you enter, along with your selected appointment date, time, and time zone. We use this information to process the request, manage the appointment, and contact you about its status.',
  },
  {
    title: 'How information is used and stored',
    body: 'Appointment requests are stored in our Supabase database so they can be reviewed and managed in the admin panel. Booking information is available to the site administrator and is kept only as needed to manage requests and maintain business records.',
  },
  {
    title: 'Email notifications',
    body: 'We use the Google Gmail API to send booking notifications to the administrator and appointment status emails to the email address supplied with the request. The connected Google account is used to send these messages; this site does not use it to read your Gmail inbox.',
  },
  {
    title: 'Service providers',
    body: 'Supabase provides database hosting, and Google provides email delivery. Information needed for those services is processed by those providers to operate the booking and notification features.',
  },
  {
    title: 'Your choices and questions',
    body: 'You may contact us to ask about or request deletion of information submitted with a booking. We may retain information when needed to manage an appointment or meet record-keeping obligations. Contact connect@hashirusman.online for privacy questions.',
  },
  {
    title: 'Updates and contact',
    body: 'This policy may be updated as the site or its booking features change. For questions, contact Hashir Usman at connect@hashirusman.online.',
  },
]

export default function Privacy() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-8 sm:py-24 xl:px-10">
      <div className="max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[.18em] text-[#71851d]">Privacy</p>
        <h1 className="text-4xl font-semibold tracking-tight text-[#202b20] sm:text-6xl">Privacy Policy</h1>
        <p className="mt-5 text-base leading-8 text-[#5c6359]">This policy explains how Hashir Usman’s website handles information submitted through its appointment booking feature.</p>
        <p className="mt-3 text-sm text-[#72766f]">Last updated: October 29, 2026</p>

        <div className="mt-12 space-y-9">
          {sections.map(({ title, body }) => (
            <section key={title}>
              <h2 className="text-xl font-semibold text-[#202b20]">{title}</h2>
              <p className="mt-3 text-[15px] leading-7 text-[#5c6359]">{body}</p>
            </section>
          ))}
        </div>

        <Link to="/" className="mt-12 inline-flex text-sm font-semibold text-[#526510] underline underline-offset-4">Return to the website</Link>
      </div>
    </main>
  )
}
