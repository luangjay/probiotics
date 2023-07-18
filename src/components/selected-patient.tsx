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
import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { cn } from "@/lib/utils";
import { type MedicalConditionRow } from "@/types/medical-condition";
import { format } from "date-fns";
import {
  ChevronsUpDownIcon,
  FileCheck2Icon,
  FileClockIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import pluralize from "pluralize";
import { useMemo } from "react";

interface SelectedPatientProps {
  medicalConditions: MedicalConditionRow[];
}

export function SelectedPatient({ medicalConditions }: SelectedPatientProps) {
  const { patient } = useSelectPatientStore();
  const pathname = usePathname();

  const path = useMemo(() => pathname.split("/"), [pathname]);
  const probioticRecordsPage =
    path[1] === "patients" && path[3] === "probiotic-records";

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
          key="selected_patient_none"
          className="flex flex-col gap-4 text-sm"
        >
          <div>No patient selected</div>
        </CardContent>
      ) : (
        <CardContent
          key={`selected_patient_${patient.id}`}
          className="flex flex-col gap-4 text-sm"
        >
          <div className="flex gap-2">
            <div className="w-1/3 truncate font-medium">SSN</div>
            <div className="flex-1 truncate">{patient.ssn}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3 truncate font-medium">Name</div>
            <div className="flex-1 truncate">{patient.name}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3 truncate font-medium">Gender</div>
            <div className="flex-1 truncate">{patient.gender}</div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3 truncate font-medium">Birth date</div>
            <div className="flex-1 truncate">
              {format(patient.birthDate, "yyyy-MM-dd")}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3 truncate font-medium">Ethnicity</div>
            <div className="flex-1 truncate">{patient.ethnicity}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1/3 font-medium">Information</div>
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
                  <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex flex-col">
                {patient.medicalConditions.length === 0 ? (
                  <DropdownMenuItem
                    key="medical_condition_none"
                    className="inline-block h-10 w-[12.5rem] truncate rounded leading-7 focus:bg-inherit"
                  >
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
          <EditPatientDialog medicalConditions={medicalConditions} />
          <div className="flex w-full">
            {probioticRecordsPage ? (
              <Link
                href={`/patients/${patient.id}/time-series-results`}
                className={cn(buttonVariants({ size: "sm" }), "w-full")}
              >
                <FileClockIcon className="mr-2 h-4 w-4" />
                Time series results
              </Link>
            ) : (
              <Link
                href={`/patients/${patient.id}/probiotic-records`}
                className={cn(buttonVariants({ size: "sm" }), "w-full")}
              >
                <FileCheck2Icon className="mr-2 h-4 w-4" />
                Probiotic records
              </Link>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
