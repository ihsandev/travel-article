import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("_token");
  const { pathname, origin } = request.nextUrl;

  if (!token) {
    if (pathname.startsWith("/dashboard")) {
      const signInUrl = new URL("/sign-in", origin);
      return NextResponse.redirect(signInUrl);
    }
  } else {
    if (PUBLIC_ROUTES.includes(pathname)) {
      const dashboardUrl = new URL("/dashboard", origin);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", ...PUBLIC_ROUTES],
};
