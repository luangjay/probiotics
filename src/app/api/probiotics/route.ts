import { type NextRequest } from "next/server";

import { ApiResponse } from "@/types/api";
import prisma from "@/lib/prisma";
import { createRootProbioticSchema } from "@/lib/schema";

import { validator } from "../validator";

const GET = validator(async () => {
  const probiotics = await prisma.probiotic.findMany();
  return ApiResponse.json(probiotics);
});

const POST = validator(async (req: NextRequest) => {
  // Validate the request body against the schema
  const body: unknown = await req.json();
  const probioticInfo = createRootProbioticSchema.parse(body);

  const probiotic = await prisma.probiotic.create({
    data: {
      parentId: null,
      ...probioticInfo,
    },
  });

  return ApiResponse.json(probiotic);
});

export { GET, POST };
