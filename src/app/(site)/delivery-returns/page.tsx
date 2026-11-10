import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/PolicyPage";
import { formatPrice } from "@/lib/format";
import { SHOP } from "@/lib/shop-config";

export const metadata: Metadata = { title: "Delivery & Returns" };

export default function Page() {
  return (
    <PolicyPage title="Delivery & Returns" updated="November 2026">
      <h2>Delivery</h2>
      <ul>
        {SHOP.shippingOptions.map((o) => (
          <li key={o.id}>
            <strong>{o.name}</strong> — {formatPrice(o.amountCents)}
          </li>
        ))}
        <li>
          <strong>Complimentary standard delivery</strong> on UK orders over{" "}
          {formatPrice(SHOP.freeShippingThresholdCents)}.
        </li>
      </ul>
      <p>
        Every candle is hand-poured in small batches, so please allow 1–3 working days for dispatch.
        You&apos;ll receive an email when your order is on its way.
      </p>
      <h3>International delivery</h3>
      <p>
        We currently deliver within the UK. International delivery can be arranged —{" "}
        <Link href="/contact">contact us</Link> with your address and we&apos;ll send a quote.
      </p>

      <h2>Returns</h2>
      <p>
        You can cancel your order for any reason within 14 days of receiving it. Let us know at{" "}
        <a href={`mailto:${SHOP.contact.email}`}>{SHOP.contact.email}</a>, then return the items unused
        and in their original packaging within a further 14 days. Return postage is your
        responsibility unless the item is faulty. We&apos;ll refund you, including the original
        standard delivery charge, within 14 days of receiving the return.
      </p>
      <h3>Damaged or faulty items</h3>
      <p>
        If anything arrives damaged or isn&apos;t right, please email us within 30 days with your order
        number and a photo, and we&apos;ll arrange a replacement or full refund. This doesn&apos;t
        affect your statutory rights.
      </p>
    </PolicyPage>
  );
}
