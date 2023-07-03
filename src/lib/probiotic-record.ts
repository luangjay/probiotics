import prisma from "@/lib/prisma";
import { alias } from "@/lib/probiotic";
import { type TimeSeriesResult } from "@/types/probiotic-record";
import { type ProbioticRecord } from "@prisma/client";

export async function getProbiotics() {
  const probiotics = await prisma.probiotic.findMany();
  return probiotics.map((probiotic) => ({
    ...probiotic,
    alias: alias(probiotic.name),
  }));
}

export async function getTimeSeriesResults(
  probioticRecords: ProbioticRecord[]
): Promise<{
  keys: string[];
  timeSeriesResults: TimeSeriesResult[];
}> {
  const probiotics = await getProbiotics();
  const keys = new Set<string>();

  const table = probiotics.map((probiotic) =>
    probioticRecords.map((probioticRecord) => {
      const result = probioticRecord.result as {
        [name: string]: number | undefined;
      };
      const key = probiotic.name;
      const value = result[key];
      if (value === undefined) {
        return null;
      }
      keys.add(alias(key));
      return value;
    })
  );

  const results = probiotics.map((probiotic, idx) => {
    if (!keys.has(probiotic.alias)) {
      return null;
    }
    const values = table[idx];
    return Object.fromEntries(
      values.map((value, idx) => [
        probioticRecords[idx].createdAt.toLocaleString(),
        value,
      ])
    );
  });

  const timeSeriesResults: TimeSeriesResult[] = probiotics
    .map((probiotic, idx) => ({
      probiotic: probiotic.alias,
      ...results[idx],
    }))
    .filter((result) => keys.has(result.probiotic));

  return {
    keys: Object.keys(timeSeriesResults[0] ?? {}),
    timeSeriesResults,
  };
}

// import { getProbiotics } from "@/lib/probiotic";
// import { type ProbioticRecord } from "@prisma/client";

// export async function getTimeSeriesResults(
//   probioticRecords: ProbioticRecord[]
// ) {
//   const probiotics = await getProbiotics();

//   const results = probioticRecords.map(
//     (probioticRecord) =>
//       probioticRecord.result as { key: string; value: number | null }[]
//   );

//   const keys = new Set<string>();
//   const table: {
//     [key: string]: { key: string; [value: string]: string | number | null };
//   } = {};

//   results.forEach((result, idx) => {
//     result.forEach((probiotic) => {
//       const { key, value } = probiotic;
//       keys.add(probiotic.key);

//       if (!table[key]) {
//         table[key] = { key, [`value${idx + 1}`]: value };
//       } else {
//         table[key][`value${idx + 1}`] = value;
//       }
//     });
//   });

//   results.forEach((result, idx) => {
//     keys.forEach((key) => {
//       if (!result.some((probiotic) => probiotic.key === key)) {
//         table[key][`value${idx + 1}`] = null;
//       }
//     });
//   });

//   return {
//     results: Object.values(table),
//     keys: Object.keys(Object.values(table)[0] ?? {}) ?? [],
//   };
// }
