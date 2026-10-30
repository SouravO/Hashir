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
4. To email booking details and status updates, enable the Gmail API in Google Cloud. To check availability, create calendar events, send invitations, and remove cancelled events, enable the Google Calendar API too. Authorize the `hashirusman120@gmail.com` Google account for `https://www.googleapis.com/auth/gmail.send`, `https://www.googleapis.com/auth/calendar.freebusy`, and `https://www.googleapis.com/auth/calendar.events`, then obtain an offline refresh token. Store `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN` only in server-side environment settings. Never use the account password as an app secret.
5. Set `VITE_BOOKING_ENABLED=true` and `BOOKING_ENABLED=true` to enable customer requests. Set `VITE_LIVE_AVAILABILITY_ENABLED=true` to compare slots with Google Calendar. Set `MEET_INVITES_ENABLED=true` to create a Google Calendar event with a Meet link, email and popup reminders, and a customer invite when an admin approves a request. Cancelling an approved request removes the event and notifies the customer.

If Google Calendar calls fail with an OAuth scope error, adding scopes to the app is not enough: the existing refresh token must be re-authorized. In Google Cloud, enable the Calendar API, add the scopes listed above to the OAuth consent configuration, re-consent the account, and replace `GOOGLE_REFRESH_TOKEN` in `.env.local` and the deployment's server-side environment. Never send the token through chat or put it in a `VITE_` variable.

For the first end-to-end check, configure Supabase, set `BOOKING_ENABLED=true`, `VITE_BOOKING_ENABLED=true`, `VITE_LIVE_AVAILABILITY_ENABLED=true`, and `MEET_INVITES_ENABLED=true`, and configure Gmail/Calendar OAuth with the scopes above. Run the updated `supabase/schema.sql`, then submit a request and confirm it appears in `appointments` and an email reaches the admin. Approve it from `/admin` and confirm the event, Google Meet link, customer invitation, and confirmation email. Cancel it and confirm the calendar event is removed and the customer is emailed. Never put `SUPABASE_SERVICE_ROLE_KEY` or Google OAuth secrets in a `VITE_` variable or commit them.

With `VITE_LIVE_AVAILABILITY_ENABLED=false`, the configured schedule is checked against pending and approved Supabase requests. With it enabled, availability also checks Google Calendar. Approval creates a calendar event only when `MEET_INVITES_ENABLED=true`. Cancellation makes the Supabase slot available again.
