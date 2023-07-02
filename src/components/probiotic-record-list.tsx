"use client";

import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { fullName } from "@/lib/user";
import { cn } from "@/lib/utils";
import { type DoctorInfo, type PatientInfo } from "@/types/user";
import { type ProbioticRecord } from "@prisma/client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { type Column } from "react-data-grid";

interface ProbioticRecordListProps {
  patient: PatientInfo & { fullName: string };
  probioticRecords: (ProbioticRecord & { doctor: DoctorInfo })[];
}

export function ProbioticRecordList({
  patient: _patient,
  probioticRecords: rows,
}: ProbioticRecordListProps) {
  // States
  const [loading, setLoading] = useState(false);
  const { setPatient } = useSelectPatientStore();

  // Component mounted
  useEffect(() => void setLoading(false), []);

  useEffect(() => void setPatient(_patient), [setPatient, _patient]);

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
        <>Loading...</>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          renderers={{
            noRowsFallback: <>Nothing to show...</>,
          }}
          rowKeyGetter={(row) => row.id}
          headerRowHeight={80}
          rowHeight={40}
          className="rdg-light flex-1"
        />
      ),
    [loading, rows, columns]
  );

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-auto">
      <h3 className="flex h-[40px] items-center text-2xl font-semibold leading-normal">
        Probiotic Records
      </h3>
      {gridElement}
    </div>
  );
}
