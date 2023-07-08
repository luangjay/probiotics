import { prisma } from "@/lib/prisma";
import { probioticBrandSchema } from "@/lib/schema";
import { ApiResponse } from "@/types/rest";
import { handler } from "../handler";

const GET = handler(async () => {
  const probioticBrands = await prisma.probioticBrand.findMany();
  return ApiResponse.json(probioticBrands);
});

const POST = handler(async (req) => {
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
