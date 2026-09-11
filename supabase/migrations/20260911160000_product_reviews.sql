-- Milestone 12: Product Reviews and Ratings
-- Table: product_reviews for verified customer ratings and feedback

create extension if not exists "pgcrypto";

-- Product Reviews table ----------------------------------------------------
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  order_id uuid references public.orders (id) on delete set null,
  rating integer not null check (rating >= 1 and rating <= 5),
  review_text text not null,
  created_at timestamptz not null default now(),

  -- Prevent duplicate reviews for the same product per order
  unique (user_id, product_id, order_id)
);

-- Indexes for performance
create index if not exists product_reviews_product_id_idx on public.product_reviews (product_id);
create index if not exists product_reviews_user_id_idx on public.product_reviews (user_id);
create index if not exists product_reviews_created_at_idx on public.product_reviews (created_at desc);

-- RLS Policies -----------------------------------------------------------
alter table public.product_reviews enable row level security;

-- Anyone can read reviews
drop policy if exists "Anyone can read product reviews" on public.product_reviews;
create policy "Anyone can read product reviews"
  on public.product_reviews for select
  using (true);

-- Authenticated users can insert their own reviews
drop policy if exists "Users can create own product reviews" on public.product_reviews;
create policy "Users can create own product reviews"
  on public.product_reviews for insert
  with check (auth.uid() = user_id);

-- Authenticated users can update their own reviews
drop policy if exists "Users can update own product reviews" on public.product_reviews;
create policy "Users can update own product reviews"
  on public.product_reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Authenticated users can delete their own reviews
drop policy if exists "Users can delete own product reviews" on public.product_reviews;
create policy "Users can delete own product reviews"
  on public.product_reviews for delete
  using (auth.uid() = user_id);

-- Comments
comment on table public.product_reviews is 'Verified customer reviews and star ratings for products';
comment on column public.product_reviews.rating is 'Rating score from 1 to 5';
comment on column public.product_reviews.review_text is 'Customer review comment';
