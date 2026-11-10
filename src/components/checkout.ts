"use client";

import type { BasketLine } from "./basket-store";

export async function startCheckout(lines: BasketLine[], giftMessage?: string): Promise<string | null> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lines: lines.map((l) => ({ slug: l.slug, quantity: l.quantity, selections: l.selections })),
      giftMessage: giftMessage || undefined,
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (res.ok && json.url) {
    window.location.assign(json.url);
    return null;
  }
  return json.error ?? "We couldn't start checkout. Please try again.";
}
