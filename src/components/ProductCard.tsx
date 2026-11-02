import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/products";

type Props = {
  product: {
    slug: string;
    name: string;
    image: string;
    heartNotes: string;
    priceCents: number;
    currency: string;
  };
  priority?: boolean;
};

export function ProductCard({ product, priority }: Props) {
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
      </div>
      <div className="meta">
        <h3>{product.name}</h3>
        <p className="notes">{product.heartNotes}</p>
        <p className="price">{formatPrice(product.priceCents, product.currency)}</p>
      </div>
    </Link>
  );
}
