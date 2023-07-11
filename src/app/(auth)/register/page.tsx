"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { doctorSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

type RegisterData = z.infer<typeof doctorSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterData>({
    resolver: zodResolver(doctorSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    const { username, password } = data;
    const response = await fetch("/api/doctors", {
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
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        id="register-form"
        noValidate
        onSubmit={(...a) => void handleSubmit(onSubmit)(...a)}
        className="flex w-full max-w-sm flex-col items-center gap-4"
      >
        <Logo className="text-6xl" />
        <Input
          id="username"
          key="username"
          placeholder="Username"
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
          placeholder="Password"
          autoCapitalize="none"
          {...register("password")}
        />
        {errors?.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
        <Input
          id="prefix"
          key="prefix"
          placeholder="Prefix"
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
          placeholder="First name"
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
          placeholder="Last name"
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
          placeholder="Email"
          autoCorrect="off"
          disabled={isLoading}
          {...register("email")}
        />
        {errors?.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
          Register
        </Button>
      </form>
    </div>
  );
}
