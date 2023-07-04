import { SelectedPatient } from "@/components/selected-patient";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container flex h-screen gap-12 py-8">
      <section className="w-[16rem]">
        <div className="flex flex-col gap-4">
          <Link href="/">Home</Link>
          <Link href="/patients">Patients</Link>
          <SelectedPatient />
        </div>
      </section>
      <section className="flex-1 overflow-auto">{children}</section>
    </div>
  );
}
