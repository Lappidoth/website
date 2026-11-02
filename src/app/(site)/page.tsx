import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export const revalidate = 300;

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow fade-up">The Presence Collection</p>
          <h1 className="script fade-up d1">Fragrance to Fire</h1>
          <p className="lede fade-up d2">
            Hand-poured with intention.
            <br />
            Crafted to shape atmosphere.
          </p>
          <div className="fade-up d3">
            <Link href="/shop" className="btn">
              Shop the Collection
            </Link>
          </div>
        </div>
        <div className="hero-media">
          <Image
            src="/images/hero-presence-collection.jpg"
            alt="Three Lappidoth & Co. candles — Involved, So Loved and Connect — on a travertine tray in soft window light"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="values" aria-label="Our craft">
        <ul>
          <li>Hand-poured</li>
          <li>Natural soy wax</li>
          <li>30+ hour burn</li>
          <li>Small batch</li>
        </ul>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Three scents · One intention</p>
            <h2>The Presence Collection</h2>
            <p>
              Each candle is named for a way of being with the people and places you love — poured
              slowly, by hand, to make a room feel like it is holding you.
            </p>
          </div>
          <div className="product-grid">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i === 0} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
            <Link href="/shop" className="link-arrow">
              View the collection
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-linen">
        <div className="container split">
          <div className="media">
            <Image
              src="/images/candle-so-loved.jpg"
              alt="So Loved candle crowned with dried rose petals"
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
            />
          </div>
          <div className="copy">
            <p className="eyebrow">Our name</p>
            <h2>
              From fragrance,
              <br />
              <em>to fire.</em>
            </h2>
            <p>
              <em>Lappidoth</em> comes from the Hebrew for “torches” — flames carried to light the
              way. It is the spirit behind everything we pour: a small fire that changes the feeling
              of a room, and the people in it.
            </p>
            <p>
              We blend each candle in small batches from natural soy wax and fine fragrance, then
              finish it by hand. Nothing rushed, nothing wasted.
            </p>
            <div>
              <Link href="/about" className="link-arrow">
                Read our story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-ink" id="ritual">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">The Ritual</p>
            <h2 style={{ color: "var(--linen)" }}>Tending the flame</h2>
          </div>
          <ol className="ritual" style={{ padding: 0, margin: 0 }}>
            <li>
              <span className="num">i.</span>
              <h3>The first light</h3>
              <p>Burn for two to three hours, until the melt pool reaches the edge of the glass.</p>
            </li>
            <li>
              <span className="num">ii.</span>
              <h3>Trim the wick</h3>
              <p>Before every light, trim to a quarter inch for a clean, steady flame.</p>
            </li>
            <li>
              <span className="num">iii.</span>
              <h3>Choose the hour</h3>
              <p>Burn no longer than four hours at a time, and never out of sight.</p>
            </li>
            <li>
              <span className="num">iv.</span>
              <h3>Rest &amp; return</h3>
              <p>Extinguish gently, let it cool completely, and come back to it again.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container quote">
          <p className="eyebrow">Made to be present</p>
          <blockquote>“Every room has an atmosphere. We pour candles to help you choose yours.”</blockquote>
          <p className="script" style={{ fontSize: "2.4rem" }}>
            Lappidoth &amp; Co.
          </p>
        </div>
      </section>

      <section className="section bg-linen">
        <div className="container newsletter">
          <p className="script">Join the circle</p>
          <p>
            Be the first to know about new collections, seasonal pours and quiet rituals for slower
            living.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
