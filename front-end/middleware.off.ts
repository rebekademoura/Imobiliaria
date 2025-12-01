// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/area", "/users"]; // rotas que exigem login

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const precisa = PROTECTED.some(p => pathname === p || pathname.startsWith(p + "/"));
  if (!precisa) return;

  const has = req.cookies.get("token")?.value;
  if (!has) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/area/:path*", "/users/:path*"] };
