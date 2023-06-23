import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import type { RowData } from "@/types/data-sheet";
import { csvFileType, xlsFileType, xlsxFileType } from "@/lib/utils";

export function useJson(file?: File) {
  const [reader, setReader] = useState<FileReader>();
  const [json, setJson] = useState<RowData[]>();

  useEffect(() => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary", FS: "," });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json<RowData>(sheet);
      setJson(json);
    };

    setReader(reader);
  }, []);

  useEffect(() => {
    if (file && reader) {
      if (file.type === csvFileType) {
        reader.readAsText(file);
      } else if (file.type === xlsFileType || file.type === xlsxFileType) {
        reader.readAsBinaryString(file);
      }
    }
  }, [file, reader]);

  return { json };
}
