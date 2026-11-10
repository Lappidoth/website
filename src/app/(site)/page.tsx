import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ProductCard } from "@/components/ProductCard";
import { SetTiles } from "@/components/SetTiles";
import { getProducts } from "@/lib/products";
import mark from "../../../public/brand/logo-mark-ink.png";
import presenceGold from "../../../public/brand/script-presence-collection-gold.png";
import fragranceToFire from "../../../public/brand/script-fragrance-to-fire.png";

export const revalidate = 300;

export default async function Home() {
  const [candles, sets] = await Promise.all([getProducts("CANDLE"), getProducts("SET")]);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <h1 className="fade-up">
            <Image src={fragranceToFire} alt="Fragrance to Fire" priority sizes="560px" />
          </h1>
          <p className="lede fade-up d1">
            Hand-poured with intention.
            <br />
            Crafted to shape atmosphere.
          </p>
          <div className="fade-up d2">
            <Link href="/shop" className="btn">
              Shop the Collection
            </Link>
          </div>
        </div>
        <div className="hero-media">
          <Image
            src="/images/hero-presence-collection.jpg"
            alt="Involved, So Loved and Connect candles on a travertine tray in soft morning light"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container sanctuary">
          <Image src={mark} alt="Lappidoth & Co. — Fragrance to Fire" className="mark" sizes="440px" />
          <div className="copy">
            <h2>Curating Your Sanctuary</h2>
            <p>
              At Lappidoth &amp; Co, we believe that lighting a candle is more than just a routine; it
              is an invitation to pause. Founded on the belief that scent has the power to transform a
              room into a retreat, our 100% natural soy wax candles are mindfully crafted in small
              batches.
            </p>
            <p>
              From the first pour to the final flicker, every detail is designed to bring a profound
              sense of calm to your daily life.
            </p>
            <div>
              <Link href="/about" className="link-arrow">
                Our story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-dark">
        <div className="container">
          <div className="section-head" style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
            <h2 className="visually-hidden">The Presence Collection</h2>
            <Image src={presenceGold} alt="" className="collection-title" sizes="520px" />
          </div>
          <div className="product-grid">
            {candles.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i === 0} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
            <Link href="/shop" className="btn btn-light">
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-paper" id="sets">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Better together</p>
            <h2>Gift a moment of presence</h2>
            <p>Choose a single candle, pair any two, or gift the complete collection.</p>
          </div>
          <SetTiles single={candles[0]} sets={sets} />
        </div>
      </section>

      <section className="section quote-band">
        <div className="container quote">
          <blockquote>
            Lappidoth &amp; Co was born out of a desire to create something pure in a noisy world. I
            wanted to design a collection that didn&apos;t just smell beautiful, but actually shifted
            the energy of a room. Every label, every hand-placed petal, and every pour is done with the
            hope that when you strike a match, you are carving out a moment of intentional peace just
            for you.
          </blockquote>
          <p className="signature">— Ceewhy Ochoga</p>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container split">
          <div className="media">
            <Image
              src="/images/pouring.jpg"
              alt="Candles being hand-poured into glass vessels"
              fill
              sizes="(max-width: 860px) 100vw, 55vw"
            />
          </div>
          <div className="copy">
            <p className="eyebrow">Small batch</p>
            <h2>From the first pour to the final flicker</h2>
            <p>
              Each candle is poured by hand from 100% natural soy wax and finished with care — every
              label placed, every petal set by hand. Nothing rushed, nothing mass-produced.
            </p>
            <div>
              <Link href="/about#care" className="link-arrow">
                Candle care
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container newsletter">
          <p className="script">Join the circle</p>
          <p>
            Be the first to hear about new collections, seasonal pours and quiet rituals for slower
            living.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
