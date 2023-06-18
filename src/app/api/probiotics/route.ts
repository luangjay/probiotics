import { NextResponse, type NextRequest } from "next/server";

import { handler } from "@/lib/api";
import prisma from "@/lib/prisma";
import { createRootProbioticSchema } from "@/lib/schema";

// import { createProbioticSchema } from "@/lib/schema";

export async function GET() {
  const action = async () => {
    const probiotics = await prisma.probiotic.findMany();

    return NextResponse.json(probiotics);
  };

  return handler(action);
}

export async function POST(req: NextRequest) {
  const action = async () => {
    // Validate the request body against the schema
    const body: unknown = await req.json();
    const probioticInfo = createRootProbioticSchema.parse(body);

    const probiotic = await prisma.probiotic.create({
      data: {
        parentId: null,
        ...probioticInfo,
      },
    });

    return NextResponse.json(probiotic);
  };

  return handler(action);
}
