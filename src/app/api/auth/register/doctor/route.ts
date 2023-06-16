import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { UserType } from "@/types/user";
import { saltHashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
    // Validate the request body against the schema
    const body: unknown = await req.json();
    const formData = registerSchema.parse(body);

    // Create the user
    const doctor = await prisma.doctor.create({
      data: {
        user: {
          create: {
            ...formData,
            ...saltHashPassword(formData.password),
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(null, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(null, { status: 500 });
  }
}
