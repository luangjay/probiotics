import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { withAuth } from "next-auth/middleware";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

import { UserType } from "./types/user";

const authPaths = new Set<string>(["/register", "/login"]);

const adminApiPaths = new Set<string>();

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;
    if (authPaths.has(pathname)) {
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
