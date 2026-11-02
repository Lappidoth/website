import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero container" style={{ minHeight: "50vh", alignContent: "center" }}>
      <p className="script">Lost the light</p>
      <p>We couldn&apos;t find that page.</p>
      <Link href="/" className="btn">
        Return home
      </Link>
    </section>
  );
}
