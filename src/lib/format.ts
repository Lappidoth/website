import { SHOP } from "./shop-config";

export function formatPrice(cents: number, currency = SHOP.currency) {
  return new Intl.NumberFormat(SHOP.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
