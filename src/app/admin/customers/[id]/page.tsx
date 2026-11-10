import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CUSTOMER_STATUSES, getCustomer } from "@/lib/crm";
import { formatPrice } from "@/lib/format";
import { TYPE_LABELS, fmtDate, fullName } from "../../format";
import { addNote, updateCustomer } from "./actions";

export default async function CustomerPage(props: PageProps<"/admin/customers/[id]">) {
  await connection();
  const { id } = await props.params;
  const c = await getCustomer(id);
  if (!c) notFound();

  return (
    <>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        <Link href="/admin/customers">← Customers</Link>
      </p>
      <h1>{fullName(c) !== "—" ? fullName(c) : c.email}</h1>
      <p className="admin-sub">
        <span className="pill" data-v={c.status}>
          {c.status}
        </span>{" "}
        &nbsp;Since {fmtDate(c.createdAt)}
      </p>

      <div className="profile-grid">
        <div>
          <section className="panel">
            <h2>Details</h2>
            <dl className="kv">
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${c.email}`}>{c.email}</a>
              </dd>
              <dt>Phone</dt>
              <dd>{c.phone ?? "—"}</dd>
              <dt>Source</dt>
              <dd>{c.source}</dd>
              <dt>Email opt-in</dt>
              <dd>{c.marketingOptIn ? "Yes" : "No"}</dd>
              <dt>Orders</dt>
              <dd>
                {c.orders.length === 0
                  ? "0"
                  : c.orders.map((o) => (
                      <div key={o.id}>
                        <Link href={`/admin/orders/${o.id}`}>{o.number}</Link> · {formatPrice(o.totalCents, o.currency)}
                      </div>
                    ))}
              </dd>
            </dl>
          </section>

          <section className="panel">
            <h2>Edit</h2>
            <form action={updateCustomer.bind(null, c.id)} className="admin-form">
              <label className="muted" htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={c.status}>
                {CUSTOMER_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <label className="muted" htmlFor="phone">Phone</label>
              <input id="phone" name="phone" defaultValue={c.phone ?? ""} />
              <label className="muted" htmlFor="tags">Tags (comma separated)</label>
              <input id="tags" name="tags" defaultValue={c.tags.map((t) => t.name).join(", ")} placeholder="wholesale, gifting" />
              <button className="btn btn-solid" type="submit">
                Save
              </button>
            </form>
          </section>
        </div>

        <div>
          <section className="panel">
            <h2>Add a note</h2>
            <form action={addNote.bind(null, c.id)} className="admin-form">
              <textarea name="body" required placeholder="Call notes, preferences, follow-ups…" aria-label="Note" />
              <div>
                <button className="btn btn-solid" type="submit">
                  Add note
                </button>
              </div>
            </form>
          </section>

          <section className="panel">
            <h2>Timeline</h2>
            {c.interactions.length === 0 ? (
              <p className="muted">No activity yet.</p>
            ) : (
              <ul className="timeline">
                {c.interactions.map((i) => (
                  <li key={i.id}>
                    <div>
                      <span className="pill">{TYPE_LABELS[i.type] ?? i.type}</span>{" "}
                      <span className="when">{fmtDate(i.createdAt)}</span>
                    </div>
                    {i.subject && <strong>{i.subject}</strong>}
                    {i.body && <div className="body">{i.body}</div>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
