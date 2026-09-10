-- Milestone 6: orders schema for Batik Arunika.
-- Tables: addresses, orders, order_items. History preserved in order_items.
-- RLS: authenticated users manage own rows. No admin policies yet.

create extension if not exists "pgcrypto";

-- Addresses ---------------------------------------------------------------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  recipient_name text not null,
  phone text not null,
  full_address text not null,
  city text not null,
  province text not null,
  postal_code text not null,
  created_at timestamptz not null default now()
);

create index if not exists addresses_user_id_idx on public.addresses (user_id);

-- Orders ------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  address_id uuid references public.addresses (id) on delete set null,
  subtotal integer not null check (subtotal >= 0),
  shipping_cost integer not null default 0 check (shipping_cost >= 0),
  grand_total integer not null check (grand_total >= 0),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed')),
  order_status text not null default 'pending_payment'
    check (order_status in ('pending_payment', 'processing', 'shipped', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- Order items (historical snapshot) ----------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  price_at_time integer not null check (price_at_time >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- RLS ---------------------------------------------------------------------
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Users can view own addresses" on public.addresses;
create policy "Users can view own addresses"
  on public.addresses for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own addresses" on public.addresses;
create policy "Users can create own addresses"
  on public.addresses for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own orders" on public.orders;
create policy "Users can create own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can view own order items" on public.order_items;
create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

drop policy if exists "Users can create own order items" on public.order_items;
create policy "Users can create own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );
