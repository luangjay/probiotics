"use client";

import { Toggle } from "@/components/ui/toggle";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { type PatientRow } from "@/types/patient";
import { type TimeSeriesResultRow } from "@/types/probiotic-record";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import DataGrid, {
  type Column,
  type RenderCellProps,
  type RenderSummaryCellProps,
} from "react-data-grid";
import { ProbioticCellExpander } from "./rdg/probiotic-cell-expander";

interface TimeSeriesResultsProps {
  patient: PatientRow;
  timeSeriesResults: TimeSeriesResultRow[];
  timeSeriesResultSummary: TimeSeriesResultRow[];
}

export function TimeSeriesResults({
  patient,
  timeSeriesResults,
  timeSeriesResultSummary: summaryRows,
}: TimeSeriesResultsProps) {
  // Initialize
  const [rows, setRows] = useState(timeSeriesResults);
  const keys = Object.keys(rows[0]?.timepoints ?? { probiotic: null });

  // Store
  const { setPatient: setSelectedPatient } = useSelectPatientStore();

  // States
  const [loading, setLoading] = useState(true);
  const [normalized, setNormalized] = useState(false);

  console.log(summaryRows);

  // Component mounted
  useEffect(() => void setLoading(false), []);

  useEffect(
    () => void setSelectedPatient(patient),
    [setSelectedPatient, patient]
  );

  const columns = useMemo<
    readonly Column<TimeSeriesResultRow, TimeSeriesResultRow>[]
  >(
    () => [
      {
        key: "probiotic",
        name: "Probiotic",
        minWidth: 300,
        renderCell: (p) => (
          <ProbioticCellExpander
            {...p}
            expanded={p.row.expanded}
            onCellExpand={() => {
              /*** Do something ***/
              const newRows = [...rows];
              const rowIdx = newRows.findIndex(
                (row) => row.probiotic === p.row.probiotic
              );
              const row = newRows[rowIdx];
              const children = row.children ?? [];
              row.expanded = !row.expanded;
              if (row.expanded) {
                newRows.splice(rowIdx + 1, 0, ...children);
              } else {
                newRows.splice(rowIdx + 1, children.length);
              }
              setRows(newRows);
            }}
          />
        ),
        renderSummaryCell: ({ row }) => row.probiotic,
      },
      ...keys.map((key) => ({
        key,
        name: key,
        minWidth: 60,
        renderHeaderCell: () => format(new Date(parseInt(key)), "yyyy-MM-dd"),
        renderCell: ({
          row,
        }: RenderCellProps<TimeSeriesResultRow, TimeSeriesResultRow>) =>
          formatValue(
            normalized,
            row.timepoints[key],
            summaryRows[0].timepoints[key]
          ),
        renderSummaryCell: ({
          row,
        }: RenderSummaryCellProps<TimeSeriesResultRow, TimeSeriesResultRow>) =>
          formatValue(
            normalized,
            row.timepoints[key],
            summaryRows[0].timepoints[key]
          ),
      })),
    ],
    // keys.map((key) => {
    //   if (key === "probiotic") {
    //     return {
    //       key,
    //       name: "Probiotic",
    //       minWidth: 300,
    //       renderSummaryCell: ({ row }) => row.probiotic,
    //     };
    //   }
    //   if (key === "data") {
    //     return {
    //       key,
    //       name: key,
    //       minWidth: 60,
    //       renderHeaderCell: () =>
    //         format(new Date(parseInt(key)), "yyyy-MM-dd"),
    //       renderCell: ({ row }) =>
    //         formatValue(normalized, row.data[key], summaryRows.data[0][key]),
    //       renderSummaryCell: ({ row }) =>
    //         formatValue(normalized, row.data[key], summaryRows.data[0][key]),
    //     };
    //   }
    // })
    [keys, normalized, summaryRows]
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
          renderers={{
            noRowsFallback: (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ textAlign: "center", gridColumn: "1/-1" }}
              >
                Nothing to show (´・ω・`)
              </div>
            ),
          }}
        />
      ),
    [loading, rows, columns, summaryRows]
  );

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex h-10 items-center justify-between">
        <h3 className="text-2xl font-semibold">Time series results</h3>
        <Toggle onClick={() => void setNormalized((prev) => !prev)}>
          Normalize
        </Toggle>
      </div>
      {gridElement}
    </div>
  );
}

function formatValue(
  normalized: boolean,
  value: string | number,
  total: string | number
) {
  if (value === 0) return null;
  return normalized && typeof total === "number" && typeof value === "number"
    ? (value / total).toFixed(4)
    : value;
}
