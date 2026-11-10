import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/PolicyPage";
import { SHOP } from "@/lib/shop-config";

export const metadata: Metadata = { title: "Terms of Sale" };

export default function Page() {
  return (
    <PolicyPage title="Terms of Sale" updated="November 2026">
      <h2>About us</h2>
      <p>
        This website is operated by Lappidoth &amp; Co. [add trading name / company number and registered
        address]. Contact us at <a href={`mailto:${SHOP.contact.email}`}>{SHOP.contact.email}</a> or{" "}
        {SHOP.contact.phone}.
      </p>
      <h2>Orders &amp; prices</h2>
      <p>
        All prices are in pounds sterling. We are not currently VAT registered, so no VAT is charged.
        Delivery charges are shown at checkout before you pay. Your contract with us is formed when we
        email to confirm your order.
      </p>
      <h2>Payment</h2>
      <p>
        Payments are processed securely by Stripe. We never see or store your full card details.
      </p>
      <h2>Delivery, cancellations &amp; returns</h2>
      <p>
        See our <Link href="/delivery-returns">Delivery &amp; Returns</Link> policy. Your statutory rights
        under the Consumer Rights Act 2015 and the Consumer Contracts Regulations 2013 are not affected.
      </p>
      <h2>Candle safety</h2>
      <p>
        Always follow the safety instructions on the label. Never leave a burning candle unattended, keep
        away from children, pets and anything flammable, and burn on a heat-resistant surface.
      </p>
    </PolicyPage>
  );
}
