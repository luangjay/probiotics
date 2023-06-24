"use client";

import { Button } from "@/components/ui";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

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
