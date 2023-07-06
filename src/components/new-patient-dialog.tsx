"use client";

import { FormErrorTooltip } from "@/components/form-error-tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patientSchema } from "@/lib/schema";
import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { type z } from "zod";

type NewPatientData = z.infer<typeof patientSchema>;

export function NewPatientDialog() {
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
  const { firstName, lastName } = useWatch<NewPatientData>({ control });

  const onSubmit = async (data: NewPatientData) => {
    console.log("aaa");
    const response = await fetch("/api/patients", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setOpen(false);
      router.refresh();
      reset();
    }
  };

  useEffect(() => {
    setValue("password", faker.internet.password());
  }, [setValue, open]);

  useEffect(() => {
    setValue("username", faker.internet.userName({ firstName, lastName }));
  }, [setValue, firstName, lastName]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-full">
          <Icons.Add className="mr-2 h-4 w-4" />
          New patient
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>New patient</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </DialogDescription>
        <form
          onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-4">
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
          <div className="flex gap-4">
            <Input
              id="ssn"
              key="ssn"
              placeholder="SSN"
              className="flex-1"
              {...register("ssn")}
            />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormErrorTooltip
              message={
                errors.ssn
                  ? errors.ssn.message
                  : errors.gender
                  ? errors.gender.message
                  : undefined
              }
            />
          </div>
          {/* <p className="text-destructive">{errors.ssn?.message}</p> */}

          {/* <p className="text-destructive">{errors.gender?.message}</p> */}
          <Input
            id="birthDate"
            key="birthDate"
            type="date"
            placeholder="Birth date"
            {...register("birthDate", { valueAsDate: true })}
          />
          {/* <p className="text-destructive">{errors.birthDate?.message}</p> */}
          <Input
            id="ethnicity"
            key="ethnicity"
            placeholder="Ethnicity"
            {...register("ethnicity")}
          />
          {/* <p className="text-destructive">{errors.ethnicity?.message}</p> */}
          <p className="text-destructive">{JSON.stringify(isValid)}</p>
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
