"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
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
      <DialogContent className="sm:h-[90vh] sm:max-w-[576px]">
        <DialogTitle>New patient</DialogTitle>
        {/* <Dialog.Description>
          Make changes to your profile here. Click save when you&apos;re done.
        </Dialog.Description> */}
        <form onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}>
          <fieldset className="flex flex-col items-center gap-2">
            <Input
              id="prefix"
              key="prefix"
              placeholder="prefix"
              {...register("prefix")}
            />
            <p className="text-destructive">{errors.prefix?.message}</p>
            <Input
              id="firstName"
              key="firstName"
              placeholder="firstName"
              {...register("firstName")}
            />
            <p className="text-destructive">{errors.firstName?.message}</p>
            <Input
              id="lastName"
              key="lastName"
              placeholder="lastName"
              {...register("lastName")}
            />
            <p className="text-destructive">{errors.lastName?.message}</p>
            <Input id="ssn" key="ssn" placeholder="ssn" {...register("ssn")} />
            <p className="text-destructive">{errors.ssn?.message}</p>
            <Input
              id="gender"
              key="gender"
              placeholder="gender"
              {...register("gender")}
            />
            <p className="text-destructive">{errors.gender?.message}</p>
            <Input
              id="birthDate"
              key="birthDate"
              type="datetime-local"
              placeholder="birthDate"
              {...register("birthDate", { valueAsDate: true })}
            />
            <p className="text-destructive">{errors.birthDate?.message}</p>
            <Input
              id="ethnicity"
              key="ethnicity"
              placeholder="ethnicity"
              {...register("ethnicity")}
            />
            <p className="text-destructive">{errors.ethnicity?.message}</p>
            <p className="text-destructive">{JSON.stringify(isValid)}</p>
          </fieldset>
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
