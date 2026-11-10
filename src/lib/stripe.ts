import Stripe from "stripe";

let client: Stripe | null = null;

/** Returns the Stripe client, or null when STRIPE_SECRET_KEY isn't set. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client ??= new Stripe(key, { appInfo: { name: "Lappidoth & Co." } });
  return client;
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
