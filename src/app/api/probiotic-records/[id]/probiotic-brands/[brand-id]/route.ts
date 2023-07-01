import { ApiResponse } from "@/types/api";
import prisma from "@/lib/prisma";

import { validator } from "./validator";

const DELETE = validator(async (req, ctx) => {
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
