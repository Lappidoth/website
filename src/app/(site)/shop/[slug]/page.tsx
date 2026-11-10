import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToBasket } from "@/components/AddToBasket";
import { ProductGallery } from "@/components/ProductGallery";
import { CANDLE_ART } from "@/lib/brand-assets";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/lib/format";
import { getProduct, getProducts } from "@/lib/products";
import { SHOP } from "@/lib/shop-config";
import presenceInk from "../../../../../public/brand/script-presence-collection-ink.png";

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.tagline} ${product.description}`,
    openGraph: { images: [product.image] },
  };
}

export default async function ProductPage(props: PageProps<"/shop/[slug]">) {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const candles = await getProducts("CANDLE");
  const isSet = product.type === "SET";
  const others = isSet ? candles : candles.filter((p) => p.slug !== product.slug);
  const art = CANDLE_ART[product.slug];
  const hasNotes = product.topNotes || product.heartNotes || product.baseNotes;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: `${product.tagline} ${product.description}`,
    image: product.image,
    brand: { "@type": "Brand", name: "Lappidoth & Co." },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: (product.priceCents / 100).toFixed(2),
      availability: product.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="container">
        <p className="breadcrumb">
          <Link href="/shop">Shop</Link> &nbsp;/&nbsp; {product.name}
        </p>
        <article className="pdp">
          <ProductGallery
            shots={[
              { src: product.image, alt: `${product.name} — ${product.collection.name}`, kind: "photo" },
              ...(art ? [{ src: art.label, alt: `The ${product.name} label`, kind: "label" as const }] : []),
            ]}
          />
          <div className="info">
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <h1>{art ? <Image src={art.nameInk} alt={product.name} priority sizes="420px" /> : product.name}</h1>
              <p className="collection-name">
                <Image src={presenceInk} alt={product.collection.name} sizes="300px" />
              </p>
            </div>
            <p className="price">{formatPrice(product.priceCents, product.currency)}</p>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <p className="lead">{product.tagline}</p>
              <p className="desc">{product.description}</p>
            </div>

            {hasNotes && (
              <dl className="notes-table">
                <div><dt>Top</dt><dd>{product.topNotes ?? "—"}</dd></div>
                <div><dt>Heart</dt><dd>{product.heartNotes ?? "—"}</dd></div>
                <div><dt>Base</dt><dd>{product.baseNotes ?? "—"}</dd></div>
              </dl>
            )}

            <AddToBasket
              product={product}
              candles={candles.map((c) => ({ slug: c.slug, name: c.name }))}
            />

            <div className="spec-label" aria-label="Specifications">
              <div>Burn time<strong>{product.burnTime}</strong></div>
              <div>Net weight<strong>{isSet ? `${product.setSize} × 5 oz` : product.netWeight}</strong></div>
              <div>Wax<strong>{product.wax}</strong></div>
            </div>

            <div className="details">
              <details>
                <summary>Delivery &amp; returns</summary>
                <div>
                  <p>
                    UK delivery from {formatPrice(SHOP.shippingOptions[0].amountCents)}, complimentary
                    on orders over {formatPrice(SHOP.freeShippingThresholdCents)}. Dispatched within 1–3
                    working days. International delivery by arrangement —{" "}
                    <Link href="/contact">get in touch</Link>.
                  </p>
                  <p>
                    <Link href="/delivery-returns">Read our delivery &amp; returns policy</Link>
                  </p>
                </div>
              </details>
              <details>
                <summary>Candle care</summary>
                <div>
                  <p>On the first light, burn for 2–3 hours until the melt pool reaches the edge of the glass.</p>
                  <p>Trim the wick to 5 mm before every burn. Burn for no more than 4 hours at a time.</p>
                </div>
              </details>
              <details>
                <summary>Safety</summary>
                <div>
                  <p>
                    Never leave a burning candle unattended. Keep out of reach of children and pets.
                    Burn on a heat-resistant surface away from draughts and anything flammable.
                    Stop use when 1 cm of wax remains.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </article>
      </div>

      {others.length > 0 && (
        <section className="section bg-linen">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{isSet ? "In the collection" : "Complete the collection"}</p>
              <h2>{isSet ? "Choose from" : "You may also love"}</h2>
            </div>
            <div className="product-grid">
              {others.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
