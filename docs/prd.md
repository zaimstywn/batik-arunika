# Product Requirement Document (PRD) — Batik Arunika

## 1. Product Identity

- Brand: Batik Arunika
- Store model: Single-vendor official brand store
- Tagline: "Keindahan Batik Indonesia, dalam Sentuhan Modern."
- Positioning: Modern, elegant, warm, authentic, product-focused Indonesian batik store.

## 2. Scope Summary

Batik Arunika is a single store operated by one UMKM brand.

Allowed roles:

1. Guest
2. Customer
3. Admin

Explicitly out of scope:

- Marketplace, multi-vendor, seller dashboard, supplier management
- Multi-warehouse, ERP, complex CMS, commission engine
- Live chat, AI recommendations, social commerce, live shopping, auctions, subscriptions, multi-currency, multi-language

## 3. Customer Journey

Guest / Customer:

Browse home -> Browse products -> Search/filter/sort -> View product detail -> Add to cart -> Authenticate if needed -> Manage addresses -> Select address & shipping service -> Pay via Midtrans Sandbox -> Receive order status updates -> View order history and order details.

## 4. Admin Journey

Admin:

Login -> Admin dashboard -> Manage products, categories, banners, promotions -> Manage orders and update fulfillment status -> View customers and basic sales overview.

## 5. Current Implementation State vs Planned

### CURRENT — Milestone 1 (Foundation)

- Scaffolding, layout, global styling, design tokens.
- Metadata configured for single-vendor brand.
- Supabase SSR clients (browser + server).
- Session proxy mechanism.
- Environment validation layer.
- Project structure established.

### PLANNED — Future Milestones

- Brand Homepage & Navigation
- Product Catalog & Search
- Supabase Auth & Profile Management
- Address Management
- Cart & Stock Validation
- Checkout & Order Summary
- Biteship Logistics Integration
- Midtrans Payment Integration & Webhook Handling
- Order History & Status Synchronization
- Admin Dashboard & Management UI
- Product Reviews & Wishlist (Optional)
