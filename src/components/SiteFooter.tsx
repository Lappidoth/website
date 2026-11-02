import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="script">Fragrance to Fire</p>
            <p style={{ opacity: 0.75, maxWidth: "26rem" }}>
              Hand-poured with intention. Crafted to shape atmosphere.
            </p>
            <NewsletterForm id="footer-newsletter" />
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link href="/shop">The Presence Collection</Link></li>
              <li><Link href="/shop/so-loved">So Loved</Link></li>
              <li><Link href="/shop/involved">Involved</Link></li>
              <li><Link href="/shop/connect">Connect</Link></li>
            </ul>
          </div>
          <div>
            <h4>House</h4>
            <ul>
              <li><Link href="/about">Our Story</Link></li>
              <li><Link href="/about#ritual">Candle Care</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/contact">Wholesale</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} Lappidoth &amp; Co.</span>
          <span>Hand-poured in small batches</span>
        </div>
      </div>
    </footer>
  );
}
