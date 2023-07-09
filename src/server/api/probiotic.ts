// import { prisma } from "@/lib/prisma";
// import { alias } from "@/lib/probiotic";
// import { type ProbioticWithComputed } from "@/types/probiotic";

// export async function getProbiotics(): Promise<ProbioticWithComputed[]> {
//   const probiotics = await prisma.probiotic.findMany();
//   return probiotics.map((probiotic) => ({
//     ...probiotic,
//     alias: alias(probiotic.name),
//   }));
// }
