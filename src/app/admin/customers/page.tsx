import Link from "next/link";
import { connection } from "next/server";
import { CUSTOMER_STATUSES, listCustomers } from "@/lib/crm";
import { fmtDate, fullName } from "../format";

export default async function CustomersPage(props: PageProps<"/admin/customers">) {
  await connection();
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const status = typeof sp.status === "string" ? sp.status : "";
  const customers = await listCustomers({ q, status });

  return (
    <>
      <h1>Customers</h1>
      <p className="admin-sub">{customers.length} shown</p>

      <form className="toolbar" method="get">
        <input type="search" name="q" defaultValue={q} placeholder="Search name or email" aria-label="Search" />
        <select name="status" defaultValue={status} aria-label="Status">
          <option value="">All statuses</option>
          {CUSTOMER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button className="btn btn-solid" type="submit">
          Filter
        </button>
        {/* Plain <a>: this is a file download, not a page navigation. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="btn" href="/admin/customers/export">
          Export CSV
        </a>
      </form>

      <div className="panel table-wrap" style={{ padding: "0.5rem 1.5rem" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Source</th>
              <th>Email opt-in</th>
              <th className="num">Activity</th>
              <th>Last updated</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan={7} className="muted">
                  No customers match.
                </td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link href={`/admin/customers/${c.id}`}>{fullName(c)}</Link>
                </td>
                <td>{c.email}</td>
                <td>
                  <span className="pill" data-v={c.status}>
                    {c.status}
                  </span>
                </td>
                <td className="muted">{c.source}</td>
                <td>{c.marketingOptIn ? "Yes" : "No"}</td>
                <td className="num">{c._count.interactions}</td>
                <td className="muted num" style={{ whiteSpace: "nowrap" }}>
                  {fmtDate(c.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
