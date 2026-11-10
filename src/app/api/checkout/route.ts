import { NextResponse } from "next/server";
import { BasketError, basketSchema, priceBasket } from "@/lib/basket";
import { createCheckout } from "@/lib/orders";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = basketSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your basket." },
      { status: 422 },
    );
  }

  try {
    const priced = await priceBasket(parsed.data.lines);
    const url = await createCheckout(priced, parsed.data.giftMessage);
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    if (err instanceof BasketError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 422 });
    }
    if (err instanceof Error && err.message === "STRIPE_NOT_CONFIGURED") {
      return NextResponse.json(
        { ok: false, error: "Online checkout is opening soon. Please contact us to order." },
        { status: 503 },
      );
    }
    console.error(err);
    return NextResponse.json({ ok: false, error: "We couldn't start checkout. Please try again." }, { status: 500 });
  }
}
