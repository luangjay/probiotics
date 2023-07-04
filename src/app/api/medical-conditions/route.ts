import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/api";
import { validator } from "../validator";

const GET = validator(async () => {
  const medicalConditions = await prisma.medicalCondition.findMany();
  return ApiResponse.json(medicalConditions);
});

export { GET };
