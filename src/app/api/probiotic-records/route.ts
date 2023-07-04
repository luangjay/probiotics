import { probioticRecordSchema } from "@/lib/schema";
import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/api";
import { validator } from "../validator";

const GET = validator(async () => {
  const probioticRecords = await prisma.probioticRecord.findMany();

  return ApiResponse.json(probioticRecords);
});

const POST = validator(async (req) => {
  // Validate the request body against the schema
  const body: unknown = await req.json();
  const probioticRecordInfo = probioticRecordSchema.parse(body);

  const probioticRecord = await prisma.probioticRecord.create({
    data: {
      ...probioticRecordInfo,
    },
  });

  return ApiResponse.json(probioticRecord);
});

export { GET, POST };
