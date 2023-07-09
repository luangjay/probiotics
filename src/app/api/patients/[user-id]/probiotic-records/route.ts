import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { handler } from "../handler";

const GET = handler(async (req, ctx) => {
  const userId = ctx.params["user-id"];

  const probioticRecords = await prisma.probioticRecord.findMany({
    where: {
      patientId: userId,
    },
  });

  return ApiResponse.json(probioticRecords);
});

export { GET };
