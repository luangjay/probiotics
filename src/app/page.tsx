import { getSessionUser } from "@/lib/session";
// import { GET } from "@/api/users/route";
import { AuthButton } from "@/components/auth-button";

export default async function Example() {
  const me = await getSessionUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <pre>{JSON.stringify(me, null, 2)}</pre>
      <AuthButton isAuthenticated={!!me} />
    </div>
  );
}
