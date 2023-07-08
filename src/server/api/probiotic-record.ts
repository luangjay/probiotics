import { alias } from "@/lib/probiotic";
import { getProbiotics } from "@/server/api/probiotic";
import { type TimeSeriesResult } from "@/types/probiotic-record";
import { type ProbioticRecord } from "@prisma/client";

export async function getTimeSeriesResults(
  probioticRecords: ProbioticRecord[]
) {
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

  return timeSeriesResults;
}
