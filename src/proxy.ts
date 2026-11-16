import { NextResponse, type NextRequest } from "next/server";
import { adminConfigured, isAdminAuthHeader } from "@/lib/admin-auth";

/**
 * Guards the back office (/admin) with HTTP Basic auth using ADMIN_USER /
 * ADMIN_PASSWORD. Admin pages and actions also call requireAdmin() themselves.
 * This is a starting point — swap for real accounts (e.g. Auth.js) when the
 * team grows beyond a single login.
 */
export function proxy(request: NextRequest) {
  if (!adminConfigured()) {
    return new NextResponse("Admin is not configured.", { status: 503 });
  }

  if (isAdminAuthHeader(request.headers.get("authorization"))) return NextResponse.next();

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Lappidoth CRM", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
