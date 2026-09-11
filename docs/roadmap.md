# Roadmap — Batik Arunika

## Milestone 1 — Foundation

Status: COMPLETED.

- Next.js, TypeScript, Tailwind, shadcn/ui setup verified.
- Environment template.
- Supabase browser and server clients.
- Session proxy.
- Brand tokens and metadata.
- README and foundation docs.
- Lint, typecheck, and production build.

## Milestone 2 — Brand UI Foundation

Status: COMPLETED.

- Global header, navigation, footer.
- Reusable loading, empty, error, and success states.
- Minimal homepage sections.
- Responsive foundation across mobile, tablet, and desktop.

## Milestone 3 — Authentication

Status: COMPLETED.

- Register, login, logout.
- Session persistence.
- Password recovery.
- Customer profile.
- Protected customer routes.

## Milestone 4 — Catalog and Admin Product Management

Status: COMPLETED.

- Categories.
- Product listing, search, filter, sort.
- Product detail and stock display.
- Admin product and category CRUD.

## Milestone 5 — Cart and Checkout

Status: COMPLETED.

- Add, update quantity, remove.
- Subtotal and stock validation.
- Address selection.
- Server-side order total validation.

## Milestone 6 — Shipping and Payment

Status: COMPLETED.

- Xendit payment gateway integration.
- Payment webhook and status updates.
- Inventory adjustment rules.
- Shipping cost calculation.

## Milestone 7 — Orders and Admin

Status: COMPLETED.

- Customer order history and detail.
- Admin order filtering and fulfillment updates.
- Admin customers, banners, promotions.
- Dashboard statistics.

## Milestone 8 — Hardening and Deployment

Status: COMPLETED.

- Authentication, RLS, cart, checkout, webhook, shipping, and admin authorization tests.
- Responsive and accessibility checks.
- SEO and error-state review.
- Final lint, typecheck, build, and production readiness review.

## Milestone 12 — Customer Features & Product Reviews (Phase 5: Post-Launch Enhancements)

Status: COMPLETED.

**Core Features:**
- ✓ Customer Dashboard with metrics and recent orders overview
- ✓ Order History with full order detail pages
- ✓ Wishlist functionality with heart icon toggle on product cards
- ✓ Address Book with full CRUD operations and default address management
- ✓ Account Settings with profile update and password change
- ✓ Product Reviews and Star Ratings with verified order review submission

**Technical Implementation:**
- Customer dashboard layout with sidebar navigation
- Database migrations for addresses (`is_default` flag) and wishlist table
- Row Level Security (RLS) policies for user data isolation
- Supabase Auth integration for profile and password updates
- Reusable WishlistButton component integrated across product pages
- Form validation and error handling with toast notifications
- Responsive UI with loading states

**Routes:**
- `/dashboard` - Customer dashboard overview
- `/dashboard/orders` - Order history list
- `/dashboard/orders/[id]` - Order detail with security checks
- `/dashboard/wishlist` - Wishlist grid with product cards
- `/dashboard/addresses` - Address book management
- `/dashboard/settings` - Profile and password settings

**Last Updated**: September 11, 2026
