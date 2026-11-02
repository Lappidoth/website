import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Lappidoth & Co. — hand-poured candles crafted with intention to shape atmosphere.",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Our Story</p>
        <h1 className="script">Fragrance to Fire</h1>
      </section>

      <section className="container" style={{ paddingBottom: "clamp(4rem, 8vw, 6rem)" }}>
        <div className="prose">
          <p className="dropcap">
            Lappidoth &amp; Co. began with a simple belief: that the atmosphere of a room can change
            the way we show up in it. A single flame can slow a conversation down, soften the end of
            a long day, and turn an ordinary evening into something remembered.
          </p>
          <p>
            Our name comes from the Hebrew <em>lappidoth</em> — “torches.” Flames carried with
            purpose, to light the way for others. That is what we hope each of our candles becomes in
            your home.
          </p>
          <p>
            Every candle is hand-poured in small batches using natural soy wax and carefully chosen
            fragrance, then finished by hand. We take our time, because the moments these candles are
            made for deserve it.
          </p>
        </div>
      </section>

      <section className="section bg-linen">
        <div className="container split">
          <div className="media">
            <Image
              src="/images/hero-presence-collection.jpg"
              alt="The Presence Collection in morning light"
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
            />
          </div>
          <div className="copy">
            <p className="eyebrow">The Presence Collection</p>
            <h2>Involved. So Loved. Connect.</h2>
            <p>
              Our first collection is named for the ways we want to be with one another — engaged,
              cherished, and truly connected. Three scents, each poured to invite presence into the
              rooms where life happens.
            </p>
            <div>
              <Link href="/shop" className="btn">
                Shop the Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="ritual">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Candle care</p>
            <h2>Tending the flame</h2>
          </div>
          <div className="prose">
            <p>
              <strong>The first burn matters most.</strong> Allow two to three hours for the melt pool
              to reach the edge of the glass; this sets the candle&apos;s memory and prevents
              tunnelling.
            </p>
            <p>
              <strong>Trim the wick</strong> to a quarter inch before every light for a clean, steady
              flame. <strong>Burn for no more than four hours</strong> at a time, keep away from
              drafts, and never leave a burning candle unattended.
            </p>
            <p>
              When half an inch of wax remains, it&apos;s time to let it rest. Clean the glass with
              warm soapy water and give it a second life.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
