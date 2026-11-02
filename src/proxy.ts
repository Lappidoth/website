import { NextResponse, type NextRequest } from "next/server";

/**
 * Guards the CRM (/admin) with HTTP Basic auth using ADMIN_USER / ADMIN_PASSWORD.
 * This is a starting point — swap for real accounts (e.g. Auth.js) when the
 * team grows beyond a single login.
 */
export function proxy(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  if (!user || !pass) {
    return new NextResponse("Admin is not configured.", { status: 503 });
  }

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    try {
      const [u, ...rest] = atob(header.slice(6)).split(":");
      if (u === user && rest.join(":") === pass) return NextResponse.next();
    } catch {
      // fall through to challenge
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Lappidoth CRM", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
