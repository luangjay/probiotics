"use client";

import { NewPatientDialog } from "@/components/new-patient-dialog";
import { selectPatientColumn } from "@/components/select-patient-column";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { filteredRows, sortedRows } from "@/lib/rdg";
import { cn } from "@/lib/utils";
import { type PatientRow } from "@/types/api/patient";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { Row, type Column, type SortColumn } from "react-data-grid";
import { useForm, useWatch } from "react-hook-form";

interface PatientListProps {
  patients: PatientRow[];
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
  const columns = useMemo<Column<PatientRow>[]>(
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
        key: "action1",
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

  // Rows
  const rows = useMemo(() => {
    const sorted = sortedRows(patients, sortColumns);
    const filtered = filteredRows(
      sorted,
      ["fullName", "gender", "birthDate", "ethnicity"],
      filter
    );
    return filtered;
  }, [patients, sortColumns, filter]);

  // Data grid
  const gridElement = useMemo(
    () =>
      loading ? (
        <div className="flex flex-1 items-center justify-center">
          Loading...
        </div>
      ) : (
        <DataGrid
          direction="ltr"
          className="rdg-light flex-1"
          rows={rows}
          columns={columns}
          headerRowHeight={40}
          rowHeight={40}
          rowKeyGetter={(row) => row.id}
          sortColumns={sortColumns}
          onSortColumnsChange={setSortColumns}
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
        />
      ),
    [loading, rows, columns, selectedPatient, sortColumns]
  );

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Patients</h2>
        <label
          htmlFor="filter"
          className="relative flex h-[40px] w-[300px] items-center gap-2"
        >
          <Input
            {...register("filter")}
            id="filter"
            className="h-full w-full pl-10"
            placeholder="Search patients"
          />
          <Icons.Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        </label>
        <NewPatientDialog />
      </div>
      <div className="flex justify-center"></div>
      {gridElement}
    </div>
  );
}
