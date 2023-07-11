import { TimeSeriesResults } from "@/components/time-series-results";
import { prisma } from "@/lib/prisma";
import { type PatientRow } from "@/types/patient";
import {
  type ProbioticRecordResultEntry,
  type TimeSeriesResultRow,
} from "@/types/probiotic-record";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    "user-id": string;
  };
}

export default async function Page({ params }: PageProps) {
  const userId = params["user-id"];
  const patient = await getPatient(userId);
  const { timeSeriesResults, timeSeriesResultSummary } =
    await getTimeSeriesResults(userId);

  return (
    <div className="flex h-full flex-col gap-4 text-sm">
      <TimeSeriesResults
        patient={patient}
        timeSeriesResults={timeSeriesResults}
        timeSeriesResultSummary={timeSeriesResultSummary}
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

function alias(name: string) {
  return name.split(";").at(-1) ?? "";
}

async function getTimeSeriesResults(patientId: string): Promise<{
  timeSeriesResults: TimeSeriesResultRow[];
  timeSeriesResultSummary: TimeSeriesResultRow[];
}> {
  const probioticRecords = await prisma.probioticRecord.findMany({
    where: {
      patientId,
    },
    orderBy: {
      id: "asc",
    },
  });
  const probiotics = await prisma.probiotic.findMany({
    orderBy: {
      id: "asc",
    },
  });

  const keys = new Set<string>();

  const table = probiotics.map((probiotic) =>
    probioticRecords.map((probioticRecord) => {
      const result = Object.fromEntries<number>(
        (probioticRecord.result as ProbioticRecordResultEntry[]).map(
          (entry) => [entry.probiotic, entry.value]
        )
      );
      const value = result[probiotic.name];
      if (value === undefined) {
        return null;
      }
      keys.add(alias(probiotic.name));
      return value;
    })
  );

  const total = table[0].map((_, idx) =>
    table.reduce((acc, cur) => acc + (cur[idx] ?? 0), 0)
  );

  const results = probiotics.map((probiotic, idx) => {
    if (!keys.has(alias(probiotic.name))) {
      return null;
    }
    const values = table[idx];
    return Object.fromEntries(
      values.map((value, idx) => [
        probioticRecords[idx].timestamp.getTime().toString(),
        value ?? 0,
      ])
    );
  });

  const resultSummary = Object.fromEntries(
    total.map((value, idx) => [
      probioticRecords[idx].timestamp.getTime().toString(),
      value,
    ])
  );

  return {
    timeSeriesResults: probiotics
      .map((probiotic, idx) => ({
        probiotic: alias(probiotic.name),
        ...results[idx],
      }))
      .filter((result) => keys.has(result.probiotic)),
    timeSeriesResultSummary: [{ probiotic: "Total", ...resultSummary }],
  };
}
