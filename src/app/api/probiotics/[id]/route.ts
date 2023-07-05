import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/rest";
import { validator } from "./validator";

const GET = validator(async (req, ctx) => {
  const id = parseInt(ctx.params.id);

  const probiotic = await prisma.probiotic.findUnique({
    where: {
      id,
    },
  });
  if (probiotic === null) {
    return new ApiResponse("Probiotic not found", { status: 404 });
  }

  return ApiResponse.json(probiotic);
});

export { GET };
