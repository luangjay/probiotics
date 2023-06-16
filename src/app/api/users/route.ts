import { NextResponse, type NextRequest } from "next/server";
import { User } from "next-auth";
import { z } from "zod";

import { saltHashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/schema";

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(
    users.map((user) => {
      const { password, salt, ...userInfo } = user;
      return userInfo;
    })
  );
}

export const revalidate = 10;
