"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { sendDispatchEmail } from "@/lib/email";

// Every action re-checks the login itself (see src/lib/admin-auth.ts).

export async function markDispatched(orderId: string, formData: FormData) {
  await requireAdmin();
  const tracking = z.string().trim().max(80).optional().parse(formData.get("tracking") ?? undefined);
  const updated = await db.order.updateMany({
    where: { id: orderId, status: "PAID" },
    data: { status: "DISPATCHED", dispatchedAt: new Date(), trackingNumber: tracking || null },
  });
  if (updated.count === 1 && formData.get("notify") !== "no") {
    const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (order) await sendDispatchEmail(order);
  }
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

export async function setOrderStatus(orderId: string, formData: FormData) {
  await requireAdmin();
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
  await requireAdmin();
  if (formData.get("confirm") !== "yes") return;
  const deleted = await db.order.deleteMany({
    where: { id: orderId, status: { in: ["CANCELLED", "REFUNDED"] } },
  });
  if (deleted.count === 0) return;
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  redirect("/admin/orders");
}
