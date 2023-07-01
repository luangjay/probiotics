import { ApiResponse } from "@/types/api";
import prisma from "@/lib/prisma";

import { validator } from "../validator";

const GET = validator(async () => {
  const probiotics = await prisma.probiotic.findMany();
  return ApiResponse.json(probiotics);
});

export { GET };
