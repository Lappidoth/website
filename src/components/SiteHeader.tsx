"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BasketButton } from "./BasketButton";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/shop#sets", label: "Gift Sets" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
        <Wordmark />
        <nav id="site-nav" className="nav" data-open={open} aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={!l.href.includes("#") && pathname.startsWith(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <BasketButton />
      </div>
    </header>
  );
}
