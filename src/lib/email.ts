/**
 * Emails sent by the site, via Resend (https://resend.com).
 *
 * Nothing is sent until RESEND_API_KEY is set, and a failed email never
 * blocks an order: failures are logged and the order carries on.
 *
 *   RESEND_API_KEY      API key from Resend
 *   EMAIL_FROM          optional, default "Lappidoth & Co. <orders@lappidothandco.com>"
 *   ORDER_NOTIFY_EMAIL  optional, where owner alerts go (default: the contact email)
 */
import { formatPrice } from "./format";
import { SHOP } from "./shop-config";
import { siteUrl } from "./stripe";

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

const from = () => process.env.EMAIL_FROM || "Lappidoth & Co. <orders@lappidothandco.com>";
const ownerAddress = () => process.env.ORDER_NOTIFY_EMAIL || SHOP.contact.email;

type Message = { to: string; subject: string; html: string; text: string; replyTo?: string; key: string };

async function send(msg: Message): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // Resend drops repeats of the same key, so a retry can't send twice
        "Idempotency-Key": msg.key,
      },
      body: JSON.stringify({
        from: from(),
        to: [msg.to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        reply_to: msg.replyTo ?? SHOP.contact.email,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`Email "${msg.subject}" failed:`, res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Email "${msg.subject}" failed:`, err);
    return false;
  }
}

// ─── Building blocks ─────────────────────────────────────────────────────

function esc(value: string | null | undefined) {
  return (value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const C = { cream: "#e6e0d5", paper: "#f7f6f0", ink: "#2a2623", soft: "#5e5751", line: "#d8cebf", mustard: "#d4a12c" };
const serif = "Georgia, 'Times New Roman', serif";
const sans = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function companyLine() {
  const c = SHOP.company;
  const office = c.registeredOffice.length ? ` Registered office: ${c.registeredOffice.join(", ")}.` : "";
  return `${c.name}, registered in ${c.registeredIn}, company number ${c.number}.${office} Trading address: ${c.tradingAddress.join(", ")}.`;
}

function layout(heading: string, body: string) {
  const base = siteUrl();
  return `<!doctype html>
<html lang="en-GB">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(heading)}</title></head>
<body style="margin:0;padding:0;background:${C.cream};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};">
<tr><td align="center" style="padding:32px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.paper};">
    <tr><td align="center" style="padding:36px 32px 8px;">
      <a href="${base}"><img src="${base}/brand/logo-mark-ink.png" width="150" alt="Lappidoth &amp; Co. — Fragrance to Fire" style="display:block;border:0;width:150px;height:auto;"></a>
    </td></tr>
    <tr><td style="padding:20px 32px 0;font-family:${serif};font-size:28px;line-height:1.25;color:${C.ink};text-align:center;">${esc(heading)}</td></tr>
    <tr><td style="padding:20px 32px 36px;font-family:${sans};font-size:15px;line-height:1.65;color:${C.ink};">${body}</td></tr>
    <tr><td style="border-top:3px solid ${C.mustard};padding:20px 32px;font-family:${sans};font-size:11px;line-height:1.6;color:${C.soft};text-align:center;">
      <a href="mailto:${SHOP.contact.email}" style="color:${C.soft};">${SHOP.contact.email}</a> · ${esc(SHOP.contact.phone)}<br>
      ${esc(companyLine())}
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

const p = (html: string) => `<p style="margin:0 0 16px;">${html}</p>`;
const label = (text: string) =>
  `<p style="margin:24px 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.soft};">${esc(text)}</p>`;

export type EmailOrder = {
  id: string;
  number: string;
  email: string | null;
  phone?: string | null;
  currency: string;
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  shippingMethod: string | null;
  shippingName: string | null;
  shippingAddress: string | null;
  giftMessage: string | null;
  trackingNumber?: string | null;
  items: { name: string; options: string | null; quantity: number; unitPriceCents: number }[];
};

function addressLines(order: EmailOrder) {
  let parts: string[] = [];
  try {
    const a = JSON.parse(order.shippingAddress ?? "{}") as Record<string, string | null>;
    const country = a.country === "GB" ? "United Kingdom" : a.country;
    parts = [a.line1, a.line2, a.city, a.state, a.postal_code, country].filter(Boolean) as string[];
  } catch {
    /* no address */
  }
  return [order.shippingName, ...parts].filter(Boolean) as string[];
}

const firstName = (order: EmailOrder) => (order.shippingName ?? "").trim().split(/\s+/)[0] || "";

function itemsTable(order: EmailOrder) {
  const money = (cents: number) => formatPrice(cents, order.currency);
  const row = (left: string, right: string, opts = "") =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid ${C.line};${opts}">${left}</td><td align="right" style="padding:10px 0;border-bottom:1px solid ${C.line};white-space:nowrap;vertical-align:top;${opts}">${right}</td></tr>`;
  const items = order.items
    .map((i) =>
      row(
        `${i.quantity} × <strong>${esc(i.name)}</strong>${i.options ? `<br><span style="color:${C.soft};font-size:13px;">${esc(i.options)}</span>` : ""}`,
        money(i.unitPriceCents * i.quantity),
      ),
    )
    .join("");
  const soft = `color:${C.soft};`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:${sans};font-size:15px;color:${C.ink};border-top:1px solid ${C.line};">
${items}
${row("Subtotal", money(order.subtotalCents), soft)}
${order.discountCents > 0 ? row("Discount", `−${money(order.discountCents)}`, soft) : ""}
${row("Delivery", order.shippingCents === 0 ? "Complimentary" : money(order.shippingCents), soft)}
${row("<strong>Total</strong>", `<strong>${money(order.totalCents)}</strong>`)}
</table>`;
}

function itemsText(order: EmailOrder) {
  const money = (cents: number) => formatPrice(cents, order.currency);
  return [
    ...order.items.map(
      (i) => `${i.quantity} x ${i.name}${i.options ? ` (${i.options})` : ""} — ${money(i.unitPriceCents * i.quantity)}`,
    ),
    `Subtotal: ${money(order.subtotalCents)}`,
    ...(order.discountCents > 0 ? [`Discount: -${money(order.discountCents)}`] : []),
    `Delivery: ${order.shippingCents === 0 ? "Complimentary" : money(order.shippingCents)}`,
    `Total: ${money(order.totalCents)}`,
  ].join("\n");
}

// ─── The emails ──────────────────────────────────────────────────────────

/** To the customer, once their payment has gone through. */
export function renderOrderConfirmation(order: EmailOrder) {
  const name = firstName(order);
  const address = addressLines(order);
  const html = layout(
    "Thank you for your order",
    [
      p(`${name ? `Dear ${esc(name)},` : "Hello,"}`),
      p(
        `Your order <strong>${esc(order.number)}</strong> is confirmed. Every candle is hand-poured in small batches, and we'll pack yours by hand and dispatch it within 1–3 working days.`,
      ),
      label("Your order"),
      itemsTable(order),
      order.shippingMethod ? label("Delivery") + p(esc(order.shippingMethod)) : "",
      address.length ? label("Delivering to") + p(address.map(esc).join("<br>")) : "",
      order.giftMessage ? label("Your gift message") + p(`<em>${esc(order.giftMessage).replace(/\n/g, "<br>")}</em>`) : "",
      p(
        `<br>If anything isn't right, just reply to this email and quote your order number.`,
      ),
      p(`With warmth,<br>Lappidoth &amp; Co.`),
    ].join(""),
  );
  const text = [
    name ? `Dear ${name},` : "Hello,",
    "",
    `Your order ${order.number} is confirmed. We'll pack it by hand and dispatch it within 1–3 working days.`,
    "",
    itemsText(order),
    "",
    order.shippingMethod ? `Delivery: ${order.shippingMethod}` : "",
    address.length ? `Delivering to: ${address.join(", ")}` : "",
    order.giftMessage ? `Gift message: ${order.giftMessage}` : "",
    "",
    "If anything isn't right, just reply to this email and quote your order number.",
    "",
    "Lappidoth & Co.",
    companyLine(),
  ]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n");
  return { subject: `Your Lappidoth & Co. order ${order.number}`, html, text };
}

/** To the owner, for every paid order. */
export function renderNewOrderAlert(order: EmailOrder) {
  const address = addressLines(order);
  const express = order.shippingMethod?.toLowerCase().startsWith("express");
  const link = `${siteUrl()}/admin/orders/${order.id}`;
  const html = layout(
    `New order ${order.number}`,
    [
      express
        ? `<p style="margin:0 0 16px;padding:10px 14px;background:${C.mustard};font-weight:bold;text-align:center;">EXPRESS DELIVERY</p>`
        : "",
      itemsTable(order),
      label("Delivery") + p(esc(order.shippingMethod ?? "—")),
      label("Ship to") + p(address.map(esc).join("<br>") || "—"),
      label("Customer") + p([order.email, order.phone].filter(Boolean).map(esc).join("<br>") || "—"),
      order.giftMessage ? label("Gift message") + p(`<em>${esc(order.giftMessage).replace(/\n/g, "<br>")}</em>`) : "",
      p(`<br><a href="${link}" style="color:${C.ink};font-weight:bold;">Open this order in the back office →</a>`),
    ].join(""),
  );
  const text = [
    `New order ${order.number}${express ? " — EXPRESS" : ""}`,
    "",
    itemsText(order),
    "",
    `Delivery: ${order.shippingMethod ?? "-"}`,
    `Ship to: ${address.join(", ") || "-"}`,
    `Customer: ${[order.email, order.phone].filter(Boolean).join(", ") || "-"}`,
    order.giftMessage ? `Gift message: ${order.giftMessage}` : "",
    "",
    link,
  ].join("\n");
  const total = formatPrice(order.totalCents, order.currency);
  return { subject: `New order ${order.number} · ${total}${express ? " · EXPRESS" : ""}`, html, text };
}

/** To the customer, when the order is marked as dispatched. */
export function renderDispatchEmail(order: EmailOrder) {
  const name = firstName(order);
  const address = addressLines(order);
  const html = layout(
    "Your order is on its way",
    [
      p(`${name ? `Dear ${esc(name)},` : "Hello,"}`),
      p(`Good news — your order <strong>${esc(order.number)}</strong> has been dispatched.`),
      order.trackingNumber
        ? label("Tracking number") + p(`<strong style="font-size:17px;letter-spacing:1px;">${esc(order.trackingNumber)}</strong>`)
        : "",
      order.shippingMethod ? label("Delivery") + p(esc(order.shippingMethod)) : "",
      address.length ? label("Delivering to") + p(address.map(esc).join("<br>")) : "",
      label("Before the first light"),
      p(
        `Let your candle burn for 2–3 hours the first time, until the wax melts to the edge of the glass, and trim the wick to 5&nbsp;mm before each burn.`,
      ),
      p(`With warmth,<br>Lappidoth &amp; Co.`),
    ].join(""),
  );
  const text = [
    name ? `Dear ${name},` : "Hello,",
    "",
    `Good news — your order ${order.number} has been dispatched.`,
    order.trackingNumber ? `Tracking number: ${order.trackingNumber}` : "",
    order.shippingMethod ? `Delivery: ${order.shippingMethod}` : "",
    address.length ? `Delivering to: ${address.join(", ")}` : "",
    "",
    "First burn: 2–3 hours, until the wax melts to the edge of the glass. Trim the wick to 5 mm before each burn.",
    "",
    "Lappidoth & Co.",
    companyLine(),
  ]
    .filter((line, i, all) => line !== "" || all[i - 1] !== "")
    .join("\n");
  return { subject: `Your Lappidoth & Co. order ${order.number} is on its way`, html, text };
}

type Enquiry = {
  customerId: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

/** To the owner, for every contact-form message. */
export function renderEnquiryAlert(e: Enquiry) {
  const who = [e.firstName, e.lastName].filter(Boolean).join(" ");
  const link = `${siteUrl()}/admin/customers/${e.customerId}`;
  const html = layout(
    "New message from the website",
    [
      label("From") + p([who, e.email, e.phone].filter(Boolean).map((v) => esc(v)).join("<br>")),
      label("Subject") + p(esc(e.subject || "Website enquiry")),
      label("Message") + p(esc(e.message).replace(/\n/g, "<br>")),
      p(`<br>Reply to this email to answer ${esc(e.firstName)} directly.`),
      p(`<a href="${link}" style="color:${C.ink};font-weight:bold;">Open their profile in the back office →</a>`),
    ].join(""),
  );
  const text = [
    `From: ${[who, e.email, e.phone].filter(Boolean).join(", ")}`,
    `Subject: ${e.subject || "Website enquiry"}`,
    "",
    e.message,
    "",
    `Reply to this email to answer ${e.firstName} directly.`,
    link,
  ].join("\n");
  return { subject: `Website message: ${e.subject || "Website enquiry"} — ${who}`, html, text };
}

// ─── Senders ─────────────────────────────────────────────────────────────

export async function sendOrderEmails(order: EmailOrder) {
  const jobs: Promise<boolean>[] = [
    send({ ...renderNewOrderAlert(order), to: ownerAddress(), replyTo: order.email ?? undefined, key: `order-alert/${order.id}` }),
  ];
  if (order.email) {
    jobs.push(send({ ...renderOrderConfirmation(order), to: order.email, key: `order-confirmation/${order.id}` }));
  }
  await Promise.all(jobs);
}

export async function sendDispatchEmail(order: EmailOrder) {
  if (!order.email) return false;
  return send({ ...renderDispatchEmail(order), to: order.email, key: `order-dispatched/${order.id}` });
}

export async function sendEnquiryAlert(enquiry: Enquiry, interactionId: string) {
  return send({ ...renderEnquiryAlert(enquiry), to: ownerAddress(), replyTo: enquiry.email, key: `enquiry/${interactionId}` });
}
