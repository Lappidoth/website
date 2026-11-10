/**
 * Shop settings in one place. Delivery prices are placeholders — confirm
 * your Royal Mail / courier rates and update here.
 */
export const SHOP = {
  currency: "GBP",
  locale: "en-GB",
  // UK only for now. Add ISO country codes (e.g. "IE", "FR", "US") to ship abroad.
  shipToCountries: ["GB"] as const,
  freeShippingThresholdCents: 5000, // free standard delivery over £50
  shippingOptions: [
    { id: "standard", name: "Standard UK delivery (2–4 working days)", amountCents: 395, minDays: 2, maxDays: 4 },
    { id: "express", name: "Express UK delivery (1–2 working days)", amountCents: 595, minDays: 1, maxDays: 2 },
  ],
  contact: {
    email: "hello@lappidothandco.com",
    phone: "+44 (0) 7423 229556",
    phoneHref: "+447423229556",
  },
  maxQuantityPerLine: 20,
};
