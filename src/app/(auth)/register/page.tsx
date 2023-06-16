"use client";

import { useState } from "react";
import { Button, Icons, Input } from "@/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import { registerSchema } from "@/lib/validation/auth";

type FormData = z.infer<typeof registerSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    const { username, password } = data;
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      await signIn("credentials", {
        username,
        password,
        callbackUrl: "/",
      });
    }
    setIsLoading(false);
    reset();
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        id="register-form"
        noValidate
        onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <h2 className="mx-auto text-5xl leading-normal font-bold">LOGO</h2>
        <Input
          id="username"
          key="username"
          placeholder="username: string"
          autoCapitalize="none"
          autoCorrect="off"
          disabled={isLoading}
          {...register("username")}
        />
        {errors?.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
        <Input
          id="password"
          key="password"
          type="password"
          placeholder="password: string"
          autoCapitalize="none"
          {...register("password")}
        />
        {errors?.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
        <Input
          id="prefix"
          key="prefix"
          placeholder="prefix: string"
          autoCorrect="off"
          disabled={isLoading}
          {...register("prefix")}
        />
        {errors?.prefix && (
          <p className="text-sm text-destructive">{errors.prefix.message}</p>
        )}
        <Input
          id="firstName"
          key="firstName"
          placeholder="firstName: string"
          // type="number"
          autoCorrect="off"
          disabled={isLoading}
          // onKeyDown={validateNumericKey}
          {...register("firstName")}
        />
        {errors?.firstName && (
          <p className="text-sm text-destructive">{errors.firstName.message}</p>
        )}
        <Input
          id="lastName"
          key="lastName"
          placeholder="lastName: string"
          autoCorrect="off"
          disabled={isLoading}
          {...register("lastName")}
        />
        {errors?.lastName && (
          <p className="text-sm text-destructive">{errors.lastName.message}</p>
        )}
        <Input
          id="email"
          key="email"
          placeholder="email: string?"
          autoCorrect="off"
          disabled={isLoading}
          {...register("email")}
        />
        {errors?.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Register
        </Button>
      </form>
    </div>
  );
}
