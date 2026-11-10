export const TYPE_LABELS: Record<string, string> = {
  NEWSLETTER_SIGNUP: "Newsletter signup",
  CONTACT_FORM: "Contact form",
  WAITLIST: "Waitlist",
  NOTE: "Note",
  ORDER_PLACED: "Order placed",
};

export const ORDER_STATUSES = ["PENDING", "PAID", "DISPATCHED", "CANCELLED", "REFUNDED"] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Awaiting payment",
  PAID: "Paid · to dispatch",
  DISPATCHED: "Dispatched",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export function fmtAddress(json: string | null) {
  if (!json) return [];
  try {
    const a = JSON.parse(json) as Record<string, string | null>;
    return [a.line1, a.line2, a.city, a.state, a.postal_code, a.country].filter(Boolean) as string[];
  } catch {
    return [];
  }
}

export function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function fullName(c: { firstName: string | null; lastName: string | null }) {
  return [c.firstName, c.lastName].filter(Boolean).join(" ") || "—";
}
