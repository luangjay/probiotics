import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

import { UserType } from "./types/user";

export default withAuth(
  function middleware(req) {
    // Initialize
    const token = req.nextauth.token;
    const method = req.method;
    const path = req.nextUrl.pathname.split("/");
    const next = NextResponse.next();
    const redirect = NextResponse.redirect(new URL("/", req.url));
    const unauthorize = new NextResponse("Unauthorized", { status: 401 });

    // Redirect users with token in register and login pages
    switch (path[1]) {
      case "/register":
      case "/login":
        return token ? redirect : next;
    }

    // Authorize api paths
    if (path[1] === "api") {
      switch (path[2]) {
        case "users":
          return token?.type === UserType.Admin ? next : unauthorize;
        case "admins":
          if (!path[3]) {
            switch (method) {
              case "GET":
                return token?.type === UserType.Admin ? next : unauthorize;
            }
          } else {
            switch (method) {
              case "GET":
                return token?.type === UserType.Admin ? next : unauthorize;
              case "PUT":
              case "DELETE":
                return token?.sub === path[3] ? next : unauthorize;
            }
          }
        case "doctors":
          if (!path[3]) {
            switch (method) {
              case "POST":
                return next;
            }
          } else {
            switch (method) {
              case "PUT":
              case "DELETE":
                return token?.type === UserType.Admin || token?.sub === path[3]
                  ? next
                  : unauthorize;
            }
          }
        default:
          switch (token?.type) {
            case UserType.Admin:
            case UserType.Doctor:
              return next;
            default:
              return unauthorize;
          }
      }
    }

    return next;
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
