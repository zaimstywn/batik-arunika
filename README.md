# Batik Arunika

Modern single-vendor e-commerce platform for an Indonesian batik brand.

Batik Arunika is the official online store of one batik brand. It is not a
marketplace and has no seller, vendor, commission, or multi-store concept.

## Project Overview

- Single-vendor official brand store.
- Roles: Guest, Customer, Admin.
- Tagline: "Keindahan Batik Indonesia, dalam Sentuhan Modern."
- Current focus: clean foundation before business features.

## Current Status

Milestone 1 — Foundation.

Implemented:

- Next.js App Router scaffold.
- TypeScript strict base.
- Tailwind CSS v4 and shadcn/ui Base Nova base styling.
- Brand design tokens in `app/globals.css`.
- Root layout with `lang="id"` and single-vendor metadata.
- Minimal foundation placeholder homepage.
- Supabase browser and server clients.
- Session-refresh proxy foundation.
- Zod-based environment validation.
- `.env.example` with public and server-only placeholders.

Not implemented yet:

- customer authentication UI and protected flows
- product catalog, categories, search, filtering, sorting
- cart
- addresses
- checkout
- Biteship shipping integration
- Midtrans Sandbox payment integration
- customer order history
- admin dashboard and management pages
- database migrations, tables, storage buckets, and Row Level Security
- product reviews and wishlist behavior

The folder skeleton for `components/*`, `features/*`, and `services/` exists,
but most of those areas are intentionally empty.

## Planned Core Features

Locked future scope, not yet implemented:

- product catalog with search, filter, and sort
- customer authentication and profile
- address management
- cart with server-validated stock and pricing
- checkout with address, shipping, promotion, and totals
- Biteship shipping rates and service selection
- Midtrans Sandbox payment creation and webhook synchronization
- separate payment and fulfillment statuses
- customer order history and detail
- admin product, category, banner, promotion, customer, and order management
- basic sales overview and low-stock visibility

Optional later if timeline allows:

- purchased-product reviews
- wishlist

Explicitly out of scope:

- marketplace and multi-vendor behavior
- seller dashboard and commissions
- affiliate, auction, subscriptions, loyalty points
- multi-currency and multi-language
- ERP, accounting, warehouse, supplier, and logistics management
- live chat, live shopping, social commerce, AI recommendations

## Tech Stack

Actual installed stack:

- Next.js 16.2.10
- React 19.2.4
- TypeScript
- Tailwind CSS v4
- shadcn/ui Base Nova
- Supabase with `@supabase/ssr` 0.12.3 and `@supabase/supabase-js` 2.110.7
- Zod 4.4.3
- React Hook Form 7.82.0
- Zustand 5.0.14
- Sonner 2.0.7
- Lucide React 1.25.0
- Vercel for intended deployment
- Midtrans Sandbox for planned payments
- Biteship for planned shipping

Payment and shipping integrations are planned only. No transaction, rate, or
webhook implementation exists in this milestone.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment template:

```bash
cp .env.example .env.local
```

3. Fill local Supabase values in `.env.local`.

Midtrans and Biteship values may remain empty during Milestone 1 because those
services are not called yet.

4. Run development server:

```bash
npm run dev
```

## Development Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Environment Variables

Public browser-safe variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`

Server-only secrets:

- `MIDTRANS_SERVER_KEY`
- `MIDTRANS_CLIENT_KEY`
- `MIDTRANS_IS_PRODUCTION`
- `BITESHIP_API_KEY`
- `BITESHIP_BASE_URL`

Do not prefix server secrets with `NEXT_PUBLIC_`.

## Project Structure

Current structure:

```text
app/
  layout.tsx
  page.tsx
  globals.css
components/
  admin/
  checkout/
  common/
  layout/
  products/
  ui/
constants/
  site.ts
  theme.ts
docs/
features/
  auth/
  cart/
  checkout/
  orders/
  products/
  wishlist/
hooks/
lib/
  env.ts
  supabase/
    client.ts
    middleware.ts
    server.ts
  utils.ts
public/
services/
types/
utils/
```

This reflects the current foundation. It is not a completed e-commerce
implementation.

## Project Status and Limitations

- Foundation only.
- No database schema or migrations.
- No storage configuration.
- No authentication pages.
- No production checkout or payment path.
- UI is a minimal milestone placeholder.

See `docs/roadmap.md` for the next milestones.
