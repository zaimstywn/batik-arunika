-- Milestone 12: Newsletter Subscription
-- Table: newsletter_subscribers for email list management

create extension if not exists "pgcrypto";

-- Newsletter Subscribers table -----------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists newsletter_subscribers_email_idx on public.newsletter_subscribers (email);
create index if not exists newsletter_subscribers_is_active_idx on public.newsletter_subscribers (is_active);
create index if not exists newsletter_subscribers_created_at_idx on public.newsletter_subscribers (created_at desc);

-- RLS Policies -----------------------------------------------------------
alter table public.newsletter_subscribers enable row level security;

-- Public can insert (subscribe)
drop policy if exists "Public can subscribe to newsletter" on public.newsletter_subscribers;
create policy "Public can subscribe to newsletter"
  on public.newsletter_subscribers for insert
  with check (true);

-- Service role and authenticated users cannot update/delete (only admins via service role)
drop policy if exists "No direct select on newsletter subscribers" on public.newsletter_subscribers;
create policy "No direct select on newsletter subscribers"
  on public.newsletter_subscribers for select
  using (false);

-- Comments
comment on table public.newsletter_subscribers is 'Email subscribers for marketing newsletter';
comment on column public.newsletter_subscribers.is_active is 'Whether the subscription is active';
