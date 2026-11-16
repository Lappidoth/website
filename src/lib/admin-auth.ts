/**
 * Back-office login check (HTTP Basic auth against ADMIN_USER / ADMIN_PASSWORD).
 *
 * Checked in two places on purpose: src/proxy.ts guards every /admin URL, and
 * requireAdmin() re-checks inside each admin page, action and download, so a
 * routing mistake can never expose customer data on its own.
 */
import { headers } from "next/headers";

/** Compares two strings without leaking how many characters matched. */
function safeEqual(a: string, b: string) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_USER && process.env.ADMIN_PASSWORD);
}

export function isAdminAuthHeader(header: string | null) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;
  if (!user || !pass || !header?.startsWith("Basic ")) return false;
  try {
    const decoded = atob(header.slice(6));
    const i = decoded.indexOf(":");
    if (i < 0) return false;
    // Evaluate both so timing doesn't reveal which half was wrong.
    const userOk = safeEqual(decoded.slice(0, i), user);
    const passOk = safeEqual(decoded.slice(i + 1), pass);
    return userOk && passOk;
  } catch {
    return false;
  }
}

/** Call at the top of every admin page, server action and route handler. */
export async function requireAdmin() {
  const h = await headers();
  if (!isAdminAuthHeader(h.get("authorization"))) throw new Error("Unauthorized");
}
