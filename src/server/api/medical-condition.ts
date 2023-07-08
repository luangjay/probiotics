import { prisma } from "@/lib/prisma";

export async function getMedicalConditions() {
  const medicalConditions = await prisma.medicalCondition.findMany();
  return medicalConditions;
}
