import Image from "next/image";
import Link from "next/link";
import ink from "../../public/brand/wordmark-ink.png";
import cream from "../../public/brand/wordmark-cream.png";

export function Wordmark({ tone = "ink", height = 44 }: { tone?: "ink" | "cream"; height?: number }) {
  const src = tone === "cream" ? cream : ink;
  return (
    <Link href="/" className="wordmark" aria-label="Lappidoth & Co. — home">
      <Image src={src} alt="Lappidoth & Co." height={height} style={{ width: "auto", height }} priority />
    </Link>
  );
}
