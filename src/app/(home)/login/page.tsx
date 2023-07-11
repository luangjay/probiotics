"use client";

import { FormErrorTooltip } from "@/components/form-error-tooltip";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

type FormData = z.infer<typeof loginSchema>;

export default function Register() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
  });
  const [error, setError] = useState(false);

  async function onSubmit(data: FormData) {
    const { username, password } = data;
    const signInResult = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (signInResult?.error) {
      setError(true);
    } else {
      router.push("/patients");
    }
  }

  return (
    <div className="container flex items-center justify-center">
      <form
        noValidate
        onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
        className="flex w-full max-w-sm flex-col items-center gap-6"
      >
        {error && (
          <p className="text-center text-sm text-destructive">Login failed</p>
        )}
        <h2 className="font-heading text-5xl">Login</h2>
        <div className="flex w-full gap-2">
          <Label
            htmlFor="username"
            className="relative flex w-full items-center font-normal"
          >
            <span className="absolute w-24 px-3 font-normal text-muted-foreground">
              Username
            </span>
            <Input
              id="username"
              key="username"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isSubmitting}
              className="pl-24"
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
            <span className="absolute w-24 px-3 font-normal text-muted-foreground">
              Password
            </span>
            <Input
              id="password"
              key="password"
              type="password"
              autoCapitalize="none"
              disabled={isSubmitting}
              className="pl-24"
              {...register("password")}
            />
          </Label>
          <FormErrorTooltip
            id="password_error_message"
            message={errors.password?.message}
          />
        </div>
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting && (
            <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Login
        </Button>
      </form>
    </div>
  );
}
