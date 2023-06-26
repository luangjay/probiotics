"use client";

import { FilterRenderer } from "@/components/renderers/filter-renderer";
import { cn } from "@/lib/utils";
import { type PatientInfo } from "@/types/user";
import Link from "next/link";
import { useMemo } from "react";
import DataGrid, { type Column } from "react-data-grid";
import { useForm, useWatch } from "react-hook-form";
import AddPatientDialog from "./add-patient-dialog";

interface PatientListProps {
  data: PatientInfo[];
}

export default function PatientList({ data }: PatientListProps) {
  const { register, control } = useForm<PatientInfo>({ mode: "onChange" });
  const filters = useWatch<PatientInfo>({ control });

  const columns = useMemo<readonly Column<PatientInfo>[]>(() => {
    return [
      {
        key: "ssn",
        name: "SSN",
        headerCellClass: "",
        renderHeaderCell: (p) => (
          <FilterRenderer<PatientInfo> {...p}>
            <input {...p} {...register("ssn")} className="w-full" />
          </FilterRenderer>
        ),
        cellClass: cn("font-mono"),
      },
      {
        key: "prefix",
        name: "Prefix",
        headerCellClass: "",
        renderHeaderCell: (p) => (
          <FilterRenderer<PatientInfo> {...p}>
            <input {...p} {...register("prefix")} className="w-full" />
          </FilterRenderer>
        ),
        cellClass: "",
      },
      {
        key: "firstName",
        name: "First Name",
        headerCellClass: "",
        renderHeaderCell: (p) => (
          <FilterRenderer<PatientInfo> {...p}>
            <input {...p} {...register("firstName")} className="w-full" />
          </FilterRenderer>
        ),
      },
      {
        key: "lastName",
        name: "Last Name",
        headerCellClass: "",
        renderHeaderCell: (p) => (
          <FilterRenderer<PatientInfo> {...p}>
            <input {...p} {...register("lastName")} className="w-full" />
          </FilterRenderer>
        ),
      },
      {
        key: "actions",
        name: "Actions",
        renderCell: ({ row }) => (
          <Link href={`/patients/${row.id}`} className="h-full w-full">
            A
          </Link>
        ),
        cellClass: cn(""),
      },
    ];
  }, [register]);

  const filteredPatientInfos = useMemo(() => {
    return data.filter((row) => {
      const { ssn, prefix, firstName, lastName } = filters;
      return (
        (ssn ? row.ssn.includes(ssn) : true) &&
        (prefix ? row.prefix.includes(prefix) : true) &&
        (firstName ? row.firstName.includes(firstName) : true) &&
        (lastName ? row.lastName.includes(lastName) : true)
      );
    });
  }, [data, filters]);

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <h2>Patients</h2>
      <DataGrid
        columns={columns}
        rows={filteredPatientInfos}
        renderers={{
          noRowsFallback: <>Nothing to show...</>,
        }}
        rowKeyGetter={(row) => row.id}
        headerRowHeight={80}
        rowHeight={40}
        className="rdg-light flex-1 gap-px"
      />
      <AddPatientDialog />
    </div>
  );
}
