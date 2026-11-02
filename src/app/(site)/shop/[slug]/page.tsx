import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { WaitlistForm } from "@/components/WaitlistForm";
import { formatPrice, getProduct, getProducts } from "@/lib/products";

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

  const others = (await getProducts()).filter((p) => p.slug !== product.slug);

  return (
    <>
      <div className="container">
        <p className="breadcrumb">
          <Link href="/shop">Shop</Link> &nbsp;/&nbsp; {product.name}
        </p>
        <article className="pdp">
          <div className="media">
            <Image
              src={product.image}
              alt={`${product.name} candle from ${product.collection.name}`}
              fill
              priority
              sizes="(max-width: 860px) 100vw, 55vw"
            />
          </div>
          <div className="info">
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <h1>{product.name}</h1>
              <p className="collection-name">{product.collection.name}</p>
            </div>
            <p className="price">{formatPrice(product.priceCents, product.currency)}</p>
            <p className="desc">
              <em>{product.tagline}</em> {product.description}
            </p>

            <dl className="notes-table" style={{ margin: 0 }}>
              <div>
                <dt>Top</dt>
                <dd>{product.topNotes}</dd>
              </div>
              <div>
                <dt>Heart</dt>
                <dd>{product.heartNotes}</dd>
              </div>
              <div>
                <dt>Base</dt>
                <dd>{product.baseNotes}</dd>
              </div>
            </dl>

            <div className="spec-label" aria-label="Specifications">
              <div>
                Burn time<strong>{product.burnTime}</strong>
              </div>
              <div>
                Net weight<strong>{product.netWeight}</strong>
              </div>
              <div>
                Wax<strong>{product.wax}</strong>
              </div>
            </div>

            <div className="waitlist-box">
              <p className="eyebrow" style={{ color: "var(--ink)" }}>
                Online ordering opens soon
              </p>
              <p>Leave your email and we&apos;ll let you know the moment {product.name} is available.</p>
              <WaitlistForm productSlug={product.slug} />
            </div>
          </div>
        </article>
      </div>

      {others.length > 0 && (
        <section className="section bg-linen">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Complete the collection</p>
              <h2>You may also love</h2>
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
