"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CUSTOMER_STATUSES, logInteraction } from "@/lib/crm";
import { db } from "@/lib/db";

// Note: /admin/* (including these actions) is protected by src/proxy.ts.

export async function addNote(customerId: string, formData: FormData) {
  const body = z.string().trim().min(1).max(5000).safeParse(formData.get("body"));
  if (!body.success) return;
  await logInteraction({ customerId, type: "NOTE", body: body.data });
  await db.customer.update({ where: { id: customerId }, data: { updatedAt: new Date() } });
  revalidatePath(`/admin/customers/${customerId}`);
}

export async function updateCustomer(customerId: string, formData: FormData) {
  const parsed = z
    .object({
      status: z.enum(CUSTOMER_STATUSES),
      tags: z.string().max(500).optional(),
      phone: z.string().trim().max(40).optional(),
    })
    .safeParse({
      status: formData.get("status"),
      tags: formData.get("tags") ?? undefined,
      phone: formData.get("phone") ?? undefined,
    });
  if (!parsed.success) return;

  const tagNames = Array.from(
    new Set(
      (parsed.data.tags ?? "")
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    ),
  );

  await db.customer.update({
    where: { id: customerId },
    data: {
      status: parsed.data.status,
      phone: parsed.data.phone || null,
      tags: {
        set: [],
        connectOrCreate: tagNames.map((name) => ({ where: { name }, create: { name } })),
      },
    },
  });
  revalidatePath(`/admin/customers/${customerId}`);
}
