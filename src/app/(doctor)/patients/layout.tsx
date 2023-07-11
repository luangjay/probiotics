import { SelectedPatient } from "@/components/selected-patient";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { type MedicalConditionRow } from "@/types/medical-condition";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const medicalConditions = await getMedicalConditions();

  return (
    <div className="container flex h-screen gap-6 py-7">
      <section className="flex w-[18rem] flex-col justify-between gap-8 overflow-auto p-1">
        <Card className="flex-1 rounded-md">
          <CardContent className="flex h-full flex-col gap-4 p-6">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80"
            >
              Home
            </Link>
            <Link
              href="/patients"
              className="transition-colors hover:text-foreground/80"
            >
              Patients
            </Link>
          </CardContent>
        </Card>
        <SelectedPatient medicalConditions={medicalConditions} />
      </section>
      <section className="flex-1 overflow-auto p-1">{children}</section>
    </div>
  );
}

async function getMedicalConditions(): Promise<MedicalConditionRow[]> {
  const medicalConditions = await prisma.medicalCondition.findMany({
    orderBy: {
      id: "asc",
    },
  });
  return medicalConditions.map((medicalCondition) => ({
    id: medicalCondition.id,
    name: medicalCondition.name,
  }));
}
