import { DummyNav } from "@/components/dummy-nav";
import { getCurrentUser } from "@/lib/auth";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const user = await getCurrentUser();
  const authenticated = Boolean(user);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="h-20 border">
        <DummyNav authenticated={authenticated} />
      </header>
      <main className="flex flex-1">{children}</main>
    </div>
  );
}
