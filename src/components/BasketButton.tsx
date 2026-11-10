"use client";

import { basket, useBasket } from "./basket-store";

export function BasketButton() {
  const { count } = useBasket();
  return (
    <button type="button" className="basket-btn" onClick={() => basket.setOpen(true)} aria-label={`Basket, ${count} item${count === 1 ? "" : "s"}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
        <path d="M5 8h14l-1.2 12H6.2L5 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      <span className="basket-count" data-empty={count === 0}>
        {count}
      </span>
    </button>
  );
}
