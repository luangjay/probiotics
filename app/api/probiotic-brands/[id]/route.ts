import { ApiResponse } from "@/types/api";
import prisma from "@/lib/prisma";

import { validator } from "./validator";

const GET = validator(async (req, ctx) => {
  const id = parseInt(ctx.params.id);

  const probioticBrand = await prisma.probioticBrand.findUnique({
    where: {
      id,
    },
  });
  if (probioticBrand === null) {
    return new ApiResponse("Probiotic not found", { status: 404 });
  }

  return ApiResponse.json(probioticBrand);
});

export { GET };
