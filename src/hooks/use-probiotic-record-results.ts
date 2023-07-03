import { csvFileType, xlsFileType, xlsxFileType } from "@/lib/s3";
import { type ProbioticRecordResult } from "@/types/probiotic-record";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export function useProbioticRecordResults(file?: File) {
  const [reader, setReader] = useState<FileReader>();
  const [results, setResults] = useState<ProbioticRecordResult[]>([]);

  const resetResults = async () => {
    const rows = await createEmptyRows(100, 0);
    setResults([...rows]);
  };

  const createEmptyResults = async (count: number) => {
    const rows = await createEmptyRows(count);
    setResults((prev) => [...prev, ...rows]);
  };

  const exportFile = () => {
    const worksheet = XLSX.utils.json_to_sheet<ProbioticRecordResult>(results, {
      header: ["probiotic", "value"],
    });
    const csv = XLSX.utils.sheet_to_csv(worksheet, {
      FS: ",",
      forceQuotes: true,
      blankrows: false,
    });
    // const blob = new Blob([csv], { type: "text/csv" });
    const file = new File([csv], "data.csv", { type: "text/csv" });
    console.log(results);
    return file;
  };

  // Component mounted
  useEffect(() => {
    void resetResults();

    const reader = new FileReader();

    reader.onload = async (e) => {
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
      const results: ProbioticRecordResult[] = json.map((result) => ({
        ...result,
        value: result.value.toString(),
      }));
      console.log(results);
      const emptyRows = await createEmptyRows(10);
      setResults([...results, ...emptyRows]);
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

  return { results, setResults, createEmptyResults, exportFile };
}

async function createEmptyRows(count: number, timeout = 1000) {
  return new Promise<ProbioticRecordResult[]>((resolve) => {
    const rows: ProbioticRecordResult[] = Array.from({ length: count }, () => ({
      probiotic: null,
      value: null,
    }));
    setTimeout(() => resolve(rows), timeout);
  });
}
