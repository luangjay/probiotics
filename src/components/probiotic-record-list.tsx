"use client";

import { EditProbioticRecordDialog } from "@/components/edit-probiotic-record-dialog";
import { NewProbioticRecordDialog } from "@/components/new-probiotic-record-dialog";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { cn } from "@/lib/utils";
import { type PatientRow } from "@/types/patient";
import { type ProbioticRow } from "@/types/probiotic";
import { type ProbioticRecordRow } from "@/types/probiotic-record";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import DataGrid, { type Column } from "react-data-grid";

interface ProbioticRecordListProps {
  patient: PatientRow;
  probioticRecords: ProbioticRecordRow[];
  probiotics: ProbioticRow[];
}

export function ProbioticRecordList({
  patient,
  probioticRecords: rows,
  probiotics,
}: ProbioticRecordListProps) {
  // States
  const [loading, setLoading] = useState(true);
  const { setPatient: setSelectedPatient } = useSelectPatientStore();

  // Component mounted
  useEffect(() => void setLoading(false), []);

  useEffect(
    () => void setSelectedPatient(patient),
    [setSelectedPatient, patient]
  );

  const columns = useMemo<readonly Column<ProbioticRecordRow>[]>(() => {
    return [
      {
        key: "timestamp",
        name: "Timestamp",
        renderCell: ({ row }) => format(row.timestamp, "yyyy-MM-dd"),
      },
      {
        key: "doctor",
        name: "Doctor",
        renderCell: ({ row }) => row.doctor.name,
      },
      {
        key: "probioticBrands",
        name: "Probiotic brands",
        renderCell: ({ row }) =>
          row.probioticBrands
            .map((probioticBrand) => probioticBrand.name)
            .join(", "),
      },
      {
        key: "note",
        name: "Notes",
        width: "25%",
        renderCell: ({ row }) => row.note,
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
