import { ApiResponse } from "@/types/api";
import prisma from "@/lib/prisma";
import { fileSchema } from "@/lib/schema";
import { getCsv, uploadCsv } from "@/lib/utils";

import { validator } from "../validator";

const GET = validator(async (req, ctx) => {
  const id = ctx.params.id;

  const csv = await getCsv("probiotic-records", id);

  return ApiResponse.csv(csv);
});

const POST = validator(async (req, ctx) => {
  const id = ctx.params.id;

  // Validate file type
  const formData = await req.formData();
  const file = fileSchema.parse(formData.get("file"));

  const fileUri = await uploadCsv(file, "probiotic-records", id);

  await prisma.probioticRecord.update({
    where: {
      id,
    },
    data: {
      fileUri,
    },
  });

  return new ApiResponse(fileUri);
});

export { GET, POST };
