import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { handler } from "../handler";

const GET = handler(async () => {
  const medicalConditions = await prisma.medicalCondition.findMany();
  return ApiResponse.json(medicalConditions);
});

export { GET };
