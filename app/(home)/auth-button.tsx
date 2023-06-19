"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/ui";
import { signOut } from "next-auth/react";

interface AuthButtonProps {
  isLoggedIn: boolean;
}

export function AuthButton({ isLoggedIn }: AuthButtonProps) {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        if (!isLoggedIn) {
          router.push("/login");
        } else {
          void signOut();
        }
      }}
    >
      {!isLoggedIn ? "Login" : "Logout"}
    </Button>
  );
}
