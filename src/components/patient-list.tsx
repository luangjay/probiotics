"use client";

import { NewPatientDialog } from "@/components/new-patient-dialog";
import { NoRowsFallback } from "@/components/rdg/no-rows-fallback";
import { selectPatientColumn } from "@/components/rdg/select-patient-column";
import { SortStatusRenderer } from "@/components/rdg/sort-status-renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { filteredRows, sortedRows } from "@/lib/rdg";
import { cn, sleep } from "@/lib/utils";
import { type MedicalConditionRow } from "@/types/medical-condition";
import { type PatientRow } from "@/types/patient";
import { format } from "date-fns";
import { FileCheck2Icon, RotateCwIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataGrid, { Row, type Column, type SortColumn } from "react-data-grid";
import { useForm, useWatch } from "react-hook-form";

interface PatientListProps {
  patients: PatientRow[];
  medicalConditions: MedicalConditionRow[];
}

interface FilterPatients {
  filter: string;
}

export function PatientList({ patients, medicalConditions }: PatientListProps) {
  // Router
  const router = useRouter();

  // States
  const [loading, setLoading] = useState(true);
  const [cooldown, setCooldown] = useState(0);
  const { patient: selectedPatient, setPatient: setSelectedPatient } =
    useSelectPatientStore();
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

  // Component mounted
  useEffect(() => void setLoading(false), []);

  // Refresh selected patient on updates
  useEffect(() => {
    if (selectedPatient) {
      const patient = patients.find(
        (patient) => selectedPatient.id === patient.id
      );
      setSelectedPatient(patient);
    }
  }, [patients, selectedPatient, setSelectedPatient]);

  // Filter rows
  const { register, control } = useForm<FilterPatients>({ mode: "onChange" });
  const { filter } = useWatch<FilterPatients>({ control });

  // Columns
  const columns = useMemo<Column<PatientRow>[]>(
    () => [
      selectPatientColumn,
      {
        key: "name",
        name: "Name",
      },
      {
        key: "gender",
        name: "Gender",
        width: "20%",
      },
      {
        key: "birthDate",
        name: "Birth date",
        width: "20%",
        cellClass: "tabular-nums tracking-tighter",
        renderCell: ({ row }) => format(row.birthDate, "yyyy-MM-dd"),
      },
      {
        key: "ethnicity",
        name: "Ethnicity",
        width: "20%",
      },
      {
        key: "action",
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
            <FileCheck2Icon className="h-[18px] w-[18px] opacity-70" />
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
      ["name", "gender", "birthDate", "ethnicity"],
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
          className="flex-1"
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
            noRowsFallback: <NoRowsFallback />,
            renderSortStatus: (p) => <SortStatusRenderer {...p} />,
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

  // Refresh
  const INITIAL_COOLDOWN = 5000;
  const INTERVAL_COOLDOWN = 1000;

  const refresh = useCallback(async () => {
    let cooldown = INITIAL_COOLDOWN;
    setCooldown(cooldown);
    router.refresh();
    while (cooldown > 0) {
      await sleep(INTERVAL_COOLDOWN);
      cooldown -= INTERVAL_COOLDOWN;
      setCooldown(cooldown);
    }
  }, [router]);

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
          <Button
            variant="outline"
            disabled={cooldown > 0}
            className="h-10 w-10 p-0"
            onClick={() => void refresh()}
          >
            <RotateCwIcon
              className={cn(
                "h-4 w-4",
                cooldown >= INITIAL_COOLDOWN && "animate-[spin_1s]"
              )}
            />
          </Button>
          <NewPatientDialog medicalConditions={medicalConditions} />
        </div>
      </div>
      {gridElement}
    </div>
  );
}
