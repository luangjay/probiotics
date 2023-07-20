import { prisma } from "@/lib/prisma";
import { partialProbioticRecordSchema } from "@/lib/schema";
import { ApiResponse } from "@/types/api";
import { handler } from "./handler";

const GET = handler(async (req, ctx) => {
  const id = ctx.params.id;

  const probioticRecord = await prisma.visitData.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return ApiResponse.json(probioticRecord);
});

const PUT = handler(async (req, ctx) => {
  const id = ctx.params.id;

  // Validate the request body against the schema
  const body: unknown = await req.json();
  const {
    fileUri: _,
    microorganismRecords,
    ...probioticRecordInfo
  } = partialProbioticRecordSchema.parse(body);

  const probioticRecord = await prisma.visitData.update({
    where: {
      id,
    },
    data: {
      ...probioticRecordInfo,
      microorganismRecords: {
        createMany: {
          data: microorganismRecords ?? [],
        },
      },
    },
  });

  return ApiResponse.json(probioticRecord);
});

const DELETE = handler(async (req, ctx) => {
  const id = ctx.params.id;

  await prisma.visitData.delete({
    where: {
      id,
    },
  });

  return ApiResponse.json(null);
});

export { DELETE, GET, PUT };
