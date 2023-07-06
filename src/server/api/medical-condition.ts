import { prisma } from "@/server/db"

export async function getMedicalConditions() {
  const medicalConditions = await prisma.medicalCondition.findMany()
  return medicalConditions
}