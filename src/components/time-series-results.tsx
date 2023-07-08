"use client";

import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { type PatientWithAll } from "@/types/patient";
import { type TimeSeriesResult } from "@/types/probiotic-record";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { type Column, type SortColumn } from "react-data-grid";

interface TimeSeriesResultsProps {
  patient: PatientWithAll;
  timeSeriesResults: TimeSeriesResult[];
}

export function TimeSeriesResults({
  patient: patientWithAll,
  timeSeriesResults: rows,
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
    () => void setSelectedPatient(patientWithAll),
    [setSelectedPatient, patientWithAll]
  );

  const columns = useMemo<readonly Column<TimeSeriesResult>[]>(
    () =>
      keys.map((key) => {
        if (key === "probiotic") {
          return {
            key,
            name: "Probiotic",
            width: 300,
            sortable: true,
          };
        }
        return {
          key,
          name: key,
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
