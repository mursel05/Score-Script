import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth?.user;
  const isBlocked = req.auth?.user?.blocked;

  if (isAuthenticated && isBlocked) {
    const response = NextResponse.redirect(new URL("/blocked", req.url));
    response.cookies.delete("authjs.session-token");
    return response;
  }

  const publicRoutes = ["/", "/login", "/blocked"];
  const publicApiRoutes = ["/api/auth", "/api/contact", "/api/leaderboard"];

  if (publicRoutes.includes(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "İstifadəçi təsdiqlənməyib", success: false },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
