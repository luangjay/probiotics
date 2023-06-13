"use client";

import { useMemo } from "react";
import { signIn, signOut } from "next-auth/react";

import { Button } from "@/components/ui";

interface AuthButtonProps {
  isAuthenticated: boolean;
}

export function AuthButton({ isAuthenticated }: AuthButtonProps) {
  if (!isAuthenticated) {
    return <Button onClick={() => void signIn()}>Login</Button>;
  }
  return <Button onClick={() => void signOut()}>Logout</Button>;
}
