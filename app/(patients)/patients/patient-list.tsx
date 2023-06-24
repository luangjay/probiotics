"use client";

import { FilterRenderer } from "@/components/renderers/filter-renderer";
import { cn } from "@/lib/utils";
import { type PatientInfo } from "@/types/user";
import { useMemo } from "react";
import DataGrid, { type Column } from "react-data-grid";
import { useForm, useWatch } from "react-hook-form";

interface PatientListProps {
  patients: PatientInfo[];
}

export default function PatientList({ patients }: PatientListProps) {
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
            <input
              {...register("lastName")}
              className="w-full"
              onClick={(e) => void e.stopPropagation()}
            />
          </FilterRenderer>
        ),
      },
    ];
  }, [register]);

  const filteredPatientInfos = useMemo(() => {
    return patients.filter((row) => {
      const { ssn, prefix, firstName, lastName } = filters;
      return (
        (ssn ? row.ssn.includes(ssn) : true) &&
        (prefix ? row.prefix.includes(prefix) : true) &&
        (firstName ? row.firstName.includes(firstName) : true) &&
        (lastName ? row.lastName.includes(lastName) : true)
      );
    });
  }, [patients, filters]);

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <DataGrid
        columns={columns}
        rows={filteredPatientInfos}
        renderers={{
          noRowsFallback: <>Nothing to show...</>,
        }}
        rowKeyGetter={(row) => row.username}
        headerRowHeight={80}
        rowHeight={40}
        className="rdg-light flex-1 gap-px  "
      />
    </div>
  );
}
