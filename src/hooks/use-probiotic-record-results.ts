import { csvFileType, xlsFileType, xlsxFileType } from "@/lib/file";
import {
  type ProbioticRecordResult,
  type ProbioticRecordResultRow,
} from "@/types/api/probiotic-record";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export function useProbioticRecordResults(file?: File) {
  const [loading, setLoading] = useState(true);
  const [reader, setReader] = useState<FileReader>();
  const [results, setResults] = useState<ProbioticRecordResultRow[]>([]);

  useEffect(() => void setLoading(false), []);

  const resetResults = async () => {
    const rows = await createEmptyRows(0, 20);
    setResults([...rows]);
  };

  const createEmptyResults = async (startIdx: number, count: number) => {
    const rows = await createEmptyRows(startIdx, count);
    console.log("on: createEmptyResults");
    setResults((prev) => [...prev, ...rows]);
  };

  const exportFile = () => {
    const worksheet = XLSX.utils.json_to_sheet<ProbioticRecordResult>(
      (
        results.filter(
          (result) => result.probiotic !== null && result.value !== null
        ) as { probiotic: string; value: string }[]
      ).map((result) => ({
        Probiotic: result.probiotic,
        Value: parseFloat(result.value),
      })),
      {
        header: ["Probiotic", "Value"],
      }
    );
    const csv = XLSX.utils.sheet_to_csv(worksheet, {
      FS: ",",
      forceQuotes: true,
      blankrows: false,
    });
    // const blob = new Blob([csv], { type: "text/csv" });
    const file = new File([csv], "data.csv", { type: "text/csv" });
    return file;
  };

  // Component mounted
  useEffect(() => {
    void resetResults();

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary", FS: "," });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json<{
        probiotic: string;
        value: number;
      }>(sheet, {
        header: ["probiotic", "value"],
        range: 1,
      });
      const results: ProbioticRecordResultRow[] = json.map((result, idx) => ({
        idx,
        probiotic: result.probiotic,
        value: result.value.toString(),
      }));
      setResults(results);
    };

    setReader(reader);
  }, []);

  useEffect(() => {
    if (file && reader) {
      switch (file.type) {
        case csvFileType:
          reader.readAsText(file);
          break;
        case xlsFileType:
        case xlsxFileType:
          reader.readAsBinaryString(file);
          break;
      }
    }
  }, [file, reader]);

  useEffect(() => {
    if (
      !loading &&
      (results.length < 5 ||
        results
          .slice(-5)
          .some((result) => result.probiotic !== null || result.value !== null))
    ) {
      const startIdx = results.length;
      void createEmptyResults(startIdx, startIdx < 15 ? 20 - startIdx : 5);
    }
  }, [loading, results]);

  return { results, setResults, resetResults, createEmptyResults, exportFile };
}

async function createEmptyRows(startIdx: number, count: number, timeout = 0) {
  return new Promise<ProbioticRecordResultRow[]>((resolve) => {
    const rows: ProbioticRecordResultRow[] = Array.from(
      { length: count },
      (_, idx) => ({
        idx: startIdx + idx,
        probiotic: null,
        value: null,
      })
    );
    setTimeout(() => resolve(rows), timeout);
  });
}
