import { db } from "./db";
export { formatPrice } from "./format";

export async function getProducts(type?: "CANDLE" | "SET") {
  return db.product.findMany({
    where: { active: true, ...(type ? { type } : {}) },
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

export type ProductWithCollection = NonNullable<Awaited<ReturnType<typeof getProduct>>>;
