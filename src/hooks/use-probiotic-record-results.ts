import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import { csvFileType, xlsFileType, xlsxFileType } from "@/lib/s3";
import { type ProbioticRecordResult } from "@/types/probiotic-record";

export function useProbioticRecordResults(file?: File) {
  const [reader, setReader] = useState<FileReader>();
  const [results, setResults] = useState<ProbioticRecordResult[]>([]);

  const createEmptyResults = async () => {
    const rows = await createEmptyRows(100);
    setResults([...results, ...rows]);
  };

  // Component mounted
  useEffect(() => {
    const createNewResults = async () => {
      const rows = await createEmptyRows(100);
      setResults([...results, ...rows]);
    };
    void createNewResults()

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary", FS: "," });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const results = XLSX.utils.sheet_to_json<ProbioticRecordResult>(sheet, {
        header: ["probiotic", "value"],
        range: 1,
      });
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

  return { results };
}

async function createEmptyRows(count: number) {
  return new Promise<ProbioticRecordResult[]>((resolve) => {
    const rows: ProbioticRecordResult[] = Array.from({ length: count });
    setTimeout(() => resolve(rows), 1000);
  });
}
