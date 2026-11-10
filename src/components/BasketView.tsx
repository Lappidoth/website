"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { BasketLines } from "./BasketLines";
import { FreeShippingNote } from "./BasketDrawer";
import { useBasket } from "./basket-store";
import { startCheckout } from "./checkout";

export function BasketView() {
  const { lines, subtotalCents } = useBasket();
  const [gift, setGift] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (lines.length === 0) {
    return (
      <div style={{ textAlign: "center", display: "grid", gap: "2rem", justifyItems: "center", paddingBottom: "6rem" }}>
        <p className="muted">Your basket is empty.</p>
        <Link href="/shop" className="btn">
          Shop the Collection
        </Link>
      </div>
    );
  }

  async function checkout() {
    setBusy(true);
    setError(null);
    const err = await startCheckout(lines, gift);
    if (err) {
      setError(err);
      setBusy(false);
    }
  }

  return (
    <div className="basket-page">
      <div style={{ display: "grid", gap: "2rem" }}>
        <BasketLines lines={lines} />
        <div className="field">
          <label htmlFor="gift">Gift message (optional)</label>
          <textarea
            id="gift"
            maxLength={300}
            value={gift}
            onChange={(e) => setGift(e.target.value)}
            placeholder="We'll handwrite this on a card and leave prices out of the parcel."
            style={{ minHeight: "5rem" }}
          />
        </div>
      </div>
      <aside className="summary" aria-label="Order summary">
        <p className="eyebrow" style={{ color: "var(--ink)" }}>Order summary</p>
        <div className="row">
          <span>Subtotal</span>
          <span>{formatPrice(subtotalCents)}</span>
        </div>
        <div className="row muted">
          <span>Delivery</span>
          <span>Calculated at checkout</span>
        </div>
        <FreeShippingNote subtotalCents={subtotalCents} />
        <div className="row total">
          <span>Total</span>
          <span>{formatPrice(subtotalCents)}</span>
        </div>
        <button type="button" className="btn btn-solid full" onClick={checkout} disabled={busy}>
          {busy ? "Opening secure checkout…" : "Secure checkout"}
        </button>
        <p className="pay-icons">Card · Apple Pay · Google Pay — processed securely by Stripe</p>
        {error && (
          <p className="form-status" data-state="error" role="alert">
            {error}
          </p>
        )}
      </aside>
    </div>
  );
}
