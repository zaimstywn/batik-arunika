# Architecture — Batik Arunika

## 1. Technical Stack

- Framework: Next.js App Router (React Server Components by default)
- Language: TypeScript (Strict mode)
- Styling: Tailwind CSS v4, shadcn/ui Base Nova
- Database & Auth: Supabase PostgreSQL & Supabase Auth (`@supabase/ssr`)
- Validation: Zod
- Forms: React Hook Form
- State: React local state / Context, Zustand where global client state is needed
- Payment: Midtrans Sandbox (Server-side handled)
- Shipping: Biteship API (Server-side handled via service abstraction)

## 2. Server vs Client Boundaries

- Server Components: Data fetching, database operations, rendering static sections, accessing server-only secrets (`MIDTRANS_SERVER_KEY`, `BITESHIP_API_KEY`, etc.).
- Client Components (`use client`): Interactive forms, cart buttons, dialogs, local state, browser APIs.
- Service Layer: External APIs (Midtrans, Biteship) and business logic are strictly isolated inside `services/` and server actions/route handlers. Components never call external APIs directly with raw secrets.

## 3. Security Principles

- No server keys exposed to the browser.
- Zod runtime validation for incoming server actions and environment variables.
- Supabase RLS (Row Level Security) planned to enforce customer data isolation.
- Order calculation (pricing, discounts, shipping, totals) is verified on the server and never trusted from client payloads.
