import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";
import { SHOP } from "@/lib/shop-config";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Page() {
  return (
    <PolicyPage title="Privacy Policy" updated="November 2026">
      <p>
        Lappidoth &amp; Co. is the data controller for the personal information you share with us. We
        handle it in line with UK GDPR and the Data Protection Act 2018.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Orders:</strong> your name, email, phone, delivery address and what you bought.</li>
        <li><strong>Messages:</strong> anything you send through our contact form.</li>
        <li><strong>Newsletter:</strong> your email address and when you subscribed.</li>
      </ul>
      <p>Card payments are handled by Stripe; we never receive your full card details.</p>
      <h2>How we use it</h2>
      <ul>
        <li>To fulfil and deliver your order and provide customer service (contract).</li>
        <li>To send our newsletter, only if you&apos;ve opted in. You can unsubscribe at any time (consent).</li>
        <li>To keep records required by law, such as accounting records (legal obligation).</li>
      </ul>
      <h2>Who we share it with</h2>
      <p>
        Only the services that help us run the shop: Stripe (payments), our website host, and our
        delivery carrier. We never sell your data.
      </p>
      <h2>Cookies</h2>
      <p>
        We only use storage that&apos;s essential for the site to work, such as remembering your basket.
        We&apos;ll ask before using any analytics or marketing cookies.
      </p>
      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete your data, or object to how we use it, by emailing{" "}
        <a href={`mailto:${SHOP.contact.email}`}>{SHOP.contact.email}</a>. You can also complain to the
        Information Commissioner&apos;s Office (ico.org.uk).
      </p>
    </PolicyPage>
  );
}
