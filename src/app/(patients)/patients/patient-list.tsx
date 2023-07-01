"use client";

import { Input } from "@/components/ui/input";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { filtered, sorted } from "@/lib/rdg";
import { type PatientInfo } from "@/types/user";
import { cx } from "cva";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { Row, type Column, type SortColumn } from "react-data-grid";
import { useForm, useWatch } from "react-hook-form";
import AddPatientDialog from "./add-patient-dialog";
import { selectPatientColumn } from "./select-patient-column";

interface PatientListProps {
  data: PatientInfo[];
}

interface Filter {
  filter: string;
}

export default function PatientList({ data }: PatientListProps) {
  const [loading, setLoading] = useState(true);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

  // Component mounted
  useEffect(() => {
    setLoading(false);
  }, []);

  // Select rows
  const { patient: selectedPatient, setPatient: setSelectedPatient } =
    useSelectPatientStore();
  const rowKeyGetter = (row: PatientInfo) => row.id;

  // Filter rows
  const { register, control } = useForm<Filter>({ mode: "onChange" });
  const { filter } = useWatch<Filter>({ control });

  // Columns
  const columns = useMemo<Column<PatientInfo>[]>(
    () => [
      selectPatientColumn,
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
            onClick={() => void setSelectedPatient(row)}
          >
            View
          </Link>
        ),
      },
    ],
    [setSelectedPatient]
  );

  const rows = useMemo(
    () => filtered(sorted(data, sortColumns), filter),
    [data, sortColumns, filter]
  );

  const gridElement = useMemo(
    () =>
      loading ? (
        <div className="mx-1 flex flex-1 items-center justify-center">
          Loading...
        </div>
      ) : (
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
            noRowsFallback: (
              <div style={{ textAlign: "center", gridColumn: "1/-1" }}>
                Nothing to show (´・ω・`)
              </div>
            ),
            renderRow: (key, p) =>
              key !== selectedPatient?.id ? (
                <Row {...p} key={key} />
              ) : (
                <Row {...p} aria-selected key={key} />
              ),
          }}
          rowKeyGetter={rowKeyGetter}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
        />
      ),
    [loading, rows, columns, sortColumns, selectedPatient]
  );

  return (
    <div className="flex h-full flex-col overflow-auto">
      <h2 className="mx-1 text-2xl font-semibold">Patients</h2>
      <div className="mx-1 flex justify-end">
        <Input
          {...register("filter")}
          id="filter"
          className="w-1/4"
          placeholder="Filter"
        />
      </div>
      {gridElement}
      <div className="flex justify-center">
        <AddPatientDialog />
      </div>
    </div>
  );
}
