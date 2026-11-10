# Lappidoth & Co. — Website + CRM

The brand website ("Fragrance to Fire") plus a built-in CRM that captures every
newsletter signup, contact enquiry and product waitlist in one customer database.

## Stack

- **Next.js 16** (App Router, TypeScript): website, API and admin in one app
- **Stripe Checkout** for payments: cards, Apple Pay, Google Pay, discount codes
- **Prisma + SQLite** for local development. For production, switch to Postgres by changing
  `provider` in `prisma/schema.prisma` and pointing `DATABASE_URL` at your database.
- **zod** validates everything that comes in from the browser

## Getting started

```bash
npm install
cp .env.example .env      # then set ADMIN_PASSWORD
npm run setup             # creates the database and seeds the products
npm run dev
```

- Website: http://localhost:3000
- CRM: http://localhost:3000/admin (log in with `ADMIN_USER` / `ADMIN_PASSWORD`)
- Browse raw data: `npm run db:studio`

## Payments (Stripe)

1. Put your **test** secret key (`sk_test_…`) in `.env` as `STRIPE_SECRET_KEY`.
2. To receive payment confirmations locally, run the Stripe CLI:
   `stripe listen --forward-to localhost:3000/api/stripe/webhook`, then put the
   `whsec_…` it prints into `STRIPE_WEBHOOK_SECRET`.
3. Pay with test card `4242 4242 4242 4242`, any future expiry date and any CVC.
4. In production, add a webhook endpoint in the Stripe Dashboard pointing at
   `https://<your-domain>/api/stripe/webhook` for `checkout.session.completed`,
   `checkout.session.async_payment_succeeded` and `checkout.session.expired`.

Prices always come from the database. The browser only sends product slugs and quantities.
Delivery (standard £4.99, express £5.99, free over £70) is set in `src/lib/shop-config.ts`.

## Project layout

```
prisma/
  schema.prisma          Data model: catalog, CRM (customers, tags, interactions), orders
  seed.ts                Products: 3 candles at £20, Duo at £38, Trio at £54
public/images/           Product photography
src/
  app/(site)/            Public website: home, shop, products, basket, story, contact, policies
  app/admin/             Back office: dashboard, orders, customers, notes, CSV export
  app/api/               subscribe, contact, checkout, stripe/webhook
  components/            Header, footer, forms, product card
  lib/crm.ts             CRM service layer. All customer writes go through here.
  lib/products.ts        Catalogue queries
  lib/basket.ts          Server-side basket validation & pricing
  lib/orders.ts          Checkout + order fulfilment (provider-specific code lives here)
  lib/shop-config.ts     Delivery rates, free-delivery threshold, contact details
  proxy.ts               Password-protects /admin
```

## How the CRM works

Every person is one `Customer` row, keyed by email. Each form on the site creates or updates
that customer and adds an `Interaction` to their timeline. Status moves up automatically
(LEAD → SUBSCRIBER → CUSTOMER → VIP) and can be set by hand in the admin.
Admins can add notes, tags and phone numbers, and export everyone to CSV.

## Extending it

The schema and service layer are designed so these can be added without restructuring:

- **Order emails:** branded confirmation and dispatch emails (e.g. via Resend).
- **Revolut Pay:** a second provider can be added in `lib/orders.ts`. Orders already record `paymentProvider`.
- **Email marketing:** sync opted-in customers to Klaviyo/Mailchimp from `lib/crm.ts`.
- **Notifications:** email the team on new contact-form enquiries (e.g. Resend).
- **Team accounts:** replace the Basic-auth guard in `src/proxy.ts` with Auth.js user logins.
- **Product admin:** edit products and prices from `/admin` rather than the seed file.
