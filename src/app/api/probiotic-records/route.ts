import { prisma } from "@/lib/prisma";
import { probioticRecordSchema } from "@/lib/schema";
import { ApiResponse } from "@/types/rest";
import { handler } from "../handler";

const GET = handler(async () => {
  const probioticRecords = await prisma.probioticRecord.findMany();

  return ApiResponse.json(probioticRecords);
});

const POST = handler(async (req) => {
  // Validate the request body against the schema
  const body: unknown = await req.json();
  console.log(body);
  const probioticRecordInfo = probioticRecordSchema.parse(body);

  const probioticRecord = await prisma.probioticRecord.create({
    data: {
      ...probioticRecordInfo,
    },
  });

  return ApiResponse.json(probioticRecord);
});

export { GET, POST };
