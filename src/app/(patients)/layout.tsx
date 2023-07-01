"use client";

import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { fullName } from "@/lib/user";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { patient } = useSelectPatientStore();

  return (
    <div className="container flex h-screen gap-12 py-8">
      <section className="w-[200px]">
        <div className="fixed flex flex-col gap-4">
          <Link href="/">Home</Link>
          <Link href="/patients">Patients</Link>
          <h3 className="">Selected patient</h3>
          {!patient ? <>No patient selected</> : <>{fullName(patient)}</>}
        </div>
      </section>
      <section className="flex-1 overflow-auto">{children}</section>
    </div>
  );
}
