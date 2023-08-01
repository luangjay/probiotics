import { prisma } from "@/lib/prisma";
import { probioticRecordSchema } from "@/lib/schema";
import { ApiResponse } from "@/types/api";
import { handler } from "../handler";

const GET = handler(async () => {
  const probioticRecords = await prisma.visitData.findMany();

  return ApiResponse.json(probioticRecords);
});

const POST = handler(async (req) => {
  // Validate the request body against the schema
  const body: unknown = await req.json();
  const {
    fileUri: _,
    microorganismRecords,
    ...probioticRecordInfo
  } = probioticRecordSchema.parse(body);

  const probioticRecord = await prisma.visitData.create({
    data: {
      ...probioticRecordInfo,
      microorganismRecords: {
        createMany: {
          data: microorganismRecords,
        },
      },
    },
  });

  return ApiResponse.json(probioticRecord);
});

export { GET, POST };
