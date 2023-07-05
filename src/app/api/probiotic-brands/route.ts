import { probioticBrandSchema } from "@/lib/schema";
import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/rest";
import { validator } from "../validator";

const GET = validator(async () => {
  const probioticBrands = await prisma.probioticBrand.findMany();
  return ApiResponse.json(probioticBrands);
});

const POST = validator(async (req) => {
  // Validate the request body against the schema
  const body: unknown = await req.json();
  const { name } = probioticBrandSchema.parse(body);

  const probioticBrand = await prisma.probioticBrand.create({
    data: {
      name,
    },
  });

  return ApiResponse.json(probioticBrand);
});

export { GET, POST };
