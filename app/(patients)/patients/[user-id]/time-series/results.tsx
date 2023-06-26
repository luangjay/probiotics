"use client";

import { useMemo } from "react";
import DataGrid, { type Column } from "react-data-grid";

type Result = { key: string; [value: string]: string | number | null };

interface ResultsProps {
  results: Result[];
  keys: string[];
}

export default function Results({ results, keys }: ResultsProps) {
  const columns = useMemo<readonly Column<Result>[]>(
    () =>
      keys.map((key, idx) => ({
        key,
        name: key === "key" ? "Key" : `Timepoint ${idx}`,
      })),
    [keys]
  );

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <h3 className="text-xl font-semibold leading-normal">
        Probiotic Records
      </h3>
      <DataGrid
        columns={columns}
        rows={results}
        renderers={{
          noRowsFallback: <>Nothing to show...</>,
        }}
        rowKeyGetter={(row) => row.key}
        headerRowHeight={80}
        rowHeight={40}
        className="rdg-light flex-1 gap-px"
      />
    </div>
  );
}
