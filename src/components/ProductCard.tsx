import Image from "next/image";
import Link from "next/link";
import { CANDLE_ART } from "@/lib/brand-assets";
import { formatPrice } from "@/lib/format";

type Props = {
  product: {
    slug: string;
    name: string;
    image: string;
    tagline: string;
    scent?: string | null;
    priceCents: number;
    stock: number | null;
  };
  priority?: boolean;
  showTagline?: boolean;
  /** "cream" for use on the charcoal background */
  tone?: "ink" | "cream";
};

export function ProductCard({ product, priority, showTagline = true, tone = "ink" }: Props) {
  const art = CANDLE_ART[product.slug];
  return (
    <Link href={`/shop/${product.slug}`} className="product-card">
      <div className="frame">
        <Image
          src={product.image}
          alt={`${product.name} candle`}
          fill
          sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
          priority={priority}
        />
        {product.stock === 0 && <span className="badge">Sold out</span>}
      </div>
      <div className="meta">
        <h3>
          {art ? (
            <Image
              src={tone === "cream" ? art.nameCream : art.nameInk}
              alt={product.name}
              className="name-art"
              sizes="240px"
            />
          ) : (
            product.name
          )}
        </h3>
        {showTagline && <p className="tagline">{product.tagline}</p>}
        {product.scent && <p className="scent">{product.scent}</p>}
        <p className="price">{formatPrice(product.priceCents)}</p>
      </div>
    </Link>
  );
}
