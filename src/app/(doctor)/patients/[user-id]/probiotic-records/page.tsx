import { ProbioticRecordList } from "@/components/probiotic-record-list";
import { prisma } from "@/lib/prisma";
import { fullName } from "@/lib/user";
import { type PatientRow } from "@/types/patient";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    "user-id": string;
  };
}

export default async function Page({ params }: PageProps) {
  const userId = params["user-id"];
  const patient = await getPatientRow(userId);
  const probiotics = await getProbiotics();

  return (
    <div className="flex h-full flex-col gap-4 text-sm">
      <ProbioticRecordList
        patient={patient}
        probioticRecord={}
        probiotics={probiotics}
      />
    </div>
  );
}

async function getPatientRow(userId: string): Promise<PatientRow> {
  const patient = await prisma.patient.findUnique({
    where: {
      userId,
    },
    include: {
      user: true,
      medicalConditions: {
        include: {
          medicalCondition: true,
        },
      },
    },
  });

  if (patient === null) notFound();

  return {
    id: patient.userId,
    ssn: patient.ssn,
    name: fullName(patient.user),
    gender: patient.gender,
    birthDate: patient.birthDate,
    ethnicity: patient.ethnicity,
    medicalConditions: patient.medicalConditions.map(
      (m14n) => m14n.medicalCondition
    ),
  };
}

export async function getProbiotics(): Promise<ProbioticWithComputed[]> {
  const probiotics = await prisma.probiotic.findMany();
  return probiotics.map((probiotic) => ({
    ...probiotic,
    alias: alias(probiotic.name),
  }));
}
