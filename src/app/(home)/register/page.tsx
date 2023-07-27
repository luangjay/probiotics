"use client";

import { FormErrorTooltip } from "@/components/form-error-tooltip";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doctorSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

type RegisterData = z.infer<typeof doctorSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    mode: "onChange",
    resolver: zodResolver(doctorSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    const { username, password } = data;
    const response = await fetch("/api/doctors", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      await signIn("credentials", {
        username,
        password,
        redirect: true,
        callbackUrl: "/patients",
      });
    }
  };

  return (
    <div className="container flex items-center justify-center">
      <form
        noValidate
        onSubmit={(...a) => void handleSubmit(onSubmit)(...a)}
        className="flex w-full max-w-sm flex-col items-center gap-4"
      >
        <h2 className="mb-2 font-heading text-5xl">Register</h2>
        <div className="flex w-full gap-2">
          <Label
            htmlFor="username"
            className="relative flex w-full items-center font-normal"
          >
            <div className="absolute w-[7rem] px-3 font-normal text-muted-foreground">
              Username*
            </div>
            <Input
              id="username"
              key="username"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isSubmitting}
              className={cn(
                "pl-[7rem]",
                errors.username &&
                  "ring-2 ring-destructive ring-offset-2 focus-visible:ring-destructive"
              )}
              {...register("username")}
            />
          </Label>
          <FormErrorTooltip
            id="username_error_message"
            message={errors.username?.message}
          />
        </div>
        <div className="flex w-full gap-2">
          <Label
            htmlFor="password"
            className="relative flex w-full items-center font-normal"
          >
            <div className="absolute w-[7rem] px-3 font-normal text-muted-foreground">
              Password*
            </div>
            <Input
              id="password"
              key="password"
              type="password"
              autoCapitalize="none"
              disabled={isSubmitting}
              className={cn(
                "pl-[7rem]",
                errors.password &&
                  "ring-2 ring-destructive ring-offset-2 focus-visible:ring-destructive"
              )}
              {...register("password")}
            />
          </Label>
          <FormErrorTooltip
            id="password_error_message"
            message={errors.password?.message}
          />
        </div>
        <div className="flex w-full gap-2">
          <Label
            htmlFor="prefix"
            className="relative flex w-full items-center font-normal"
          >
            <div className="absolute w-[7rem] px-3 font-normal text-muted-foreground">
              Prefix*
            </div>
            <Input
              id="prefix"
              key="prefix"
              autoCorrect="off"
              disabled={isSubmitting}
              className={cn(
                "pl-[7rem]",
                errors.prefix &&
                  "ring-2 ring-destructive ring-offset-2 focus-visible:ring-destructive"
              )}
              {...register("prefix")}
            />
          </Label>
          <FormErrorTooltip
            id="prefix_error_message"
            message={errors.prefix?.message}
          />
        </div>
        <div className="flex w-full gap-2">
          <Label
            htmlFor="firstname"
            className="relative flex w-full items-center font-normal"
          >
            <div className="absolute w-[7rem] px-3 font-normal text-muted-foreground">
              First name*
            </div>
            <Input
              id="firstname"
              key="firstname"
              autoCorrect="off"
              disabled={isSubmitting}
              className={cn(
                "pl-[7rem]",
                errors.firstName &&
                  "ring-2 ring-destructive ring-offset-2 focus-visible:ring-destructive"
              )}
              {...register("firstName")}
            />
          </Label>
          <FormErrorTooltip
            id="firstname_error_message"
            message={errors.firstName?.message}
          />
        </div>
        <div className="flex w-full gap-2">
          <Label
            htmlFor="lastname"
            className="relative flex w-full items-center font-normal"
          >
            <div className="absolute w-[7rem] px-3 font-normal text-muted-foreground">
              Last name*
            </div>
            <Input
              id="lastname"
              key="lastname"
              autoCorrect="off"
              disabled={isSubmitting}
              className={cn(
                "pl-[7rem]",
                errors.lastName &&
                  "ring-2 ring-destructive ring-offset-2 focus-visible:ring-destructive"
              )}
              {...register("lastName")}
            />
          </Label>
          <FormErrorTooltip
            id="lastname_error_message"
            message={errors.lastName?.message}
          />
        </div>
        <div className="flex w-full gap-2">
          <Label
            htmlFor="email"
            className="relative flex w-full items-center font-normal"
          >
            <div className="absolute w-[7rem] px-3 font-normal text-muted-foreground">
              Email
            </div>
            <Input
              id="email"
              key="email"
              autoCorrect="off"
              disabled={isSubmitting}
              className={cn(
                "pl-[7rem]",
                errors.email &&
                  "ring-2 ring-destructive ring-offset-2 focus-visible:ring-destructive"
              )}
              {...register("email")}
            />
          </Label>
          <FormErrorTooltip
            id="email_error_message"
            message={errors.email?.message}
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="mt-2"
        >
          {isSubmitting && (
            <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Register
        </Button>
      </form>
    </div>
  );
}
