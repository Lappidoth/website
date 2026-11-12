import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, fmtAddress, fmtDate } from "../../format";
import { deleteOrder, markDispatched, setOrderStatus } from "./actions";

export default async function OrderPage(props: PageProps<"/admin/orders/[id]">) {
  await connection();
  const { id } = await props.params;
  const o = await db.order.findUnique({ where: { id }, include: { items: true, customer: true } });
  if (!o) notFound();

  const address = fmtAddress(o.shippingAddress);
  const testMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");
  const stripeUrl = o.paymentRef
    ? `https://dashboard.stripe.com/${testMode ? "test/" : ""}payments/${o.paymentRef}`
    : null;

  return (
    <>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        <Link href="/admin/orders">← Orders</Link>
      </p>
      <h1>Order {o.number}</h1>
      <p className="admin-sub">
        <span className="pill" data-v={o.status}>{ORDER_STATUS_LABELS[o.status] ?? o.status}</span>
        &nbsp; Placed {fmtDate(o.createdAt)}
      </p>

      <div className="profile-grid">
        <div>
          <section className="panel">
            <h2>Ship to</h2>
            <dl className="kv">
              <dt>Name</dt>
              <dd>{o.shippingName ?? "—"}</dd>
              <dt>Address</dt>
              <dd>{address.length ? address.map((l) => <div key={l}>{l}</div>) : "—"}</dd>
              <dt>Email</dt>
              <dd>{o.email ? <a href={`mailto:${o.email}`}>{o.email}</a> : "—"}</dd>
              <dt>Phone</dt>
              <dd>{o.phone ?? "—"}</dd>
              <dt>Customer</dt>
              <dd>{o.customer ? <Link href={`/admin/customers/${o.customer.id}`}>View profile</Link> : "—"}</dd>
            </dl>
          </section>

          {o.status === "PAID" && (
            <section className="panel">
              <h2>Dispatch</h2>
              <form action={markDispatched.bind(null, o.id)} className="admin-form">
                <label className="muted" htmlFor="tracking">Tracking number (optional)</label>
                <input id="tracking" name="tracking" />
                <button className="btn btn-solid" type="submit">Mark as dispatched</button>
              </form>
            </section>
          )}

          <section className="panel">
            <h2>Status</h2>
            <form action={setOrderStatus.bind(null, o.id)} className="admin-form">
              <select name="status" defaultValue={o.status} aria-label="Order status">
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                ))}
              </select>
              <button className="btn" type="submit">Update</button>
              <p className="muted" style={{ fontSize: "0.8rem" }}>
                Refunds are issued in Stripe; then set the status here to Refunded.
              </p>
            </form>
          </section>

          <section className="panel danger">
            <h2>Delete order</h2>
            {o.status === "CANCELLED" || o.status === "REFUNDED" ? (
              <form action={deleteOrder.bind(null, o.id)} className="admin-form">
                <p className="muted" style={{ fontSize: "0.85rem" }}>
                  Permanently removes this order. This can&apos;t be undone.
                </p>
                <label className="confirm-check">
                  <input type="checkbox" name="confirm" value="yes" required /> Yes, delete order {o.number}
                </label>
                <button className="btn btn-danger" type="submit">Delete permanently</button>
              </form>
            ) : (
              <p className="muted" style={{ fontSize: "0.85rem" }}>
                To delete an order (for example a test order), first set its status to Cancelled or Refunded above.
              </p>
            )}
          </section>
        </div>

        <div>
          <section className="panel">
            <h2>Items</h2>
            <table className="table">
              <tbody>
                {o.items.map((i) => (
                  <tr key={i.id}>
                    <td>
                      {i.quantity} × <strong>{i.name}</strong>
                      {i.options && <div className="muted">{i.options}</div>}
                    </td>
                    <td className="num" style={{ textAlign: "right" }}>{formatPrice(i.unitPriceCents * i.quantity, o.currency)}</td>
                  </tr>
                ))}
                <tr><td className="muted">Subtotal</td><td className="num" style={{ textAlign: "right" }}>{formatPrice(o.subtotalCents, o.currency)}</td></tr>
                {o.discountCents > 0 && (
                  <tr><td className="muted">Discount</td><td className="num" style={{ textAlign: "right" }}>−{formatPrice(o.discountCents, o.currency)}</td></tr>
                )}
                <tr><td className="muted">Delivery</td><td className="num" style={{ textAlign: "right" }}>{formatPrice(o.shippingCents, o.currency)}</td></tr>
                <tr><td><strong>Total</strong></td><td className="num" style={{ textAlign: "right" }}><strong>{formatPrice(o.totalCents, o.currency)}</strong></td></tr>
              </tbody>
            </table>
          </section>

          {o.giftMessage && (
            <section className="panel">
              <h2>Gift message</h2>
              <p style={{ whiteSpace: "pre-wrap" }}>{o.giftMessage}</p>
            </section>
          )}

          <section className="panel">
            <h2>Payment</h2>
            <dl className="kv">
              <dt>Provider</dt>
              <dd>{o.paymentProvider}</dd>
              <dt>Paid</dt>
              <dd>{o.paidAt ? fmtDate(o.paidAt) : "—"}</dd>
              {o.dispatchedAt && (<><dt>Dispatched</dt><dd>{fmtDate(o.dispatchedAt)}</dd></>)}
              {o.trackingNumber && (<><dt>Tracking</dt><dd>{o.trackingNumber}</dd></>)}
            </dl>
            {stripeUrl && (
              <p style={{ marginTop: "1rem" }}>
                <a href={stripeUrl} target="_blank" rel="noreferrer">View payment in Stripe ↗</a>
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
