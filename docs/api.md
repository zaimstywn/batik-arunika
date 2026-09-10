# API Boundaries — Batik Arunika

> Status: planned only. No API routes or server actions for these operations are implemented in Milestone 1.

## 1. Planned Product and Catalog Boundary

Future operations may include:

- list published products
- get product by slug or ID
- list categories
- search, filter, sort, and paginate products

Public product reads should not expose unpublished or internal administrative fields.

## 2. Planned Cart and Checkout Boundary

Future operations may include:

- add cart item
- update cart quantity
- remove cart item
- validate stock
- validate promotion
- calculate subtotal, discount, shipping, and grand total
- create an order after server validation

The client must not supply final prices, discounts, shipping costs, totals, stock levels, or payment status.

## 3. Planned Shipping Boundary

A shipping service layer should isolate Biteship:

- resolve destination data
- request shipping rates
- return courier and service options
- associate the selected service with checkout or an order

Biteship credentials remain server-only.

## 4. Planned Payment Boundary

A payment service layer should isolate Midtrans:

- create a Midtrans transaction for a validated order
- return only safe client-facing payment data or redirect information
- receive Midtrans webhook notifications
- verify notification authenticity
- update payment and order records

Server keys remain server-only. Client payment success UI is not authoritative.

## 5. Planned Webhook Handling

The webhook endpoint must:

- validate the Midtrans signature
- handle retries and duplicate notifications safely
- synchronize payment status and order status
- avoid exposing raw internal errors or secrets
