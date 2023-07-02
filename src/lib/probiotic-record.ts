import { type ProbioticRecord } from "@prisma/client";
import { getProbiotics } from "./probiotic";

export async function getTimeSeriesResults(probioticRecords: ProbioticRecord[]) {
  const probiotics = await getProbiotics()

  
  const results = probioticRecords.map(
    (probioticRecord) =>
      probioticRecord.result as { key: string; value: number | null }[]
  );

  const keys = new Set<string>();
  const table: {
    [key: string]: { key: string; [value: string]: string | number | null };
  } = {};

  results.forEach((result, idx) => {
    result.forEach((probiotic) => {
      const { key, value } = probiotic;
      keys.add(probiotic.key);

      if (!table[key]) {
        table[key] = { key, [`value${idx + 1}`]: value };
      } else {
        table[key][`value${idx + 1}`] = value;
      }
    });
  });

  results.forEach((result, idx) => {
    keys.forEach((key) => {
      if (!result.some((probiotic) => probiotic.key === key)) {
        table[key][`value${idx + 1}`] = null;
      }
    });
  });

  return {
    results: Object.values(table),
    keys: Object.keys(Object.values(table)[0] ?? {}) ?? [],
  };
}
