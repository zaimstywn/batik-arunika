# Batik Arunika

Modern single-vendor e-commerce platform for an Indonesian batik brand.

Batik Arunika is the official online store of one batik brand. It is a single-vendor application designed to provide a premium, warm, elegant, and minimal shopping experience for authentic Indonesian batik products.

## Project Status

**COMPLETE — MVP RELEASE**

All core milestones (1 through 11) have been implemented, tested, and verified.

## Completed Features

- **Public Storefront & Branding**: Modern responsive layout, hero banner, featured categories, and brand story using custom design tokens (`#8B5E3C`, `#D4A373`, `#FAF7F2`, `#A63D40`, `#2D2D2D`).
- **Product Catalog**: Dynamic catalog listing with category filtering and search, product detail pages with stock tracking and 404 handling.
- **Authentication & Profile**: Supabase Auth (Email/Password) with server-side session persistence, route protection via proxy, customer profile page, and order history.
- **Shopping Cart**: Client-side state managed via Zustand with `persist` middleware, quantity controls with stock clamping, and cart badge.
- **Checkout**: Address form with Zod validation, order summary, and server-side price/total recalculation.
- **Shipping Integration**: Dynamic shipping rates powered by Biteship API (originating from Tembalang, Semarang) with fallback mock rates for unblocked development.
- **Payment Gateway**: Xendit Invoice integration with automatic redirection, graceful fallback mode, and a secure webhook route (`/api/webhooks/xendit`) enforcing `x-callback-token` verification via Supabase service-role client.
- **Order Management**: Customer order history & detail views (`/profile/pesanan/[id]`), and an Admin order management portal (`/admin/orders`) with fulfillment status updating (`pending_payment` -> `processing` -> `shipped` -> `completed` -> `cancelled`).
- **Admin Dashboard & Catalog Management**: Overview dashboard with real revenue, order, and product metrics, recent orders feed, plus category and product CRUD forms secured by `ADMIN_EMAIL` verification.

## Tech Stack

- **Framework**: Next.js 16.2.10 (App Router, Server Components by default)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4, shadcn/ui Base Nova
- **Database & Auth**: Supabase PostgreSQL, Supabase Auth (`@supabase/ssr`)
- **State Management**: Zustand 5.0.14 (persist middleware)
- **Form & Validation**: React Hook Form 7.82.0, Zod 4.4.3
- **Payment Gateway**: Xendit Invoice API
- **Logistics**: Biteship API
- **UI Components & Icons**: Lucide React 1.25.0, Sonner 2.0.7

## Local Development Setup

### 1. Prerequisites

- Node.js 20+ installed
- A Supabase project (for live Auth and PostgreSQL database)

### 2. Installation

```bash
git clone https://github.com/anomalyco/batik-arunika.git
cd batik-arunika
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the required values in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Batik Arunika"

# Admin Access
ADMIN_EMAIL=admin@batikarunika.com

# Xendit Payment Gateway
XENDIT_SECRET_KEY=xnd_development_...
XENDIT_WEBHOOK_TOKEN=your-xendit-webhook-token

# Biteship Logistics
BITESHIP_API_KEY=biteship_live_...
BITESHIP_BASE_URL=https://api.biteship.com
```

> **Note**: If `XENDIT_SECRET_KEY` or `BITESHIP_API_KEY` are not provided, the application will gracefully fall back to mock data during local development.

### 4. Database Setup

Apply the SQL migrations located in `supabase/migrations/` to your Supabase PostgreSQL instance:

1. `20260910090000_create_catalog_schema.sql` (Creates `categories`, `products`, RLS policies, and seed data)
2. `20260910120000_create_orders_schema.sql` (Creates `addresses`, `orders`, `order_items`, and RLS policies)

### 5. Running the Application

```bash
# Start development server
npm run dev

# Run ESLint
npm run lint

# Run TypeScript type check
npm run typecheck

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
app/
  (auth)/
    login/page.tsx
    register/page.tsx
  admin/
    categories/
    orders/
    products/
    layout.tsx
    page.tsx
  api/
    webhooks/
      xendit/route.ts
  checkout/
    success/page.tsx
    page.tsx
  keranjang/page.tsx
  koleksi/
    [slug]/page.tsx
    page.tsx
  profile/
    pesanan/[id]/page.tsx
    page.tsx
  globals.css
  layout.tsx
  not-found.tsx
  page.tsx
components/
  cart/
  common/
  layout/
  orders/
  products/
  ui/
constants/
  homepage.ts
  site.ts
  theme.ts
docs/
features/
  auth/
  cart/
  checkout/
  orders/
  payment/
  products/
  shipping/
lib/
  env.ts
  format.ts
  supabase/
    client.ts
    middleware.ts
    server.ts
    service.ts
  utils.ts
proxy.ts
supabase/
  migrations/
types/
```

## Security & Architectural Principles

- **Server-Side Price Validation**: Product prices, stock levels, and order subtotals are strictly recalculated on the server using database records during order creation. Client payloads are never trusted for monetary values.
- **Historical Order Snapshots**: `order_items` stores historical `price_at_time` and `product_name` snapshots to preserve purchase records even if product prices or names change over time.
- **Service-Role Isolation**: Supabase service-role client is used exclusively in server-only contexts (webhooks, admin stats, order updates) and is never bundled to the client.
- **Route Protection**: Next.js proxy/middleware validates user sessions and enforces `ADMIN_EMAIL` authorization for `/admin/*` routes.
