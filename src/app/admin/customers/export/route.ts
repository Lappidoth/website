import { db } from "@/lib/db";

function csvCell(v: unknown) {
  const s = v == null ? "" : String(v);
  // Quote everything and neutralise spreadsheet formula injection.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  const customers = await db.customer.findMany({
    orderBy: { createdAt: "asc" },
    include: { tags: true },
  });

  const header = ["email", "first_name", "last_name", "phone", "status", "source", "marketing_opt_in", "tags", "created_at"];
  const rows = customers.map((c) =>
    [
      c.email,
      c.firstName,
      c.lastName,
      c.phone,
      c.status,
      c.source,
      c.marketingOptIn,
      c.tags.map((t) => t.name).join("; "),
      c.createdAt.toISOString(),
    ]
      .map(csvCell)
      .join(","),
  );

  return new Response([header.join(","), ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lappidoth-customers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
