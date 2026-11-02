export const TYPE_LABELS: Record<string, string> = {
  NEWSLETTER_SIGNUP: "Newsletter signup",
  CONTACT_FORM: "Contact form",
  WAITLIST: "Waitlist",
  NOTE: "Note",
  ORDER_PLACED: "Order placed",
};

export function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
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
