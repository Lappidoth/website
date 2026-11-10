import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

type Props = {
  product: { slug: string; name: string; image: string; tagline: string; priceCents: number; stock: number | null };
  priority?: boolean;
  showTagline?: boolean;
};

export function ProductCard({ product, priority, showTagline = true }: Props) {
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
        <h3>{product.name}</h3>
        {showTagline && <p className="tagline">{product.tagline}</p>}
        <p className="price">{formatPrice(product.priceCents)}</p>
      </div>
    </Link>
  );
}
