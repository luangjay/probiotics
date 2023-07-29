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
import { cn, union } from "@/lib/utils";
import { type MicroorganismRow } from "@/types/microorganism";
import { type PatientRow } from "@/types/patient";
import { type ProbioticBrandRow } from "@/types/probiotic-brand";
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
    () => rows.filter((row) => row.children).every((row) => row.expanded),
    [rows]
  );

  useEffect(() => void setLoading(false), []);

  useEffect(
    () => void setSelectedPatient(patient),
    [setSelectedPatient, patient]
  );

  /* BEGIN HELL */
  const total = useCallback(
    (org: MicrobiomeChangeRow, rows: MicrobiomeChangeRow[]) =>
      rows.reduce<MicrobiomeChangeRow>(
        (acc, row) => {
          keys.forEach((key) => {
            acc.timepoints[key] += !row.expanded ? row.timepoints[key] : 0;
            // BUG PLS FIX: cannot use set of objects because of references
            acc.probioticBrands[key] = Array.from(
              union(
                new Set(
                  acc.probioticBrands[key] ?? new Set<ProbioticBrandRow>()
                ),
                new Set(
                  !row.expanded &&
                  row.timepoints[key] &&
                  row.probioticBrands[key] !== undefined
                    ? row.probioticBrands[key]
                    : new Set<ProbioticBrandRow>()
                )
              )
            );
          });
          acc.probiotic ||= !row.expanded ? row.probiotic : false;
          acc.essential ||= !row.expanded ? row.essential : false;
          acc.active ||= !row.expanded ? row.active : false;
          return acc;
        },
        {
          ...org,
          timepoints: Object.fromEntries(keys.map((key) => [key, 0])),
          probiotic: false,
          essential: false,
          active: false,
        }
      ),
    [keys]
  );

  const filter = useCallback(
    (rows: MicrobiomeChangeRow[]) => {
      const fn = (row: MicrobiomeChangeRow) =>
        (!probiotic || row.probiotic) &&
        (!essential || row.essential) &&
        (!active || row.active);
      return rows
        .map((row) => {
          if (!row.children) return row;
          row.children = row.children.filter(fn);
          return total(row, row.children);
        })
        .filter(fn);
    },
    [total, essential, probiotic, active]
  );

  const calculate = useCallback(
    (rows: MicrobiomeChangeRow[]) => {
      // Get filtered original rows, keep expanded states and kill child rows
      const newRows = filter(
        microbiomeChanges.map((microbiomeChange) => {
          if (!microbiomeChange.children) return microbiomeChange;
          const row = rows.find(
            (row) => row.microorganism === microbiomeChange.microorganism
          );
          return {
            ...microbiomeChange,
            expanded: row?.expanded ?? false,
          };
        })
      );

      // Revive child rows
      rows
        .filter((row) => row.expanded)
        .forEach((row) => {
          const rowIdx = newRows.findIndex(
            (newRow) => row.microorganism === newRow.microorganism
          );
          const children = filter(row.children ?? []);
          newRows.splice(rowIdx + 1, 0, ...children);
        });

      return newRows;
    },
    [microbiomeChanges, filter]
  );

  const summaryRows = useMemo<MicrobiomeChangeRow[]>(() => {
    const org: MicrobiomeChangeRow = {
      microorganism: "Total",
      timepoints: Object.fromEntries(keys.map((key) => [key, 0])),
      probioticBrands: Object.fromEntries(keys.map((key) => [key, []])),
    };
    return [total(org, rows)];
  }, [rows, keys, total]);

  useEffect(() => {
    setRows((prev) => calculate(prev));
  }, [microbiomeChanges, calculate]);

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
              rows
                .filter((row) => row.children)
                .forEach((row) => {
                  const children = filter(row.children ?? []);
                  row = { ...row, expanded: !expanded };
                  newRows.push(row, ...(!expanded ? children : []));
                });
              setRows(filter(newRows));
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
              setRows(filter(newRows));
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
            <ReadsHeaderCell
              {...p}
              visitData={visitDatas[idx]}
              probioticBrands={summaryRows[0].probioticBrands[key]}
            />
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
    [visitDatas, keys, rows, summaryRows, expanded, formatReads, filter]
  );
  /* END HELL */

  const gridElement = loading ? (
    <DataGrid
      rows={[]}
      columns={columns}
      headerRowHeight={40}
      rowHeight={40}
      enableVirtualization={false}
      className="h-full"
    />
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
          <Toggle onClick={() => void setProbiotic((prev) => !prev)}>
            Probiotic
          </Toggle>
          <Toggle onClick={() => void setEssential((prev) => !prev)}>
            Essential
          </Toggle>
          <Toggle onClick={() => void setActive((prev) => !prev)}>
            Active
          </Toggle>
        </div>
        <div className="flex h-full items-center gap-4">
          <Toggle onClick={() => void setNormalized((prev) => !prev)}>
            Normalize
          </Toggle>
          <ImportAbundanceFileDialog microorganisms={microorganisms} />
        </div>
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
