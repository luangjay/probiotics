"use client";

import { FormErrorTooltip } from "@/components/form-error-tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patientSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, type MedicalCondition } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, ChevronDownIcon, XCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { type z } from "zod";
import { Badge } from "./ui/badge";

type NewPatientData = z.infer<typeof patientSchema>;

interface NewPatientDialogProps {
  medicalConditions: MedicalCondition[];
}

export function NewPatientDialog({ medicalConditions }: NewPatientDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    setValue,
    reset,
  } = useForm<NewPatientData>({
    resolver: zodResolver(patientSchema),
    mode: "onChange",
  });
  const {
    gender,
    birthDate,
    medicalConditionIds = [],
  } = useWatch<NewPatientData>({ control });
  const [selectedM14ns, setSelectedM14ns] = useState<MedicalCondition[]>([]);

  const onSubmit = async (data: NewPatientData) => {
    console.log("aaa");
    const response = await fetch("/api/patients", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setOpen(false);
      router.refresh();
      setSelectedM14ns([]);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-full">
          <Icons.Add className="mr-2 h-4 w-4" />
          New patient
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
          className="flex w-full flex-col gap-4 overflow-auto p-1"
        >
          <DialogTitle>New patient</DialogTitle>
          <DialogDescription>Name</DialogDescription>
          <div className="flex w-full items-center gap-4">
            <Input
              id="prefix"
              key="prefix"
              placeholder="Prefix"
              className="w-24"
              {...register("prefix")}
            />
            <Input
              id="firstName"
              key="firstName"
              placeholder="First name"
              className="flex-1"
              {...register("firstName")}
            />
            <Input
              id="lastName"
              key="lastName"
              placeholder="Last name"
              className="flex-1"
              {...register("lastName")}
            />
            <FormErrorTooltip
              message={
                errors.prefix
                  ? errors.prefix.message
                  : errors.firstName
                  ? errors.firstName.message
                  : errors.lastName
                  ? errors.lastName.message
                  : undefined
              }
            />
          </div>
          <DialogDescription>Personal information</DialogDescription>
          <div className="flex w-full items-center gap-4">
            <Input
              id="ssn"
              key="ssn"
              placeholder="SSN"
              className="w-1/2"
              {...register("ssn")}
            />
            <Input
              id="ethnicity"
              key="ethnicity"
              placeholder="Ethnicity"
              className="flex-1"
              {...register("ethnicity")}
            />
            <FormErrorTooltip
              message={
                errors.ssn
                  ? errors.ssn.message
                  : errors.ethnicity
                  ? errors.ethnicity.message
                  : undefined
              }
            />
          </div>
          <div className="flex w-full items-center gap-4">
            <Select
              key="select_gender"
              value={gender}
              onValueChange={(value: Gender) => {
                setValue("gender", value);
              }}
            >
              <SelectTrigger
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex-1 justify-between font-normal",
                  !gender && "text-muted-foreground"
                )}
              >
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={Gender.Male}>Male</SelectItem>
                  <SelectItem value={Gender.Female}>Female</SelectItem>
                  <SelectItem value={Gender.Others}>Others</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[55%] justify-start text-left font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? (
                    format(birthDate as Date, "PPP")
                  ) : (
                    <span>Birth date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  initialFocus
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={birthDate as Date}
                  onSelect={(day, selectedDay) =>
                    void setValue("birthDate", selectedDay)
                  }
                />
              </PopoverContent>
            </Popover>
            <FormErrorTooltip
              message={
                errors.gender
                  ? errors.gender.message
                  : errors.birthDate
                  ? errors.birthDate.message
                  : undefined
              }
            />
          </div>
          <DialogDescription>Medical conditions</DialogDescription>
          <div className="flex h-6 w-full gap-2 overflow-auto">
            {selectedM14ns.map((m14n) => (
              <Badge
                key={`selected_${m14n.name}`}
                variant="secondary"
                className="h-full"
              >
                <span className="whitespace-nowrap">{m14n.name}</span>
                <XCircleIcon
                  className="ml-2 h-4 w-4 fill-secondary-foreground text-secondary"
                  onClick={() => {
                    setSelectedM14ns((prev) =>
                      prev.filter(({ id }) => id !== m14n.id)
                    );
                    setValue(
                      "medicalConditionIds",
                      medicalConditionIds.filter((id) => id !== m14n.id)
                    );
                  }}
                />
              </Badge>
            ))}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 font-normal text-muted-foreground"
              >
                Select a medical condition
                <ChevronDownIcon className="ml-4 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[17.5rem] overflow-y-scroll">
              {medicalConditions.map((medicalCondition) => (
                <DropdownMenuItem
                  disabled={medicalConditionIds.includes(medicalCondition.id)}
                  key={`medical_condition_${medicalCondition.id}`}
                  className="h-10 rounded"
                  onSelect={() => {
                    setSelectedM14ns((prev) => [...prev, medicalCondition]);
                    setValue("medicalConditionIds", [
                      ...medicalConditionIds,
                      medicalCondition.id,
                    ]);
                  }}
                >
                  {medicalCondition.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="mt-2 flex justify-center">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
