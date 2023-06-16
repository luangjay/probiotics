import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    console.log(pathname);
    const token = await getToken({ req });
    const isLoggedIn = !!token;

    if (pathname === "/register" || pathname === "/login") {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return null;
    }

    await fetch(new URL("/api/auth/signout", req.url), { method: "POST" });
    return null;
    // return NextResponse.redirect(new URL("/api/auth/signout", req.url));
  },
  {
    callbacks: {
      authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  }
);

export const matcher = ["/register", "/login", "/logout"];
