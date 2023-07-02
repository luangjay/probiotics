"use client";

import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { buttonVariants } from "./ui/button";

export function SelectedPatient() {
  const { patient } = useSelectPatientStore();
  const pathname = usePathname();

  const path = useMemo(() => pathname.split("/"), [pathname]);

  return (
    <div className="flex flex-col gap-4 text-sm">
      <h3 className="text-base">Selected patient</h3>
      {!patient ? (
        <div>No patient selected</div>
      ) : (
        <>
          <div>{patient.ssn}</div>
          <div>{patient.fullName}</div>
          <div>{patient.gender}</div>
          <div>{patient.birthDate.toLocaleDateString()}</div>
          <div>{patient.ethnicity}</div>
          {path[2] !== undefined && path[3] !== "time-series" ? (
            <Link
              href={`${patient.id}/time-series`}
              className={buttonVariants({ size: "sm", variant: "ghost" })}
            >
              Time series
            </Link>
          ) : (
            <Link
              href={`/patients/${patient.id}`}
              className={buttonVariants({ size: "sm", variant: "ghost" })}
            >
              View
            </Link>
          )}
        </>
      )}
    </div>
  );
}
