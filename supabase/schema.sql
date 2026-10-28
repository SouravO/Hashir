-- Appointment requests are inserted only by the server-side Vercel function.
-- Never put a Supabase service role/secret key in VITE_ variables or browser code.

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  appointment_date date not null,
  appointment_time text not null check (appointment_time ~ '^(?:[01][0-9]|2[0-3]):[0-5][0-9]$'),
  timezone text not null default 'Asia/Kolkata',
  duration_minutes integer not null default 30 check (duration_minutes between 10 and 180),
  message text check (message is null or char_length(message) <= 1000),
  availability_source text not null default 'demo' check (availability_source in ('demo', 'live')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  google_event_id text unique,
  meeting_url text,
  client_invite_sent boolean not null default false,
  owner_notified boolean not null default false,
  delivery_note text,
  created_at timestamptz not null default now()
);

-- Add delivery fields safely when upgrading a table created by an earlier version.
alter table public.appointments add column if not exists request_id uuid default gen_random_uuid();
alter table public.appointments add column if not exists google_event_id text;
alter table public.appointments add column if not exists meeting_url text;
alter table public.appointments add column if not exists client_invite_sent boolean not null default false;
alter table public.appointments add column if not exists owner_notified boolean not null default false;
alter table public.appointments add column if not exists delivery_note text;
update public.appointments set request_id = gen_random_uuid() where request_id is null;
alter table public.appointments alter column request_id set not null;
create unique index if not exists appointments_request_id_key on public.appointments (request_id);
create unique index if not exists appointments_google_event_id_key on public.appointments (google_event_id) where google_event_id is not null;

alter table public.appointments enable row level security;

revoke all on table public.appointments from anon, authenticated;
grant select on table public.appointments to authenticated;
grant update (status) on table public.appointments to authenticated;

drop policy if exists "Admins can view appointment requests" on public.appointments;
create policy "Admins can view appointment requests"
  on public.appointments for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update appointment status" on public.appointments;
create policy "Admins can update appointment status"
  on public.appointments for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check (
    (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    and status <> 'confirmed'
  );

-- The Vercel function uses the server-only service role key, which bypasses RLS.
-- No anon insert/select/update policy exists: visitors cannot read the appointment table.
