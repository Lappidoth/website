import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ClearBasket } from "@/components/ClearBasket";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { fulfilCheckoutSession } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

async function loadOrder(sessionId: string) {
  const stripe = getStripe();
  if (!stripe || !sessionId.startsWith("cs_")) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // Usually the webhook has already done this; calling again is safe.
    await fulfilCheckoutSession(session);
    return db.order.findUnique({ where: { checkoutRef: session.id }, include: { items: true } });
  } catch {
    return null;
  }
}

export default async function SuccessPage(props: PageProps<"/checkout/success">) {
  await connection();
  const sp = await props.searchParams;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : "";
  const order = sessionId ? await loadOrder(sessionId) : null;

  return (
    <section className="page-hero container" style={{ paddingBottom: "7rem" }}>
      <ClearBasket />
      <p className="script" style={{ fontSize: "clamp(3.5rem, 8vw, 5.5rem)" }}>Thank you</p>
      {order ? (
        <>
          <p>
            Your order <strong>{order.number}</strong> is confirmed. A receipt is on its way to{" "}
            {order.email ?? "your inbox"}.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.4rem" }}>
            {order.items.map((i) => (
              <li key={i.id}>
                {i.quantity} × {i.name}
                {i.options ? ` (${i.options})` : ""}
              </li>
            ))}
          </ul>
          <p>
            <strong>Total paid: {formatPrice(order.totalCents, order.currency)}</strong>
          </p>
        </>
      ) : (
        <p>Your order has been received. A confirmation is on its way to your inbox.</p>
      )}
      <p>We&apos;ll let you know as soon as your candles are on their way.</p>
      <Link href="/shop" className="btn">
        Continue shopping
      </Link>
    </section>
  );
}
