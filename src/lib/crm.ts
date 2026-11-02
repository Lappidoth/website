/**
 * CRM service layer.
 *
 * All customer data flows through these functions — API routes, admin
 * actions, and future integrations (Stripe webhooks, email platforms,
 * imports) should call these rather than touching the database directly.
 */
import { z } from "zod";
import { db } from "./db";

export const CUSTOMER_STATUSES = ["LEAD", "SUBSCRIBER", "CUSTOMER", "VIP", "ARCHIVED"] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const INTERACTION_TYPES = [
  "NEWSLETTER_SIGNUP",
  "CONTACT_FORM",
  "WAITLIST",
  "NOTE",
  "ORDER_PLACED",
] as const;
export type InteractionType = (typeof INTERACTION_TYPES)[number];

// Status only ever moves "up" automatically; admins can set anything manually.
const STATUS_RANK: Record<CustomerStatus, number> = {
  ARCHIVED: -1,
  LEAD: 0,
  SUBSCRIBER: 1,
  CUSTOMER: 2,
  VIP: 3,
};

// ─── Public form schemas ─────────────────────────────────────────────────

const email = z.string().trim().toLowerCase().email("Please enter a valid email.").max(254);
const optionalName = z.string().trim().max(80).optional();

export const subscribeSchema = z.object({
  email,
  firstName: optionalName,
});

export const contactSchema = z.object({
  email,
  firstName: z.string().trim().min(1, "Please tell us your name.").max(80),
  lastName: optionalName,
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(5, "Please include a short message.").max(5000),
  marketingOptIn: z.boolean().optional(),
});

export const waitlistSchema = z.object({
  email,
  firstName: optionalName,
  productSlug: z.string().trim().max(120),
});

// ─── Core operations ─────────────────────────────────────────────────────

type UpsertInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  source: string;
  status?: CustomerStatus;
  marketingOptIn?: boolean;
};

/** Find-or-create a customer by email, filling blanks without overwriting known data. */
export async function upsertCustomer(input: UpsertInput) {
  const existing = await db.customer.findUnique({ where: { email: input.email } });

  if (!existing) {
    return db.customer.create({
      data: {
        email: input.email,
        firstName: input.firstName || null,
        lastName: input.lastName || null,
        phone: input.phone || null,
        source: input.source,
        status: input.status ?? "LEAD",
        marketingOptIn: input.marketingOptIn ?? false,
      },
    });
  }

  const current = existing.status as CustomerStatus;
  const next =
    input.status && STATUS_RANK[input.status] > STATUS_RANK[current] && current !== "ARCHIVED"
      ? input.status
      : current;

  return db.customer.update({
    where: { id: existing.id },
    data: {
      firstName: existing.firstName ?? (input.firstName || null),
      lastName: existing.lastName ?? (input.lastName || null),
      phone: existing.phone ?? (input.phone || null),
      status: next,
      marketingOptIn: existing.marketingOptIn || !!input.marketingOptIn,
    },
  });
}

export async function logInteraction(input: {
  customerId: string;
  type: InteractionType;
  subject?: string;
  body?: string;
  metadata?: Record<string, unknown>;
}) {
  return db.interaction.create({
    data: {
      customerId: input.customerId,
      type: input.type,
      subject: input.subject ?? null,
      body: input.body ?? null,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    },
  });
}

// ─── Use cases called by the public site ─────────────────────────────────

export async function subscribe(data: z.infer<typeof subscribeSchema>) {
  const customer = await upsertCustomer({
    ...data,
    source: "newsletter",
    status: "SUBSCRIBER",
    marketingOptIn: true,
  });
  await logInteraction({ customerId: customer.id, type: "NEWSLETTER_SIGNUP" });
  return customer;
}

export async function submitContact(data: z.infer<typeof contactSchema>) {
  const { subject, message, ...person } = data;
  const customer = await upsertCustomer({
    ...person,
    source: "contact",
    status: data.marketingOptIn ? "SUBSCRIBER" : "LEAD",
  });
  await logInteraction({
    customerId: customer.id,
    type: "CONTACT_FORM",
    subject: subject || "Website enquiry",
    body: message,
  });
  return customer;
}

export async function joinWaitlist(data: z.infer<typeof waitlistSchema>) {
  const customer = await upsertCustomer({
    email: data.email,
    firstName: data.firstName,
    source: "waitlist",
    status: "SUBSCRIBER",
    marketingOptIn: true,
  });
  await logInteraction({
    customerId: customer.id,
    type: "WAITLIST",
    subject: `Waitlist: ${data.productSlug}`,
    metadata: { productSlug: data.productSlug },
  });
  return customer;
}

// ─── Admin queries ───────────────────────────────────────────────────────

export async function getDashboardStats() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [total, subscribers, newThisMonth, openEnquiries, byStatus, recent] = await Promise.all([
    db.customer.count({ where: { status: { not: "ARCHIVED" } } }),
    db.customer.count({ where: { marketingOptIn: true } }),
    db.customer.count({ where: { createdAt: { gte: since } } }),
    db.interaction.count({ where: { type: "CONTACT_FORM", createdAt: { gte: since } } }),
    db.customer.groupBy({ by: ["status"], _count: true }),
    db.interaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { customer: true },
    }),
  ]);
  return { total, subscribers, newThisMonth, openEnquiries, byStatus, recent };
}

export async function listCustomers(opts: { q?: string; status?: string }) {
  const q = opts.q?.trim();
  return db.customer.findMany({
    where: {
      ...(opts.status ? { status: opts.status } : {}),
      ...(q
        ? {
            OR: [
              { email: { contains: q } },
              { firstName: { contains: q } },
              { lastName: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: { tags: true, _count: { select: { interactions: true, orders: true } } },
    take: 200,
  });
}

export async function getCustomer(id: string) {
  return db.customer.findUnique({
    where: { id },
    include: {
      tags: true,
      interactions: { orderBy: { createdAt: "desc" } },
      orders: { orderBy: { createdAt: "desc" } },
    },
  });
}
