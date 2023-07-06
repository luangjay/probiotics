"use client";

import { NewProbioticRecordDialog } from "@/components/new-probiotic-record-dialog";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { fullName } from "@/lib/api/user";
import { cn } from "@/lib/utils";
import { type DoctorInfo } from "@/types/api/doctor";
import { type PatientWithAll } from "@/types/api/patient";
import { type ProbioticRecord } from "@prisma/client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { type Column } from "react-data-grid";

interface ProbioticRecordListProps {
  patient: PatientWithAll;
}

export function ProbioticRecordList({
  patient: patientWithAll,
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
    readonly Column<ProbioticRecord & { doctor: DoctorInfo }>[]
  >(() => {
    return [
      {
        key: "id",
        name: "Record ID",
        cellClass: cn("font-mono"),
      },
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
      {
        key: "actions",
        name: "Actions",
        renderCell: ({ row }) => (
          <Link
            href={{
              pathname: `/probiotic-records/${row.id}`,
            }}
          >
            A
          </Link>
        ),
      },
    ];
  }, []);

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
              <div style={{ textAlign: "center", gridColumn: "1/-1" }}>
                Nothing to show (´・ω・`)
              </div>
            ),
          }}
        />
      ),
    [loading, rows, columns]
  );

  return (
    <div className="flex h-full flex-col gap-4">
      <h3 className="flex h-[40px] items-center text-2xl font-semibold">
        Probiotic Records
      </h3>
      {gridElement}
      <div className="flex justify-center">
        <NewProbioticRecordDialog />
      </div>
    </div>
  );
}
