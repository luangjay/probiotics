"use client";

import { NewProbioticRecordDialog } from "@/components/new-probiotic-record-dialog";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { fullName } from "@/lib/user";
import { cn } from "@/lib/utils";
import { type DoctorInfo } from "@/types/doctor";
import { type PatientRow } from "@/types/patient";
import { type ProbioticRecordRow } from "@/types/probiotic-record";
import {
  type Probiotic,
  type ProbioticBrand,
  type ProbioticRecord,
} from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { type Column } from "react-data-grid";
import { EditProbioticRecordDialog } from "./edit-probiotic-record-dialog";

interface ProbioticRecordListProps {
  patient: PatientRow;
  probioticRecord: ProbioticRecordRow[];
  probiotics: Probiotic[];
}

export function ProbioticRecordList({
  patient,
  probioticRecord,
  probiotics,
}: ProbioticRecordListProps) {
  // Initialize
  const { probioticRecords: rows } = patientWithAll;

  // States
  const [loading, setLoading] = useState(true);
  const { setPatient: setSelectedPatient } = useSelectPatientStore();

  // Component mounted
  useEffect(() => void setLoading(false), []);

  useEffect(
    () => void setSelectedPatient(patientWithAll),
    [setSelectedPatient, patientWithAll]
  );

  const columns = useMemo<
    readonly Column<
      ProbioticRecord & {
        doctor: DoctorInfo;
        probioticBrands: ProbioticBrand[];
      }
    >[]
  >(() => {
    return [
      {
        key: "doctor",
        name: "Doctor",
        renderCell: ({ row }) => fullName(row.doctor),
      },
      {
        key: "createdAt",
        name: "Created at",
        renderCell: ({ row }) => row.createdAt.toLocaleString(),
      },
      {
        key: "updatedAt",
        name: "Updated at",
        renderCell: ({ row }) => row.updatedAt.toLocaleString(),
      },
      // {
      //   key: "probioticBrands",
      //   name: "Updated at",
      //   renderCell: ({row}) => row.
      // },
      {
        key: "probioticBrands",
        name: "Probiotic brands",
        renderCell: ({ row }) =>
          row.probioticBrands.map(({ name }) => name).join(", "),
      },
      {
        key: "action1",
        name: "",
        minWidth: 40,
        maxWidth: 40,
        width: 40,
        cellClass: cn("!p-0"),
        renderCell: ({ row }) => (
          <EditProbioticRecordDialog
            probioticRecord={row}
            probiotics={probiotics}
          />
        ),
      },
    ];
  }, [probiotics]);

  const gridElement = useMemo(
    () =>
      loading ? (
        <div className="flex flex-1 items-center justify-center">
          Loading...
        </div>
      ) : (
        <DataGrid
          direction="ltr"
          className="rdg-light flex-1 overflow-y-scroll"
          rows={rows}
          columns={columns}
          headerRowHeight={40}
          rowHeight={40}
          rowKeyGetter={(row) => row.id}
          // sortColumns={sortColumns}
          // onSortColumnsChange={setSortColumns}
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
          }}
        />
      ),
    [loading, rows, columns]
  );

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex h-10 items-center justify-between">
        <h3 className="text-2xl font-semibold">Probiotic records</h3>
        <NewProbioticRecordDialog probiotics={probiotics} />
      </div>
      {gridElement}
    </div>
  );
}
