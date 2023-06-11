import { signIn } from "next-auth/react";
import { GET } from "../api/users/route";
import LoginButton from "@/components/login-button";
import { getCurrentUser } from "@/lib/session";

export default async function Example() {
  const res = await GET();
  const users = await res.json();
  const me = await getCurrentUser();

  // const res = await fetch("/api/users", { method: "GET" });
  // const users = await res.json();
  return (
    <>
      <div>{JSON.stringify(me)}</div>
      <div>
        <LoginButton />
      </div>
    </>
  );
}
