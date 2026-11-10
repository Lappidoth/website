"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";

// /admin/* (including these actions) is protected by src/proxy.ts.

export async function markDispatched(orderId: string, formData: FormData) {
  const tracking = z.string().trim().max(80).optional().parse(formData.get("tracking") ?? undefined);
  await db.order.updateMany({
    where: { id: orderId, status: "PAID" },
    data: { status: "DISPATCHED", dispatchedAt: new Date(), trackingNumber: tracking || null },
  });
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

export async function setOrderStatus(orderId: string, formData: FormData) {
  const status = z.enum(["PENDING", "PAID", "DISPATCHED", "CANCELLED", "REFUNDED"]).parse(formData.get("status"));
  await db.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}
