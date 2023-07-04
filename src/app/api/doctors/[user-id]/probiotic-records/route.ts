import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/api";
import { validator } from "../validator";

const GET = validator(async (req, ctx) => {
  const userId = ctx.params["user-id"];

  const probioticRecords = await prisma.probioticRecord.findMany({
    where: {
      doctorId: userId,
    },
  });

  return ApiResponse.json(probioticRecords);
});

export { GET };
