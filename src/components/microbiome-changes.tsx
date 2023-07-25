"use client";

import { ImportAbundanceFileDialog } from "@/components/import-abundance-file-dialog";
import {
  MicroorganismCell,
  MicroorganismHeaderCell,
} from "@/components/rdg/microorganism-cell";
import { NoRowsFallback } from "@/components/rdg/no-rows-fallback";
import { ReadsHeaderCell } from "@/components/rdg/reads-cell";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { cn } from "@/lib/utils";
import { type MicroorganismRow } from "@/types/microorganism";
import { type PatientRow } from "@/types/patient";
import {
  type MicrobiomeChangeRow,
  type VisitDataRow,
} from "@/types/visit-data";
import { format } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataGrid, { type Column } from "react-data-grid";

interface MicrobiomeChangesProps {
  patient: PatientRow;
  microbiomeChanges: MicrobiomeChangeRow[];
  keys: string[];
  microorganisms: MicroorganismRow[];
  visitDatas: VisitDataRow[];
}

export function MicrobiomeChanges({
  patient,
  microbiomeChanges,
  keys,
  microorganisms,
  visitDatas,
}: MicrobiomeChangesProps) {
  // Initialize
  const [rows, setRows] = useState<MicrobiomeChangeRow[]>(microbiomeChanges);

  // Store
  const { setPatient: setSelectedPatient } = useSelectPatientStore();

  // States
  const [loading, setLoading] = useState(true);
  const [essential, setEssential] = useState(false);
  const [probiotic, setProbiotic] = useState(false);
  const [active, setActive] = useState(false);
  const [normalized, setNormalized] = useState(false);

  const expanded = useMemo<boolean>(
    () => rows.every((row) => row.expanded !== false),
    [rows]
  );

  useEffect(() => void setLoading(false), []);

  useEffect(
    () => void setSelectedPatient(patient),
    [setSelectedPatient, patient]
  );

  // useEffect(() => {
  //   setRows(microbiomeChanges);
  // }, [microbiomeChanges]);

  const total = useCallback(
    (rows: MicrobiomeChangeRow[]) => {
      return rows.reduce<{ [timepoint: string]: number }>((acc, row) => {
        Object.keys(row.timepoints).forEach((timepoint) => {
          acc[timepoint] += !row.expanded ? row.timepoints[timepoint] : 0;
        });
        return acc;
      }, Object.fromEntries(keys.map((key) => [key, 0])));
    },
    [keys]
  );

  const filter = useCallback(
    (rows: MicrobiomeChangeRow[]) => {
      if (essential) {
        rows = rows.filter((row) => row.children || row.essential);
      }
      if (probiotic) {
        rows = rows.filter((row) => row.children || row.probiotic);
      }
      if (active) {
        rows = rows.filter((row) =>
          Object.keys(row.timepoints).reduce(
            (acc, timepoint) => row.timepoints[timepoint] !== 0 || acc,
            false
          )
        );
      }
      return rows;
    },
    [essential, probiotic, active]
  );

  const calculate = useCallback(
    (rows: MicrobiomeChangeRow[]) => {
      rows = filter(
        rows.map((row) =>
          row.children
            ? { ...row, timepoints: total(filter(row.children)) }
            : row
        )
      );
      console.log(rows);
      return rows;
    },
    [total, filter]
  );

  useEffect(() => {
    setRows(calculate(microbiomeChanges));
  }, [microbiomeChanges, calculate]);

  const summaryRows = useMemo<MicrobiomeChangeRow[]>(
    () => [
      {
        microorganism: "Total",
        timepoints: total(rows),
      },
    ],
    [rows, total]
  );

  const formatReads = useCallback(
    (row: MicrobiomeChangeRow, key: string) => {
      const value = row.timepoints[key];
      const total = summaryRows[0].timepoints[key];
      if (value === 0) return null;
      return normalized ? (value / total).toFixed(4) : value;
    },
    [normalized, summaryRows]
  );

  const columns = useMemo<
    readonly Column<MicrobiomeChangeRow, MicrobiomeChangeRow>[]
  >(
    () => [
      {
        key: "microorganism",
        name: "Microorganism",
        frozen: true,
        width: "40%",
        headerCellClass: cn(keys.length === 0 && "!border-r"),
        renderHeaderCell: (p) => (
          <MicroorganismHeaderCell
            {...p}
            expanded={expanded}
            onExpandAll={() => {
              const newRows: MicrobiomeChangeRow[] = [];
              microbiomeChanges.forEach((row) => {
                const children = row.children ?? [];
                row = { ...row, expanded: !expanded };
                newRows.push(row, ...(!expanded ? children : []));
              });
              setRows(calculate(newRows));
            }}
          />
        ),
        cellClass: cn(keys.length === 0 && "!border-r"),
        renderCell: (p) => (
          <MicroorganismCell
            {...p}
            onExpand={() => {
              const rowIdx = rows.findIndex(
                (row) => row.microorganism === p.row.microorganism
              );
              const row = rows[rowIdx];
              const newRows = [...rows];
              const children = filter(row.children ?? []);
              newRows[rowIdx] = { ...row, expanded: !row.expanded };
              if (!row.expanded) {
                newRows.splice(rowIdx + 1, 0, ...children);
              } else {
                newRows.splice(rowIdx + 1, children.length);
              }
              setRows(calculate(newRows));
            }}
          />
        ),
        summaryCellClass: cn(keys.length === 0 && "!border-r"),
        renderSummaryCell: ({ row }) => row.microorganism,
      },
      ...keys.map<Column<MicrobiomeChangeRow, MicrobiomeChangeRow>>(
        (key, idx) => ({
          key,
          name: format(new Date(parseInt(key)), "yyyy-MM-dd"),
          width: "30%",
          headerCellClass: cn(
            "flex items-center justify-between tabular-nums tracking-tighter",
            keys.length === 1 && idx === 0 && "!border-r"
          ),
          renderHeaderCell: (p) => (
            <ReadsHeaderCell {...p} visitData={visitDatas[idx]} />
          ),
          cellClass: cn(
            "text-end tabular-nums tracking-tighter",
            keys.length === 1 && idx === 0 && "!border-r"
          ),
          renderCell: ({ row }) => formatReads(row, key),
          summaryCellClass: cn(
            "text-end tabular-nums tracking-tighter",
            keys.length === 1 && idx === 0 && "!border-r"
          ),
          renderSummaryCell: ({ row }) => formatReads(row, key),
        })
      ),
    ],
    [
      microbiomeChanges,
      visitDatas,
      rows,
      keys,
      expanded,
      formatReads,
      filter,
      calculate,
    ]
  );

  const gridElement = loading ? (
    <div className="flex h-full items-center justify-center">Loading...</div>
  ) : (
    <DataGrid
      direction="ltr"
      className="rdg-light h-full overflow-scroll"
      rows={rows}
      columns={columns}
      bottomSummaryRows={summaryRows}
      headerRowHeight={40}
      rowHeight={40}
      rowKeyGetter={(row) => row.microorganism}
      renderers={{
        noRowsFallback: <NoRowsFallback />,
      }}
    />
  );

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex h-10 items-center justify-between">
        <h3 className="text-2xl font-semibold">Microbiome changes</h3>
        <div className="flex h-full items-center gap-4">
          <Toggle onClick={() => void setEssential((prev) => !prev)}>
            Essential
          </Toggle>
          <Toggle onClick={() => void setProbiotic((prev) => !prev)}>
            Probiotic
          </Toggle>
          <Toggle onClick={() => void setActive((prev) => !prev)}>
            Active
          </Toggle>
          <Toggle onClick={() => void setNormalized((prev) => !prev)}>
            Normalize
          </Toggle>
        </div>
        <ImportAbundanceFileDialog microorganisms={microorganisms} />
      </div>
      <div className="relative flex-1 overflow-auto">
        {gridElement}
        {keys.length === 0 && (
          <div className="absolute bottom-[11px] left-[calc(40%-4px)] right-[11px] top-0 flex items-center justify-center">
            <ImportAbundanceFileDialog
              microorganisms={microorganisms}
              trigger={
                <Button variant="outline" size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Import abundance file
                </Button>
              }
            />
          </div>
        )}
        {keys.length === 1 && (
          <div className="absolute bottom-[11px] left-[calc(70%-4px)] right-[11px] top-0 flex items-center justify-center">
            <ImportAbundanceFileDialog
              microorganisms={microorganisms}
              trigger={
                <Button variant="outline" size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Import abundance file
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
