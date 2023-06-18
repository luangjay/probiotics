import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { handler } from "@/lib/api";
import prisma from "@/lib/prisma";
import { updateProbioticSchema } from "@/lib/schema";

// import { updateProbioticSchema } from "@/lib/schema";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const action = async () => {
    const id = z.number().int().parse(parseInt(params.id));
    const probiotic = await prisma.probiotic.findUnique({
      where: {
        id,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    if (probiotic === null) {
      return new NextResponse("Probiotic not found", { status: 404 });
    }
    return NextResponse.json(probiotic);
  };

  return handler(action);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const action = async () => {
    // Validate the request body against the schema
    const id = z.number().int().parse(parseInt(params.id));
    const body: unknown = await req.json();
    const probioticInfo = updateProbioticSchema.parse(body);

    const _probiotic = await prisma.probiotic.findUnique({
      where: {
        id,
      },
      include: {
        parent: true,
        children: true,
      },
    });
    if (_probiotic === null) {
      return new NextResponse("Probiotic not found", { status: 404 });
    }

    const probiotic = await prisma.probiotic.update({
      where: {
        id,
      },
      data: {
        ...probioticInfo,
      },
    });

    return NextResponse.json(probiotic);
  };

  return handler(action);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const action = async () => {
    const id = z.number().int().parse(parseInt(params.id));
    const probiotic = await prisma.probiotic.findUnique({
      where: {
        id,
      },
    });
    if (probiotic === null) {
      return new NextResponse("Probiotic not found", { status: 404 });
    }

    await prisma.probiotic.delete({
      where: {
        id: parseInt(params.id),
      },
    });
    return NextResponse.json(null);
  };

  return handler(action);
}
