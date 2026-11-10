"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import { SHOP } from "@/lib/shop-config";
import { BasketLines } from "./BasketLines";
import { basket, useBasket } from "./basket-store";
import { startCheckout } from "./checkout";

export function FreeShippingNote({ subtotalCents }: { subtotalCents: number }) {
  const remaining = SHOP.freeShippingThresholdCents - subtotalCents;
  return (
    <p className="ship-note">
      {remaining > 0
        ? `You're ${formatPrice(remaining)} away from complimentary UK delivery.`
        : "Your order qualifies for complimentary UK delivery."}
    </p>
  );
}

export function BasketDrawer() {
  const { lines, open, subtotalCents } = useBasket();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && basket.setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  async function checkout() {
    setBusy(true);
    setError(null);
    const err = await startCheckout(lines);
    if (err) {
      setError(err);
      setBusy(false);
    }
  }

  return (
    <div className="drawer" data-open={open} aria-hidden={!open}>
      <div className="drawer-scrim" onClick={() => basket.setOpen(false)} />
      <div
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Your basket"
        tabIndex={-1}
        ref={panelRef}
        inert={!open}
      >
        <div className="drawer-head">
          <p className="eyebrow">Your basket</p>
          <button type="button" className="close" onClick={() => basket.setOpen(false)} aria-label="Close basket">
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer-empty">
            <p className="script">Nothing here yet</p>
            <Link href="/shop" className="btn" onClick={() => basket.setOpen(false)}>
              Shop the Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer-body">
              <FreeShippingNote subtotalCents={subtotalCents} />
              <BasketLines lines={lines} />
            </div>
            <div className="drawer-foot">
              <div className="row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotalCents)}</span>
              </div>
              <p className="small muted">Delivery and any discount codes are added at checkout.</p>
              <button type="button" className="btn btn-solid full" onClick={checkout} disabled={busy}>
                {busy ? "Opening secure checkout…" : "Checkout"}
              </button>
              <Link href="/basket" className="link-quiet" onClick={() => basket.setOpen(false)}>
                View basket &amp; add a gift note
              </Link>
              {error && (
                <p className="form-status" data-state="error" role="alert">
                  {error}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
