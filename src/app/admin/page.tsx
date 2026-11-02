import Link from "next/link";
import { connection } from "next/server";
import { getDashboardStats } from "@/lib/crm";
import { TYPE_LABELS, fmtDate, fullName } from "./format";

export default async function AdminDashboard() {
  await connection();
  const s = await getDashboardStats();

  return (
    <>
      <h1>Dashboard</h1>
      <p className="admin-sub">Everyone who has reached out, signed up, or joined a waitlist.</p>

      <div className="stat-row">
        <div className="stat">
          <div className="label">Contacts</div>
          <div className="value">{s.total}</div>
        </div>
        <div className="stat">
          <div className="label">Opted in to email</div>
          <div className="value">{s.subscribers}</div>
        </div>
        <div className="stat">
          <div className="label">New · 30 days</div>
          <div className="value">{s.newThisMonth}</div>
        </div>
        <div className="stat">
          <div className="label">Enquiries · 30 days</div>
          <div className="value">{s.openEnquiries}</div>
        </div>
      </div>

      <section className="panel">
        <h2>Recent activity</h2>
        {s.recent.length === 0 ? (
          <p className="muted">No activity yet. Submissions from the website will appear here.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Contact</th>
                  <th>Activity</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {s.recent.map((i) => (
                  <tr key={i.id}>
                    <td className="muted num" style={{ whiteSpace: "nowrap" }}>
                      {fmtDate(i.createdAt)}
                    </td>
                    <td>
                      <Link href={`/admin/customers/${i.customer.id}`}>
                        {fullName(i.customer) !== "—" ? fullName(i.customer) : i.customer.email}
                      </Link>
                    </td>
                    <td>
                      <span className="pill">{TYPE_LABELS[i.type] ?? i.type}</span>
                    </td>
                    <td className="muted">{i.subject ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <h2>By status</h2>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {s.byStatus.map((b) => (
            <Link key={b.status} href={`/admin/customers?status=${b.status}`} className="pill" data-v={b.status} style={{ textDecoration: "none" }}>
              {b.status} · {b._count}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
