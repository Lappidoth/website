import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Lappidoth & Co. — orders, gifting, wholesale and press.",
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Contact</p>
        <h1>We&apos;d love to hear from you</h1>
        <p>Questions about an order, gifting for an event, or carrying our candles in your shop.</p>
      </section>
      <section className="container contact-layout">
        <aside className="contact-aside">
          <div>
            <h3>Gifting &amp; events</h3>
            <p>Custom pours and curated sets for weddings, retreats and corporate gifting.</p>
          </div>
          <div>
            <h3>Wholesale</h3>
            <p>Interested in stocking Lappidoth &amp; Co.? Choose “Wholesale &amp; stockists” below.</p>
          </div>
          <div>
            <h3>Response time</h3>
            <p>We reply to every message personally, usually within two business days.</p>
          </div>
        </aside>
        <ContactForm />
      </section>
    </>
  );
}
