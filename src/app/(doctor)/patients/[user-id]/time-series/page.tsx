import { TimeSeriesResults } from "@/components/time-series-results";
import { prisma } from "@/lib/prisma";
import { species } from "@/lib/probiotic";
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

async function getTimeSeriesResults(patientId: string): Promise<{
  timeSeriesResults: TimeSeriesResultRow[];
  timeSeriesResultSummary: TimeSeriesResultRow[];
}> {
  const probioticRecords = await prisma.probioticRecord.findMany({
    where: {
      patientId,
    },
    orderBy: {
      timestamp: "asc",
    },
  });
  const probiotics = await prisma.probiotic.findMany({
    orderBy: {
      id: "asc",
    },
  });

  const tree = probiotics.reduce<{ genus: string; species: string[] }[]>(
    (acc, cur) => {
      const { genus, species } = cur;
      const rootIdx = acc.map((root) => root.genus).indexOf(genus);
      if (rootIdx === -1) {
        acc.push({ genus: genus, species: [species] });
      } else {
        acc[rootIdx].species.push(cur.species);
      }
      return acc;
    },
    []
  );

  // console.log(probioticTree);

  const results = probioticRecords.map((probioticRecord) =>
    Object.fromEntries<number | undefined>(
      (probioticRecord.result as ProbioticRecordResultEntry[]).map((entry) => [
        species(entry.probiotic),
        entry.value,
      ])
    )
  );

  const table = tree.reduce<(number | null)[][]>((acc, cur) => {
    acc.push(
      cur.species.map((species) =>
        probioticRecords.map((_, idx) => {
          const value = results[idx][species];
          return value ?? null;
        })
      )
    );
    return acc;
  }, []);

  console.log(table);

  const total = table[0].map((_, idx) =>
    table.reduce((acc, cur) => acc + (cur[idx] ?? 0), 0)
  );

  return {
    timeSeriesResults: probiotics.map((probiotic, idx) => {
      const values = table[idx];
      return {
        probiotic: probiotic.species,
        timepoints: Object.fromEntries(
          values.map((value, idx) => [
            probioticRecords[idx].timestamp.getTime().toString(),
            value ?? 0,
          ])
        ),
      };
    }),
    timeSeriesResultSummary: [
      {
        probiotic: "Total",
        timepoints: Object.fromEntries(
          total.map((value, idx) => [
            probioticRecords[idx].timestamp.getTime().toString(),
            value,
          ])
        ),
      },
    ],
  };
}
