# Hashir Usman portfolio

A responsive React portfolio built with Vite, Tailwind CSS v4, DM Sans, and Phosphor icons.

## Run locally

```sh
npm install
npm run dev
```

`npm run dev` starts the site and a local adapter for the `/api/*` booking functions, so you can test without access to the hosted Vercel project. Add the server environment variables below to `.env.local` first. Production still uses the Vercel function files in `api/`.

## Check and build

```sh
npm run lint
npm run build
npm run preview
```

The production site is generated in `dist/` and can be hosted on any static hosting service.

## Project structure

- `src/App.jsx`: four page routes and shared layout.
- `src/components/Navbar.jsx` and `src/components/Footer.jsx`: shared layout components.
- `src/pages/`: Home, About, Ventures, and Contact. Home includes the full Hero.
- `src/index.css`: Tailwind import, design font, and Hero animation keyframes.
- `public/images/`: responsive portrait assets used by the site.

The contact and newsletter forms open prefilled email drafts; they do not submit to a backend. The LinkedIn destination is the general LinkedIn site because a personal profile URL was not present in the project.

Venture wordmarks are typographic recreations. Case study outcomes only include information already documented in the project; unreported metrics are identified as such.

## Appointment requests and admin

The consultation modal loads slots from `/api/availability` and posts requests to `/api/book-consultation`. Pending and approved requests reserve their date and time in Supabase; cancelling a request frees the slot. A unique database index prevents two customers from reserving the same slot at once. The admin dashboard is at `/admin`; only signed-in users whose Supabase `app_metadata.role` is `admin` can view requests. Admins can approve or cancel requests. Gmail sends the admin a booking email and sends the customer an approval or cancellation email; calendar invites are not part of this flow.

To configure customer booking and admin email notifications:

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in its SQL editor.
2. Create an admin user in Supabase Authentication. In that user's **app metadata**, set `{ "role": "admin" }`, then sign in at `/admin`. Do not put this role in user-editable metadata.
3. For local development, put the Supabase settings in `.env.local`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`. The service role/secret key must stay server-side and must never use a `VITE_` name. When hosting later, copy the server-only values to the hosting provider's environment settings.
4. To email booking details and status updates, enable the Gmail API in Google Cloud. Create OAuth credentials, authorize the `hashirusman120@gmail.com` Gmail account for `https://www.googleapis.com/auth/gmail.send`, and obtain an offline refresh token. Store `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN` only in server-side environment settings. Never use the Gmail account password as an app secret.
5. Set `VITE_BOOKING_ENABLED=true` and `BOOKING_ENABLED=true` to enable customer requests. Leave `VITE_LIVE_AVAILABILITY_ENABLED=false` to use the configured website schedule without Google Calendar.

For the first end-to-end check, configure Supabase, set `BOOKING_ENABLED=true` and `VITE_BOOKING_ENABLED=true`, leave `VITE_LIVE_AVAILABILITY_ENABLED=false`, and configure Gmail OAuth. Run the updated `supabase/schema.sql`, then submit a request and confirm it appears in `appointments` and an email reaches the admin. Approve or cancel it from `/admin` and confirm the customer receives the status email. Never put `SUPABASE_SERVICE_ROLE_KEY` or Google OAuth secrets in a `VITE_` variable or commit them.

With `VITE_LIVE_AVAILABILITY_ENABLED=false`, the weekday schedule is checked against pending and approved Supabase requests. With it enabled, availability also checks Google Calendar. Booking approval does not create a calendar event. Cancellation makes the Supabase slot available again.
