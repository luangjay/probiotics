"use client";

import { NoRowsFallback } from "@/components/rdg/no-rows-fallback";
import { TimeSeriesProbioticCell } from "@/components/rdg/time-series-probiotic-cell";
import { TimeSeriesProbioticHeader } from "@/components/rdg/time-series-probiotic-header";
import { Toggle } from "@/components/ui/toggle";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { formatTimeSeriesValue } from "@/lib/rdg";
import { type PatientRow } from "@/types/patient";
import { type TimeSeriesResultRow } from "@/types/probiotic-record";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { type Column } from "react-data-grid";

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
  const [rows, setRows] = useState<TimeSeriesResultRow[]>(timeSeriesResults);
  const keys = Object.keys(rows[0]?.timepoints ?? { probiotic: null });

  // Store
  const { setPatient: setSelectedPatient } = useSelectPatientStore();

  // States
  const [loading, setLoading] = useState(true);
  const [normalized, setNormalized] = useState(false);

  // Component mounted
  useEffect(() => void setLoading(false), []);

  useEffect(
    () => void setSelectedPatient(patient),
    [setSelectedPatient, patient]
  );

  const expanded = useMemo<boolean>(
    () => rows.every((row) => row.expanded !== false),
    [rows]
  );

  const columns = useMemo<
    readonly Column<TimeSeriesResultRow, TimeSeriesResultRow>[]
  >(
    () => [
      {
        key: "probiotic",
        name: "Microorganism",
        width: "50%",
        renderHeaderCell: (p) => (
          <TimeSeriesProbioticHeader
            {...p}
            expanded={expanded}
            onExpandAll={() => {
              const newRows: TimeSeriesResultRow[] = [];
              timeSeriesResults.forEach((row) => {
                const children = row.children ?? [];
                row = { ...row, expanded: !expanded };
                newRows.push(row, ...(!expanded ? children : []));
              });
              setRows(newRows);
            }}
          />
        ),
        renderCell: (p) => (
          <TimeSeriesProbioticCell
            {...p}
            onExpand={() => {
              const rowIdx = rows.findIndex(
                (row) => row.probiotic === p.row.probiotic
              );
              const row = rows[rowIdx];
              const newRows = [...rows];
              const children = row.children ?? [];
              newRows[rowIdx] = { ...row, expanded: !row.expanded };
              if (!row.expanded) {
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
      ...keys
        .slice(-2)
        .map<Column<TimeSeriesResultRow, TimeSeriesResultRow>>((key) => ({
          key,
          name: key,
          width: "25%",
          cellClass: "tabular-nums tracking-tighter text-end",
          renderHeaderCell: () => format(new Date(parseInt(key)), "yyyy-MM-dd"),
          renderCell: ({ row }) =>
            formatTimeSeriesValue(
              normalized,
              row.timepoints[key],
              summaryRows[0].timepoints[key]
            ),
          summaryCellClass: "tabular-nums tracking-tighter text-end",
          renderSummaryCell: ({ row }) =>
            formatTimeSeriesValue(
              normalized,
              row.timepoints[key],
              summaryRows[0].timepoints[key]
            ),
        })),
    ],
    [rows, keys, normalized, summaryRows, expanded, timeSeriesResults]
  );

  const gridElement = useMemo(
    () =>
      loading ? (
        <div className="flex flex-1 items-center justify-center">
          Loading...
        </div>
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
            noRowsFallback: <NoRowsFallback />,
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
