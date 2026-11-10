"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { basket, type BasketLine } from "./basket-store";

export function BasketLines({ lines }: { lines: BasketLine[] }) {
  return (
    <ul className="basket-lines">
      {lines.map((l) => (
        <li key={l.key}>
          <Link href={`/shop/${l.slug}`} className="thumb" onClick={() => basket.setOpen(false)}>
            <Image src={l.image} alt="" fill sizes="88px" />
          </Link>
          <div className="info">
            <div className="row">
              <p className="name">{l.name}</p>
              <p className="price">{formatPrice(l.priceCents * l.quantity)}</p>
            </div>
            {l.optionLabel && <p className="opts">{l.optionLabel}</p>}
            <div className="row">
              <div className="qty" role="group" aria-label={`Quantity of ${l.name}`}>
                <button type="button" onClick={() => basket.setQuantity(l.key, l.quantity - 1)} aria-label="Decrease quantity">
                  −
                </button>
                <span aria-live="polite">{l.quantity}</span>
                <button type="button" onClick={() => basket.setQuantity(l.key, l.quantity + 1)} aria-label="Increase quantity">
                  +
                </button>
              </div>
              <button type="button" className="remove" onClick={() => basket.setQuantity(l.key, 0)}>
                Remove
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
