import Link from "next/link";
import { formatPrice } from "@/lib/format";

type P = { slug: string; name: string; priceCents: number; setSize: number | null };

export function SetTiles({ single, sets }: { single?: P; sets: P[] }) {
  const unit = single?.priceCents ?? 0;
  return (
    <div className="set-tiles">
      {single && (
        <Link href="/shop" className="set-tile">
          <span className="count">1</span>
          <h3>Single candle</h3>
          <span className="price">{formatPrice(unit)}</span>
          <span className="save" />
        </Link>
      )}
      {sets.map((s) => {
        const saving = unit && s.setSize ? unit * s.setSize - s.priceCents : 0;
        return (
          <Link key={s.slug} href={`/shop/${s.slug}`} className="set-tile">
            <span className="count">{s.setSize}</span>
            <h3>{s.name.replace("The Presence ", "The ")}</h3>
            <span className="price">{formatPrice(s.priceCents)}</span>
            <span className="save">{saving > 0 ? `Save ${formatPrice(saving)}` : ""}</span>
          </Link>
        );
      })}
    </div>
  );
}
