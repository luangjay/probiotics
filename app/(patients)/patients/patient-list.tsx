"use client";

import { Input } from "@/components/ui/input";
import { filtered, sorted } from "@/lib/rdg";
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
  const { register, control } = useForm<Filter>({ mode: "onChange" });
  const { filter } = useWatch<Filter>({ control });

  const columns = useMemo<Column<PatientInfo>[]>(
    () => [
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
          <Link href={`/patients/${row.id}`} className="h-full w-full">
            A
          </Link>
        ),
      },
    ],
    []
  );

  const rows = useMemo(
    () => filtered(sorted(data, sortColumns), filter || ""),
    [data, sortColumns, filter]
  );

  // const filtered = useMemo<PatientInfo[]>(
  //   () =>
  //     data.filter((row) => {
  //       const { ssn, prefix, firstName, lastName } = filters;
  //       return (
  //         (ssn ? row.ssn.includes(ssn) : true) &&
  //         (prefix ? row.prefix.includes(prefix) : true) &&
  //         (firstName ? row.firstName.includes(firstName) : true) &&
  //         (lastName ? row.lastName.includes(lastName) : true)
  //       );
  //     }),
  //   [data, filters]
  // );

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
        // rowClass={() => "hover:bg-red-500"}
        rowKeyGetter={(row) => row.id}
        sortColumns={sortColumns}
        onSortColumnsChange={setSortColumns}
      />
    ),
    [rows, columns, sortColumns]
  );

  useEffect(() => {
    setLoading(false);
  }, [gridElement]);

  return (
    <div className="flex h-full flex-col overflow-auto">
      <h2 className="mx-1 text-2xl font-semibold">Patients</h2>
      <div className="mx-1 flex justify-end">
        <Input className="w-1/4" {...register("filter")}></Input>
      </div>
      {!loading ? (
        gridElement
      ) : (
        <div className="flex flex-1 items-center justify-center">
          Loading...
        </div>
      )}
      <div className="flex justify-center">
        <AddPatientDialog />
      </div>
    </div>
  );
}
