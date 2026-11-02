import { NextResponse, type NextRequest } from "next/server";

/**
 * Fast first gate for /admin: no session cookie → straight to the login page.
 * The real check (session exists, not expired, admin still exists) runs on the
 * server in requireAdmin() for every admin page and action.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (!req.cookies.get("txsw_admin")) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
