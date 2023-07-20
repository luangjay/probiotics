import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { handler } from "./handler";

const GET = handler(async (req, ctx) => {
  const id = parseInt(ctx.params.id);

  const probiotic = await prisma.microorgranism.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return ApiResponse.json(probiotic);
});

export { GET };
