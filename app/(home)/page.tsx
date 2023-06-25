import { buttonVariants } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { AuthButton } from "./auth-button";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <AuthButton authenticated={!!user} />
      <Link className={buttonVariants({ variant: "ghost" })} href="patients">
        Patients
      </Link>
    </div>
  );
}
