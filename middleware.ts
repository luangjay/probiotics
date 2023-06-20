import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    if (pathname === "register" || pathname === "login") {
      return token
        ? NextResponse.redirect(new URL("/", req.url))
        : NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/register", "/login", "/api/:path*"],
};
