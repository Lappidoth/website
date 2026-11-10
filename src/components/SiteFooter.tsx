import Image from "next/image";
import Link from "next/link";
import { SHOP } from "@/lib/shop-config";
import mark from "../../public/brand/logo-mark-cream.png";
import { NewsletterForm } from "./NewsletterForm";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image src={mark} alt="Lappidoth & Co. — Fragrance to Fire" style={{ width: 200, height: "auto" }} />
            <p className="muted-light">Join the circle for new pours, quiet rituals and early access.</p>
            <NewsletterForm id="footer-newsletter" />
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link href="/shop">The Presence Collection</Link></li>
              <li><Link href="/shop/the-presence-duo">The Presence Duo</Link></li>
              <li><Link href="/shop/the-presence-trio">The Presence Trio</Link></li>
              <li><Link href="/basket">Your Basket</Link></li>
            </ul>
          </div>
          <div>
            <h4>Care</h4>
            <ul>
              <li><Link href="/about#care">Candle Care</Link></li>
              <li><Link href="/delivery-returns">Delivery &amp; Returns</Link></li>
              <li><Link href="/terms">Terms of Sale</Link></li>
              <li><Link href="/privacy">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href={`mailto:${SHOP.contact.email}`}>{SHOP.contact.email}</a></li>
              <li><a href={`tel:${SHOP.contact.phoneHref}`}>{SHOP.contact.phone}</a></li>
              <li><Link href="/contact">Gifting &amp; wholesale</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} Lappidoth &amp; Co.</span>
          <span>Hand-poured in small batches in the UK</span>
        </div>
      </div>
    </footer>
  );
}
