import { UserType } from "@/types/user";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    console.log(pathname, token?.type);

    if (pathname === "/register" || pathname === "/login") {
      return token
        ? NextResponse.redirect(new URL("/", req.url))
        : NextResponse.next();
    }
    if (pathname === "/patients") {
      return token?.type !== UserType.Admin && token?.type !== UserType.Doctor
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
  matcher: ["/register", "/login", "/api/:path*", "/patients"],
};
