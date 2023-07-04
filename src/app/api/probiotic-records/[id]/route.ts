import { updateProbioticRecordSchema } from "@/lib/schema";
import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/api";
import { validator } from "./validator";

const GET = validator(async (req, ctx) => {
  const id = ctx.params.id;

  const probioticRecord = await prisma.probioticRecord.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return ApiResponse.json(probioticRecord);
});

const PUT = validator(async (req, ctx) => {
  const id = ctx.params.id;

  // Validate the request body against the schema
  const body: unknown = await req.json();
  const probioticRecordInfo = updateProbioticRecordSchema.parse(body);

  const probioticRecord = await prisma.probioticRecord.update({
    where: {
      id,
    },
    data: {
      ...probioticRecordInfo,
    },
  });

  return ApiResponse.json(probioticRecord);
});

const DELETE = validator(async (req, ctx) => {
  const id = ctx.params.id;

  await prisma.probioticRecord.delete({
    where: {
      id,
    },
  });

  return ApiResponse.json(null);
});

export { DELETE, GET, PUT };
