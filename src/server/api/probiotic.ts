import { alias } from "@/lib/api/probiotic";
import { prisma } from "@/server/db";
import { type ProbioticWithComputed } from "@/types/api/probiotic";

export async function getProbiotics(): Promise<ProbioticWithComputed[]> {
  const probiotics = await prisma.probiotic.findMany();
  return probiotics.map((probiotic) => ({
    ...probiotic,
    alias: alias(probiotic.name),
  }));
}
