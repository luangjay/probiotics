import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/rest";
import { handler } from "./handler";

const GET = handler(async (req, ctx) => {
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
