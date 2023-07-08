import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/rest";
import { handler } from "../handler";

const GET = handler(async () => {
  const probiotics = await prisma.probiotic.findMany();
  return ApiResponse.json(probiotics);
});

export { GET };
