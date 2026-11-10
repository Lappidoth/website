import Link from "next/link";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, fmtDate } from "../format";

export default async function OrdersPage(props: PageProps<"/admin/orders">) {
  await connection();
  const sp = await props.searchParams;
  const status = typeof sp.status === "string" && sp.status ? sp.status : "";
  const orders = await db.order.findMany({
    // Hide abandoned checkouts unless asked for explicitly
    where: status ? { status } : { status: { notIn: ["PENDING", "CANCELLED"] } },
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 200,
  });

  return (
    <>
      <h1>Orders</h1>
      <p className="admin-sub">{orders.length} shown</p>
      <form className="toolbar" method="get">
        <select name="status" defaultValue={status} aria-label="Status">
          <option value="">Paid &amp; dispatched</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button className="btn btn-solid" type="submit">Filter</button>
      </form>
      <div className="panel table-wrap" style={{ padding: "0.5rem 1.5rem" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Status</th>
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={6} className="muted">No orders yet.</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id}>
                <td><Link href={`/admin/orders/${o.id}`}>{o.number}</Link></td>
                <td className="muted num" style={{ whiteSpace: "nowrap" }}>{fmtDate(o.createdAt)}</td>
                <td>{o.shippingName ?? o.email ?? "—"}</td>
                <td className="muted">{o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}</td>
                <td><span className="pill" data-v={o.status}>{ORDER_STATUS_LABELS[o.status] ?? o.status}</span></td>
                <td className="num">{formatPrice(o.totalCents, o.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
