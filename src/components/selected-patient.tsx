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
import { cn, pluralize } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

export function SelectedPatient() {
  const { patient } = useSelectPatientStore();
  const pathname = usePathname();

  const path = useMemo(() => pathname.split("/"), [pathname]);
  const patientPage = path[2] === "patient" && path[3] === undefined;

  const medicalConditionCount = patient?.medicalConditions.length ?? 0;

  const [open, setOpen] = useState(false);

  return (
    <Card className="min-h-[24rem] rounded-md">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">
          Selected patient
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        {!patient ? (
          <div>No patient selected</div>
        ) : (
          <>
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
              <div className="w-1/3 font-semibold">Others</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    aria-expanded={open}
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
                    <DropdownMenuItem className="inline-block h-[2.5rem] w-[12.5rem] truncate rounded leading-[1.75rem] focus:bg-inherit">
                      No medical conditions
                    </DropdownMenuItem>
                  ) : (
                    patient.medicalConditions.map((medicalCondition) => (
                      <DropdownMenuItem
                        key={`medical_condition_${medicalCondition.id}`}
                        className="inline-block h-[2.5rem] w-[12.5rem] truncate rounded leading-[1.75rem]"
                      >
                        {medicalCondition.name}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </CardContent>
      {patient && (
        <CardFooter className="flex flex-col gap-4">
          <EditPatientDialog />
          <div className="flex w-full">
            {patientPage ? (
              <Link
                href={`${patient.id}/time-series`}
                className={cn(buttonVariants({ size: "sm" }), "w-full")}
              >
                Time series
              </Link>
            ) : (
              <Link
                href={`/patients/${patient.id}`}
                className={cn(buttonVariants({ size: "sm" }), "w-full")}
              >
                View
              </Link>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
