import { ApiResponse } from "@/types/api";
import prisma from "@/lib/prisma";
import { updateProbioticSchema } from "@/lib/schema";

import { validator } from "./validator";

const GET = validator(async (req, ctx) => {
  const id = parseInt(ctx.params.id as string);
  const probiotic = await prisma.probiotic.findUnique({
    where: {
      id,
    },
  });
  if (probiotic === null) {
    return new ApiResponse("Probiotic not found", { status: 404 });
  }

  return ApiResponse.json(probiotic);
});

const PUT = validator(async (req, ctx) => {
  // Validate the request body against the schema
  const id = parseInt(ctx.params.id as string);
  const body: unknown = await req.json();
  const probioticInfo = updateProbioticSchema.parse(body);

  const probiotic = await prisma.probiotic.update({
    where: {
      id,
    },
    data: {
      ...probioticInfo,
    },
  });
  if (probiotic === null) {
    return new ApiResponse("Probiotic not found", { status: 404 });
  }

  return ApiResponse.json(probiotic);
});

const DELETE = validator(async (req, ctx) => {
  const id = parseInt(ctx.params.id as string);
  await prisma.probiotic.delete({
    where: {
      id,
    },
  });
  return ApiResponse.json(null);
});

export { GET, PUT, DELETE };
