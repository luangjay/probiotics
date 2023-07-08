import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/rest";
import { handler } from "./handler";

const GET = handler(async (req, ctx) => {
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
