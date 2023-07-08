import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/rest";
import { handler } from "./handler";

const DELETE = handler(async (req, ctx) => {
  // Validate the request body against the schema
  const id = ctx.params.id;
  const brandId = parseInt(ctx.params["brand-id"]);

  await prisma.probioticBrandProbioticRecord.delete({
    where: {
      probioticBrandId_probioticRecordId: {
        probioticBrandId: brandId,
        probioticRecordId: id,
      },
    },
  });

  return ApiResponse.json(null);
});

export { DELETE };
