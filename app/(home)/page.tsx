import { getSessionUser } from "@/lib/auth";

import { AuthButton } from "./auth-button";

export default async function Home() {
  const user = await getSessionUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <AuthButton isLoggedIn={!!user} />
    </div>
  );
}
