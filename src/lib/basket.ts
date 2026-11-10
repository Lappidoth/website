/**
 * Basket validation + pricing. Runs on the server: prices always come from
 * the database, never from the browser.
 */
import { z } from "zod";
import { db } from "./db";
import { SHOP } from "./shop-config";

export const basketLineSchema = z.object({
  slug: z.string().min(1).max(120),
  quantity: z.number().int().min(1).max(SHOP.maxQuantityPerLine),
  // For sets: the candle slugs chosen, e.g. ["so-loved", "connect"]
  selections: z.array(z.string().max(120)).max(10).optional(),
});

export const basketSchema = z.object({
  lines: z.array(basketLineSchema).min(1, "Your basket is empty.").max(30),
  giftMessage: z.string().trim().max(300).optional(),
});

export type BasketLineInput = z.infer<typeof basketLineSchema>;

export type PricedLine = {
  productId: string;
  slug: string;
  name: string;
  options: string | null;
  quantity: number;
  unitPriceCents: number;
  image: string;
};

export class BasketError extends Error {}

export async function priceBasket(lines: BasketLineInput[]) {
  const slugs = new Set<string>();
  lines.forEach((l) => {
    slugs.add(l.slug);
    l.selections?.forEach((s) => slugs.add(s));
  });

  const products = await db.product.findMany({ where: { slug: { in: [...slugs] }, active: true } });
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const priced: PricedLine[] = lines.map((line) => {
    const product = bySlug.get(line.slug);
    if (!product) throw new BasketError("One of the items in your basket is no longer available.");

    let options: string | null = null;
    if (product.type === "SET") {
      const picks = line.selections ?? [];
      if (picks.length !== product.setSize) {
        throw new BasketError(`Please choose ${product.setSize} candles for ${product.name}.`);
      }
      const names = picks.map((slug) => {
        const candle = bySlug.get(slug);
        if (!candle || candle.type !== "CANDLE") throw new BasketError("Please choose candles from the collection.");
        return candle.name;
      });
      options = names.join(", ");
    }

    if (product.stock !== null && product.stock < line.quantity) {
      throw new BasketError(
        product.stock === 0 ? `${product.name} is sold out.` : `Only ${product.stock} of ${product.name} left.`,
      );
    }

    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      options,
      quantity: line.quantity,
      unitPriceCents: product.priceCents,
      image: product.image,
    };
  });

  const subtotalCents = priced.reduce((sum, l) => sum + l.unitPriceCents * l.quantity, 0);
  return { lines: priced, subtotalCents };
}
