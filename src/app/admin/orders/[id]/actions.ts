"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

/**
 * Permanently delete an order. Only allowed once it's Cancelled or Refunded,
 * so a live, paid order can't be removed by accident.
 */
export async function deleteOrder(orderId: string, formData: FormData) {
  if (formData.get("confirm") !== "yes") return;
  const deleted = await db.order.deleteMany({
    where: { id: orderId, status: { in: ["CANCELLED", "REFUNDED"] } },
  });
  if (deleted.count === 0) return;
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  redirect("/admin/orders");
}
