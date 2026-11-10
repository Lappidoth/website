import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/ContactForm";
import { SHOP } from "@/lib/shop-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Lappidoth & Co. — orders, gifting, wholesale and international delivery.",
};

export default function ContactPage() {
  return (
    <>
      <section className="section bg-paper">
        <div className="container contact-top">
          <div className="media">
            <Image src="/images/pouring.jpg" alt="Candles being hand-poured" fill priority sizes="(max-width: 860px) 100vw, 55vw" />
          </div>
          <div className="contact-details">
            <h1>Get in Touch</h1>
            <div>
              <h3>Email Address</h3>
              <a href={`mailto:${SHOP.contact.email}`}>{SHOP.contact.email}</a>
            </div>
            <div>
              <h3>Phone Number</h3>
              <a href={`tel:${SHOP.contact.phoneHref}`}>{SHOP.contact.phone}</a>
            </div>
          </div>
        </div>
      </section>
      <section className="section bg-linen">
        <div className="container contact-form-wrap">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <p className="eyebrow">Send a message</p>
            <h2>Gifting, wholesale &amp; international orders</h2>
            <p>We reply to every message personally, usually within two working days.</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
