"use client";

import { z } from "zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button, Icons, Input } from "@/components/ui";
import { loginSchema } from "@/lib/validation/auth";

type FormData = z.infer<typeof loginSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    const { username, password } = data;
    const signInResult = await signIn("credentials", {
      username,
      password,
      callbackUrl: "/",
    });
    setIsError(!signInResult?.ok);
    setIsLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        {/* <p></p> */}
        <h2 className="mx-auto text-2xl font-bold">Login</h2>
        <Input
          id="username"
          key="username"
          placeholder="username"
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          disabled={isLoading}
          {...register("username")}
        />
        {errors?.username && (
          <p className="text-destructive">{errors.username.message}</p>
        )}
        <Input
          id="password"
          key="password"
          placeholder="password"
          type="password"
          autoCapitalize="none"
          {...register("password")}
        />
        {errors?.password && (
          <p className="text-destructive">{errors.password.message}</p>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
      </form>
    </div>
  );
}
