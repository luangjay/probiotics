"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button, Icons, Input } from "@/components/ui";
import { registerSchema } from "@/lib/validation/auth";
import { signIn } from "next-auth/react";

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
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <h2 className="mx-auto text-2xl font-bold">Register</h2>
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
        <Input
          id="attr1"
          key="attr1"
          placeholder="attr1: string"
          type="text"
          autoCorrect="off"
          disabled={isLoading}
          {...register("attr1")}
        />
        {errors?.attr1 && (
          <p className="text-destructive">{errors.attr1.message}</p>
        )}
        <Input
          id="attr2"
          key="attr2"
          placeholder="attr2: int"
          type="number"
          autoCorrect="off"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (["e", "E", "+", "-", ".", " "].includes(e.key)) {
              e.preventDefault();
            }
          }}
          {...register("attr2", { valueAsNumber: true })}
        />
        {errors?.attr2 && (
          <p className="text-destructive">{errors.attr2.message}</p>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Register
        </Button>
      </form>
    </div>
  );
}
