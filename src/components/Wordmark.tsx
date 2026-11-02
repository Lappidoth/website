import Link from "next/link";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`wordmark ${className}`} aria-label="Lappidoth & Co. — home">
      <span>Lappidoth</span>
      <span>&amp; Co.</span>
    </Link>
  );
}
