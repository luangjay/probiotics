"use client";

import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { sorted } from "@/lib/rdg";
import { type PatientInfo } from "@/types/user";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { type Column, type SortColumn } from "react-data-grid";

interface TimeSeriesResultsProps {
  patient: PatientInfo & { fullName: string };
  keys: string[];
  timeSeriesResults: {
    probiotic: string;
    [timepoint: string]: string | number;
  }[];
}

export function TimeSeriesResults({
  patient: _patient,
  keys,
  timeSeriesResults,
}: TimeSeriesResultsProps) {
  // States
  const [loading, setLoading] = useState(true);
  const { setPatient } = useSelectPatientStore();
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

  // Component mounted
  useEffect(() => void setLoading(false), []);

  useEffect(() => void setPatient(_patient), [setPatient, _patient]);

  const columns = useMemo<
    readonly Column<{
      probiotic: string;
      [timepoint: string]: string | number;
    }>[]
  >(
    () =>
      keys.map((key) => {
        if (key === "probiotic") {
          return {
            key,
            name: "Probiotic",
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

  const rows = useMemo(
    () => sorted(timeSeriesResults, sortColumns),
    [timeSeriesResults, sortColumns]
  );

  const gridElement = useMemo(
    () =>
      loading ? (
        <>Loading...</>
      ) : (
        <DataGrid
          direction="ltr"
          className="rdg-light flex-1"
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
    <div className="flex h-full flex-col gap-4 p-1">
      <h3 className="flex h-[40px] items-center text-2xl font-semibold">
        Probiotic Records
      </h3>
      {gridElement}
    </div>
  );
}
