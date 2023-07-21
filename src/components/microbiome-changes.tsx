"use client";

import { NewVisitDataDialog } from "@/components/new-visit-data-dialog";
import { NoRowsFallback } from "@/components/rdg/no-rows-fallback";
import { TimeSeriesProbioticCell } from "@/components/rdg/time-series-probiotic-cell";
import { TimeSeriesProbioticHeader } from "@/components/rdg/time-series-probiotic-header";
import { Toggle } from "@/components/ui/toggle";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { formatReads } from "@/lib/rdg";
import { cn, sleep } from "@/lib/utils";
import { type MicroorganismRow } from "@/types/microorganism";
import { type PatientRow } from "@/types/patient";
import { type MicrobiomeChangeRow } from "@/types/visit-data";
import { format } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import DataGrid, { type Column, type DataGridHandle } from "react-data-grid";

interface MicrobiomeChangesProps {
  patient: PatientRow;
  microbiomeChanges: MicrobiomeChangeRow[];
  microbiomeChangeSummary: MicrobiomeChangeRow[];
  microorganisms: MicroorganismRow[];
}

export function MicrobiomeChanges({
  patient,
  microbiomeChanges,
  microbiomeChangeSummary: summaryRows,
  microorganisms,
}: MicrobiomeChangesProps) {
  // Initialize
  const [rows, setRows] = useState<MicrobiomeChangeRow[]>(microbiomeChanges);
  const keys = Object.keys(rows[0]?.timepoints ?? { probiotic: null });

  // Store
  const { setPatient: setSelectedPatient } = useSelectPatientStore();

  // States
  const [loading, setLoading] = useState(true);
  const [normalized, setNormalized] = useState(false);

  useEffect(
    () => void setSelectedPatient(patient),
    [setSelectedPatient, patient]
  );

  const expanded = useMemo<boolean>(
    () => rows.every((row) => row.expanded !== false),
    [rows]
  );

  const columns = useMemo<
    readonly Column<MicrobiomeChangeRow, MicrobiomeChangeRow>[]
  >(
    () => [
      {
        key: "probiotic",
        name: "Microorganism",
        frozen: true,
        width: "40%",
        headerCellClass: cn(keys.length === 0 && "!border-r"),
        renderHeaderCell: (p) => (
          <TimeSeriesProbioticHeader
            {...p}
            expanded={expanded}
            onExpandAll={() => {
              const newRows: MicrobiomeChangeRow[] = [];
              microbiomeChanges.forEach((row) => {
                const children = row.children ?? [];
                row = { ...row, expanded: !expanded };
                newRows.push(row, ...(!expanded ? children : []));
              });
              setRows(newRows);
            }}
          />
        ),
        cellClass: cn(keys.length === 0 && "!border-r"),
        renderCell: (p) => (
          <TimeSeriesProbioticCell
            {...p}
            onExpand={() => {
              const rowIdx = rows.findIndex(
                (row) => row.microorganism === p.row.microorganism
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
        summaryCellClass: cn(keys.length === 0 && "!border-r"),
        renderSummaryCell: ({ row }) => row.microorganism,
      },
      ...keys.map<Column<MicrobiomeChangeRow, MicrobiomeChangeRow>>(
        (key, idx) => ({
          key,
          name: key,
          width: "30%",
          headerCellClass: cn(
            "text-end tabular-nums tracking-tighter",
            keys.length === 1 && idx === 0 && "!border-r"
          ),
          renderHeaderCell: () => format(new Date(parseInt(key)), "yyyy-MM-dd"),
          cellClass: cn(
            "text-end tabular-nums tracking-tighter",
            keys.length === 1 && idx === 0 && "!border-r"
          ),
          renderCell: ({ row }) =>
            formatReads(
              normalized,
              row.timepoints[key],
              summaryRows[0].timepoints[key]
            ),
          summaryCellClass: cn(
            "text-end tabular-nums tracking-tighter",
            keys.length === 1 && idx === 0 && "!border-r"
          ),
          renderSummaryCell: ({ row }) =>
            formatReads(
              normalized,
              row.timepoints[key],
              summaryRows[0].timepoints[key]
            ),
        })
      ),
    ],
    [microbiomeChanges, rows, keys, summaryRows, expanded, normalized]
  );

  // Ref
  const ref = useRef<DataGridHandle | null>(null);

  const gridElement = useMemo(
    () =>
      loading ? (
        <div className="flex flex-1 items-center justify-center">
          Loading...
        </div>
      ) : (
        <DataGrid
          ref={ref}
          direction="ltr"
          className="rdg-light h-full overflow-scroll"
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

  useEffect(() => {
    const loadRdg = async () => {
      ref.current?.scrollToCell({ idx: keys.length });
      await sleep(100);
      setLoading(false);
    };
    void loadRdg();
  }, [ref, keys]);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex h-10 items-center justify-between">
        <h3 className="text-2xl font-semibold">Microbiome changes</h3>
        <div className="flex h-full items-center gap-4">
          <Toggle onClick={() => void setNormalized((prev) => !prev)}>
            Normalize
          </Toggle>
          <NewVisitDataDialog microorganisms={microorganisms} />
        </div>
      </div>
      <div className="relative flex-1 overflow-auto">
        {gridElement}
        {keys.length === 0 && (
          <div className="absolute bottom-[11px] left-[calc(40%-4px)] right-[11px] top-0 flex items-center justify-center">
            aaabb
          </div>
        )}
        {keys.length === 1 && (
          <div className="absolute bottom-[11px] left-[calc(70%-4px)] right-[11px] top-0 flex items-center justify-center">
            aaabb
          </div>
        )}
      </div>
    </div>
  );
}
