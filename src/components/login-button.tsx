"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui";

export function LoginButton() {
  return <Button onClick={() => void signIn()}>Login</Button>;
}
