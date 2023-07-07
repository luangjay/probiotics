import { prisma } from "@/server/db";

export async function getProbiotics() {
  const probiotics = await prisma.probiotic.findMany();
  return probiotics;
}
