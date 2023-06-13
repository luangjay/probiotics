import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { saltHashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation/auth";

/**
 * `GET /api/users`
 */
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

/**
 * `POST /api/users`
 */
export async function POST(req: NextRequest) {
  try {
    // Validate the request body against the schema
    const body: unknown = await req.json();
    const user = registerSchema.parse(body);

    // Create the user
    const doctor = await prisma.doctor.create({
      data: {
        user: {
          create: {
            ...user,
            ...saltHashPassword(user.password),
          },
        },
      },
      include: {
        user: true,
      },
    });

    console.log("POST /api/users", 200);
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("POST /api/users", 400);
      return NextResponse.json(null, { status: 400 });
    }
    console.log("POST /api/users", 500);
    return NextResponse.json(null, { status: 500 });
  }
}

export const revalidate = 10;
