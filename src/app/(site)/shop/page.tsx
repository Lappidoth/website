import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { SetTiles } from "@/components/SetTiles";
import { getProducts } from "@/lib/products";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Shop",
  description: "The Presence Collection — hand-poured natural soy wax candles. Singles, duos and trios.",
};

export default async function ShopPage() {
  const [candles, sets] = await Promise.all([getProducts("CANDLE"), getProducts("SET")]);

  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Shop</p>
        <h1>The Presence Collection</h1>
        <p>
          Hand-poured with intention. Crafted to shape atmosphere. 100% natural soy wax, 5 oz, over
          thirty hours of burn time.
        </p>
      </section>
      <section className="container" style={{ paddingBottom: "clamp(4rem, 8vw, 6rem)" }}>
        <div className="product-grid">
          {candles.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 3} />
          ))}
        </div>
      </section>
      <section className="section bg-linen" id="sets">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Gift sets</p>
            <h2>Better together</h2>
            <p>Pair any two of your favourites, or choose three — beautifully priced for gifting.</p>
          </div>
          <div className="product-grid two">
            {sets.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div style={{ marginTop: "3rem" }}>
            <SetTiles single={candles[0]} sets={sets} />
          </div>
        </div>
      </section>
    </>
  );
}
