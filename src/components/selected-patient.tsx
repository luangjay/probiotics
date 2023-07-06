"use client";

import { EditPatientDialog } from "@/components/edit-patient-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import pluralize from "pluralize";
import { useMemo } from "react";

export function SelectedPatient() {
  const { patient } = useSelectPatientStore();
  const pathname = usePathname();

  const path = useMemo(() => pathname.split("/"), [pathname]);
  const patientPage = path[2] === "patient" && path[3] === undefined;

  const medicalConditionCount = patient?.medicalConditions.length ?? 0;

  return (
    <Card className="min-h-[27.125rem] rounded-md">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">
          Selected patient
        </CardTitle>
      </CardHeader>
      {!patient ? (
        <CardContent
          key="patient_selected_none"
          className="flex flex-col gap-4 text-sm"
        >
          <div>No patient selected</div>
        </CardContent>
      ) : (
        <CardContent
          key={`patient_selected_${patient.id}`}
          className="flex flex-col gap-4 text-sm"
        >
          <div className="flex gap-2">
            <div className="w-1/3 truncate font-semibold">SSN</div>
            <div className="flex-1 truncate">{patient.ssn}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3 truncate font-semibold">Name</div>
            <div className="flex-1 truncate">{patient.fullName}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3 truncate font-semibold">Gender</div>
            <div className="flex-1 truncate">{patient.gender}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3 truncate font-semibold">Birth date</div>
            <div className="flex-1 truncate">
              {patient.birthDate.toLocaleDateString()}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3 truncate font-semibold">Ethnicity</div>
            <div className="flex-1 truncate">{patient.ethnicity}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1/3 font-semibold">Info</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="inline-flex flex-1 justify-between overflow-hidden font-normal"
                >
                  <span className="w-4 font-semibold">
                    {medicalConditionCount}
                  </span>
                  <span className="flex-1">
                    {pluralize("medical conditions", medicalConditionCount)}
                  </span>
                  <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col">
                {patient.medicalConditions.length === 0 ? (
                  <DropdownMenuItem className="inline-block h-10 w-[12.5rem] truncate rounded leading-7 focus:bg-inherit">
                    No medical conditions
                  </DropdownMenuItem>
                ) : (
                  patient.medicalConditions.map((medicalCondition) => (
                    <DropdownMenuItem
                      key={`medical_condition_${medicalCondition.id}`}
                      className="inline-block h-10 w-[12.5rem] truncate rounded leading-7"
                    >
                      {medicalCondition.name}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      )}
      {patient && (
        <CardFooter className="flex flex-col gap-4">
          <EditPatientDialog />
          <div className="flex w-full">
            {patientPage ? (
              <Link
                href={`/patients/${patient.id}/time-series`}
                className={cn(buttonVariants({ size: "sm" }), "w-full")}
              >
                Time series
              </Link>
            ) : (
              <Link
                href={`/patients/${patient.id}/probiotic-records`}
                className={cn(buttonVariants({ size: "sm" }), "w-full")}
              >
                Probiotic records
              </Link>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
