"use client";

import { basket } from "./basket-store";

export function QuickAdd({ slug, name, image, priceCents }: { slug: string; name: string; image: string; priceCents: number }) {
  return (
    <button type="button" className="btn btn-light" onClick={() => basket.add({ slug, name, image, priceCents })}>
      Add to basket
    </button>
  );
}
