import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Shop",
  description: "The Presence Collection — hand-poured natural soy candles.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Shop</p>
        <h1>The Presence Collection</h1>
        <p>
          Hand-poured with intention. Crafted to shape atmosphere. Natural soy wax, 5 oz, over thirty
          hours of burn time.
        </p>
      </section>
      <section className="container" style={{ paddingBottom: "clamp(4rem, 8vw, 7rem)" }}>
        <div className="product-grid">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 3} />
          ))}
        </div>
      </section>
    </>
  );
}
