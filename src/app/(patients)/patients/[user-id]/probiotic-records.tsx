"use client";

import { cn } from "@/lib/utils";
import { type DoctorInfo } from "@/types/user";
import { type ProbioticRecord } from "@prisma/client";
import Link from "next/link";
import { useMemo } from "react";
import DataGrid, { type Column } from "react-data-grid";

interface ProbioticRecordsProps {
  data: (ProbioticRecord & { doctor: DoctorInfo })[];
}

export default function ProbioticRecords({ data }: ProbioticRecordsProps) {
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
        renderCell: ({ row }) =>
          `${row.doctor.prefix} ${row.doctor.firstName} ${row.doctor.lastName}`,
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

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-auto">
      <h3 className="text-xl font-semibold leading-normal">
        Probiotic Records
      </h3>
      <DataGrid
        columns={columns}
        rows={data}
        renderers={{
          noRowsFallback: <>Nothing to show...</>,
        }}
        rowKeyGetter={(row) => row.id}
        headerRowHeight={80}
        rowHeight={40}
        className="rdg-light flex-1"
      />
    </div>
  );
}
