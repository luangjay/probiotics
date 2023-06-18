import { NextResponse, type NextRequest } from "next/server";

import { UserType } from "@/types/user";
import { handler } from "@/lib/api";
import { saltHashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateAdminSchema } from "@/lib/schema";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const action = async () => {
    const admin = await prisma.admin.findUnique({
      where: {
        userId: params.userId,
      },
      include: {
        user: true,
      },
    });

    if (admin === null) {
      return new NextResponse("Admin not found", { status: 404 });
    }
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const action = async () => {
    // Validate the request body against the schema
    const body: unknown = await req.json();
    const { ..._userInfo } = updateAdminSchema.parse(body);

    const _admin = await prisma.admin.findUnique({
      where: {
        userId: params.userId,
      },
    });
    if (_admin === null) {
      return new NextResponse("Admin not found", { status: 404 });
    }

    const admin = await prisma.admin.update({
      where: {
        userId: params.userId,
      },
      data: {
        user: {
          update: {
            ..._userInfo,
            ...(_userInfo.password && saltHashPassword(_userInfo.password)),
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const action = async () => {
    const admin = await prisma.admin.findUnique({
      where: {
        userId: params.userId,
      },
    });
    if (admin === null) {
      return new NextResponse("Admin not found", { status: 404 });
    }

    await prisma.user.delete({
      where: {
        id: params.userId,
      },
    });
    return NextResponse.json({});
  };

  return handler(action);
}
