# Database Plan — Batik Arunika (Supabase PostgreSQL)

> Status: PLANNED ONLY. No migrations, tables, RLS, or storage buckets are implemented in Milestone 1.

## 1. Planned Entities

- profiles
- categories
- products
- product_images
- product_variants — only if variants are genuinely needed
- addresses
- carts
- cart_items
- orders
- order_items
- payments
- promotions
- banners
- wishlist
- reviews

Do not create tables that are not required by a milestone actually being implemented.

## 2. Planned Data Principles

- Primary keys for every entity.
- Foreign keys for relationships.
- `created_at` and `updated_at` timestamps.
- Indexes for frequent lookups such as product slug, category, user ID, and order status.
- Unique constraints where business identity requires them.
- Check constraints for quantities, prices, discount ranges, and status values.
- `order_items` preserve historical product name, variant description, quantity, and unit price.
- Avoid storing values that can be safely derived unless there is a caching or historical reason.

## 3. Planned Payment and Order Statuses

Payment status:

- `pending`
- `paid`
- `failed`
- `expired`
- `cancelled`

Order or fulfillment status:

- `pending_payment`
- `paid`
- `processing`
- `shipped`
- `completed`
- `cancelled`

Keep these concepts separate. Payment success reporting from the client is not proof of payment; the webhook is the source of truth.

## 4. Planned RLS Direction

Customers can access only their own:

- profile
- addresses
- cart and cart items
- orders and order items
- payments associated with their orders
- wishlist
- reviews

Customers must not access another customer’s data or administer store data.

Admin access must be enforced at the database or server authorization layer, not only by hiding UI elements.

## 5. Planned Storage Direction

Possible public buckets:

- `product-images`
- `banner-images`
- `avatars`

Use public access only where appropriate. Do not expose private credentials or private customer documents.
