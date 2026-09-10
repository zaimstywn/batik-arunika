-- Milestone 4: catalog schema for Batik Arunika (single-vendor store).
-- Tables: categories, products. Public read-only. No write policies yet.

create extension if not exists "pgcrypto";

-- Categories ---------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- Products -----------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price integer not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  category_id uuid references public.categories (id) on delete set null,
  image_url text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_is_featured_idx on public.products (is_featured);
create index if not exists products_created_at_idx on public.products (created_at desc);

-- Row Level Security: public read-only ------------------------------------
alter table public.categories enable row level security;
alter table public.products enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
  on public.categories for select
  using (true);

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products for select
  using (true);

-- Seed: categories ----------------------------------------------------------
insert into public.categories (name, slug, description) values
  ('Batik Pria', 'batik-pria', 'Kemeja dan atasan batik dengan potongan modern.'),
  ('Batik Wanita', 'batik-wanita', 'Dress dan blouse batik yang anggun dan nyaman.'),
  ('Outer Batik', 'outer-batik', 'Outer dan luaran batik untuk layering kasual.')
on conflict (slug) do nothing;

-- Seed: products ------------------------------------------------------------
insert into public.products (name, slug, description, price, stock, category_id, image_url, is_featured) values
  (
    'Batik Kawung Arunika',
    'batik-kawung-arunika',
    'Kemeja batik pria motif kawung klasik dengan palet hangat modern. Katun primisima yang nyaman untuk acara formal maupun santai.',
    349000, 24,
    (select id from public.categories where slug = 'batik-pria'),
    'https://picsum.photos/seed/batik-kawung-arunika/800/600',
    true
  ),
  (
    'Batik Parang Senja',
    'batik-parang-senja',
    'Kemeja batik pria motif parang dengan gradasi warna senja. Potongan slim fit yang rapi dan elegan.',
    289000, 32,
    (select id from public.categories where slug = 'batik-pria'),
    'https://picsum.photos/seed/batik-parang-senja/800/600',
    false
  ),
  (
    'Batik Sekar Jagad Laras',
    'batik-sekar-jagad-laras',
    'Dress batik wanita motif sekar jagad yang mewah. Siluet flowy dengan detail lengan modern, cocok untuk acara spesial.',
    459000, 15,
    (select id from public.categories where slug = 'batik-wanita'),
    'https://picsum.photos/seed/batik-sekar-jagad-laras/800/600',
    true
  ),
  (
    'Batik Mega Mendung Sagara',
    'batik-mega-mendung-sagara',
    'Blouse batik wanita motif mega mendung bernuansa biru sagara. Bahan rayon adem dengan jahitan rapi.',
    429000, 18,
    (select id from public.categories where slug = 'batik-wanita'),
    'https://picsum.photos/seed/batik-mega-mendung-sagara/800/600',
    false
  ),
  (
    'Outer Batik Senja Kirana',
    'outer-batik-senja-kirana',
    'Outer batik unisex untuk layering kasual. Motif kontemporer dengan warna hangat, mudah dipadukan dengan atasan polos.',
    399000, 20,
    (select id from public.categories where slug = 'outer-batik'),
    'https://picsum.photos/seed/outer-batik-senja-kirana/800/600',
    true
  ),
  (
    'Outer Batik Kirana Pagi',
    'outer-batik-kirana-pagi',
    'Outer batik ringan dengan motif cerah bernuansa pagi. Cocok untuk gaya kasual sehari-hari.',
    329000, 12,
    (select id from public.categories where slug = 'outer-batik'),
    'https://picsum.photos/seed/outer-batik-kirana-pagi/800/600',
    false
  )
on conflict (slug) do nothing;
