import { partialProbioticBrandSchema } from "@/lib/schema";
import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/rest";
import { validator } from "./validator";

const GET = validator(async (req, ctx) => {
  const id = parseInt(ctx.params.id);

  const probioticBrand = await prisma.probioticBrand.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return ApiResponse.json(probioticBrand);
});

const PUT = validator(async (req, ctx) => {
  const id = parseInt(ctx.params.id);
  const body: unknown = await req.json();
  const pProbioticBrand = partialProbioticBrandSchema.parse(body);

  const probioticBrand = await prisma.probioticBrand.update({
    where: {
      id,
    },
    data: pProbioticBrand,
  });

  return ApiResponse.json(probioticBrand);
});

const DELETE = validator(async (req, ctx) => {
  const id = parseInt(ctx.params.id);

  await prisma.probioticBrand.delete({
    where: {
      id,
    },
  });

  return ApiResponse.json(null);
});

export { DELETE, GET, PUT };
