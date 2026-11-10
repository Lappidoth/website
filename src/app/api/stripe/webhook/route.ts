import { getStripe } from "@/lib/stripe";
import { cancelCheckoutSession, fulfilCheckoutSession } from "@/lib/orders";

/**
 * Stripe → our database. In the Stripe Dashboard, add an endpoint pointing at
 * https://<your-domain>/api/stripe/webhook listening for:
 *   checkout.session.completed
 *   checkout.session.async_payment_succeeded
 *   checkout.session.expired
 * and put its signing secret in STRIPE_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return new Response("Not configured", { status: 503 });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await fulfilCheckoutSession(event.data.object);
      break;
    case "checkout.session.expired":
      await cancelCheckoutSession(event.data.object);
      break;
  }

  return Response.json({ received: true });
}
