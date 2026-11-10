/**
 * Order lifecycle. Payment-provider specifics stay in this file and
 * src/lib/stripe.ts, so another provider (e.g. Revolut) can be added
 * alongside without touching the rest of the app.
 */
import type Stripe from "stripe";
import { logInteraction, upsertCustomer } from "./crm";
import { db } from "./db";
import { formatPrice } from "./format";
import { SHOP } from "./shop-config";
import { getStripe, siteUrl } from "./stripe";
import type { PricedLine } from "./basket";

async function nextOrderNumber() {
  const last = await db.order.findFirst({ orderBy: { createdAt: "desc" }, select: { number: true } });
  const n = last ? parseInt(last.number.replace(/\D/g, ""), 10) : 1000;
  return `LC-${(Number.isFinite(n) ? n : 1000) + 1}`;
}

export async function createCheckout(
  priced: { lines: PricedLine[]; subtotalCents: number },
  giftMessage?: string,
) {
  const stripe = getStripe();
  if (!stripe) throw new Error("STRIPE_NOT_CONFIGURED");

  const order = await db.order.create({
    data: {
      number: await nextOrderNumber(),
      subtotalCents: priced.subtotalCents,
      totalCents: priced.subtotalCents,
      currency: SHOP.currency,
      giftMessage: giftMessage || null,
      items: {
        create: priced.lines.map((l) => ({
          productId: l.productId,
          name: l.name,
          options: l.options,
          quantity: l.quantity,
          unitPriceCents: l.unitPriceCents,
        })),
      },
    },
  });

  const base = siteUrl();
  const publicImages = base.startsWith("https://");
  const freeShipping = priced.subtotalCents >= SHOP.freeShippingThresholdCents;

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: SHOP.currency.toLowerCase(),
      client_reference_id: order.id,
      metadata: { orderId: order.id, orderNumber: order.number },
      payment_intent_data: { metadata: { orderId: order.id, orderNumber: order.number } },
      line_items: priced.lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: SHOP.currency.toLowerCase(),
          unit_amount: l.unitPriceCents,
          product_data: {
            name: l.name,
            ...(l.options ? { description: l.options } : {}),
            ...(publicImages ? { images: [`${base}${l.image}`] } : {}),
          },
        },
      })),
      shipping_address_collection: { allowed_countries: [...SHOP.shipToCountries] },
      shipping_options: SHOP.shippingOptions.map((opt, i) => {
        const amount = i === 0 && freeShipping ? 0 : opt.amountCents;
        return {
          shipping_rate_data: {
            type: "fixed_amount" as const,
            display_name: amount === 0 ? `${opt.name} — complimentary` : opt.name,
            fixed_amount: { amount, currency: SHOP.currency.toLowerCase() },
            delivery_estimate: {
              minimum: { unit: "business_day" as const, value: opt.minDays },
              maximum: { unit: "business_day" as const, value: opt.maxDays },
            },
          },
        };
      }),
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/basket`,
    });
  } catch (err) {
    // Don't leave an orphaned "awaiting payment" order behind
    await db.order.delete({ where: { id: order.id } }).catch(() => {});
    throw err;
  }

  await db.order.update({ where: { id: order.id }, data: { checkoutRef: session.id } });
  return session.url;
}

/**
 * Marks an order paid and records the customer in the CRM. Safe to call more
 * than once (from the webhook and the success page) — it only runs once.
 */
export async function fulfilCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return null;

  const orderId = session.metadata?.orderId ?? session.client_reference_id;
  if (!orderId) return null;

  const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return null;
  if (order.status !== "PENDING") return order; // already processed

  const details = session.customer_details;
  const shipping = session.collected_information?.shipping_details ?? null;
  const email = details?.email?.toLowerCase();

  let customerId: string | null = null;
  if (email) {
    const [firstName, ...rest] = (details?.name ?? "").trim().split(/\s+/);
    const customer = await upsertCustomer({
      email,
      firstName: firstName || undefined,
      lastName: rest.join(" ") || undefined,
      phone: details?.phone ?? undefined,
      source: "checkout",
      status: "CUSTOMER",
    });
    customerId = customer.id;
  }

  // Claim the order atomically so concurrent calls can't double-process it.
  const claimed = await db.order.updateMany({
    where: { id: order.id, status: "PENDING" },
    data: {
      status: "PAID",
      paidAt: new Date(),
      customerId,
      email: email ?? null,
      phone: details?.phone ?? null,
      totalCents: session.amount_total ?? order.totalCents,
      subtotalCents: session.amount_subtotal ?? order.subtotalCents,
      shippingCents: session.shipping_cost?.amount_total ?? 0,
      discountCents: session.total_details?.amount_discount ?? 0,
      shippingName: shipping?.name ?? details?.name ?? null,
      shippingAddress: shipping?.address ? JSON.stringify(shipping.address) : null,
      paymentRef: typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null),
    },
  });
  if (claimed.count === 0) return db.order.findUnique({ where: { id: order.id } });

  for (const item of order.items) {
    if (item.productId) {
      await db.product.updateMany({
        where: { id: item.productId, stock: { not: null, gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
    }
  }

  if (customerId) {
    await logInteraction({
      customerId,
      type: "ORDER_PLACED",
      subject: `Order ${order.number} · ${formatPrice(session.amount_total ?? order.totalCents)}`,
      body: order.items
        .map((i) => `${i.quantity} × ${i.name}${i.options ? ` (${i.options})` : ""}`)
        .join("\n"),
      metadata: { orderId: order.id },
    });
  }

  return db.order.findUnique({ where: { id: order.id } });
}

export async function cancelCheckoutSession(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId ?? session.client_reference_id;
  if (!orderId) return;
  await db.order.updateMany({ where: { id: orderId, status: "PENDING" }, data: { status: "CANCELLED" } });
}
