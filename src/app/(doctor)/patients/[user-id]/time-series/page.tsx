import { TimeSeriesResults } from "@/components/time-series-results";
import { prisma } from "@/lib/prisma";
import { type PatientRow } from "@/types/patient";
import { type TimeSeriesResult } from "@/types/probiotic-record";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    "user-id": string;
  };
}

export default async function Page({ params }: PageProps) {
  const userId = params["user-id"];
  const patient = await getPatient(userId);
  const timeSeriesResults = await getTimeSeriesResults(userId);

  return (
    <div className="flex h-full flex-col gap-4 text-sm">
      <TimeSeriesResults
        patient={patient}
        timeSeriesResults={timeSeriesResults}
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

async function getTimeSeriesResults(
  patientId: string
): Promise<TimeSeriesResult[]> {
  const probioticRecords = await prisma.probioticRecord.findMany({
    where: {
      patientId,
    },
    orderBy: {
      id: "asc",
    },
  });
  const probiotics = await prisma.probiotic.findMany();
  const keys = new Set<string>();

  const table = probiotics.map((probiotic) =>
    probioticRecords.map((probioticRecord) => {
      const result = probioticRecord.result as {
        [name: string]: number | undefined;
      };
      const value = result[probiotic.name];
      if (value === undefined) {
        return null;
      }
      keys.add(probiotic.alias);
      return value;
    })
  );

  const results = probiotics.map((probiotic, idx) => {
    if (!keys.has(probiotic.alias)) {
      return null;
    }
    const values = table[idx];
    return Object.fromEntries(
      values.map((value, idx) => [
        probioticRecords[idx].createdAt.toLocaleString(),
        value,
      ])
    );
  });

  return probiotics
    .map((probiotic, idx) => ({
      probiotic: probiotic.alias,
      ...results[idx],
    }))
    .filter((result) => keys.has(result.probiotic));
}
