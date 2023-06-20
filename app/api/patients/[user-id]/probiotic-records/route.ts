import { ApiResponse } from "@/types/api";
import prisma from "@/lib/prisma";

import { validator } from "../validator";

const GET = validator(async (req, ctx) => {
  const userId = ctx.params["user-id"];

  const probioticRecords = await prisma.probioticRecord.findMany({
    where: {
      patientId: userId,
    },
  });

  return ApiResponse.json(probioticRecords);
});

export { GET };
