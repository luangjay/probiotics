"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
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
    <div className="flex min-h-screen items-center justify-center">
      <form
        noValidate
        onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        {error && (
          <p className="text-center text-sm text-destructive">Login failed</p>
        )}
        <h2 className="mx-auto text-5xl font-bold leading-normal">LOGO</h2>
        <Input
          id="username"
          key="username"
          placeholder="username"
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          disabled={isSubmitting}
          {...register("username")}
        />
        {errors?.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
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
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Login
        </Button>
      </form>
    </div>
  );
}
