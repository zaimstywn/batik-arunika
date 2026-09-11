-- Milestone 12: Wishlist feature for customer dashboard
-- Table: wishlists to store user product favorites

create extension if not exists "pgcrypto";

-- Wishlists table --------------------------------------------------------
create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  
  -- Ensure a user can only wishlist a product once
  unique (user_id, product_id)
);

-- Indexes for performance
create index if not exists wishlists_user_id_idx on public.wishlists (user_id);
create index if not exists wishlists_product_id_idx on public.wishlists (product_id);
create index if not exists wishlists_created_at_idx on public.wishlists (created_at desc);

-- RLS Policies -----------------------------------------------------------
alter table public.wishlists enable row level security;

drop policy if exists "Users can view own wishlist" on public.wishlists;
create policy "Users can view own wishlist"
  on public.wishlists for select
  using (auth.uid() = user_id);

drop policy if exists "Users can add to own wishlist" on public.wishlists;
create policy "Users can add to own wishlist"
  on public.wishlists for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can remove from own wishlist" on public.wishlists;
create policy "Users can remove from own wishlist"
  on public.wishlists for delete
  using (auth.uid() = user_id);

-- Comments
comment on table public.wishlists is 'Customer wishlist items with product references';
comment on column public.wishlists.user_id is 'User who wishlisted the product';
comment on column public.wishlists.product_id is 'Product that was wishlisted';
