import { addProbioticRecordProbioticBrandSchema } from "@/lib/schema";
import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/api";
import { validator } from "../validator";

const GET = validator(async (req, ctx) => {
  const id = ctx.params.id;

  const probioticBrandProbioticRecord =
    await prisma.probioticBrandProbioticRecord.findMany({
      where: {
        probioticRecordId: id,
      },
      include: {
        probioticBrand: true,
      },
    });

  return ApiResponse.json(
    probioticBrandProbioticRecord.map((p27d) => p27d.probioticBrand)
  );
});

const POST = validator(async (req, ctx) => {
  const id = ctx.params.id;

  // Validate the request body against the schema
  const body: unknown = await req.json();
  const probioticBrandInfo = addProbioticRecordProbioticBrandSchema.parse(body);

  const { probioticBrand } = await prisma.probioticBrandProbioticRecord.create({
    data: {
      probioticRecordId: id,
      ...probioticBrandInfo,
    },
    include: {
      probioticBrand: true,
    },
  });

  return ApiResponse.json(probioticBrand);
});

export { GET, POST };
