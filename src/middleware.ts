import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    console.log(pathname);
    const token = await getToken({ req });
    const authenticated = !!token;

    switch (pathname) {
      case "/register":
      case "/login":
        if (authenticated) {
          return NextResponse.redirect(new URL("/", req.url));
        }
        return null;
    }
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

export const config = {
  matcher: ["/register", "/login"],
};
