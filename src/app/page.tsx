import { getCurrentUser } from "@/lib/session";
// import { GET } from "@/api/users/route";
import { LoginButton } from "@/components/login-button";

export default async function Example() {
  const me = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <pre>{JSON.stringify(me, null, 2)}</pre>
      <LoginButton />
    </div>
  );
}
