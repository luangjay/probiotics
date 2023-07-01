"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthButtonProps {
  authenticated: boolean;
}

export function AuthButton({ authenticated }: AuthButtonProps) {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        if (!authenticated) {
          router.push("/login");
        } else {
          void signOut();
        }
      }}
    >
      {!authenticated ? "Login" : "Logout"}
    </Button>
  );
}
