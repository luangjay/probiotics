"use client";

import { NewPatientDialog } from "@/components/new-patient-dialog";
import { selectPatientColumn } from "@/components/select-patient-column";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { filteredRows, sortedRows } from "@/lib/rdg";
import { cn } from "@/lib/utils";
import { type PatientRow } from "@/types/api/patient";
import { type MedicalCondition } from "@prisma/client";
import { FileCheck2Icon, RotateCwIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { Row, type Column, type SortColumn } from "react-data-grid";
import { useForm, useWatch } from "react-hook-form";

interface PatientListProps {
  patients: PatientRow[];
  medicalConditions: MedicalCondition[];
}

interface FilterPatients {
  filter: string;
}

export function PatientList({ patients, medicalConditions }: PatientListProps) {
  // Router
  const router = useRouter();

  // Select rows
  const { patient: selectedPatient } = useSelectPatientStore();

  // States
  const [loading, setLoading] = useState(true);
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

  // Component mounted
  useEffect(() => void setLoading(false), []);

  // Filter rows
  const { register, control } = useForm<FilterPatients>({ mode: "onChange" });
  const { filter } = useWatch<FilterPatients>({ control });

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
            href={`/patients/${row.id}/probiotic-records`}
            className="flex h-full w-full items-center justify-center"
          >
            <FileCheck2Icon className="h-[18px] w-[18px]" />
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
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ textAlign: "center", gridColumn: "1/-1" }}
              >
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
    <div className="flex h-full flex-col gap-6">
      <div className="flex h-10 items-center justify-between">
        <h2 className="text-2xl font-semibold">Patients</h2>
        <div className="relative flex h-full w-[20rem] items-center gap-2 font-normal">
          <Label
            htmlFor="filter"
            className="absolute left-0 flex h-10 w-10 items-center justify-center"
          >
            <SearchIcon className="h-4 w-4 opacity-50" />
          </Label>
          <Input
            {...register("filter")}
            id="filter"
            className="h-full w-full pl-10"
            placeholder="Search patients"
          />
        </div>
        <div className="flex h-10 gap-4">
          <Button className="h-10 w-10 p-0">
            <RotateCwIcon
              className="h-4 w-4"
              onClick={() => {
                router.refresh();
              }}
            />
          </Button>
          <NewPatientDialog medicalConditions={medicalConditions} />
        </div>
      </div>
      {gridElement}
    </div>
  );
}
