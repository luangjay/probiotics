import { refineMicroorganism } from "@/components/rdg/microorganism-editor";
import { refineReads } from "@/components/rdg/reads-editor";
import { csvFileType, xlsFileType, xlsxFileType } from "@/lib/file";
import { type MicroorganismRecordRow } from "@/types/microorganism-record";
import { type MicroorganismRecord } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface UseMicroorganismRecordRowsArgs {
  initial?: MicroorganismRecord[];
}

export function useMicroorganismRecordRows(
  file?: File,
  options?: UseMicroorganismRecordRowsArgs
) {
  // Initialize
  const { initial } = { ...options };

  // States
  const [loading, setLoading] = useState(true);
  const [reader, setReader] = useState<FileReader>();
  const [rows, setRows] = useState<MicroorganismRecordRow[]>([]);

  const resetRows = useCallback(async () => {
    if (!initial) {
      const emptyRows = await createEmptyResultRows(0, 20);
      setRows(emptyRows);
      return;
    }
    const rows = initial.map((microorganismRecord, idx) => ({
      idx,
      microorganism: microorganismRecord.microorganism,
      reads: microorganismRecord.reads.toString(),
    }));
    setRows(rows);
  }, [initial]);

  const createEmptyRows = async (
    startIdx: number,
    count: number,
    timeout = 0
  ) => {
    const emptyRows = await createEmptyResultRows(startIdx, count, timeout);
    setRows((prev) => [...prev, ...emptyRows]);
  };

  const exportFile = () => {
    const header = [["Microorganism", "Reads"]];
    const worksheet = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, header);

    const result = rows
      .filter(
        (
          row
        ): row is {
          idx: number;
          microorganism: string;
          reads: string;
        } => row.microorganism !== null && row.reads !== null
      )
      .map((rows) => ({
        probiotic: rows.microorganism,
        value: parseFloat(rows.reads),
      }));
    XLSX.utils.sheet_add_json(worksheet, result, {
      origin: "A2",
      skipHeader: true,
    });

    const csv = XLSX.utils.sheet_to_csv(worksheet, {
      FS: ",",
      forceQuotes: true,
      blankrows: false,
    });
    // const blob = new Blob([csv], { type: "text/csv" });
    const exported = new File([csv], `${file?.name ?? "untitled"}.csv`, {
      type: "text/csv;charset=utf-8",
    });
    return exported;
  };

  // Component mounted
  useEffect(() => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary", FS: "," });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json<{
        microorganism: string | null;
        reads: string | number | null;
      }>(sheet, {
        header: ["microorganism", "reads"],
        range: 1,
      });
      const result: MicroorganismRecordRow[] = rows.map((row, idx) => ({
        idx,
        microorganism: refineMicroorganism(null, row.microorganism),
        reads: refineReads(
          null,
          typeof row.reads === "number" ? row.reads.toString() : row.reads
        ),
      }));
      setRows(result);
    };

    setReader(reader);
    setLoading(false);
  }, []);

  useEffect(() => void resetRows(), [resetRows]);

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
      rows
        .slice(-5)
        .some((row) => row.microorganism !== null || row.reads !== null)
    ) {
      const startIdx = rows.length;
      void createEmptyRows(startIdx, Math.max(20 - startIdx, 5));
    }
  }, [loading, rows]);

  return {
    rows,
    setRows,
    resetRows,
    createEmptyRows,
    exportFile,
  };
}

async function createEmptyResultRows(
  startIdx: number,
  count: number,
  timeout = 0
) {
  return new Promise<MicroorganismRecordRow[]>((resolve) => {
    const rows: MicroorganismRecordRow[] = Array.from(
      { length: count },
      (_, idx) => ({
        idx: startIdx + idx,
        microorganism: null,
        reads: null,
      })
    );
    setTimeout(() => resolve(rows), timeout);
  });
}
