"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { patientSchema } from "@/lib/schema";
import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { type z } from "zod";

type CreatePatientData = z.infer<typeof patientSchema>;

export default function AddPatientDialog() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<CreatePatientData>({
    resolver: zodResolver(patientSchema),
    mode: "onChange",
  });
  const { firstName, lastName } = useWatch<CreatePatientData>({ control });

  const onSubmit = async (data: CreatePatientData) => {
    console.log("aaa");
    const response = await fetch("/api/patients", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setOpen(false);
      reset();
    }
  };

  useEffect(() => {
    setValue("password", faker.internet.password());
  }, [setValue]);

  useEffect(() => {
    setValue("username", faker.internet.userName({ firstName, lastName }));
  }, [setValue, firstName, lastName]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost">Add patient</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Add patient</Dialog.Title>
        <Dialog.Description>
          Make changes to your profile here. Click save when you&apos;re done.
        </Dialog.Description>
        <form onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}>
          <fieldset className="flex flex-col items-center gap-2">
            <Input id="prefix" placeholder="prefix" {...register("prefix")} />
            <p className="text-destructive">{errors.prefix?.message}</p>
            <Input
              id="firstName"
              placeholder="firstName"
              {...register("firstName")}
            />
            <p className="text-destructive">{errors.firstName?.message}</p>
            <Input
              id="lastName"
              placeholder="lastName"
              {...register("lastName")}
            />
            <p className="text-destructive">{errors.lastName?.message}</p>
            <Input id="ssn" placeholder="ssn" {...register("ssn")} />
            <p className="text-destructive">{errors.ssn?.message}</p>
            <Input id="gender" placeholder="gender" {...register("gender")} />
            <p className="text-destructive">{errors.gender?.message}</p>
            <Input
              id="birthDate"
              type="datetime-local"
              placeholder="birthDate"
              {...register("birthDate", { valueAsDate: true })}
            />
            <p className="text-destructive">{errors.birthDate?.message}</p>
            <Input
              id="ethnicity"
              placeholder="ethnicity"
              {...register("ethnicity")}
            />
            <p className="text-destructive">{errors.ethnicity?.message}</p>
          </fieldset>
          <div className="mt-2 flex justify-end">
            {/* <Dialog.Close asChild> */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm
            </Button>
            {/* </Dialog.Close> */}
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
