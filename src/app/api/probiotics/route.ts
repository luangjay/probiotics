import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/rest";
import { validator } from "../validator";

const GET = validator(async () => {
  const probiotics = await prisma.probiotic.findMany();
  return ApiResponse.json(probiotics);
});

export { GET };
