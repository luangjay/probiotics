import { DummyNav } from "@/components/dummy-nav";
import { getCurrentUser } from "@/lib/auth";
import { fullName } from "@/lib/user";

export default async function Home() {
  const user = await getCurrentUser();
  const authenticated = Boolean(user);

  return (
    <div className="flex min-h-screen flex-col">
      <DummyNav authenticated={authenticated} />
      <div className="container flex flex-1 flex-col items-center justify-center gap-8">
        <h1 className="text-4xl font-semibold">Welcome</h1>
        {!user ? (
          <p className="leading-none">Not logged in</p>
        ) : (
          <>
            <p className="text-xl">{fullName(user)}</p>
            <p className="text-lg">{user.username}</p>
          </>
        )}
      </div>
    </div>
  );
}
