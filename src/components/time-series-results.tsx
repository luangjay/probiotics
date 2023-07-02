"use client";

import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { alias } from "@/lib/probiotic";
import { type PatientInfo } from "@/types/user";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { type Column } from "react-data-grid";

type Result = { key: string; [value: string]: string | number | null };

interface TimeSeriesResultsProps {
  patient: PatientInfo & { fullName: string };
  timeSeriesResults: Result[];
  keys: string[];
}

export function TimeSeriesResults({
  patient: _patient,
  timeSeriesResults: rows,
  keys,
}: TimeSeriesResultsProps) {
  // States
  const [loading, setLoading] = useState(true);
  const { setPatient } = useSelectPatientStore();

  // Component mounted
  useEffect(() => void setLoading(false), []);

  useEffect(() => void setPatient(_patient), [setPatient, _patient]);

  const columns = useMemo<readonly Column<Result>[]>(
    () =>
      keys.map((key, idx) => {
        if (key === "key") {
          return {
            key,
            name: "Probiotic",
            renderCell: ({ row }) => <>{alias(row.key)}</>,
          };
        }
        return {
          key,
          name: `Timepoint ${idx}`,
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
          rows={rows}
          columns={columns}
          renderers={{
            noRowsFallback: <>Nothing to show...</>,
          }}
          rowKeyGetter={(row) => row.key}
          headerRowHeight={80}
          rowHeight={40}
          className="rdg-light flex-1"
        />
      ),
    [loading, rows, columns]
  );

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-auto">
      <h3 className="flex h-[40px] items-center text-2xl font-semibold leading-normal">
        Probiotic Records
      </h3>
      {gridElement}
    </div>
  );
}
