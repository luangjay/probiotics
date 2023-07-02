"use client";

import { CreatePatientDialog } from "@/components/create-patient-dialog";
import { selectPatientColumn } from "@/components/select-patient-column";
import { Input } from "@/components/ui/input";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { filtered, sorted } from "@/lib/rdg";
import { cn } from "@/lib/utils";
import { type PatientInfo } from "@/types/user";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { Row, type Column, type SortColumn } from "react-data-grid";
import { useForm, useWatch } from "react-hook-form";
import { Icons } from "./ui/icons";

interface PatientListProps {
  patients: (PatientInfo & { fullName: string })[];
}

interface Filter {
  filter: string;
}

export function PatientList({ patients }: PatientListProps) {
  // States
  const [loading, setLoading] = useState(true);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

  // Component mounted
  useEffect(() => void setLoading(false), []);

  // Select rows
  const { patient: selectedPatient } = useSelectPatientStore();

  // Filter rows
  const { register, control } = useForm<Filter>({ mode: "onChange" });
  const { filter } = useWatch<Filter>({ control });

  // Columns
  const columns = useMemo<Column<PatientInfo & { fullName: string }>[]>(
    () => [
      selectPatientColumn,
      {
        key: "fullName",
        name: "Name",
      },
      {
        key: "gender",
        name: "Gender",
        width: "20%",
      },
      {
        key: "birthDate",
        name: "Birth Date",
        renderCell: ({ row }) => <>{row.birthDate.toLocaleDateString()}</>,
        width: "20%",
      },
      {
        key: "ethnicity",
        name: "Ethnicity",
        width: "20%",
      },
      {
        key: "actions",
        name: "",
        minWidth: 40,
        maxWidth: 40,
        width: 40,
        cellClass: cn("!p-0"),
        renderCell: ({ row }) => (
          <Link
            href={`/patients/${row.id}`}
            className="flex h-full w-full items-center justify-center"
          >
            <Icons.Record
              className="h-[20px] w-[20px]"
              strokeWidth={1}
              width={20}
              height={20}
            />
          </Link>
        ),
      },
    ],
    []
  );

  const rows = useMemo(
    () => filtered(sorted(patients, sortColumns), filter),
    [patients, sortColumns, filter]
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
          className="rdg-light my-4 flex-1"
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
          rowKeyGetter={(row) => row.id}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
        />
      ),
    [loading, rows, columns, selectedPatient, sortColumns]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Patients</h2>
        <Input
          {...register("filter")}
          id="filter"
          className="h-[40px] w-[200px] rounded"
          placeholder="Filter"
        />
      </div>
      {gridElement}
      <div className="flex justify-center">
        <CreatePatientDialog />
      </div>
    </div>
  );
}
