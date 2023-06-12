"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button, Icons, Input } from "@/components/ui";
import { userCreateSchema } from "@/lib/validation/auth";

type FormData = z.infer<typeof userCreateSchema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userCreateSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    // await new Promise((resolve) => void setTimeout(resolve, 2000));
    await fetch("/api/users", { method: "POST" });
    console.log(data);
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        id="username"
        type="text"
        autoCapitalize="none"
        autoCorrect="off"
        disabled={isLoading}
        {...register("username")}
      />
      <Input
        id="password"
        type="password"
        autoCapitalize="none"
        {...register("password")}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Register
      </Button>
      {errors?.username && <p>{errors.username.message}</p>}
      {errors?.password && <p>{errors.password.message}</p>}
    </form>
  );
}
