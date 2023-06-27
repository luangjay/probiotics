"use client";

import { FilterRenderer } from "@/components/renderers/filter-renderer";
import { Input } from "@/components/ui/input";
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

export default function PatientList({ data }: PatientListProps) {
  const [loading, setLoading] = useState(true);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
  const { register, control } = useForm<PatientInfo>({ mode: "onChange" });
  const filters = useWatch<PatientInfo>({ control });

  const columns = useMemo<Column<PatientInfo>[]>(
    () => [
      {
        key: "ssn",
        name: "SSN",
        headerCellClass: cx("p-0"),
        renderHeaderCell: (p) => (
          <FilterRenderer<PatientInfo> {...p}>
            <input {...p} {...register("ssn")} className="w-full" />
          </FilterRenderer>
        ),
        cellClass: cx("border-b border-r"),
      },
      {
        key: "prefix",
        name: "Prefix",
        headerCellClass: cx("p-0"),
        renderHeaderCell: (p) => (
          <FilterRenderer<PatientInfo> {...p}>
            <input {...p} {...register("prefix")} className="w-full" />
          </FilterRenderer>
        ),
        cellClass: cx("border-b border-r"),
      },
      {
        key: "firstName",
        name: "First Name",
        headerCellClass: cx("p-0"),
        renderHeaderCell: (p) => (
          <FilterRenderer<PatientInfo> {...p}>
            <input {...p} {...register("firstName")} className="w-full" />
          </FilterRenderer>
        ),
        cellClass: cx("border-b border-r"),
      },
      {
        key: "lastName",
        name: "Last Name",
        headerCellClass: cx("p-0"),
        renderHeaderCell: (p) => (
          <FilterRenderer<PatientInfo> {...p}>
            <Input
              {...p}
              {...register("lastName")}
              className="focus-visible h-full w-full rounded-sm bg-background px-2 focus-visible:outline-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </FilterRenderer>
        ),
        cellClass: cx("border-b border-r"),
      },
      {
        key: "actions",
        name: "Actions",
        renderCell: ({ row }) => (
          <Link href={`/patients/${row.id}`} className="h-full w-full">
            A
          </Link>
        ),
        cellClass: cx("border-b border-r"),
      },
    ],
    [register]
  );

  const filtered = useMemo<PatientInfo[]>(
    () =>
      data.filter((row) => {
        const { ssn, prefix, firstName, lastName } = filters;
        return (
          (ssn ? row.ssn.includes(ssn) : true) &&
          (prefix ? row.prefix.includes(prefix) : true) &&
          (firstName ? row.firstName.includes(firstName) : true) &&
          (lastName ? row.lastName.includes(lastName) : true)
        );
      }),
    [data, filters]
  );

  const gridElement = useMemo(
    () => (
      <DataGrid
        direction="ltr"
        className="rdg-light flex-1 overflow-scroll border"
        rows={filtered}
        columns={columns}
        headerRowHeight={80}
        rowHeight={40}
        defaultColumnOptions={{
          sortable: true,
        }}
        rowKeyGetter={(row) => row.id}
        sortColumns={sortColumns}
        onSortColumnsChange={setSortColumns}
      />
    ),
    [columns, filtered, sortColumns]
  );

  useEffect(() => {
    setLoading(false);
  }, [gridElement]);

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <h2>Patients</h2>
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
