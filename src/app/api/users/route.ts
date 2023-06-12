import { saltHashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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
    const body = await req.json();
    const { attr1, attr2, ...user } = registerSchema.parse(body);

    // Create the user
    const doctor = await prisma.doctor.create({
      data: {
        user: {
          create: {
            ...user,
            ...saltHashPassword(user.password),
          },
        },
        attr1,
        attr2,
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
