import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="container flex flex-col items-center justify-center gap-8">
      <h1 className="font-heading text-4xl font-extrabold">Welcome</h1>
      {!user ? (
        <p className="leading-none">Not logged in</p>
      ) : (
        <>
          <p className="text-xl">{user.name}</p>
          <p className="text-lg">{user.username}</p>
        </>
      )}
    </div>
  );
}

export const revalidate = 0;
