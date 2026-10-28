# Hashir Usman portfolio

A responsive React portfolio built with Vite, Tailwind CSS v4, DM Sans, and Phosphor icons.

## Run locally

```sh
npm install
npm run dev
```

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

The consultation modal posts appointment requests to `/api/book-consultation`, which stores them in Supabase with `pending` status and emails the owner for review. The admin dashboard is at `/admin`; it uses Supabase Auth and only users whose Supabase `app_metadata.role` is `admin` can read or update appointment status. For a live request, **Approve & Send Invite** rechecks the selected slot, creates the Google Meet event, sends the client a Calendar invitation, and then marks the request confirmed. Demo requests cannot be approved as real appointments. The database policy also prevents admins from setting `confirmed` directly.

To configure Supabase:

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in its SQL editor.
2. Create an admin user in Supabase Authentication. In that user's **app metadata**, set `{ "role": "admin" }`, then sign in at `/admin`. Do not put this role in user-editable metadata.
3. Copy `.env.example` to `.env.local` for local development. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the admin UI. Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in the server environment (Vercel); never expose the service role key in a `VITE_` variable. The server anon key is used only to validate the admin's Supabase Auth token.
4. In Google Cloud, enable the Google Calendar API and Gmail API. Create OAuth credentials for the `connect@hashirusman.online` Google account and grant `https://www.googleapis.com/auth/calendar.events`, `https://www.googleapis.com/auth/calendar.freebusy`, and `https://www.googleapis.com/auth/gmail.send`. Obtain an offline refresh token for that account. Store `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN` only in server-side environment settings.
5. Keep `VITE_BOOKING_ENABLED`, `VITE_LIVE_AVAILABILITY_ENABLED`, `BOOKING_ENABLED`, and `MEET_INVITES_ENABLED` false until Supabase inserts, Google live availability, owner email, and client Meet invites have all been verified. Set `VITE_BOOKING_ENABLED`, `VITE_LIVE_AVAILABILITY_ENABLED`, and `BOOKING_ENABLED` to `true` to accept requests on live slots. Set `MEET_INVITES_ENABLED` to `true` only when ready to enable the admin approval action and send invitations. Vercel needs the server settings in its project environment, followed by a redeploy.

The calendar shows illustrative weekday slots until `VITE_LIVE_AVAILABILITY_ENABLED` is enabled. Live slots are checked against the owner's Google Calendar, then rechecked on submission and again during approval. Demo requests are marked `availability_source = 'demo'`; they can be saved and emailed to the owner after booking is enabled, but they cannot be approved and do not create a calendar event or Meet link. A live request does not create an event until the owner approves it. The approval endpoint creates the event with `sendUpdates=all` and conference data enabled, then stores the Meet link and confirmed status. Cancellation does not send a follow-up email automatically.
