import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container flex flex-1 gap-12">
      <section className="w-[200px] lg:py-8">
        <div className="fixed flex h-screen flex-col gap-4">
          <Link href="/">Home</Link>
          <Link href="/patients">Patients</Link>
        </div>
      </section>
      <section className="h-screen w-full flex-1 overflow-auto lg:py-8">
        {children}
      </section>
    </div>
  );
}
