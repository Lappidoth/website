import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { siteUrl } from "@/lib/stripe";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const products = await getProducts();
  const pages = ["", "/shop", "/about", "/contact", "/delivery-returns", "/terms", "/privacy"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.6 })),
    ...products.map((p) => ({
      url: `${base}/shop/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
