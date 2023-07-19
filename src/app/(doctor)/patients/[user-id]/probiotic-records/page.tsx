import { ProbioticRecordList } from "@/components/probiotic-record-list";
import { prisma } from "@/lib/prisma";
import { type PatientRow } from "@/types/patient";
import { type ProbioticRow } from "@/types/probiotic";
import { type ProbioticRecordRow } from "@/types/probiotic-record";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    "user-id": string;
  };
}

export default async function Page({ params }: PageProps) {
  const userId = params["user-id"];
  const patient = await getPatient(userId);
  const probioticRecords = await getProbioticRecords(userId);
  const probiotics = await getProbiotics();

  return (
    <div className="flex h-full flex-col gap-4 text-sm">
      <ProbioticRecordList
        patient={patient}
        probioticRecords={probioticRecords}
        probiotics={probiotics}
      />
    </div>
  );
}

async function getPatient(userId: string): Promise<PatientRow> {
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
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  if (patient === null) notFound();

  return {
    id: patient.userId,
    ssn: patient.ssn,
    prefix: patient.user.prefix,
    firstName: patient.user.firstName,
    lastName: patient.user.lastName,
    name: patient.user.name,
    gender: patient.gender,
    birthDate: patient.birthDate,
    ethnicity: patient.ethnicity,
    medicalConditions: patient.medicalConditions.map(
      (m14n) => m14n.medicalCondition
    ),
  };
}

async function getProbioticRecords(
  patientId: string
): Promise<ProbioticRecordRow[]> {
  const probioticRecords = await prisma.probioticRecord.findMany({
    where: {
      patientId,
    },
    include: {
      doctor: {
        include: {
          user: true,
        },
      },
      probioticBrands: {
        include: {
          probioticBrand: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  return probioticRecords.map((probioticRecord) => ({
    id: probioticRecord.id,
    fileUri: probioticRecord.fileUri,
    timestamp: probioticRecord.timestamp,
    result: probioticRecord.result,
    note: probioticRecord.note,
    createdAt: probioticRecord.createdAt,
    updatedAt: probioticRecord.updatedAt,
    doctor: {
      userId: probioticRecord.doctor.userId,
      name: probioticRecord.doctor.user.name,
    },
    probioticBrands: probioticRecord.probioticBrands.map((p12d) => ({
      id: p12d.probioticBrand.id,
      name: p12d.probioticBrand.name,
    })),
  }));
}

async function getProbiotics(): Promise<ProbioticRow[]> {
  const probiotics = await prisma.probiotic.findMany();

  return probiotics.map((probiotic) => ({
    id: probiotic.id,
    name: probiotic.name,
  }));
}

export const dynamic = "force-dynamic";
