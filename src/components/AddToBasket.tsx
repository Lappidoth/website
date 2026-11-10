"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { basket } from "./basket-store";

type Candle = { slug: string; name: string };

type Props = {
  product: { slug: string; name: string; image: string; priceCents: number; type: string; setSize: number | null; stock: number | null };
  candles: Candle[]; // for sets
};

export function AddToBasket({ product, candles }: Props) {
  const isSet = product.type === "SET" && product.setSize;
  const size = product.setSize ?? 0;
  // Default a set to one of each (Trio) or the first N candles (Duo)
  const [picks, setPicks] = useState<string[]>(() =>
    Array.from({ length: size }, (_, i) => candles[i % Math.max(candles.length, 1)]?.slug ?? ""),
  );
  const [qty, setQty] = useState(1);
  const soldOut = product.stock === 0;

  function add() {
    basket.add(
      {
        slug: product.slug,
        name: product.name,
        image: product.image,
        priceCents: product.priceCents,
        ...(isSet
          ? {
              selections: picks,
              optionLabel: picks.map((s) => candles.find((c) => c.slug === s)?.name ?? s).join(", "),
            }
          : {}),
      },
      qty,
    );
  }

  return (
    <div className="atb">
      {isSet && (
        <fieldset className="set-picker">
          <legend className="eyebrow">Choose your {size === 2 ? "two" : size === 3 ? "three" : size}</legend>
          {picks.map((value, i) => (
            <label key={i} className="field">
              <span>Candle {i + 1}</span>
              <select
                value={value}
                onChange={(e) => setPicks((p) => p.map((v, j) => (j === i ? e.target.value : v)))}
              >
                {candles.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </fieldset>
      )}

      <div className="atb-row">
        <div className="qty qty-lg" role="group" aria-label="Quantity">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            −
          </button>
          <span aria-live="polite">{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity">
            +
          </button>
        </div>
        <button type="button" className="btn btn-solid grow" onClick={add} disabled={soldOut}>
          {soldOut ? "Sold out" : `Add to basket · ${formatPrice(product.priceCents * qty)}`}
        </button>
      </div>
    </div>
  );
}
