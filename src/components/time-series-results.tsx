"use client";

import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { type PatientRow } from "@/types/patient";
import { type TimeSeriesResultRow } from "@/types/probiotic-record";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { type Column, type SortColumn } from "react-data-grid";

interface TimeSeriesResultsProps {
  patient: PatientRow;
  timeSeriesResults: TimeSeriesResultRow[];
  timeSeriesResultSummary: TimeSeriesResultRow[];
}

export function TimeSeriesResults({
  patient,
  timeSeriesResults: rows,
  timeSeriesResultSummary: summaryRows,
}: TimeSeriesResultsProps) {
  // Initialize
  const keys = Object.keys(rows[0] ?? {});

  // States
  const [loading, setLoading] = useState(true);
  const { setPatient: setSelectedPatient } = useSelectPatientStore();
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

  // Component mounted
  useEffect(() => void setLoading(false), []);

  useEffect(
    () => void setSelectedPatient(patient),
    [setSelectedPatient, patient]
  );

  const columns = useMemo<
    readonly Column<TimeSeriesResultRow, TimeSeriesResultRow>[]
  >(
    () =>
      keys.map((key) => {
        if (key === "probiotic") {
          return {
            key,
            name: "Probiotic",
            sortable: true,
            minWidth: 300,
            renderSummaryCell: ({ row }) => row.probiotic,
          };
        }
        return {
          key,
          name: key,
          minWidth: 60,
          renderHeaderCell: () => format(new Date(parseInt(key)), "yyyy-MM-dd"),
          renderSummaryCell: ({ row }) => row[key],
        };
      }),
    [keys]
  );

  const gridElement = useMemo(
    () =>
      loading ? (
        <>Loading...</>
      ) : (
        <DataGrid
          direction="ltr"
          className="rdg-light flex-1 overflow-y-scroll"
          rows={rows}
          columns={columns}
          bottomSummaryRows={summaryRows}
          headerRowHeight={40}
          rowHeight={40}
          rowKeyGetter={(row) => row.key}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
          renderers={{
            noRowsFallback: (
              <div style={{ textAlign: "center", gridColumn: "1/-1" }}>
                Nothing to show (´・ω・`)
              </div>
            ),
          }}
        />
      ),
    [loading, rows, columns, sortColumns]
  );

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex h-10 items-center justify-between">
        <h3 className="text-2xl font-semibold">Time series results</h3>
      </div>
      {gridElement}
    </div>
  );
}
