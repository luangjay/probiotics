import { getCsv, uploadCsv } from "@/lib/file";
import { fileSchema } from "@/lib/schema";
import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/rest";
import { handler } from "../handler";

const GET = handler(async (req, ctx) => {
  const id = ctx.params.id;

  const csv = await getCsv("probiotic-records", id);

  return ApiResponse.csv(csv);
});

const POST = handler(async (req, ctx) => {
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
