import { ApiResponse } from "@/types/api";
import prisma from "@/lib/prisma";

import { validator } from "../validator";

const GET = validator(async () => {
  const probioticBrands = await prisma.probioticBrand.findMany();
  return ApiResponse.json(probioticBrands);
});

export { GET };
