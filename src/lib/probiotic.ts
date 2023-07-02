import prisma from "@/lib/prisma";

export async function getProbiotics() {
  const probiotics = await prisma.probiotic.findMany();
  return probiotics;
}

export function alias(name: string) {
  return name.split(";").at(-1);
}
