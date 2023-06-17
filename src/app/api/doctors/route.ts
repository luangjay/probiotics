import { NextResponse, type NextRequest } from "next/server";

import { UserType } from "@/types/user";
import { handler } from "@/lib/api";
import { saltHashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createDoctorSchema } from "@/lib/schema";

export async function GET() {
  const action = async () => {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: true,
      },
    });

    return NextResponse.json(
      doctors.map((doctor) => {
        const { user, userId, ...doctorInfo } = doctor;
        const { password, salt, ...userInfo } = user;
        return {
          type: UserType.Doctor,
          ...userInfo,
          ...doctorInfo,
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
    const { ..._userInfo } = createDoctorSchema.parse(body);

    const doctor = await prisma.doctor.create({
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
