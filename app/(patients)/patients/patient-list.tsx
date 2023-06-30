"use client";

import { noRowsFallback } from "@/components/rdg/no-rows-fallback";
import { renderRow } from "@/components/rdg/render-row";
import { selectColumn } from "@/components/rdg/select-column";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRowSelection } from "@/hooks/use-row-selection";
import { filtered, sorted } from "@/lib/rdg";
import { cn } from "@/lib/utils";
import { type RowKeyGetter } from "@/types/rdg";
import { type PatientInfo } from "@/types/user";
import { cx } from "cva";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { type Column, type SortColumn } from "react-data-grid";
import { useForm, useWatch } from "react-hook-form";
import AddPatientDialog from "./add-patient-dialog";

interface PatientListProps {
  data: PatientInfo[];
}

interface Filter {
  filter: string;
}

export default function PatientList({ data }: PatientListProps) {
  const [loading, setLoading] = useState(true);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

  // Select rows
  const { key: selectedRowKey } = useRowSelection();
  const rowKeyGetter: RowKeyGetter<PatientInfo> = (row) => row.id;

  // Filter rows
  const { register, control } = useForm<Filter>({ mode: "onChange" });
  const { filter } = useWatch<Filter>({ control });

  // Columns
  const columns = useMemo<Column<PatientInfo>[]>(
    () => [
      selectColumn({ rowKeyGetter }),
      {
        key: "ssn",
        name: "SSN",
        cellClass: cx("font-mono"),
      },
      {
        key: "prefix",
        name: "Prefix",
      },
      {
        key: "firstName",
        name: "First Name",
      },
      {
        key: "lastName",
        name: "Last Name",
      },
      {
        key: "actions",
        name: "Actions",
        renderCell: ({ row }) => (
          <Link
            href={`/patients/${row.id}`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "px-2 py-0 text-xs"
            )}
          >
            View
          </Link>
        ),
      },
    ],
    []
  );

  const rows = useMemo(
    () => filtered(sorted(data, sortColumns), filter),
    [data, sortColumns, filter]
  );

  const gridElement = useMemo(
    () => (
      <DataGrid
        direction="ltr"
        className="rdg-light mx-1 my-4 flex-1"
        rows={rows}
        columns={columns}
        headerRowHeight={40}
        rowHeight={40}
        defaultColumnOptions={{
          sortable: true,
        }}
        renderers={{
          noRowsFallback,
          renderRow: (key, p) => renderRow<PatientInfo>(key, p, selectedRowKey),
        }}
        rowKeyGetter={rowKeyGetter}
        sortColumns={sortColumns}
        onSortColumnsChange={setSortColumns}
      />
    ),
    [rows, columns, sortColumns, selectedRowKey]
  );

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="flex h-full flex-col overflow-auto">
      <h2 className="mx-1 text-2xl font-semibold">Patients</h2>
      <div className="mx-1 flex justify-end">
        <Input className="w-1/4" {...register("filter")}></Input>
      </div>
      {!loading ? (
        gridElement
      ) : (
        <div className="mx-1 flex flex-1 items-center justify-center">
          Loading...
        </div>
      )}
      <div className="flex justify-center">
        <AddPatientDialog />
      </div>
    </div>
  );
}
