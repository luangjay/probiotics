import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/api";
import { validator } from "../validator";

const GET = validator(async () => {
  const probioticBrands = await prisma.probioticBrand.findMany();
  return ApiResponse.json(probioticBrands);
});

export { GET };
