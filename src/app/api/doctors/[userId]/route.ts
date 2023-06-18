import { NextResponse, type NextRequest } from "next/server";

import { UserType } from "@/types/user";
import { handler } from "@/lib/api";
import { saltHashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateDoctorSchema } from "@/lib/schema";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const action = async () => {
    const doctor = await prisma.doctor.findUnique({
      where: {
        userId: params.userId,
      },
      include: {
        user: true,
        probioticRecords: true,
      },
    });

    if (doctor === null) {
      return new NextResponse("Doctor not found", { status: 404 });
    }
    const { user, userId, ...doctorInfo } = doctor;
    const { password, salt, ...userInfo } = user;
    return NextResponse.json({
      type: UserType.Doctor,
      ...userInfo,
      ...doctorInfo,
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
    const { ..._userInfo } = updateDoctorSchema.parse(body);

    const _doctor = await prisma.doctor.findUnique({
      where: {
        userId: params.userId,
      },
    });
    if (_doctor === null) {
      return new NextResponse("Doctor not found", { status: 404 });
    }

    const doctor = await prisma.doctor.update({
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

    const { user, userId, ...doctorInfo } = doctor;
    const { password, salt, ...userInfo } = user;
    return NextResponse.json({
      type: UserType.Doctor,
      ...userInfo,
      ...doctorInfo,
    });
  };

  return handler(action);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const action = async () => {
    const doctor = await prisma.doctor.findUnique({
      where: {
        userId: params.userId,
      },
    });
    if (doctor === null) {
      return new NextResponse("Doctor not found", { status: 404 });
    }

    await prisma.user.delete({
      where: {
        id: params.userId,
      },
    });
    return NextResponse.json(null);
  };

  return handler(action);
}
