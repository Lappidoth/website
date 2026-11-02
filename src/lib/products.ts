import { db } from "./db";

export async function getProducts() {
  return db.product.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: { collection: true },
  });
}

export async function getProduct(slug: string) {
  return db.product.findFirst({
    where: { slug, active: true },
    include: { collection: true },
  });
}

export function formatPrice(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
