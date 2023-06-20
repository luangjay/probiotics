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

    console.log(path);
    console.log(path);

    switch (path[1]) {
      // Redirect users with token in register and login pages
      case "register":
      case "login":
        return path.length === 2 && token ? redirect : next;

      // Authorize api paths
      case "api":
        switch (path[2]) {
          case "users":
            return path.length <= 4 && token?.type !== UserType.Admin
              ? unauthorize
              : next;
          case "admins":
            if (!path[3]) {
              switch (method) {
                case "GET":
                  return path.length === 3 && token?.type !== UserType.Admin
                    ? unauthorize
                    : next;
              }
            } else {
              switch (method) {
                case "GET":
                  return path.length === 4 && token?.type !== UserType.Admin
                    ? unauthorize
                    : next;
                case "PUT":
                case "DELETE":
                  return path.length === 4 && token?.sub !== path[3]
                    ? unauthorize
                    : next;
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
                  return path.length === 4 &&
                    token?.type !== UserType.Admin &&
                    token?.sub !== path[3]
                    ? unauthorize
                    : next;
              }
            }
          case "patients":
            return next; // TODO
          case "probiotics":
            return path.length <= 4 &&
              token?.type !== UserType.Admin &&
              token?.type !== UserType.Doctor
              ? unauthorize
              : next;
          case "probiotic-brands":
            return path.length <= 4 &&
              token?.type !== UserType.Admin &&
              token?.type !== UserType.Doctor
              ? unauthorize
              : next;
          case "medical-conditions":
            return path.length <= 4 &&
              token?.type !== UserType.Admin &&
              token?.type !== UserType.Doctor
              ? unauthorize
              : next;
          case "probiotic-records":
            return next; // TODO
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
