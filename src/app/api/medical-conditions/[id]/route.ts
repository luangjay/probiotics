import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/api";
import { validator } from "./validator";

const GET = validator(async (req, ctx) => {
  const id = parseInt(ctx.params.id);

  const medicalCondition = await prisma.medicalCondition.findUnique({
    where: {
      id,
    },
  });
  if (medicalCondition === null) {
    return new ApiResponse("Probiotic not found", { status: 404 });
  }

  return ApiResponse.json(medicalCondition);
});

export { GET };
