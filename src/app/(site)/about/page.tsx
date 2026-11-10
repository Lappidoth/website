import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import mark from "../../../../public/brand/logo-mark-ink.png";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Lappidoth & Co. — 100% natural soy wax candles, mindfully crafted in small batches.",
};

export default function AboutPage() {
  return (
    <>
      <section className="section bg-paper">
        <div className="container sanctuary">
          <Image src={mark} alt="Lappidoth & Co. — Fragrance to Fire" className="mark" sizes="440px" priority />
          <div className="copy">
            <p className="eyebrow">Our story</p>
            <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 600 }}>Curating Your Sanctuary</h1>
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
          </div>
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
            <Image src="/images/hero-presence-collection.jpg" alt="The Presence Collection" fill sizes="(max-width: 860px) 100vw, 55vw" />
          </div>
          <div className="copy">
            <p className="eyebrow">The Presence Collection</p>
            <h2>Involved. So Loved. Connect.</h2>
            <p>
              Our first collection is named for the ways we hope to be with one another — deeply
              engaged, warmly cherished, and truly connected. Three candles, each poured to invite
              presence into the rooms where life happens.
            </p>
            <div>
              <Link href="/shop" className="btn">Shop the Collection</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-linen" id="care">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Candle care</p>
            <h2>Tending the flame</h2>
          </div>
          <ol className="ritual">
            <li>
              <span className="num">i.</span>
              <h3>The first light</h3>
              <p>Burn for 2–3 hours until the melt pool reaches the edge of the glass. This prevents tunnelling.</p>
            </li>
            <li>
              <span className="num">ii.</span>
              <h3>Trim the wick</h3>
              <p>Before every light, trim the wick to 5 mm for a clean, steady flame.</p>
            </li>
            <li>
              <span className="num">iii.</span>
              <h3>Choose the hour</h3>
              <p>Burn for no more than 4 hours at a time, away from draughts — and never out of sight.</p>
            </li>
            <li>
              <span className="num">iv.</span>
              <h3>A second life</h3>
              <p>When 1 cm of wax remains, let it rest. Clean the glass with warm soapy water and reuse it.</p>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
