# Deployment — Batik Arunika

> Status: foundation-level. The project is not production-ready.

## 1. Intended Flow

GitHub repository -> Vercel deployment -> Supabase backend.

Vercel hosts the Next.js App Router application. Supabase provides PostgreSQL, authentication, and storage.

## 2. Environment Separation

Public client variables use `NEXT_PUBLIC_`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`

Server-only variables must not use `NEXT_PUBLIC_`:

- `MIDTRANS_SERVER_KEY`
- `MIDTRANS_CLIENT_KEY`
- `MIDTRANS_IS_PRODUCTION`
- `BITESHIP_API_KEY`
- `BITESHIP_BASE_URL`

Production should set `MIDTRANS_IS_PRODUCTION` and live callback URLs only when a real production integration is explicitly enabled. Sandbox remains the planned testing mode.

## 3. Pre-Deployment Checks

Before any staging or production deployment:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- verify required environment variables
- verify no secrets are committed
- verify Supabase session behavior
- verify payment and shipping integrations only after their milestones pass
