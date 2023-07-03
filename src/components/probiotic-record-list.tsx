"use client";

import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { sorted } from "@/lib/rdg";
import { fullName } from "@/lib/user";
import { cn } from "@/lib/utils";
import { type DoctorInfo, type PatientInfo } from "@/types/user";
import { type ProbioticRecord } from "@prisma/client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { type Column, type SortColumn } from "react-data-grid";
import { CreateProbioticRecordDialog } from "./create-probiotic-record-dialog";

interface ProbioticRecordListProps {
  patient: PatientInfo & { fullName: string };
  probioticRecords: (ProbioticRecord & { doctor: DoctorInfo })[];
}

export function ProbioticRecordList({
  probioticRecords,
  ...props
}: ProbioticRecordListProps) {
  // States
  const [loading, setLoading] = useState(false);
  const { setPatient } = useSelectPatientStore();
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

  // Component mounted
  useEffect(() => void setLoading(false), []);

  useEffect(() => void setPatient(props.patient), [setPatient, props.patient]);

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

  const rows = useMemo(
    () => sorted(probioticRecords, sortColumns),
    [probioticRecords, sortColumns]
  );

  const gridElement = useMemo(
    () =>
      loading ? (
        <>Loading...</>
      ) : (
        <DataGrid
          direction="ltr"
          className="rdg-light flex-1 overflow-scroll"
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
    <div className="flex h-full flex-col gap-4 p-1">
      <h3 className="flex h-[40px] items-center text-2xl font-semibold">
        Probiotic Records
      </h3>
      {gridElement}
      <div className="flex justify-center">
        <CreateProbioticRecordDialog />
      </div>
    </div>
  );
}
