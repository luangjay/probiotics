import { getCurrentUser } from "@/lib/session";
import { LoginButton } from "@/components/auth/login-button";
import { RegisterForm } from "@/components/auth/register-form";

export default async function Example() {
  const me = await getCurrentUser();

  return (
    <>
      <div>{JSON.stringify(me)}</div>
      <div>
        <LoginButton />
        <RegisterForm />
      </div>
    </>
  );
}
