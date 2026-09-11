-- Milestone 12: Loyalty Program
-- Tables: user_loyalty and loyalty_history for points and rewards tracking

create extension if not exists "pgcrypto";

-- User Loyalty Summary table -----------------------------------------------
create table if not exists public.user_loyalty (
  user_id uuid primary key references auth.users (id) on delete cascade,
  points integer not null default 0 check (points >= 0),
  lifetime_points integer not null default 0,
  tier text not null default 'Bronze' check (tier in ('Bronze', 'Silver', 'Gold', 'Platinum')),
  updated_at timestamptz not null default now()
);

-- Loyalty History table (audit trail) -----------------------------------------------
create table if not exists public.loyalty_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  order_id uuid references public.orders (id) on delete set null,
  points integer not null,
  description text not null,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists user_loyalty_tier_idx on public.user_loyalty (tier);
create index if not exists loyalty_history_user_id_idx on public.loyalty_history (user_id);
create index if not exists loyalty_history_order_id_idx on public.loyalty_history (order_id);
create index if not exists loyalty_history_created_at_idx on public.loyalty_history (created_at desc);

-- RLS Policies -----------------------------------------------------------
alter table public.user_loyalty enable row level security;
alter table public.loyalty_history enable row level security;

-- Users can view own loyalty data
drop policy if exists "Users can view own loyalty" on public.user_loyalty;
create policy "Users can view own loyalty"
  on public.user_loyalty for select
  using (auth.uid() = user_id);

drop policy if exists "Users can view own loyalty history" on public.loyalty_history;
create policy "Users can view own loyalty history"
  on public.loyalty_history for select
  using (auth.uid() = user_id);

-- Service role can insert/update (via triggers/functions)
-- No direct user insert/update allowed

-- Comments
comment on table public.user_loyalty is 'Customer loyalty points and tier tracking';
comment on column public.user_loyalty.points is 'Current available loyalty points';
comment on column public.user_loyalty.lifetime_points is 'Total points ever earned (never decreases)';
comment on column public.user_loyalty.tier is 'Customer tier: Bronze (0+), Silver (500+), Gold (2000+), Platinum (5000+)';

comment on table public.loyalty_history is 'Audit trail of loyalty point transactions';
comment on column public.loyalty_history.points is 'Points earned (positive) or spent (negative)';
comment on column public.loyalty_history.order_id is 'Associated order (nullable for non-order points)';
