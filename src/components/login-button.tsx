"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export default function LoginButton() {
  return <Button onClick={() => void signIn()}>login-button</Button>;
}
