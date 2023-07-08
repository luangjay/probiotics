import { type Probiotic } from "@prisma/client";

export type ProbioticWithComputed = Probiotic & { alias: string };
