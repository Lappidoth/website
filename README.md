# Lappidoth & Co. — Website + CRM

The brand website ("Fragrance to Fire") plus a built-in CRM that captures every
newsletter signup, contact enquiry and product waitlist in one customer database.

## Stack

- **Next.js 16** (App Router, TypeScript) — website, API and admin in one app
- **Prisma + SQLite** for local development. Switch to Postgres for production by changing
  `provider` in `prisma/schema.prisma` and pointing `DATABASE_URL` at your database.
- **zod** for validating everything that comes in from forms

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

## Project layout

```
prisma/
  schema.prisma          Data model: catalog, CRM (customers, tags, interactions), orders
  seed.ts                The Presence Collection products (prices & notes are placeholders)
public/images/           Product photography
src/
  app/(site)/            Public website: home, shop, product pages, story, contact
  app/admin/             CRM: dashboard, customer list/search/CSV export, profiles, notes
  app/api/               Public form endpoints: subscribe, contact, waitlist
  components/            Header, footer, forms, product card
  lib/crm.ts             CRM service layer. All customer writes go through here.
  lib/products.ts        Catalog queries
  proxy.ts               Password-protects /admin
```

## How the CRM works

Every person is one `Customer` row, keyed by email. Each form on the site creates or updates
that customer and adds an `Interaction` to their timeline. Status moves up automatically
(LEAD → SUBSCRIBER → CUSTOMER → VIP) and can be set by hand in the admin.
Admins can add notes, tags and phone numbers, and export everyone to CSV.

## Extending it

The schema and service layer are designed so these can be added without restructuring:

- **Checkout:** Stripe Checkout + a webhook that creates `Order` rows and calls
  `upsertCustomer({ status: "CUSTOMER" })` + `logInteraction({ type: "ORDER_PLACED" })`.
- **Email marketing:** sync opted-in customers to Klaviyo/Mailchimp from `lib/crm.ts`.
- **Notifications:** email the team on new contact-form enquiries (e.g. Resend).
- **Team accounts:** replace the Basic-auth guard in `src/proxy.ts` with Auth.js user logins.
- **Product admin:** edit products and prices from `/admin` rather than the seed file.
