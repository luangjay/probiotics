import { NextResponse, type NextRequest } from "next/server";

import { UserType } from "@/types/user";
import { handler } from "@/lib/api";
import { saltHashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createAdminSchema } from "@/lib/schema";

export async function GET() {
  const action = async () => {
    const admins = await prisma.admin.findMany({
      include: {
        user: true,
      },
    });

    return NextResponse.json(
      admins.map((admin) => {
        const { user, userId, ...adminInfo } = admin;
        const { password, salt, ...userInfo } = user;
        return {
          type: UserType.Admin,
          ...userInfo,
          ...adminInfo,
        };
      })
    );
  };

  return handler(action);
}

export async function POST(req: NextRequest) {
  const action = async () => {
    // Validate the request body against the schema
    const body: unknown = await req.json();
    const { ..._userInfo } = createAdminSchema.parse(body);

    const admin = await prisma.admin.create({
      data: {
        user: {
          create: {
            ..._userInfo,
            ...saltHashPassword(_userInfo.password),
          },
        },
      },
      include: {
        user: true,
      },
    });

    const { user, userId, ...adminInfo } = admin;
    const { password, salt, ...userInfo } = user;
    return NextResponse.json({
      type: UserType.Admin,
      ...userInfo,
      ...adminInfo,
    });
  };

  return handler(action);
}
