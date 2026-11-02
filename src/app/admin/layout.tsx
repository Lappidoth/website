import type { Metadata } from "next";
import Link from "next/link";
import "./admin.css";

export const metadata: Metadata = {
  title: "CRM",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin">
      <aside className="admin-side">
        <Link href="/admin" className="wordmark">
          <span>Lappidoth</span>
          <span>&amp; Co.</span>
        </Link>
        <nav aria-label="Admin">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/customers">Customers</Link>
          <Link href="/">View site ↗</Link>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
